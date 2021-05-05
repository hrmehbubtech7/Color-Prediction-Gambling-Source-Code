import Page from 'components/Page';
import React, { useState, useEffect, useRef } from 'react';
import {
  Col, InputGroup, InputGroupAddon, Input, FormGroup, Label,
  Row
} from 'reactstrap';
import {
  MdReportProblem
} from 'react-icons/md';
import { Link } from 'react-router-dom';
import Typography from '../components/Typography';
import PageSpinner from '../components/PageSpinner';
import Button from 'components/Button';
import Snackbar from "components/Snackbar.js";
import bn from 'utils/bemnames';
import { ConsoleTransportOptions } from 'winston/lib/winston/transports';
const bem = bn.create('page');
const RechargePage = (props) => {
  const razorpay_div = useRef(null);
  const [errorMessage, setErrorMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(props.auth.user.email);
  const [budget, setBudget] = useState(props.auth.user.budget);
  const [money, setMoney] = useState('');
  const [account, setAccount] = useState('');
  const [accountItems, setAccountItems] = useState('');
  const apply = async () => {
    if (money == '') {
      setErrorMessage("Please input the amount to recharge.");
      return;
    }
    if (email == '') {
      setErrorMessage("Please input your email address.");
      return;
    }
    if (money < 200) {
      setErrorMessage("More than ₹ 200 allowed.");
      return;
    }
    const response = await fetch("/api/recharge", {
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "Authorization": props.auth.userToken

      },
      body: JSON.stringify({ money, email })
    });
    const data = await response.json();
    if (response.status == 200) {
      // //send razorpy website to deposit
      var ttt=props.auth;
      ttt.user.email=data.email;
      localStorage.setItem('auth',JSON.stringify(ttt));        
      window.location.href=`${process.env.REACT_APP_SHOP_URL}/${data.id}/${data.nickname}/${data.email}/${data.money}/${process.env.REACT_APP_SHOP_NO}/1`;       


    }
    else
      setErrorMessage(data.error);
  };
  useEffect(() => {
    (async () => {
      const response = await fetch("/api/budget", {
        "method": "GET",
        "headers": {
          "content-type": "application/json",
          "Authorization": props.auth.userToken

        }
      });
      if (response.status == 401)
        props.history.push('/login');
      const data = await response.json();
      var tmp = props.auth;
      tmp.user.budget = data.budget;
      localStorage.setItem('auth', JSON.stringify(tmp));
      setBudget(data.budget);
      const response1 = await fetch("/static/account.json", {
        "method": "GET",
        "headers": {
          "content-type": "application/json"
        }
      });
      const data1 = await response1.json();
      setAccount(data1);
      setAccountItems(Object.getOwnPropertyNames(data1));
    })();
  }, []);
  return (
    <>
      <Row>
        {/* <Col xl={12} lg={12} md={12} style={{textAlign:'center'}}>
          <img src="/img/bank/bank.jpg" style={{width:'300px'}} />
        </Col> */}
        {/* <Col xl={12} lg={12} md={12} style={{padding:"0 30px"}}>
          {accountItems && accountItems.map((ele,key)=>(
            <h6 key={key}>{ele+' '}:{' '+account[ele]}</h6> 
          ))}
          <h6></h6>
        </Col> */}
        <Col xl={12} lg={12} md={12}>
          <InputGroup>
            <InputGroupAddon addonType="prepend"><span className="input-group-text">₹</span></InputGroupAddon>
            <Input value={money} type="number" max='15000' min='0' placeholder="Enter Recharge amount" onChange={(e) => { setMoney(e.target.value) }} />
          </InputGroup>
        </Col>
        <Col xl={12} lg={12} md={12} className="amount-button">
          <Button component="a" color="reddit" round className={'ml-3 mr-3 mt-2'} onClick={() => setMoney(200)} >₹ 200</Button>
          <Button component="a" color="reddit" round className={'ml-3 mr-3 mt-2'} onClick={() => setMoney(1000)} >₹ 1000</Button>
          <Button component="a" color="reddit" round className={'ml-3 mr-3 mt-2'} onClick={() => setMoney(2000)} >₹ 2000</Button>
          <Button component="a" color="reddit" round className={'ml-3 mr-3 mt-2'} onClick={() => setMoney(5000)} >₹ 5000</Button>
          <Button component="a" color="reddit" round className={'ml-3 mr-3 mt-2'} onClick={() => setMoney(10000)} >₹ 10000</Button>
          <Button component="a" color="reddit" round className={'ml-3 mr-3 mt-2'} onClick={() => setMoney(15000)} >₹ 15000</Button>
        </Col>
        <Col xl={12} lg={12} md={12}>
          <InputGroup>
            <InputGroupAddon addonType="prepend"><span className="input-group-text">Email</span></InputGroupAddon>
            <Input value={email} placeholder="Email" onChange={(e) => { setEmail(e.target.value) }} />
          </InputGroup>
        </Col>
        <Col md={12} style={{ textAlign: 'center' }} className={'mt-3'} >
          {!isLoading ? (
            <Button onClick={()=>window.location.href=`https://elisonclubs.com`} color="success"> Recharge </Button>
          ) : (
            <PageSpinner />
          )}

        </Col>
        <Col md={12} style={{ textAlign: 'center' }} >
          <Button to="/records/recharge-list" component={Link} color="info" simple> Recharge Records</Button>
        </Col>
        <Col md={12} style={{ textAlign: 'center' }} >
            <div ref={razorpay_div}></div>
        </Col>
        <Snackbar
          place="tr"
          color="danger"
          icon={MdReportProblem}
          message={errorMessage}
          open={errorMessage}
          closeNotification={() => setErrorMessage(false)}
          close
        />
      </Row>
      <Row>
        <div style={{ "height": '100px' }}></div>
      </Row>
    </>
  );
};

export default RechargePage
