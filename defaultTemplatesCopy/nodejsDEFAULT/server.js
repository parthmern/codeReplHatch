const express = require("express");
const app = express();
const port = 4001; // FIXED (Do not change)
const cors = require("cors");

app.use(cors()); // Do not remove in Dev mode

app.get("/", (req, res) => {
  res.send("Hello from default template | github @parthmern");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
