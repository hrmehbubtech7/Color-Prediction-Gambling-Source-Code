import AuthForm, { STATE_LOGIN } from 'components/AuthForm';
import React from 'react';
import { Card, Col, Row } from 'reactstrap';
import { STATE_SIGNUP,STATE_PHONE } from '../components/AuthForm';

class AuthPage extends React.Component {
  handleAuthState = authState => {
    // alert(authState)
    
    //decide if signup page or login page

    if (authState === STATE_LOGIN) {
      this.props.history.push('/login');
    } else if(authState===STATE_SIGNUP) {
      this.props.history.push('/signup');
    } else if(authState===STATE_PHONE) {
      this.props.history.push('/phone');
    } else{
      this.props.history.push('/verify');
    }
  };

  handleLogoClick = () => {
    this.props.history.push('/');
  };
  handleSubmit=()=>{
    if(this.props.location.state!==undefined)
      this.props.history.push(this.props.location.state.from);
    else
      this.props.history.push({
        pathname: '/',
        state: { signin: true }
      });
  }
  render() {
    return (
      <Row
        style={{
          minHeight: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor:"#c2cad3"
        }}>
        <Col md={6} lg={4}>
          <Card body>
            <AuthForm
              authState={this.props.authState}
              onChangeAuthState={this.handleAuthState}
              onLogoClick={this.handleLogoClick}
              onSubmit={this.handleSubmit}
              params={this.props.match.params.ref_code}
            />
          </Card>
        </Col>
      </Row>
    );
  }
}

export default AuthPage;
