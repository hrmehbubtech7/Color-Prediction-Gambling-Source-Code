import Page from 'components/Page';
import React, { useState, useEffect } from 'react';
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader

} from 'reactstrap';
import {
  FaHandPointUp, FaHandPointDown, FaTrashAlt,
  FaArrowCircleLeft
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Typography from '../components/Typography';
import bn from 'utils/bemnames';
const bem = bn.create('page');
const AdminUserPage = (props) => {
  const id = props.match.params.id;
  const [user, setUser] = useState('');
  const [selected, setSelected] = useState(0);
  const [recharges, setRecharges] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [enjoys, setEnjoys] = useState([]);
  const [balanceEditable, setBalanceEditable] = useState(false);
  const [balance, setBalance]=useState('');
  const editBalance = (e) => {
    const tmp = JSON.parse(JSON.stringify(user));
    tmp.budget = e.target.value;
    setUser(tmp);
  }
  const postBalance =async () => {
    const response = await fetch(`/api/balance/${id}`, {
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "Authorization": JSON.parse(localStorage.getItem('auth')).userToken
      },
      body:JSON.stringify({balance})
    });
    try {
      if(response.status<400){
        const data = await response.json();
        setUser(data);
        setBalanceEditable(false);
      }      
    } catch (err) {

    }
  }
  const pointUp = async () => {
    const response = await fetch(`/api/pointUp/${id}`, {
      "method": "PUT",
      "headers": {
        "content-type": "application/json",
        "Authorization": JSON.parse(localStorage.getItem('auth')).userToken
      }
    });
    try {
      const data = await response.json();
      setUser(data);
    } catch (err) {

    }
  };

  const pointDown = async () => {
    const response = await fetch(`/api/pointDown/${id}`, {
      "method": "PUT",
      "headers": {
        "content-type": "application/json",
        "Authorization": JSON.parse(localStorage.getItem('auth')).userToken
      }
    });
    try {
      const data = await response.json();
      setUser(data);
    } catch (err) {

    }
  };

  const remove = (no) => () => {
    // console.log(no);
    // console.log(list.findIndex(ele=>ele.userId===no));
    setSelected(no);
  };
  const postRemove = async () => {
    const response = await fetch(`/api/remove-user/${id}`, {
      "method": "DELETE",
      "headers": {
        "content-type": "application/json",
        "Authorization": JSON.parse(localStorage.getItem('auth')).userToken

      }
    });
    try {
      props.history.goBack();
    } catch (err) {

    }
    setSelected(0);
  }

  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/user/${id}`, {
        "method": "GET",
        "headers": {
          "content-type": "application/json",
          "Authorization": JSON.parse(localStorage.getItem('auth')).userToken

        }
      });
      if (response.status == 401)
        props.history.push('/login');
      try {
        const data = await response.json();
        await setUser(data.user);
        await setBalance(data.user.budget);
        await setRecharges(data.recharges);
        await setWithdrawals(data.withdrawals);
        await setRewards(data.rewards);
        await setEnjoys(data.enjoys);
      } catch (err) {
        console.log(err);
      }

      // console.log(data.data);

    })();
  }, []);
  return (
    <Page title={(<><Button color="link" onClick={() => props.history.goBack()}><Typography type="h4" className={bem.e('title')}><FaArrowCircleLeft /> Admin User</Typography></Button></>)} className="MyPage"
    >
      <Row style={{ margin: '20px 10px' }}>
        {
          (JSON.parse(localStorage.getItem('auth')).user.superAdmin && !user.superAdmin) ? (
            <button className="btn btn-primary" onClick={pointUp} ><FaHandPointUp /></button>
          ) : ""
        }
        {
          (JSON.parse(localStorage.getItem('auth')).user.superAdmin && user.admin) ? (
            <button className="btn btn-warning" onClick={pointDown} ><FaHandPointDown /></button>
          ) : ""
        }
        {
          (JSON.parse(localStorage.getItem('auth')).user.superAdmin) ? (
            <button className="btn btn-danger" onClick={remove(1)} ><FaTrashAlt /></button>
          ) : ""
        }

      </Row>

      {
        user ? (
          <Row style={{ margin: '20px 10px' }}>
            <Col lg={4} sm={6} xs={12}>
              Role: {user.superAdmin ? (<span className="text-warning">Super Admin</span>) : (
                user.admin ? (<span className="text-danger">Admin</span>) : (<span className="text-primary">User</span>)
              )}
            </Col>
            <Col lg={4} sm={6} xs={12}>
              Phone Number: {user.phone}
            </Col>
            <Col lg={4} sm={6} xs={12}>
              Email: {user.email}
            </Col>
            <Col lg={4} sm={6} xs={12}>
              Nickname: {user.nickname}
            </Col>
            <Col lg={4} sm={6} xs={12}>
              Joined at: {user.createdAt}
            </Col>
            <Col lg={4} sm={6} xs={12}>
              Phone verification: {user.phone_verified}
            </Col>
            <Col lg={4} sm={6} xs={12}>
              Balance: ₹ {
                JSON.parse(localStorage.getItem('auth')).user.superAdmin ? (
                  balanceEditable ? (
                    <>
                      <Input type="number" style={{ width: "100px", height: "20px", display: 'inline-block' }} value={balance} onChange={(e)=>setBalance(e.target.value)} />
                      <Button color="link" onClick={postBalance} >OK</Button>
                      <Button color="link" onClick={() =>{ setBalanceEditable(false); setBalance(user.budget)}}>Cancel</Button>
                    </>
                  ) : (
                      <>
                        {user.budget}
                        <Button color="link" onClick={() => setBalanceEditable(true)} >Change</Button>
                      </>
                    )
                ) : user.budget
                
              }
            </Col>
            <Col lg={4} sm={6} xs={12}>
              Referrer 1: {user.refer1 ? user.refer1.phone : ''}
            </Col>
            <Col lg={4} sm={6} xs={12}>
              Referrer 2: {user.refer2 ? user.refer2.phone : ''}
            </Col>
            <Col lg={4} sm={6} xs={12}>
              Referral List 1: {user.refered1.length > 0 ? user.refered1.map((ele, key) => (
              <div key={key} className="data-content">
                <span>{ele.phone}</span>
              </div>
            )) : ''}
            </Col>
            <Col lg={4} sm={6} xs={12}>
              Referral List 2: {user.refered2.length > 0 ? user.refered2.map((ele, key) => (
              <div key={key} className="data-content">
                <span>{ele.phone}</span>
              </div>
            )) : ''}
            </Col>
            <Col lg={4} sm={6} xs={12}>
              Bank Card: {user.bank_card.length > 0 ? user.bank_card.map((ele, key) => (
              <div key={key} style={{ paddingLeft: "10px" }} className="data-content">
                Bank Card No {key + 1}
                <br />
                  &nbsp;Actual Name: {ele.actual_name}
                <br />
                  &nbsp;IFSC: {ele.ifsc_code}
                <br />
                  &nbsp;Bank Name: {ele.bank_name}
                <br />
                  &nbsp;Bank Account: {ele.bank_account}
                <br />
                  &nbsp;Territory: {ele.state_territory}
                <br />
                  &nbsp;State: {ele.state}
                <br />
                  &nbsp;City: {ele.city}
                <br />
                  &nbsp;Address: {ele.address}
                <br />
                  &nbsp;Mobile Number: {ele.mobile_number}
                <br />
                  &nbsp;Email: {ele.email}
                <br />
                  &nbsp;UPI Account: {ele.upi_account}
                <br />
              </div>
            )) : ''}
            </Col>
            <Col sm={6} xs={12}>
              Recharge history
              {
                recharges.map((ele, key) => (
                  <div key={key} className="data-content">
                    Order No: {ele._id} &nbsp; Amount: ₹ {ele.money} &nbsp; Date: {ele.createdAt}
                  </div>
                ))
              }
            </Col>
            <Col sm={6} xs={12}>
              Withdrawal history
              {
                withdrawals.map((ele, key) => (
                  <div key={key} className="data-content">
                    Order No: {ele._id} &nbsp; Amount: ₹ {ele.money} &nbsp; Date: {ele.createdAt} status : {ele.status == 0 ? (<span className="text-warning">checking</span>) :
                      (ele.status == 1 ? (<span className="text-primary">done</span>) : (ele.status == -1 ? (<span className="text-danger">declined</span>) : (<span className="text-warning">failed</span>)))}
                  </div>
                ))
              }
            </Col>
            <Col sm={6} xs={12}>
              Rewards history
              {
                rewards.map((ele, key) => (
                  <div key={key} className="data-content">
                    Reward No: {ele._id} &nbsp; Amount: ₹ {ele.money} &nbsp;  status : {ele.status ? (<span className="text-primary">done</span>) : (<span className="text-warning">not yet</span>)} &nbsp;  rewareded by : {ele.createdBy ? ele.createdBy.phone : ''}
                  </div>
                ))
              }
            </Col>
            <Col sm={6} xs={12}>
              Betting history
              {
                enjoys.map((ele, key) => (
                  <div key={key} className="data-content">
                    Period: {ele.period} &nbsp; Bet: ₹ {ele.contract}
                    <br /> Select: {ele.select} &nbsp; Result: {ele.result} Price : ₹ {ele.amount}
                  </div>
                ))
              }
            </Col>
            <Col sm={12} xs={12}>
              Financial history
              {
                user.financials.map((ele, key) => (
                  <div key={key} className="data-content">
                    Type: {ele.type} &nbsp; Date: {ele.createdAt}  &nbsp; Amount: ₹ {ele.amount}
                    &nbsp; {ele.details ? (ele.details.period ? "Period : "+ ele.details.period : (ele.details.orderID ? "Order ID : "+ele.details.orderID : "")) : ''} 
                  </div>
                ))
              }
            </Col>
          </Row>
        ) : ''
      }


      <Modal
        isOpen={selected !== 0}
        toggle={() => setSelected(0)}
      >
        <ModalHeader toggle={() => setSelected(0)}>Are u sure to remove the user?</ModalHeader>
        {
          selected ? (
            <ModalBody>
              <Row>
                <Col md={12}>
                  <Form>
                    <FormGroup>
                      <Label for="history">Phone Number</Label>
                      <Input type="text" disabled value={user.phone} name="history" id="history" className='form-control' />
                    </FormGroup>
                  </Form>
                </Col>
              </Row>
              <Row>
                <Button style={{ width: '130px', marginLeft: 'auto', marginRight: 'auto' }} color="primary" onClick={() => postRemove()}>
                  OK
                </Button>
                <Button style={{ width: '130px', marginLeft: 'auto', marginRight: 'auto' }} color="secondary" onClick={() => setSelected(0)}>
                  Cancel
                </Button>
              </Row>

            </ModalBody>
          ) : ''
        }

        <ModalFooter>
          {/* Decline/ approve/completed/error  */}



        </ModalFooter>
      </Modal>
      <Row>
        <div style={{ height: "50px" }}></div>
      </Row>
    </Page>
  );
};

export default AdminUserPage 
