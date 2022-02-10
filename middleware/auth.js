import users from '../models/users.js'
import jwt from 'jsonwebtoken'

export default async (req, res, next) => {
  try {
    // 先將token的bearer取代成空字串
    const token = req.headers.authorization?.replace('Bearer ', '') || ''
    // 如果傳進來的有token
    if (token.length > 0) {
      // 先解譯
      const decoded = jwt.decode(token)
      // console.log('decoded' + decoded)
      // 找相符的token(id=解譯出的id)
      req.user = await users.findOne({ _id: decoded._id, tokens: token })
      // 將進來的token存進req.token裡
      req.token = token
      // 如果找到user
      if (req.user) {
        // 如果路徑是舊換新
        if (req.baseUrl === '/users' && req.path === '/extend') {
          // 通過
          next()
          // 如果是其他路徑
        } else {
          // 用SECRET驗證
          jwt.verify(token, process.env.SECRET)
          next()
        }
      } else {
        throw new Error('找不到user')
      }
    } else {
      // 如果傳進來的沒有token
      throw new Error('沒有token')
    }
  } catch (error) {
    // console.log(req)
    if (error.name === 'TokenExpiredError' && req.baseUrl === '/users' && req.path === '/extend') {
      next()
    } else {
      res.status(401).send({ success: false, message: '驗證錯誤' })
    }
  }
}
