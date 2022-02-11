import mongoose from 'mongoose'
import validator from 'validator'

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.ObjectId,
    ref: 'users'
  },
  appointment: {
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
    pettype: {
      type: String,
      enum: {
        values: ['小型犬', '中型犬', '大型犬', '短毛', '長毛']
      }
    },
    petName: {
      type: String,
      default: ''
    },
    petbreed: {
      String,
      default: ''
    },
    serviceitem: {
      type: String,
      enum: {
        values: ['小美容', '大美容']
      }
    },
    appointmentdate: {
      type: String,
      default: ''
    },
    appointmenttime: {
      type: String,
      default: ''
    }
  }
}, { versionKey: false })

export default mongoose.model('appointments', appointmentSchema)
