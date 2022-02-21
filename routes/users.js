import express from 'express'
import content from '../middleware/content.js'
import auth from '../middleware/auth.js'

import {
  register,
  login,
  logout,
  extend,
  updateInfo,
  getUserInfo,
  addCart,
  getCart,
  updateCart
} from '../controllers/users.js'

const router = express.Router()

// 註冊
router.post('/', content('application/json'), register)
// 登入
router.post('/login', content('application/json'), login)
// 登出
router.delete('/logout', auth, logout)
// token舊換新
router.post('/extend', auth, extend)
// 更新會員資料
router.patch('/info', auth, updateInfo)
// 拿取自己的資料
router.get('/me', auth, getUserInfo)
// 加入購物車
router.post('/me/cart', auth, addCart)
// 拿取購物車資料
router.get('/me/cart', auth, getCart)
// 更新購物車資料
router.patch('/me/cart', auth, updateCart)

export default router
