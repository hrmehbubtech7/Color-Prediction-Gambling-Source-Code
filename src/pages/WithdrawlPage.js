import Page from 'components/Page';
import React, { useState, useEffect } from 'react';
import {
  Col, InputGroup, InputGroupAddon, Input, FormGroup, Label,
  Row
} from 'reactstrap';
import {
  FaKey,
} from 'react-icons/fa';
import {
  MdReportProblem, MdCheckCircle
} from 'react-icons/md';
import { Link } from 'react-router-dom';
import Button from 'components/Button';
import Snackbar from "components/Snackbar.js";
import bn from 'utils/bemnames';
import { Redirect } from 'react-router';
const bem = bn.create('page');
const WithdrawlPage = (props) => {
  const [amount, setAmount] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [addBank, setAddBank]=useState(false);
  const apply = () => {
    // console.log(JSON.stringify({amount,password,bank}));
    if (bank == "Add Bank Card" || bank=="") {
      setAddBank(true);
      return;
    }
    if (amount >= 250) {
      (async () => {
        const response = await fetch("/api/withdrawl", {
          "method": "POST",
          "headers": {
            "content-type": "application/json",
            "Authorization": JSON.parse(localStorage.getItem('auth')).userToken

          },
          body: JSON.stringify({ amount, password, bank })
        });

        const data = await response.json();
        if (response.status == 200) {
          setSuccessMessage(data.message);
          props.auth.user.budget = parseFloat(props.auth.user.budget) - parseFloat(amount);
          localStorage.setItem('auth', JSON.stringify(props.auth));
        }
        else
          setErrorMessage(data.error);
      })();
    } else {
      setErrorMessage("Only more than ₹ 250 allowed!");
    }

  };
  // console.log(props);
  // const [bank, setBank] = useState('');
  const [bank, setBank] = useState(props.auth.user.bank_card.length>0 ? props.auth.user.bank_card[0].actual_name + " " + props.auth.user.bank_card[0].bank_account : "Add Bank Card");
  useEffect(() => {
    if (bank == "Add Bank Card") {
      // console.log(bank);
      setAddBank(true);
    }
  }, [bank]);
  return (
    <>
      {
        addBank ? (
          <Redirect
            to={{
              pathname: "/bank/add",
            
            }}
          />
        ) : ""
      }
      <Row>
      <Col xl={12} lg={12} md={12}>
        Withdrawal Time:
        <br />
        10:00 AM TO 6:00 PM
        MONDAY TO SATERDAY
        </Col>
        <Col xl={12} lg={12} md={12}>
      
          <InputGroup>
            <InputGroupAddon addonType="prepend"><span className="input-group-text">₹</span></InputGroupAddon>
            <Input value={amount} type="number" max={parseFloat(props.auth.user.budget)} placeholder="Enter withdrawal amount" onChange={(e) => { setAmount(e.target.value) }} />
          </InputGroup>
          <span style={{ fontSize: '0.7rem', fontWeight: '300', marginLeft: '30px' }}>Fee {Math.floor(amount * 0.03)} , to account {Math.ceil(amount * 0.97)}</span>
          <FormGroup>
            <Label for="exampleSelect">Payout</Label>
            <Input type="select" value={bank} name="select" id="exampleSelect" className='form-control' onChange={(e) => setBank(e.target.value)} >
              {
                props.auth.user.bank_card.map((ele, key) => (
                  <option key={key} value={key}>{ele.actual_name + " " + ele.bank_account}</option>
                ))
              }
              <option>Add Bank Card</option>
            </Input>
          </FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend"><span className="input-group-text"><FaKey /></span></InputGroupAddon>
            <Input value={password} type="password" placeholder="Enter your login password" onChange={(e) => { setPassword(e.target.value) }} />
          </InputGroup>
        </Col>
        <Col md={12} style={{ textAlign: 'center' }} className={'mt-3'}>
          <Button onClick={apply} color="danger"> Withdraw </Button>
        </Col>
        <Col md={12} style={{ textAlign: 'center' }} >
          <Button to="/records/withdraw-list" component={Link} color="info" simple> Withdraw Records</Button>
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
        <Snackbar
          place="tr"
          color="success"
          icon={MdCheckCircle}
          message={successMessage}
          open={successMessage}
          closeNotification={() => setSuccessMessage(false)}
          close
        />
      </Row>
      <Row>
        <div style={{ "height": '60px' }}></div>
      </Row>
    </>
  );
};

export default WithdrawlPage 
