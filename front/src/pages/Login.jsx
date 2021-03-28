import React, { useState } from 'react'
import { MeDocument, useLoginMutation } from '../generated/graphql'
import { setAccessToken } from '../service/auth/token'

const Login = ({ history }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [register] = useLoginMutation()

  return (
    <form onSubmit={async e => {
      e.preventDefault()
      console.log('form submitted')
      const response = await register({
        variables: {
          email,
          password
        },
        update: (store, { data }) => {
          if (!data) return null
          store.writeQuery({
            query: MeDocument,
            data: {
              me: data.login.user
            }
          })
        }
      })
      console.log(response);
      if (response && response.data) {
        setAccessToken(response.data.login.accessToken)
      }

      history.push("/")
    }}>
      <div>
        <input type="email" value={email} placeholder="email" onChange={
          e => { setEmail(e.target.value) }
        } />
      </div>
      <div>
        <input type="password" value={password} placeholder="password" onChange={
          e => { setPassword(e.target.value) }
        } />
      </div>
      <div>
        <button>login</button>
      </div>
    </form>
  )
}

export default Login
