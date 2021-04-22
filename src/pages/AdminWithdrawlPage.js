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
  ModalHeader,
  Pagination, PaginationItem, PaginationLink
} from 'reactstrap';
import {
  FaHourglassHalf, FaMoneyCheck, FaCheckSquare, FaTimesCircle,
  FaArrowCircleLeft
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Typography from '../components/Typography';
import bn from 'utils/bemnames';
const bem = bn.create('page');
const AdminWithdrawl = (props) => {
  const [status, setStatus] = useState(-1);
  const [list, setList] = useState([]);
  const [view, setView] = useState(-1);
  const [page, setPage] = useState(1);
  const [last, setLast] = useState(1);
  const toggle = (no) => () => {
    // console.log(no);
    // console.log(list.findIndex(ele=>ele.userId===no));
    setView(no);
  };
  const postReply = async (id, approved) => {
    const response = await fetch("/api/withdrawl-admin", {
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "Authorization": JSON.parse(localStorage.getItem('auth')).userToken

      },
      body: JSON.stringify({
        id: list[id]._id,
        status: approved
      })
    });
    var aa = JSON.parse(JSON.stringify(list));
    aa[id].status = approved;
    setList(aa);
    setView(-1);
  }

  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/withdrawl-admin/${status}/${page}`, {
        "method": "GET",
        "headers": {
          "content-type": "application/json",
          "Authorization": JSON.parse(localStorage.getItem('auth')).userToken

        }
      });
      if (response.status == 401)
        props.history.push('/login');
      const data = await response.json();
      await setList(data.data);
      setPage(data.page);
      setLast(data.last_page);
      // console.log(data.data);

    })();
  }, [page, status]);
  return (
    <Page title={(<><Link to="/account"><Typography type="h4" className={bem.e('title')}><FaArrowCircleLeft /> Admin Withdrawl</Typography></Link></>)} className="MyPage"
    >
      <Row>
        <Col md={12}>
          <Input type="select" value={status} onChange={(e) => setStatus(e.target.value)} >
            <option value="-1">All</option>
            <option value="0">Waiting</option>
            <option value="1">Approved</option>
            <option value="2">Declined</option>
            <option value="3">Completed</option>
            <option value="4">Error</option>
          </Input>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          {
            (list && list.length > 0) ?
              list.map((ele, key) => (
                <Button tag="a" className={'form-control'} color="link" onClick={toggle(key)} key={key} style={{ marginBottom: '0rem', height: '50px' }}>{ele.userPhone}, {ele.userNickname} : ₹ {ele.money}
                  <span style={{ float: 'right' }}>{ele.status == 0 ? (<FaHourglassHalf className="text-warning" />) : (
                    ele.status == 1 ? (<FaCheckSquare className="text-primary" />) : (
                      ele.status == 2 ? (<FaTimesCircle className="text-danger" />) : (
                        ele.status == 3 ? (<FaMoneyCheck className="text-success" />) : (
                          <FaTimesCircle className="text-danger" />
                        )
                      )
                    )
                  )}</span></Button>
              )) : ''
          }

        </Col>

      </Row>
      <Row>
        <Col md={12}>
          <Pagination size="sm" aria-label="Page navigation example">
            {
              page > 1 ? (
                <PaginationItem>
                  <PaginationLink previous onClick={() => setPage(1)} />
                </PaginationItem>
              ) : ''
            }
            {
              page > 1 ? (
                <PaginationItem>
                  <PaginationLink onClick={() => setPage(page - 1)}>
                    {page - 1}
                  </PaginationLink>
                </PaginationItem>
              ) : ''
            }

            <PaginationItem active>
              <PaginationLink >
                {page}
              </PaginationLink>
            </PaginationItem>
            {
              page < last ? (
                <PaginationItem>
                  <PaginationLink onClick={() => setPage(page + 1)}>
                    {page + 1}
                  </PaginationLink>
                </PaginationItem>
              ) : ''
            }
            {
              page < last ? (
                <PaginationItem>
                  <PaginationLink next onClick={() => setPage(last)} />
                </PaginationItem>
              ) : ''
            }


          </Pagination>
        </Col>
      </Row>
      <Row>
        <div style={{ "height": '80px' }}></div>
      </Row>
      <Modal
        isOpen={view !== -1}
        toggle={() => setView(-1)}
      >
        <ModalHeader toggle={() => setView(-1)}>Withdrawl Information</ModalHeader>
        {
          (view > -1 && list[view]) ? (
            <ModalBody>
              <Row>
                <Col md={12}>
                  <Form>
                    <FormGroup>
                      <Label for="exampleSelect1">User ID</Label>
                      <Input type="text" disabled id="exampleSelect1" className='form-control' value={list[view].userId} />

                    </FormGroup>
                    <FormGroup>
                      <Label for="period1">User Phone Number</Label>
                      <Input type="text" disabled value={list[view].userPhone} name="period" id="period1" className='form-control' />
                    </FormGroup>
                    <FormGroup>
                      <Label for="whatsapp1">NickName</Label>
                      <Input type="text" disabled value={list[view].userNickname} name="whatsapp" id="whatsapp1" className='form-control' />
                    </FormGroup>
                    <FormGroup>
                      <Label for="status">Status</Label>
                      <Input type="text" disabled value={list[view].status == 0 ? "Waiting" : (list[view].status == 1 ? "Approved" : (list[view].status == 2 ? "Declined" : (list[view].status == 3 ? "Complete" : "Error")))} name="status" id="status" className='form-control' />
                    </FormGroup>
                    <FormGroup>
                      <Label for="content1">Required amounts</Label>
                      <Input type="text" disabled value={"₹" + list[view].money} name="content" id="content1" className='form-control' />
                    </FormGroup>
                    <h4>Bank Card</h4>
                    <FormGroup>
                      <Label for="actual_name">Actual Name</Label>
                      <Input type="text" disabled value={list[view].actual_name} name="actual_name" id="actual_name" className='form-control' />
                    </FormGroup>
                    <FormGroup>
                      <Label for="ifsc_code">IFSC Code</Label>
                      <Input type="text" disabled value={list[view].ifsc_code} name="ifsc_code" id="ifsc_code" className='form-control' />
                    </FormGroup>
                    <FormGroup>
                      <Label for="bank_name">Bank Name</Label>
                      <Input type="text" disabled value={list[view].bank_name} name="bank_name" id="bank_name" className='form-control' />
                    </FormGroup>
                    <FormGroup>
                      <Label for="bank_account">Bank Account</Label>
                      <Input type="text" disabled value={list[view].bank_account} name="bank_account" id="bank_account" className='form-control' />
                    </FormGroup>
                    <FormGroup>
                      <Label for="state_territory">State/Territory</Label>
                      <Input type="text" disabled value={list[view].state_territory} name="state_territory" id="state_territory" className='form-control' />
                    </FormGroup>
                    <FormGroup>
                      <Label for="city">City</Label>
                      <Input type="text" disabled value={list[view].city} name="city" id="city" className='form-control' />
                    </FormGroup>
                    <FormGroup>
                      <Label for="address">Address</Label>
                      <Input type="text" disabled value={list[view].address} name="address" id="address" className='form-control' />
                    </FormGroup>
                    <FormGroup>
                      <Label for="mobile_number">Mobile Number</Label>
                      <Input type="text" disabled value={list[view].mobile_number} name="mobile_number" id="mobile_number" className='form-control' />
                    </FormGroup>
                    <FormGroup>
                      <Label for="email">Email</Label>
                      <Input type="text" disabled value={list[view].email} name="email" id="email" className='form-control' />
                    </FormGroup>
                    <FormGroup>
                      <Label for="upi_account">UPI Account</Label>
                      <Input type="text" disabled value={list[view].upi_account} name="upi_account" id="upi_account" className='form-control' />
                    </FormGroup>
                  </Form>
                </Col>
              </Row>
              {
                list[view].status == 0 ? (
                  <Row>
                    <Button style={{ width: '130px', marginLeft: 'auto', marginRight: 'auto' }} color="primary" onClick={() => postReply(view, 1)}>
                      Approve
                    </Button>
                    <Button style={{ width: '130px', marginLeft: 'auto', marginRight: 'auto' }} color="secondary" onClick={() => postReply(view, 2)}>
                      Decline
                    </Button>
                  </Row>
                ) : ""
              }

              <br />
              {
                list[view].status == 0 || list[view].status == 1 ? (
                  <Row>
                    <Button style={{ width: '130px', marginLeft: 'auto', marginRight: 'auto' }} color="success" onClick={() => postReply(view, 3)}>
                      Complete
                    </Button>
                    <Button style={{ width: '130px', marginLeft: 'auto', marginRight: 'auto' }} color="danger" onClick={() => postReply(view, 4)}>
                      Error
                    </Button>

                  </Row>) : ""
              }
              <br />
              <Row>
                <Link style={{ width: '130px', marginLeft: 'auto', marginRight: 'auto' }} color="success" to={'/user/' + list[view].userId}>
                  User Information
                </Link>


              </Row>
            </ModalBody>
          ) : ''
        }

        <ModalFooter>
          {/* Decline/ approve/completed/error  */}



        </ModalFooter>
      </Modal>

    </Page>
  );
};

export default AdminWithdrawl
