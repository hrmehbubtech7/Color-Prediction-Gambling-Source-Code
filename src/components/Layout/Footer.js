import React from 'react';
import { NavLink } from 'react-router-dom';
import {   NavLink as BSNavLink,Navbar, Nav, NavItem } from 'reactstrap';
import {
  FaHome,
  FaCoins,
 FaTrophy,
 FaUser
} from 'react-icons/fa';
import {
  GiCardPlay,GiWallet,GiCrownCoin
} from 'react-icons/gi';
import {
  HiSupport
} from 'react-icons/hi';
import {
  AiOutlineLogin
} from 'react-icons/ai';
import bn from 'utils/bemnames';
const bem = bn.create('footer');

const Footer = () => {
  var navItems;
  if(localStorage.getItem('auth')){
    navItems = [
   
      // { to: '/', name: 'Home', exact: true, Icon: FaHome },
      { to: '/play', name: 'Color', exact: true, Icon: GiCardPlay },

      // { to: '/toss', name: 'Toss', exact: true, Icon: GiCrownCoin },
      { to: '/wallet', name: 'Wallet', exact: true, Icon: GiWallet },
      { to: '/account', name: 'Account', exact: false, Icon: FaUser },
      // { to: '/about', name: 'About', exact: false, Icon: MdContactMail }
    
    ];
  }else{
    navItems = [
   
      { to: '/', name: 'Home', exact: true, Icon: FaHome },
      // { to: '/admin', name: 'Admin', exact: false, Icon: FaUserEdit },
      { to: '/login', name: 'Signin', exact: false, Icon: AiOutlineLogin },
      // { to: '/about', name: 'About', exact: false, Icon: MdContactMail }
    
    ];
  }
  return (
    <Navbar className="footer">
      <Nav navbar>
        {navItems.map(({ to, name, exact, Icon }, index) => (
              <NavItem key={index} className={bem.e('nav-item')}>
                <BSNavLink
                  id={`navItem-${name}-${index}`}
                  className="text-uppercase"
                  tag={NavLink}
                  to={to}
                  activeClassName="active"
                  exact={exact}
                >
                  <Icon className={bem.e('nav-item-icon')} />
                  <span className="">{name}</span>
                </BSNavLink>
              </NavItem>
            ))}
      </Nav>
    </Navbar>
  );
};

export default Footer;
