import orders from '../models/orders.js'
import users from '../models/users.js'

// 結帳
export const checkout = async (req, res) => {
  try {
    console.log(req.user.cart)
    if (req.user.cart.length === 0) {
      res.status(400).send({ success: false, message: '購物車是空的' })
      return
    }
    // 檢查有沒有結帳過
    const hasNotsell = await users.aggregate([
      {
        $match: {
          _id: req.user._id
        }
      },
      {
        $project: {
          'cart.product': 1
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'cart.product',
          foreignField: '_id',
          as: 'cart.product'
        }
      },
      {
        $match: {
          'cart.product.sell': false
        }
      }
    ])
    if (hasNotsell.length > 0) {
      console.log(hasNotsell)
      res.status(404).send({ success: false, message: '包含下架商品' })
      return
    }

    const result = await orders.create({ userId: req.user._id, user: req.body, products: req.user.cart })

    console.log(result)
    // 清空購物車
    req.user.cart = []
    await req.user.save()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    console.log('checkout 錯誤')
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

export const getMyOrders = async (req, res) => {
  console.log('getMyOrders')
  try {
    const result = await orders.find({ userId: req.user._id }).populate('products.product')
    res.status(200).send({ success: false, message: '', result })
    console.log(result)
  } catch (error) {
    console.log('getMyOrders錯誤')
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getAllOrders = async (req, res) => {
  try {
    const result = await orders.find().populate('products.product')
    console.log(result)
    res.status(200).send({ success: false, message: '', result })
  } catch (error) {
    console.log('getAllOrders錯誤')
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
