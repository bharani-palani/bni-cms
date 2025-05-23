import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import AppContext from '../contexts/AppContext';
import { UserContext } from '../contexts/UserContext';

export const ProtectedRoute = ({
  component: Component,
  structure,
  meta,
  ...rest
}) => {
  return (
    <AppContext.Consumer>
      {appData => {
        return (
          <UserContext.Consumer>
            {userInfo => {
              return (
                <Route
                  {...rest}
                  render={props => {
                    if (rest.accessGiven.includes(userInfo.userData.type)) {
                      return (
                        <Component
                          {...props}
                          structure={structure}
                          meta={meta}
                        />
                      );
                    } else {
                      return (
                        <Redirect
                          to={{
                            pathname: 'error',
                            state: { from: props.location },
                          }}
                        />
                      );
                    }
                  }}
                />
              );
            }}
          </UserContext.Consumer>
        );
      }}
    </AppContext.Consumer>
  );
};
