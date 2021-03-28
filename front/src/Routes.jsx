import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Header from './Header'
import Home from './pages/Home'
import Login from './pages/Login'
import Me from './pages/Me'
import Register from './pages/Register'

const Routes = () => {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/me" component={Me} />
      </Switch>
    </BrowserRouter>
  )
}

export default Routes
