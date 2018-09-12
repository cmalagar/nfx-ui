import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import './App.css';
import Investor from '../../components/Investor'
import Investors from '../../components/Investors'
import CreateInvestor from '../../components/CreateInvestor'
import EditInvestor from '../../components/EditInvestor'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path='/' component={Investors} />
          <Route path='/create' component={CreateInvestor} />
          <Route path='/edit_investor' component={EditInvestor} />
        </Switch>
      </div>
    );
  }
}

export default App;
