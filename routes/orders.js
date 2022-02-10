import express from 'express'
import content from '../middleware/content.js'
import auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'

import { checkout, getMyOrders, getAllOrders } from '../controllers/orders.js'

const router = express.Router()
// 結帳
router.post('/', content('application/json'), auth, checkout)
// 找使用者訂單
router.get('/me', auth, getMyOrders)
// 找所有人訂單
router.get('/all', auth, admin, getAllOrders)

export default router
