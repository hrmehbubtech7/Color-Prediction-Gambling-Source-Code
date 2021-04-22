import Page from 'components/Page';
import React,{useState} from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  Input,
  Label,
  Row,
FormGroup,UncontrolledAlert
} from 'reactstrap';
import {
  FaArrowCircleLeft} from 'react-icons/fa';
import {Link} from 'react-router-dom';
import Typography from '../components/Typography';
import bn from 'utils/bemnames';
import Button from 'components/Button';

const bem = bn.create('page');
const AccountPage = (props) => {
  const [password,setPassword]=useState('');
  const [phone,setPhone]=useState('');
  const [verify,setVerify]=useState('');
  const [otp,setOtp]=useState({state:0,message:''});
  const [result]=useState({state:0,message:''});
  const otpRequest=()=>{
    fetch("/api/phoneChange", {
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "Authorization":JSON.parse(localStorage.getItem('auth')).userToken

      },
      "body": JSON.stringify({
        phone: phone
      })
    })
      .then(response =>{ 
        if(response.status<400){
          response.json().then(()=>{
            setOtp({
              state:1,
              message:"Please type verification code"
            });
          });         
  
        }else if(response.status==401){
          props.history.push('/login');
        }else{
          response.json().then(res=>{
            setOtp({
              state:2,
              message:res.error
            });
          });         
        }
  
    });
  };
  const submitPasword=()=>{
    if(otp.state===1){
      fetch("/api/change-password", {
        "method": "POST",
        "headers": {
          "content-type": "application/json",
          "Authorization":JSON.parse(localStorage.getItem('auth')).userToken

        },
        "body": JSON.stringify({
          password: password,
          phone:phone,
          otp:verify
        })
      })
      .then(response =>{ 
        if(response.status<400){
          response.json().then(res=>{
            localStorage.setItem("auth",JSON.stringify(res));
            props.history.push('/');
            
          });         
  
        }else if(response.status==401){
          props.history.push('/login');
        }else{
          response.json().then(res=>{
            setOtp({
              state:2,
              message:res.error
            });
          });         
        }    
      });
    }
      
    

  };
  return (
    <Page title={(<Link to="/account"><Typography type="h4" className={bem.e('title')}><FaArrowCircleLeft /> Account</Typography></Link>)} className="MyPage"  >

      <Row>       
        
        <Col xl={12} lg={12} md={12}>
        <Card>
            <CardHeader>Change Password</CardHeader>
            <CardBody>
              {
                result.state==1 ? (
                  <UncontrolledAlert color="success">
                  {result.message}
                  </UncontrolledAlert>
                ) : (
                  result.state==2 ? (
                    <UncontrolledAlert color="danger">
                    {result.message}
                    </UncontrolledAlert>
                  ) : ''
                )
              }
              <Form>                
              <FormGroup>
                  
                  <Input
                    type="text"
                    name="phone"
                    value={phone}
                    onChange={(e)=>{setPhone(e.target.value)}}
                    placeholder="Phone Number" style={{display:'inline-block',width:'70%'}}
                  />            
                  <Button color="success" onClick={otpRequest}>SEND OTP</Button>
                  {
                    otp.state==1 ? (
                      <UncontrolledAlert color="success">
                      {otp.message}
                      </UncontrolledAlert>
                    ) : (
                      otp.state==2 ? (
                      <UncontrolledAlert color="danger">
                      {otp.message}
                      </UncontrolledAlert>                      ) : ''
                    )
                  }
                </FormGroup>
                <FormGroup>
                  <Label for="verify"> Verification Code</Label>
                  <Input
                    type="text"
                    name="verify"
                    value={verify}
                    onChange={(e)=>{setVerify(e.target.value)}}
                    placeholder="Verification Code"
                  />                
                </FormGroup>
                <FormGroup>
                  <Label for="examplePassword">Password</Label>
                  <Input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e)=>{setPassword(e.target.value);}}
                    placeholder="password"
                  />
                </FormGroup>
                
                <Button onClick={submitPasword} color="primary" > ok</Button>
              </Form>
            </CardBody>
          </Card>
        
        </Col>
     
        
      </Row>
     
    </Page>
  );
};

export default AccountPage 
