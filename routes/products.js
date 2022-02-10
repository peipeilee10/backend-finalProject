import express from 'express'
import content from '../middleware/content.js'
import auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'
import {
  createProducts,
  updateProductById,
  getAllProducts,
  deleteProduct,
  getProducts,
  getProductById
  // getAllProducts
} from '../controllers/products.js'

const router = express.Router()

// 上傳商品
router.post('/', auth, admin, content('multipart/form-data'), upload, createProducts)
// 修改商品
router.patch('/:id', auth, admin, content('multipart/form-data'), upload, updateProductById)
// 拿到所有商品(含下架)
router.get('/all', auth, admin, getAllProducts)
// 刪除商品
router.delete('/:id', auth, admin, deleteProduct)
// 拿到所有商品(不含下架)
router.get('/', getProducts)
// 拿商品
router.get('/:id', getProductById)

export default router
