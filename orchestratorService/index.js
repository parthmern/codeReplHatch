import express from "express";
import { exec } from "child_process";
import { KubeConfig, AppsV1Api, CoreV1Api } from "@kubernetes/client-node";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(cors());

// Kubernetes client
const kc = new KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(AppsV1Api);

async function listPods() {
  const kc = new KubeConfig();
  kc.loadFromDefault();
  const client = kc.makeApiClient(CoreV1Api);

  try {
    const res = await client.listNamespacedPod({
      namespace: "default",
    });

    for (const item of res.items) {
      console.log(`  - ${item.metadata.name}`);
    }
  } catch (err) {
    console.error("Error listing pods:", err);
  }
}

async function listDeploymentWithRetry(
  userId,
  namespace = "default",
  maxRetries = 10,
  delayMs = 3000
) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await k8sApi.listNamespacedDeployment({ namespace });
      const deployment = res.items.find(
        (item) => item.metadata.name === `${userId}-deployment`
      );
      //console.log(deployment);

      if (deployment) {
        const total = deployment.status.replicas;
        const available = deployment.status.availableReplicas;
        console.log(
          `[Attempt ${attempt}] Found deployment: ${deployment.metadata.name} | total: ${total} | available: ${available}`
        );

        return {
          name: deployment.metadata.name,
          totalReplicas: total || undefined,
          availableReplicas: available || undefined,
        };
      } else {
        console.log(
          `[Attempt ${attempt}] Deployment not found, retrying in ${delayMs}ms...`
        );
      }
    } catch (err) {
      console.error(
        `[Attempt ${attempt}] Error listing deployments:`,
        err.message
      );
    }

    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  console.warn(
    `Deployment ${userId}-deployment not found after ${maxRetries} retries`
  );
  return undefined;
}
function deleteUserpod(userId, namespace = "default") {
  return new Promise((resolve, reject) => {
    exec(
      `helm uninstall ${userId} --namespace ${namespace}`,
      (err, stdout, stderr) => {
        if (err) return reject({ err, stderr });
        resolve(stdout);
      }
    );
  });
}

app.post("/deploy-userpod/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log("POST on", userId);
  if (!userId) return res.status(400).send("userId required");

  const chartPath = "./helm/userpod";
  const namespace = "default";

  const setValues = [
    `name=${userId}`,
    `image=pptl8685/runnerservice:latest`,
    `replicas=1`,
    `s3.folder=${userId}`,
  ].join(",");

  const helmCmd = `helm upgrade --install ${userId} ${chartPath} --namespace ${namespace} --create-namespace --set ${setValues}`;

  exec(helmCmd, async (err, stdout, stderr) => {
    if (err) {
      console.error("Helm deploy error:", err);
      return res.status(500).send({ error: err.message, stderr });
    }

    console.log("Helm deploy stdout:", stdout);

    try {
      const deploymentInfo = await listDeploymentWithRetry(userId);
      if (!deploymentInfo) {
        throw new Error("Not found Deployments");
      }
      res.send({
        message: deploymentInfo,
        helmOutput: stdout,
      });
    } catch (k8sErr) {
      console.error("Kubernetes API error:", k8sErr);
      res.status(500).send({ error: k8sErr.message });
    }
  });
});

app.delete("/delete-userpod/:userId", async (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).send("userId required");

  try {
    const output = await deleteUserpod(userId, "default");
    console.log("output", output);
    res.send({
      message: `Userpod "${userId}" deleted successfully!`,
      helmOutput: output,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
});

app.listen(3005, () => {
  console.log("ORCHESTRATOR SERVICE running on port 3005");

  (async () => {
    try {
      await listPods();
      //   await listDeployments();
      //await waitForDeployment("b", "default", k8sApi);
    } catch (err) {
      console.error("Error waiting for deployment:", err);
    }
  })();
});
