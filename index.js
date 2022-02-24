import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import usersRoute from './routes/users.js'
import productsRoute from './routes/products.js'
import ordersRoute from './routes/orders.js'
import appointmentRoute from './routes/appointment.js'
import pagesRoute from './routes/pages.js'

mongoose.connect(process.env.DB_URL, () => {
  console.log('MongoDB Connected')
})

const app = express()

// 允許前端cors請求
app.use(
  cors({
    origin(origin, cb) {
      console.log(origin)
      if (
        origin === undefined ||
        origin.includes('github') ||
        origin.includes('localhost') ||
        origin.includes('192.168')
      ) {
        cb(null, true)
      } else {
        cb(new Error('Not allowed'), false)
      }
    }
  })
)

// 處理cors 錯誤
app.use((_, req, res, next) => {
  res.status(403).send({ success: false, message: '請求被拒絕' })
})

// 解析請求
app.use(express.json())

// express.json錯誤
app.use((_, req, res, next) => {
  res.status(400).send({ success: false, message: '資料格式錯誤' })
})

app.use('/users', usersRoute)
app.use('/products', productsRoute)
app.use('/orders', ordersRoute)
app.use('/appointments', appointmentRoute)
app.use('/pages', pagesRoute)

// 上面的錯誤都不符合
app.all('*', (req, res) => {
  console.log('index錯誤')
  res.status(404).send({ success: false, message: '找不到' })
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Server Started')
})
