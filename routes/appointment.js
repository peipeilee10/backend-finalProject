import express from 'express'
import content from '../middleware/content.js'
import auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'

import {
  appointmentcheckout,
  getMyappointment,
  getAllappointment,
  deletappointment
} from '../controllers/appointment.js'

const router = express.Router()

// 新增預約
router.post('/', content('application/json'), auth, appointmentcheckout)
// 使用者拿自己的預約紀錄
router.get('/myappointment', auth, getMyappointment)
// 管理者拿全部的預約紀錄
router.get('/allappointment', auth, admin, getAllappointment)
// 取消預約
router.delete('/deleteappointment/:id', auth, deletappointment)

export default router
