import React from 'react'
import { Link } from 'react-router-dom'
import { useLogoutMutation, useMeQuery } from './generated/graphql'
import { setAccessToken } from './service/auth/token'

const Header = () => {
  const { loading, data } = useMeQuery()
  const [logout, { client }] = useLogoutMutation()

  return (
    <div>
      <span><Link to="/">Home</Link> | </span>
      {!loading &&
        data && data.me ?
        <span>you are logged is as: {data.me.email} | <button onClick={async () => {
          await logout()
          setAccessToken('')
          await client.resetStore()
        }}>logout</button></span>
        :
        <span><Link to="/register">Register</Link> | <Link to="/login">Login</Link></span>
      }
    </div>
  )
}

export default Header
