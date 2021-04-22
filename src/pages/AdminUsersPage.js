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
  ModalHeader, InputGroup, InputGroupAddon,
  Pagination, PaginationItem, PaginationLink
} from 'reactstrap';
import {
  FaHandPointUp, FaHandPointDown, FaTrashAlt, FaUserCog, FaUserPlus,
  FaArrowCircleLeft, FaSearchengin
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Typography from '../components/Typography';
import bn from 'utils/bemnames';
const bem = bn.create('page');
const AdminUsersPage = (props) => {
  const [status, setStatus] = useState(true);
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(-1);
  const [page, setPage] = useState(1);
  const [last, setLast] = useState(1);
  const [search, setSearch] = useState('');
  const [addModal, setAddModal] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [referral, setReferral] = useState('');
  const [role, setRole] = useState('User');
  const pointUp = (key) => async () => {
    const response = await fetch(`/api/pointUp/${list[key]._id}`, {
      "method": "PUT",
      "headers": {
        "content-type": "application/json",
        "Authorization": JSON.parse(localStorage.getItem('auth')).userToken
      }
    });
    try {
      const data = await response.json();
      const tmp_list = JSON.parse(JSON.stringify(list));
      tmp_list[key] = data;
      setList(tmp_list);
    } catch (err) {

    }
  };

  const pointDown = (key) => async () => {
    const response = await fetch(`/api/pointDown/${list[key]._id}`, {
      "method": "PUT",
      "headers": {
        "content-type": "application/json",
        "Authorization": JSON.parse(localStorage.getItem('auth')).userToken
      }
    });
    try {
      const data = await response.json();
      const tmp_list = JSON.parse(JSON.stringify(list));
      tmp_list[key] = data;
      setList(tmp_list);
    } catch (err) {

    }
  };

  const remove = (no) => () => {
    // console.log(no);
    // console.log(list.findIndex(ele=>ele.userId===no));
    setSelected(no);
  };
  const postRemove = async (key, status) => {
    const response = await fetch(`/api/remove-user/${list[key]._id}`, {
      "method": "DELETE",
      "headers": {
        "content-type": "application/json",
        "Authorization": JSON.parse(localStorage.getItem('auth')).userToken

      }
    });
    try {
      const data = await response.json();
      if (response.status < 400) {
        const tmp_list = JSON.parse(JSON.stringify(list));
        tmp_list.splice(key, 1);
        setList(tmp_list);
      } else {
        alert(data.message);
      }

    } catch (err) {
      alert("Server error");
    }
    setSelected(-1);
  }
  const postAdd = async () => {
    const response = await fetch(`/api/add-user/`, {
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "Authorization": JSON.parse(localStorage.getItem('auth')).userToken
      },
      body: JSON.stringify({ phone, role, password, referral })
    });
    try {
      const data = await response.json();
      if (response.status < 400) {
        const tmp_list = JSON.parse(JSON.stringify(list));
        tmp_list.push(data);
        setList(tmp_list);
      } else {
        alert(data.message);
      }

    } catch (err) {
      alert("Server error");
    }
    setAddModal(false);
  }
  useEffect(() => {
    (async () => {
      const response = await fetch("/api/users/" + page + `/${search}`, {
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
        setList(data.users);
        setPage(parseInt(data.page));
        setLast(parseInt(data.last_page));
      } catch (err) {

      }

      // console.log(data.data);

    })();
  }, [page, search]);
  return (
    <Page title={(<><Link to="/account"><Typography type="h4" className={bem.e('title')}><FaArrowCircleLeft /> Admin Users</Typography></Link>
      {JSON.parse(localStorage.getItem('auth')).user.superAdmin ? (<Button color="link" onClick={() => setAddModal(true)} style={{ "padding": "20px" }}><FaUserPlus /></Button>) : ""}</>)} className="MyPage"
    >
      <Row>
        <Col md={12}>
          <InputGroup>
            <InputGroupAddon addonType="prepend"><span className="input-group-text"><FaSearchengin /></span></InputGroupAddon>
            <Input value={search} type="text" placeholder="Search.." onChange={(e) => { setSearch(e.target.value) }} />
          </InputGroup>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          {
            (list && list.length > 0) ?
              list.map((ele, key) => (
                <div className={'form-control admin-recharge-control'} color="link" key={key} style={{ marginBottom: '0rem' }}>
                  Phone : {ele.phone}, &nbsp; Email : {ele.email}
                  <br />
            Name: {ele.nickname} &nbsp; {ele.superAdmin ? (<span className="text-warning">SuperAdmin</span>) : (ele.admin ? (<span className="text-danger">Admin</span>) : (<span className="text-primary">User</span>))}
                  <div style={{ float: 'right' }}>
                    {
                      (JSON.parse(localStorage.getItem('auth')).user.superAdmin && !ele.superAdmin) ? (
                        <button className="btn btn-primary" onClick={pointUp(key)} ><FaHandPointUp /></button>
                      ) : ""
                    }
                    {
                      (JSON.parse(localStorage.getItem('auth')).user.superAdmin && ele.admin) ? (
                        <button className="btn btn-warning" onClick={pointDown(key)} ><FaHandPointDown /></button>
                      ) : ""
                    }
                    <Link className="btn btn-success" color="success" to={`/user/${ele._id}`}><FaUserCog /></Link>
                    {JSON.parse(localStorage.getItem('auth')).user.superAdmin ? (
                      <button className="btn btn-danger" onClick={remove(key)} ><FaTrashAlt /></button>
                    ) : ""}</div>
                </div>
              )) : ''
          }

        </Col>

      </Row>
      <Modal
        isOpen={selected !== -1}
        toggle={() => setSelected(-1)}
      >
        <ModalHeader toggle={() => setSelected(-1)}>Are u sure to remove the user?</ModalHeader>
        {
          (selected > -1 && list[selected]) ? (
            <ModalBody>
              <Row>
                <Col md={12}>
                  <Form>
                    <FormGroup>
                      <Label for="history">Phone Number</Label>
                      <Input type="text" disabled value={list[selected].phone} name="history" id="history" className='form-control' />
                    </FormGroup>
                  </Form>
                </Col>
              </Row>
              <Row>
                <Button style={{ width: '130px', marginLeft: 'auto', marginRight: 'auto' }} color="primary" onClick={() => postRemove(selected, 1)}>
                  OK
                </Button>
                <Button style={{ width: '130px', marginLeft: 'auto', marginRight: 'auto' }} color="secondary" onClick={() => setSelected(-1)}>
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

      <Modal
        isOpen={addModal}
        toggle={() => setAddModal(!addModal)}
      >
        <ModalHeader toggle={() => setAddModal(!addModal)}>Add a new User</ModalHeader>
        <ModalBody>
          <Row>
            <Col md={12}>
              <FormGroup>
                <Label for="role">Phone Number</Label>
                <Input type="select" onChange={(e) => setRole(e.target.value)} id="role" value={role} className='form-control' >
                  <option>Super Admin</option>
                  <option>Admin</option>
                  <option>User</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <Label for="phone">Phone Number</Label>
                <Input type="text" onChange={(e) => setPhone(e.target.value)} id="phone" value={phone} className='form-control' />
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input type="password" onChange={(e) => setPassword(e.target.value)} id="password" value={password} className='form-control' />
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <Label for="referral">Referral Number</Label>
                <Input type="text" onChange={(e) => setReferral(e.target.value)} id="referral" value={referral} className='form-control' />
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button style={{ width: '130px', marginLeft: 'auto', marginRight: 'auto' }} color="primary" onClick={() => postAdd()}>
            OK
          </Button>
          <Button style={{ width: '130px', marginLeft: 'auto', marginRight: 'auto' }} color="secondary" onClick={() => setAddModal(!addModal)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
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
        <div style={{ height: "50px" }}></div>
      </Row>
    </Page>
  );
};

export default AdminUsersPage 
