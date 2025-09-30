FROM node:alpine

WORKDIR /runnerService

COPY package.json .
COPY package-lock.json .

# run at image building time
RUN pwd && ls -l  

RUN npm ci 

COPY . .

RUN pwd & ls -l

# run when container starts 
CMD [ "npm", "run", "dev" ]

# Run this file
# docker build -t my-image-name . --progress=plain --no-cache
# docker run my-image-name -p 4000:4000
# docker tag my-image-name pptl8685/runnerService
# docker push pptl8685/runnerservice