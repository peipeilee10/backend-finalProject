import appointment from '../models/appointment.js'
// import users from '../models/users.js'

// 新增預約
export const appointmentcheckout = async (req, res) => {
  // console.log(req.user)
  console.log(req.body)
  try {
    const result = await appointment.create({ userId: req.user._id, appointment: req.body })
    console.log('result' + result)
    await req.user.save()
    // console.log('123')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    console.log('appointmentcheckout 錯誤')
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

// 拿到自己的預約
export const getMyappointment = async (req, res) => {
  console.log(req.user)
  try {
    const result = await appointment.find({ userId: req.user._id })
    res.status(200).send({ success: true, message: '', result })
    console.log(result)
  } catch (error) {
    console.log('getMyappointment錯誤')
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 拿取所有預約
export const getAllappointment = async (req, res) => {
  // console.log(req.user)
  try {
    const result = await appointment.find()
    // console.log(result)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    console.log('getAllappointment錯誤')
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 刪除預約
export const deletappointment = async (req, res) => {
  console.log('刪除預約deletappointment')
  try {
    await appointment.findByIdAndDelete(req.params.id)
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    console.log('deletappointment刪除預約錯誤')
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到商品' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}
