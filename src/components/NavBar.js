import React from 'react';
import { Link } from "react-router-dom";
import './NavBar.css';

const NavBar = () => {
  return (
    <div className='nav'>
        <Link className='link' to="/"><h1>Dough Calculator</h1></Link>
        <div className='nav-right'>
        <Link className='link' to="/about"><h2>about </h2></Link>
        <Link className='link' to="/settings"><h2>settings <i class="fa fa-cog" aria-hidden="true"></i></h2></Link>
        </div>
    </div>
  )
}

export default NavBar;