// import { Button, } from 'reactstrap';
import { useState } from 'react';
import logo from '../assests/img/logo.png'
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';


const Navbar = () => {
    const authObj = JSON.parse(localStorage.getItem('authInfo'))
    return(
        <div className="nav-bar">
          {/* <Link to='https://aqueongroup.com/'>
            <img src={logo} alt="log" className='logo-image'/>   
          </Link> */}
          <h4>Admin Dashboard</h4>
          {/* { authObj?.data?.code && <Avatar sx={{ bgcolor: "#FFA07A" }} >{authObj?.data?.code ?  authObj?.data?.code.substring(2, 4).toUpperCase(): 'AU'}</Avatar> } */}
        </div>
    )
}

export default Navbar;
