import Page from 'components/Page';
import React, { useState } from 'react';
import {
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Card,
  CardBody,
  CardHeader,
} from 'reactstrap';
import Button from 'components/Button';
import {
  FaArrowCircleLeft,
  FaPlus,
  FaWallet, FaWindowClose
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Typography from '../components/Typography';
import bn from 'utils/bemnames';
const bem = bn.create('page');
const BankPage = (props) => {
  const [data, setData] = useState(props.auth.user.bank_card);
  const [addData, setAddData] = useState({
    state: (props.match.params.add && props.match.params.add == 'add') ? true : false, actual_name: '', ifsc_code: '', bank_name: '', bank_account: '', state_territory: '',
    city: '', address: '', mobile_number: '', email: '', upi_account: ''
  });
  const [toggle, setToggle] = useState(-1);
  const addSuggestion = () => {
    if (addData.actual_name != '' && addData.ifsc_code !== '' && addData.bank_name !== '' && addData.bank_account !== '' && addData.state_territory !== '' && addData.city !== '' && addData.address !== '' && addData.mobile_number !== '' && addData.email !== '') {
      (async () => {
        const response = await fetch("/api/bank", {
          "method": "POST",
          "headers": {
            "content-type": "application/json",
            "Authorization": props.auth.userToken

          },
          body: JSON.stringify({ ...addData })
        });

        if (response.status == 200) {
          // if(response.status>200)
          //   this.props.history.push('/login');
          var tmp = JSON.parse(JSON.stringify(data));
          tmp.push(addData);
          var tmp1 = props.auth;
          tmp1.user.bank_card = tmp;
          localStorage.setItem('auth', JSON.stringify(tmp1));
          setData(tmp);
          setAddData({
            state: false, actual_name: '', ifsc_code: '', bank_name: '', bank_account: '', state_territory: '',
            city: '', address: '', mobile_number: '', email: '', upi_account: ''
          });
        } else if (response.status == 401)
          props.history.push('/login');
      })();
    }

  };
  const remove = (key) => () => {
    (async () => {
      // if(response.status>200)
      //   this.props.history.push('/login');
      const response = await fetch("/api/bank", {
        "method": "DELETE",
        "headers": {
          "content-type": "application/json",
          "Authorization": props.auth.userToken

        },
        body: JSON.stringify({ key })
      });
      if (response.status == 200) {
        var tmp = JSON.parse(JSON.stringify(data));
        tmp.splice(key, 1);
        var tmp1 = props.auth;
        tmp1.user.bank_card = tmp;
        localStorage.setItem('auth', JSON.stringify(tmp1));
        setData(tmp);
      } else {
        props.history.push('/login');
      }
    })();
  }
  // useEffect(() => {
  //   (async ()=>{
  //     const response=await fetch("/api/bank", {
  //       "method": "GET",
  //       "headers": {
  //         "content-type": "application/json",
  //         "Authorization":props.auth.userToken

  //       }
  //     });
  //     const tmp=await response.json();
  //     await setData(tmp.data);

  //   })();      
  // },[]);
  return (

    <Page
      className="walletPage"
      title={(
        <div className="header-userinfo">
          <img src={`/uploads/avatars/${props.auth.user.avatar ? props.auth.user.id + ".jpg" : "user.png"}`} />
          <div>
            <span className="header-nickname">{props.auth.user.nickname}</span>
            <span className="header-balance"><small>₹</small>{props.auth.user.budget}</span>
          </div>
        </div>
      )}
      breadcrumbs={
        (
          <div className="header-buttons">
            <Button component="a" color="success" justIcon style={{ "float": "right", padding: "5px 10px" }} onClick={() => { setAddData({ ...addData, state: true }) }} >
              <FaPlus />
            </Button>
          </div>
        )
      }
    >
      <Row>
        <Col xl={12} lg={12} md={12}>
          <Card>
            <CardHeader>Bank Cards</CardHeader>
            <CardBody>
              {
                data ? data.map((ele, key) => (

                  <div key={key} className={'form-control'} style={{ marginBottom: '0rem' }}>
                    <span onClick={() => setToggle(key)} style={{ minWidth: "150px", display: "inline-block" }}>
                      <FaWallet className="mr-3" /> {ele.actual_name}-{ele.bank_account}
                    </span>
                    <Button color="danger" size="sm" style={{ float: 'right', marginTop: '-5px' }} simple onClick={remove(key)}>
                      <FaWindowClose className="ml-3" />
                    </Button>
                  </div>



                )) : ''
              }
            </CardBody>
          </Card>
        </Col>


      </Row>
      <Row>
        <div style={{ "height": '60px' }}></div>
      </Row>
      <Modal
        isOpen={addData.state}
        toggle={() => setAddData({ ...addData, state: !addData.state })}
      >
        <ModalHeader toggle={() => setAddData({ ...addData, state: !addData.state })}>Add Bank Card</ModalHeader>
        <ModalBody>
          <Row>
            <Col md={12}>
              <Form>
                <FormGroup>
                  <Label for="actual_name">Actual Name</Label>
                  <Input type="text" value={addData.actual_name} onChange={(e) => setAddData({ ...addData, actual_name: e.target.value })} name="actual_name" id="actual_name" className='form-control' />
                </FormGroup>
                <FormGroup>
                  <Label for="ifsc_code">IFSC Code</Label>
                  <Input type="text" value={addData.ifsc_code} onChange={(e) => setAddData({ ...addData, ifsc_code: e.target.value })} name="ifsc_code" id="ifsc_code" className='form-control' />
                </FormGroup>
                <FormGroup>
                  <Label for="bank_name">Bank Name</Label>
                  <Input type="text" value={addData.bank_name} onChange={(e) => setAddData({ ...addData, bank_name: e.target.value })} name="bank_name" id="bank_name" className='form-control' />
                </FormGroup>
                <FormGroup>
                  <Label for="bank_account">Bank Account</Label>
                  <Input type="text" value={addData.bank_account} onChange={(e) => setAddData({ ...addData, bank_account: e.target.value })} name="bank_account" id="bank_account" className='form-control' />
                </FormGroup>
                <FormGroup>
                  <Label for="state_territory">State/Territory</Label>
                  <Input type="text" value={addData.state_territory} onChange={(e) => setAddData({ ...addData, state_territory: e.target.value })} name="state_territory" id="state_territory" className='form-control' />
                </FormGroup>
                <FormGroup>
                  <Label for="city">City</Label>
                  <Input type="text" value={addData.city} onChange={(e) => setAddData({ ...addData, city: e.target.value })} name="city" id="city" className='form-control' />
                </FormGroup>
                <FormGroup>
                  <Label for="address">Address</Label>
                  <Input type="text" value={addData.address} onChange={(e) => setAddData({ ...addData, address: e.target.value })} name="address" id="address" className='form-control' />
                </FormGroup>
                <FormGroup>
                  <Label for="mobile_number">Mobile Number</Label>
                  <Input type="text" value={addData.mobile_number} onChange={(e) => setAddData({ ...addData, mobile_number: e.target.value })} name="mobile_number" id="mobile_number" className='form-control' />
                </FormGroup>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input type="text" value={addData.email} onChange={(e) => setAddData({ ...addData, email: e.target.value })} name="email" id="email" className='form-control' />
                </FormGroup>
                <FormGroup>
                  <Label for="upi_account">UPI Account</Label>
                  <Input type="text" value={addData.upi_account} onChange={(e) => setAddData({ ...addData, upi_account: e.target.value })} name="upi_account" id="upi_account" className='form-control' />
                </FormGroup>


              </Form>
            </Col>

          </Row>


        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={addSuggestion}>
            Ok
          </Button>
          <Button color="white" onClick={() => setAddData({ ...addData, state: !addData.state })}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      {
        toggle > -1 ? (
          <Modal
            isOpen={toggle > -1}
            toggle={() => setToggle(-1)}
          >
            <ModalHeader toggle={() => setToggle(-1)}>Bank Card</ModalHeader>
            <ModalBody>
              <Row>
                <Col md={12}>
                  <Form>
                    <FormGroup>
                      <Label for="actual_name">Actual Name</Label>
                      <Input disabled type="text" value={data[toggle].actual_name} name="actual_name" id="actual_name" className='form-control' />
                    </FormGroup>
                    <FormGroup>
                      <Label for="ifsc_code">IFSC Code</Label>
                      <Input disabled type="text" value={data[toggle].ifsc_code} name="ifsc_code" id="ifsc_code" className='form-control' />
                    </FormGroup>
                    <FormGroup>
                      <Label for="bank_name">Bank Name</Label>
                      <Input disabled type="text" value={data[toggle].bank_name} name="bank_name" id="bank_name" className='form-control' />
                    </FormGroup>
                    <FormGroup>
                      <Label for="bank_account">Bank Account</Label>
                      <Input disabled type="text" value={data[toggle].bank_account} name="bank_account" id="bank_account" className='form-control' />
                    </FormGroup>
                    <FormGroup>
                      <Label for="state_territory">State/Territory</Label>
                      <Input disabled type="text" value={data[toggle].state_territory} name="state_territory" id="state_territory" className='form-control' />
                    </FormGroup>
                    <FormGroup>
                      <Label for="city">City</Label>
                      <Input disabled type="text" value={data[toggle].city} name="city" id="city" className='form-control' />
                    </FormGroup>
                    <FormGroup>
                      <Label for="address">Address</Label>
                      <Input disabled type="text" value={data[toggle].address} name="address" id="address" className='form-control' />
                    </FormGroup>
                    <FormGroup>
                      <Label for="mobile_number">Mobile Number</Label>
                      <Input disabled type="text" value={data[toggle].mobile_number} name="mobile_number" id="mobile_number" className='form-control' />
                    </FormGroup>
                    <FormGroup>
                      <Label for="email">Email</Label>
                      <Input disabled type="text" value={data[toggle].email} name="email" id="email" className='form-control' />
                    </FormGroup>
                    <FormGroup>
                      <Label for="upi_account">UPI Account</Label>
                      <Input disabled type="text" value={data[toggle].upi_account} name="upi_account" id="upi_account" className='form-control' />
                    </FormGroup>


                  </Form>
                </Col>

              </Row>

            </ModalBody>
            <ModalFooter>

              <Button color="secondary" onClick={() => setToggle(-1)}>
                Close
              </Button>
            </ModalFooter>
          </Modal>
        ) : ''
      }
    </Page>
  );
};

export default BankPage 
