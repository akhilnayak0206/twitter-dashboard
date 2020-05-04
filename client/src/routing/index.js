import React from 'react';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
import LoginPage from '../components/LoginPage';

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/login' component={LoginPage} />
        <Redirect exact from='/' to='/login' />
        <Redirect to='/' />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
