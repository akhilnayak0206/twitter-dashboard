import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import LoginPage from '../components/LoginPage';
import Dashboard from '../components/Dashboard';
import '../App.css';

const Routes = () => {
  return (
    <div className='main'>
      <Switch>
        <Route exact path='/login' component={LoginPage} />
        <Route exact path='/dashboard' component={Dashboard} />
        <Redirect exact from='/' to='/login' />
        <Redirect to='/' />
      </Switch>
    </div>
  );
};

export default Routes;
