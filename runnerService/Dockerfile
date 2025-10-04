FROM node:20-bullseye

# for node-pty
# RUN apk add --no-cache bash git python3 make g++

WORKDIR /runnerService

COPY package.json .
COPY package-lock.json .

# run at image building time
RUN pwd && ls -l  

RUN npm ci 

RUN npm install -g pm2

COPY . .

RUN pwd & ls -l

EXPOSE 4000 4001

RUN npm run build

# run when container starts 
CMD ["pm2-runtime", "dist/index.js", "--watch"]

# Run this file
# docker build -t my-image-name . --progress=plain --no-cache
# docker run -p 4000:4000 my-image-name 
# docker tag my-image-name pptl8685/runnerservice
# docker push pptl8685/runnerservice