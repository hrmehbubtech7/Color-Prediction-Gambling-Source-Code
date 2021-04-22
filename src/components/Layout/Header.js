
import React from 'react';

import {
  Navbar
} from 'reactstrap';
import bn from 'utils/bemnames';

const bem = bn.create('header');



class Header extends React.Component {
  state = {
    isOpenNotificationPopover: false,
    isNotificationConfirmed: false,
    isOpenUserCardPopover: false,
  };

  toggleNotificationPopover = () => {
    this.setState({
      isOpenNotificationPopover: !this.state.isOpenNotificationPopover,
    });

    if (!this.state.isNotificationConfirmed) {
      this.setState({ isNotificationConfirmed: true });
    }
  };

  toggleUserCardPopover = () => {
    this.setState({
      isOpenUserCardPopover: !this.state.isOpenUserCardPopover,
    });
  };

  handleSidebarControlButton = event => {
    event.preventDefault();
    event.stopPropagation();

    document.querySelector('.cr-sidebar').classList.toggle('cr-sidebar--open');
  };

  render() {

    return (
      <Navbar light expand className={bem.b('bg-white')}>
        {/* <Nav navbar className="mr-2">
          <Button outline onClick={this.handleSidebarControlButton}>
            <MdClearAll size={25} />
          </Button>
        </Nav> */}
        <h2 style={{'color':'teal'}}>Welcome to ${process.env.REACT_APP_NAME}</h2>
        {/* <Nav navbar>
          <SearchInput />
        </Nav> */}

        
      </Navbar>
    );
  }
}

export default Header;
