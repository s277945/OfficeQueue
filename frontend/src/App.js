import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { Switch, Route } from 'react-router-dom'

import { General } from './pages/General'
import { Manager } from './pages/Manager'
import { Officer } from './pages/Officer'
import { Ticket } from './pages/Ticket'

class App extends Component {

  render(){
  return <div className='App'>
      <Switch>
        <Route path='/general' component={General}></Route>
        <Route path='/manager' component={Manager}></Route>
        <Route path='/officer' component={Officer}></Route>
        <Route path='/ticket' component={Ticket}></Route>
        <Route component={General}></Route>
      </Switch>
    </div>
  }
}

export default App;
