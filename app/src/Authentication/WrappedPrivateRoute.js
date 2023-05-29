import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from './AuthContext';

const WrappedPrivateRoute = ({ children, ...rest }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
};

export default WrappedPrivateRoute;
