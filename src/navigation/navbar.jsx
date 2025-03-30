import React from 'react';
import { NavLink } from 'react-router-dom';
import '../style/responsive-design/navbar-responsive.css'

const Navbar = () => {
  return (
    <div className="Navbar">
      <div className='contener'>
        <div className='navbar'>
          <div className='navbar-left'>
            <h2><NavLink to="/">Car Comparison</NavLink></h2>
          </div>
          <div className='navbar-right'>
            <NavLink to="/">Home</NavLink>
            {/* <NavLink to="/pages">Result Page</NavLink> */}
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
