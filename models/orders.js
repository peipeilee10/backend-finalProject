import mongoose from 'mongoose'
import validator from 'validator'

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.ObjectId,
      ref: 'users'
    },
    user: {
      name: {
        type: String,
        default: ''
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
      address: {
        type: String,
        default: ''
      },
      memo: {
        type: String,
        default: ''
      },
      pickupway: {
        type: String,
        enum: {
          values: ['宅配', '自取']
        }
      },
      pay: {
        type: String,
        enum: {
          values: ['貨到付款', 'ATM轉帳']
        }
      }
    },
    products: {
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
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { versionKey: false }
)

export default mongoose.model('orders', orderSchema)
