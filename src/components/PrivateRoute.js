import React from 'react';
import { Redirect, Route } from 'react-router-dom';
function PrivateRoute({ component:Component,isAuthenticated, ...rest }) {
    return (
      <Route
        {...rest}
        render={({ location }) =>
          isAuthenticated ? (
            <Component/>
          )
          : (
            <Redirect
              to={{
                pathname: "/not-authenticated",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }
export default PrivateRoute