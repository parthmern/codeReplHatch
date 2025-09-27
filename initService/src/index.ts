import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { s3Service } from './services/s3.service.js'

const app = new Hono()

app.get('/', (c) => {
  return c.json({
    "github": "@parthmern",
    "portfolio": "parthmern.cloud"
  }, 200)
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
  const s3 = new s3Service();
  s3.getAllObject();
  s3.copyS3Folder("defaultTemplates", "parth");
  s3.saveContentToS3("trial/", "name.txt", "content");
})
