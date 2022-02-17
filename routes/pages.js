import express from 'express'
import content from '../middleware/content.js'
import auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'

import { uploadCarouselImg, getCarouselImg, deleteCarouselImg } from '../controllers/pages.js'
const router = express.Router()
// 新增
router.post('/', auth, admin, content('multipart/form-data'), upload, uploadCarouselImg)
// 拿取
router.get('/', getCarouselImg)
// 刪除
router.delete('/:id', auth, admin, deleteCarouselImg)
export default router
