import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useContext } from "react";
import AuthContext from "./AuthContext";

const PrivateRoute = ({ children, ...rest }) => {
  const { user } = useContext(AuthContext);

  return (
    <>
      {user ? (
        children
      ) : (
        <Navigate to="/Dashboard" replace />
      )}
    </>
  );
};

export default PrivateRoute;


/*
import React from 'react';
import { Route, Redirect } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Children } from "react";

const PrivateRoute  = ({childrem, ...rest}) => {
    let {user} = useContext(AuthContext);
    return <Route {...rest}>{!user ? <Redirect to="/login"/>: Children}</Route>;
};

export default PrivateRoute;

*/

/*
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from './AuthContext';

const PrivateRoute = () => {
  
};

export default PrivateRoute;

*/

/*
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import WrappedPrivateRoute from './WrappedPrivateRoute';
import { Children } from 'react';

const PrivateRoute = ({ children, ...rest }) => {
  return (
    <Route {...rest}>
      <WrappedPrivateRoute element={<Children />}>{children}</WrappedPrivateRoute>
    </Route>
  );
};

export default PrivateRoute;
*/