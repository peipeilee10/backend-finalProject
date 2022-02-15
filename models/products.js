import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '商品名不能空白']
    },
    price: {
      type: String,
      required: [true, '商品價格不能空白']
    },
    description: {
      type: String,
      required: [true, '商品介紹不能空白']
    },
    image: {
      type: String,
      required: [true, '商品照片不能空白']
    },
    sell: {
      type: Boolean
    },
    category: {
      type: String,
      enum: {
        values: ['毛孩飼料', '沐浴用品', '毛孩玩具', '其他用品']
      }
    }
  },
  { versionKey: false }
)

export default mongoose.model('products', productSchema)
