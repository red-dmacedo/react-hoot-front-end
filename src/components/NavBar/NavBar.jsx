// src/components/NavBar/NavBar.jsx

import { useContext } from 'react';
import { Link } from 'react-router';

import { UserContext } from '../../contexts/UserContext';

const NavBar = () => {
  const {user, setUser} = useContext(UserContext);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <nav>
      {user ? (
        <ul>
          <li><Link to='/'>Dashboard</Link></li>
          <li><Link to='/hoots'>Hoots</Link></li>
          <li><Link to='/' onClick={handleSignOut}>Sign Out</Link></li>
        </ul>
      ) : (
        <ul>
          <li><Link to='/sign-up'>Sign Up</Link></li>
          <li><Link to="/sign-in">Sign In</Link></li>
        </ul>
      )}
    </nav>
  );
};

export default NavBar;

