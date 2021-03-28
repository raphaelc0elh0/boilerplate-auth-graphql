import React from 'react'
import { useUsersQuery } from '../generated/graphql'

const Home = () => {
  const { data, error, loading } = useUsersQuery()

  if (loading) return <div>Loading</div>
  if (error) return <div>{error.message}</div>

  return (
    <div>
      <div>users:</div>
      <ul>
        {data.users.map(user => {
          return <li key={user.id}>{user.id}. {user.name} - {user.email} - {user.role}</li>
        })}
      </ul>
    </div>
  )
}

export default Home
