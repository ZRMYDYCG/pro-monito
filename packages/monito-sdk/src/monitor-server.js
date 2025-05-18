import express from 'express'

const app = express()
const PORT = 8080

// 1x1 像素透明 GIF
const transparentGIF = Buffer.from(
  'R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
  'base64',
)

app.get('/send/monitor.gif', (req, res) => {
  console.log('收到监控数据:', req.query.data)
  res.set('Content-Type', 'image/gif')
  res.send(transparentGIF)
})

app.listen(PORT, () => {
  console.log(`Monitor server running at http://localhost:${PORT}`)
})
