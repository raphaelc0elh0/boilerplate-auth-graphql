export const context = async ({ res, req }) => {
  const user = req.user || null // req.user got from expressJWT middleware
  return { res, req, user }
}