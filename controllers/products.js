import products from '../models/products.js'
import users from '../models/users.js'

// 增加商品
export const createProducts = async (req, res) => {
  console.log(req.body)
  try {
    const result = await products.create({ ...req.body, image: req.file.path })
    console.log(result)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    console.log('createProducts商品新增錯誤')
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(400).send({ success: false, message: error.errors[key].message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

// 修改商品
export const updateProductById = async (req, res) => {
  const data = {
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    image: req.body.image,
    sell: req.body.sell
  }
  if (req.file) {
    data.image = req.file.path
  }
  try {
    const result = await products.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    console.log('updateProductById修改商品錯誤')
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到商品' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(400).send({ success: false, message: error.errors[key].message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

// 拿到所有商品
export const getAllProducts = async (req, res) => {
  try {
    const result = await products.find()
    // console.log(result)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    console.log('getAllProducts拿取所有商品失敗')
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 刪除商品
export const deleteProduct = async (req, res) => {
  console.log('刪除商品controller')
  try {
    await products.findByIdAndDelete(req.params.id)
    await users.find({
      $pull: {
        cart: {
          _id: req.params._id
        }
      }
    })
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    console.log('deleteProduct刪除商品錯誤')
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到商品' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

// 拿到商品
export const getProducts = async (req, res) => {
  try {
    const result = await products.find({ sell: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    console.log('getProducts拿取商品失敗')
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 拿商品
export const getProductById = async (req, res) => {
  try {
    const result = await products.findById(req.params.id)
    console.log(req.params.id)
    if (result) {
      res.status(200).send({ success: true, message: '', result })
    } else {
      console.log('123')
      res.status(404).send({ success: false, message: '找不到商品' })
    }
  } catch (error) {
    console.log('getProductById錯誤')
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到商品' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}
