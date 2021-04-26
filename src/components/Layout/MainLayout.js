import { Content, Footer, Header } from 'components/Layout';
import React from 'react';
import Snackbar from "components/Snackbar.js";

import {
  FaTelegram
} from 'react-icons/fa';
import {
  MdNotificationsActive
} from 'react-icons/md';
import { Link } from 'react-router-dom';
class MainLayout extends React.Component {
  token = JSON.parse(localStorage.getItem('auth'));
  state={
    envelopModal:false,
    envelop:'',
    notiMessage:false
  }
  static isSidebarOpen() {
    // return document
    //   .querySelector('.cr-sidebar')
    //   .classList.contains('cr-sidebar--open');
  }

  componentWillReceiveProps({ breakpoint }) {
    if (breakpoint !== this.props.breakpoint) {
      this.checkBreakpoint(breakpoint);
    }
  }

  notifyFunc = () => {

    if (this.token && this.token.user.admin==true) {
      fetch("/api/new-complaints-admin", {
        "method": "GET",
        "headers": {
          "content-type": "application/json",
          "Authorization": this.token.userToken
        }
      })
        .then(response => {
          if (response.status < 400) {
            response.json().then(res => {
              if (res.complaints > 0) {
                this.setState({notiMessage : (<Link className="notification-link" to="/complaint-admin">New Complaints appeared</Link>)});              
              }
              if (res.withdrawals > 0) {
                this.setState({notiMessage : (<Link className="notification-link" to="/withdrawl-admin">New Withdrawal request waiting</Link>)});
              }
            });
          }
        });
    } else if (this.token) {
      fetch("/api/new-complaints", {
        "method": "GET",
        "headers": {
          "content-type": "application/json",
          "Authorization": this.token.userToken
        }
      })
        .then(response => {
          if (response.status < 400) {
            response.json().then(res => {
              if (res.complaints > 0) {
                this.setState({notiMessage : (<Link className="notification-link" to="/support">Replied from the Support team</Link>)});
              
              }
              if (res.withdrawals > 0) {
                this.setState({notiMessage : (<Link className="notification-link" to="/records/withdraw-list">Withdrawal accepted</Link>)});
             
              }
            });
          }
        });
    }
  }


  componentDidMount() {
    this.checkBreakpoint(this.props.breakpoint);
    this.notifyFunc();
    setInterval(this.notifyFunc, 300000);
    // setTimeout(() => {
    //   if (!this.notificationSystem) {
    //     return;
    //   }

    //   this.notificationSystem.addNotification({
    //     title: <MdImportantDevices />,
    //     message: 'Welome to Reduction Admin!',
    //     level: 'info',
    //   });
    // }, 1500);

    // setTimeout(() => {
    //   if (!this.notificationSystem) {
    //     return;
    //   }

    //   this.notificationSystem.addNotification({
    //     title: <MdLoyalty />,
    //     message:
    //       'Reduction is carefully designed template powered by React and Bootstrap4!',
    //     level: 'info',
    //   });
    // }, 2500);
  }

  // close sidebar when
  handleContentClick = event => {
    // close sidebar if sidebar is open and screen size is less than `md`
    // if (
    //   MainLayout.isSidebarOpen() &&
    //   (this.props.breakpoint === 'xs' ||
    //     this.props.breakpoint === 'sm' ||
    //     this.props.breakpoint === 'md')
    // ) {
    //   // this.openSidebar('close');
    // }
  };

  checkBreakpoint(breakpoint) {
    switch (breakpoint) {
      // case 'xs':
      // case 'sm':
      // case 'md':
      //   return this.openSidebar('close');

      // case 'lg':
      // case 'xl':
      // default:
      //   return this.openSidebar('open');
    }
  }

  openSidebar(openOrClose) {
    // if (openOrClose === 'open') {
    //   return document
    //     .querySelector('.cr-sidebar')
    //     .classList.add('cr-sidebar--open');
    // }
    // document.querySelector('.cr-sidebar').classList.remove('cr-sidebar--open');
  }

  render() {

    const { children } = this.props;
    return (
      <main className="cr-app bg-light">
        
        {/* <Sidebar /> */}
        <Content fluid onClick={this.handleContentClick}>      
           
              
            
          <a href={process.env.REACT_APP_TELT_LINK} className="btn btn-primary telegram"><FaTelegram /> </a>
          {children}
          <Footer />
        </Content>
        <Snackbar
          place="tr"
          color="success"
          icon={MdNotificationsActive}
          message={this.state.notiMessage}
          open={this.state.notiMessage}
          closeNotification={() => this.setState({notiMessage:false})}
          close
        />
      </main>
    );
  }
}

export default MainLayout;
