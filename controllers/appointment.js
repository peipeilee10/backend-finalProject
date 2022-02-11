import appointment from '../models/appointment.js'
// import users from '../models/users.js'

// 預約
export const appointmentcheckout = async (req, res) => {
  // console.log(req.user)
  console.log('req.body' + req.body)
  try {
    const result = await appointment.create({ userId: req.user._id, appointment: req.body })
    console.log('result' + result)
    await req.user.save()
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

export const getMyappointment = async (req, res) => {

}

export const getAllappointment = async (req, res) => {

}
