/* eslint-disable jsx-a11y/href-no-hash */

import React from 'react';
import {
  Redirect
} from 'react-router-dom';

const Logout = () => {
  localStorage.clear();
  return (
    <Redirect to="/login" />
  );
};

export default Logout;
