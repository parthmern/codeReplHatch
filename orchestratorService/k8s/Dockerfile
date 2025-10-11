# testing file to reach to s3 of digital ocean 
FROM amazon/aws-cli

ENV AWS_ACCESS_KEY_ID="xxxxx"
ENV AWS_SECRET_ACCESS_KEY="xxxxx"

ENTRYPOINT ["/bin/sh", "-c"]
CMD ["aws --endpoint-url https://tor1.digitaloceanspaces.com s3 ls s3://parthmern-s3/nodejsDEFAULT/"]

# docker build -t test-aws-s3 .
# docker run --rm test-aws-s3 