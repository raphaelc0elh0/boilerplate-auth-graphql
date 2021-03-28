import React from 'react'
import { useMeQuery } from '../generated/graphql'

const Me = () => {
  const { data, error, loading } = useMeQuery({
    fetchPolicy: 'network-only'
  })

  if (loading) return <div>Loading</div>
  if (error) return <div>{error.message}</div>

  return (
    <div>
      {data.me.role}
    </div>
  )
}

export default Me
