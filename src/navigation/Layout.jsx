import React from "react";
import Navbar from './navbar';
import { Outlet, useLocation } from 'react-router-dom';

function Layout() {
  const location = useLocation();

  return (
    <>
      {/* Hide Navbar on home, login, and signin pages */}
      {location.pathname !== '/' &&
        location.pathname !== '/admin' &&
        location.pathname !== '/admin-car' &&
        location.pathname !== '/users'
        && location.pathname !== '/inbox' &&
        location.pathname !== '/login' &&
        location.pathname !== '/signin'
        && <Navbar />}
      <Outlet />
    </>
  );
}

export default Layout;
