import mongoose from 'mongoose'
import md5 from 'md5'
import validator from 'validator'

const userSchema = new mongoose.Schema({
  account: {
    type: String,
    minlength: [4, '帳號字數需介於4-10個字'],
    maxlength: [10, '帳號字數需介於4-10個字'],
    unique: true,
    required: [true, '帳號為必填欄位']
  },
  password: {
    type: String,
    minlength: [4, '密碼字數不得小於4個字'],
    required: [true, '密碼為必填欄位']
  },
  email: {
    type: String,
    validator: {
      validator (email) {
        if (email.length === 0) return true
        return validator.isEmail(email)
      },
      message: '信箱格式不正確'
    },
    default: ''
  },
  tokens: {
    type: [String]
  },
  role: {
    // 0 一般會員  1管理員
    type: Number,
    default: 0
  },
  name: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: '',
    validator: {
      validator (phone) {
        if (phone.length === 0) return true
        return validator.isMobilePhone(phone, 'zh-TW')
      }
    }
  },
  cart: {
    type: [
      {
        product: {
          type: mongoose.ObjectId,
          ref: 'products',
          required: [true, '缺少商品ID']
        },
        quantity: {
          type: Number,
          required: [true, '缺少商品數量']
        }
      }
    ]
  }
}, { versionKey: false })

// 儲存前加密密碼
userSchema.pre('save', function (next) {
  const user = this
  // 密碼被修改過
  if (user.isModified('password')) {
    // 如果密碼符合條件(長度大於4)
    if (user.password.length >= 4) {
      // 進行md5加密
      user.password = md5(user.password)
    } else {
      // 如果不符合就回傳錯誤
      const error = new mongoose.Error.ValidationError(null)
      error.addError('password', new mongoose.Error.ValidationError({ message: '密碼長度不得小於4' }))
      next(error)
    }
  }
  next()
})

// 找到並更新
userSchema.pre('findOneAndUpdate', function (next) {
  const user = this._update
  if (user.password) {
    if (user.password.length >= 4) {
      user.password = md5(user.password)
    } else {
      const error = new mongoose.Error.ValidationError(null)
      error.addError('password', new mongoose.Error.ValidatorError({ message: '密碼長度不得小於4' }))
      next(error)
      return
    }
  }
  next()
})

export default mongoose.model('users', userSchema)
