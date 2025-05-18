import express from 'express'

const app = express()
const PORT = 8080

// 1x1 像素透明 GIF
const transparentGIF = Buffer.from(
  'R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
  'base64',
)

// gif 获取数据方式
app.get('/send/monitor.gif', (req, res) => {
  try {
    const data = JSON.parse(req.query.data)
    console.log('收到监控数据:', {
      timestamp: new Date().toISOString(),
      data: data,
    })
    res.set({
      'Content-Type': 'image/gif',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
    })
    res.status(200).send(transparentGIF)
  } catch (error) {
    console.error('解析监控数据失败:', error)
    res.status(400).json({ error: 'Invalid data' })
  }
})

app.listen(PORT, () => {
  console.log(`Monitor server running at http://localhost:${PORT}`)
})
