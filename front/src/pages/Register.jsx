import React, { useState } from 'react'
import { useRegisterMutation } from '../generated/graphql'

const Register = ({ history }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')

  const [register] = useRegisterMutation()

  return (
    <form onSubmit={async e => {
      e.preventDefault()
      console.log('form submitted')
      const response = await register({
        variables: {
          name, email, password, role
        }
      })
      console.log(response);
      history.push("/")
    }}>
      <div>
        <input type="name" value={name} placeholder="name" onChange={
          e => { setName(e.target.value) }
        } />
      </div>
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
        <input type="name" value={role} placeholder="role" onChange={
          e => { setRole(e.target.value) }
        } />
      </div>
      <div>
        <button>register</button>
      </div>
    </form>
  )
}

export default Register
