const express = require('express')

const app = express()
app.get('/health', (req, res) => {
  res.send('ok')
})

app.listen(3000, () => {
  console.log('App started on port 3000')
})
