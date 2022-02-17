import users from '../models/users.js'
import jwt from 'jsonwebtoken'
import md5 from 'md5'
import products from '../models/products.js'

// 註冊
export const register = async (req, res) => {
  try {
    // 註冊成功
    await users.create(req.body)
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      // 資料錯誤
      const key = Object.keys(error.errors)[0]
      res.status(400).send({ sucess: false, message: error.errors[key].name })
      // 有設unique
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(400).send({ sucess: false, message: '帳號已存在' })
    } else {
      // 其他錯誤
      res.status(500).send({ sucess: false, message: '帳號已存在' })
    }
  }
}

// 登入
export const login = async (req, res) => {
  try {
    // 找到相符的帳密
    const user = await users.findOne(
      {
        account: req.body.account,
        password: md5(req.body.password)
      },
      '-password'
    )
    // 簽發jwt
    if (user) {
      const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET, { expiresIn: '7 days' })
      user.tokens.push(token)
      // console.log('token:' + token)
      await user.save()
      const result = user.toObject()
      // console.log('result:' + result)
      // 不須回傳以前的tokens，所以刪除
      delete result.tokens
      result.token = token
      result.cart = result.cart.length
      res.status(200).send({ success: true, message: '', result })
    } else {
      res.status(404).send({ success: true, message: '帳號或密碼錯誤' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: true, message: '伺服器錯誤' })
  }
}

// 登出
export const logout = async (req, res) => {
  try {
    // 將user.token從陣列中過濾掉
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    await req.user.save()
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// token舊換新
export const extend = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex(token => token === req.token)
    const token = jwt.sign({ _id: req.user._id.toString() }, process.env.SECRET, { expiresIn: '7 days' })
    req.user.token[idx] = token
    // 標記修改
    req.user.markModifies('tokens')
    await req.user.save()
    res.status(200).send({ success: true, message: '', result: { token } })
  } catch (error) {
    console.log('token舊換新錯誤')
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 更新會員資料
export const updateInfo = async (req, res) => {
  console.log('updateInfo')
  try {
    const user = await users.findByIdAndUpdate({ _id: req.user.id }, req.body, { new: true, runValidators: true })
    if (user) {
      res.status(200).send({ success: false, message: '', user })
    } else {
      res.status(404).send({ success: false, message: '找不到使用者' })
    }
  } catch (error) {
    console.log('updateInfo錯誤')
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(400).send({ sucess: false, message: error.errors[key].name })
    } else {
      res.status(500).send({ sucess: false, message: '伺服器錯誤' })
    }
  }
}

// 拿取使用者自己的資料
export const getUserInfo = async (req, res) => {
  try {
    const result = req.user.toObject()
    delete result.tokens
    result.cart = result.cart.length
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    console.log('getUserInfo錯誤')
    res.status(500).send({ success: true, message: '伺服器錯誤' })
  }
}

// 加入購物車
export const addCart = async (req, res) => {
  console.log('addCart')
  try {
    const idx = req.user.cart.findIndex(item => item.product.toString() === req.body.product)
    if (idx > -1) {
      req.user.cart[idx].quantity += req.body.quantity
    } else {
      const result = await products.findById(req.body.product)
      if (!result || !result.sell) {
        res.status(404).send({ success: true, message: '商品不存在' })
        return
      }
      req.user.cart.push(req.body)
    }
    await req.user.save()
    res.status(200).send({ success: true, message: '', result: req.user.cart.length })
  } catch (error) {
    console.log('addCart錯誤')
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(400).send({ sucess: false, message: error.errors[key].name })
    } else {
      res.status(500).send({ sucess: false, message: '伺服器錯誤' })
    }
  }
}

export const getCart = async (req, res) => {
  try {
    const { cart } = await users.findById(req.user._id, 'cart').populate('cart.product')
    res.status(200).send({ success: true, message: '', result: cart })
  } catch (error) {
    console.log('getCart錯誤')
    res.status(500).send({ sucess: false, message: '伺服器錯誤' })
  }
}

export const updateCart = async (req, res) => {
  console.log('updateCart')
  try {
    if (req.body.quantity === 0) {
      const idx = req.user.cart.findIndex(item => item.product.toString() === req.body.product)
      if (idx > -1) {
        req.user.cart.splice(idx, 1)
      }
      await req.user.save()
      res.status(200).send({ success: true, message: '' })
    } else {
      const idx = req.user.cart.findIndex(item => item.product.toString() === req.body.product)
      if (idx > -1) {
        req.user.cart[idx].quantity = req.body.quantity
      }
      await req.user.save()
      res.status(200).send({ success: true, message: '' })
    }
  } catch (error) {
    console.log('updateCart錯誤')
    res.status(500).send({ success: false, messaga: '伺服器錯誤' })
  }
}
