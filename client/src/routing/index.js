import React from 'react';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
import LoginPage from '../components/LoginPage';
import Dashboard from '../components/Dashboard';

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/login' component={LoginPage} />
        <Route exact path='/dashboard' component={Dashboard} />
        <Redirect exact from='/' to='/login' />
        <Redirect to='/' />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
