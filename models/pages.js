import mongoose from 'mongoose'

const pageSchema = new mongoose.Schema({
  carouselImage: {
    type: String
  }
}, { versionKey: false })

export default mongoose.model('pages', pageSchema)
