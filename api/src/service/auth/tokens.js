import jwt from 'jsonwebtoken'
const { User } = require("../../../models")

export const createAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  )
}

export const createRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  )
}

export const sendRefreshToken = (res, user) => {
  const refreshToken = user ? createRefreshToken(user) : ''
  res.cookie('h4p', refreshToken, {
    httpOnly: true,
    path: '/refresh_token'
  })
}

export const verifyRefreshToken = async ({ req, res }) => {
  const failedResponse = { ok: false, accessToken: '' }

  // get token from cookies
  const token = req.cookies.h4p
  if (!token) return res.send(failedResponse)

  // verify if token is valid
  let payload = null
  try {
    payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
  } catch (error) {
    console.log(error)
    return res.send(failedResponse)
  }

  // token is valid
  // find user
  const user = await User.findByPk(payload.id)
  if (!user) return res.send(failedResponse)

  // check tokenVersion
  if (user.tokenVersion !== payload.tokenVersion) return res.send(failedResponse)

  // send a httpOnly cookie
  sendRefreshToken(res, user)

  // send access token
  return res.send({ ok: true, accessToken: createAccessToken(user) })
}