import Page from 'components/Page';
import React, { useState, useEffect } from 'react';
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

} from 'reactstrap';
import StyledTab from "components/StyledTab";
import StyledTabs from "components/StyledTabs";
import { Pagination, PaginationItem } from '@material-ui/lab';

import {
  FaArrowCircleLeft,
  FaPlus, FaRegEyeSlash
} from 'react-icons/fa';
import {MdRateReview} from 'react-icons/md';
import Button from 'components/Button';
import Snackbar from "components/Snackbar.js";
import { Link } from 'react-router-dom';
import Typography from '../components/Typography';
import bn from 'utils/bemnames';
const bem = bn.create('page');
const ComplaintPage = (props) => {
  const [status, setStatus] = useState(1);
  const [list, setList] = useState([]);
  const [addData, setAddData] = useState({ state: false, whatsapp: '', period: '', category: 'Suggestion' });
  const [view, setView] = useState(-1);
  const [page, setPage] = useState(1);
  const [last, setLast] = useState(1);
  const toggle = (no) => () => {
    // console.log(list.findIndex(ele=>ele._id===no));
    (async () => {
      const response = await fetch("/api/complaints", {
        "method": "PUT",
        "headers": {
          "content-type": "application/json",
          "Authorization": JSON.parse(localStorage.getItem('auth')).userToken
        },
        body: JSON.stringify({ id: list.find(ele => ele._id === no)._id })
      });
      try {
        if (response.status < 400) {
          const data = await response.json();
          const tmp = JSON.parse(JSON.stringify(list));
          const id = list.findIndex(ele => ele._id === no);
          tmp[id].view_status = true;
          await setList(tmp);
          setView(id);
        }
      } catch (err) {
      }
    })();
  };
  const addSuggestion = () => {
    if (addData.period != '' && addData.content !== '') {
      (async () => {
        const response = await fetch("/api/complaints", {
          "method": "POST",
          "headers": {
            "content-type": "application/json",
            "Authorization": JSON.parse(localStorage.getItem('auth')).userToken

          },
          body: JSON.stringify({ ...addData })
        });
        const data = await response.json();
        alert(data.message);
        setAddData({ state: false, whatsapp: '', period: '', category: 'Suggestion' });
      })();
    }
  };
  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/complaints/${status}/` + page, {
        "method": "GET",
        "headers": {
          "content-type": "application/json",
          "Authorization": JSON.parse(localStorage.getItem('auth')).userToken

        }
      });
      if (response.status == 401)
        props.history.push('/login');
      try {
        if (response.status < 400) {
          const data = await response.json();
          await setList(data.data);
          setPage(parseInt(data.page));
          setLast(parseInt(data.last_page));
        }

      } catch (err) {

      }

    })();
  }, [status, page]);
  return (
    // <Page
    //   className="walletPage"
    //   title={(
    //     <div className="header-userinfo">
    //       <img src={`/uploads/avatars/${props.auth.user.avatar ? props.auth.user.id + ".jpg" : "user.png"}`} />
    //       <div>
    //         <span className="header-nickname">{props.auth.user.nickname}</span>
    //         <span className="header-balance"><small>₹</small>{props.auth.user.budget}</span>
    //       </div>
    //     </div>
    //   )}
    //   breadcrumbs={
    //     (
    //       <div className="header-buttons">
    //         <Button component="a" color="success" justIcon  style={{ "float": "right", padding:"5px 10px" }} onClick={() => { setAddData({ ...addData, state: true }) }}>
    //           <MdRateReview />
    //         </Button>           
    //       </div>
    //     )
    //   }
    // >
    <Page title={(<><Link to="/account"><Typography type="h4" className={bem.e('title')}><FaArrowCircleLeft /> Help Center</Typography></Link><Button color="success" justIcon  style={{ "float": "right", padding:"5px 10px",marginTop:"15px" }} onClick={() => { setAddData({ ...addData, state: true }) }}><MdRateReview /></Button></>)} className="MyPage"  >


      <StyledTabs variant="fullWidth" value={status} onChange={(e,v)=>{setStatus(v);setPage(1);}} aria-label="styled tabs example">
        <StyledTab label="Replied" value={1} />
        <StyledTab label="Waiting" value={0} />
      </StyledTabs>
      <br />

      <Row>
        <Col md={12}>
          {
            (list && list.length > 0) ?
              list.map((ele, key) => (
                <Button tag="a" className={'form-control'} color="info" size="sm" onClick={toggle(ele._id)} key={key} style={{ marginBottom: '0rem' }}>{ele.category}  :  {ele.period}
                  <span style={{ float: 'right' }}>{(ele.status == true && ele.view_status == false) ? (<FaRegEyeSlash className="text-danger" />) : ""}</span>
                </Button>
              )) : ''
          }

        </Col>

      </Row>
      <Row>
        <Pagination color="primary" count={last}
          page={page} onChange={(e, v) => setPage(v)}
          renderItem={(item) => <PaginationItem component="a" {...item} />} size="small" />
      </Row>
      <Row>
        <div style={{ "height": '60px' }}></div>
      </Row>
      <Modal
        isOpen={view !== -1}
        toggle={() => setView(-1)}
      >
        <ModalHeader toggle={() => setView(-1)}>Complaint & Suggestion</ModalHeader>
        {
          (view > -1 && list[view]) ? (
            <ModalBody>
              <Row>
                <Col md={12}>
                  <Form>
                  <FormGroup>
                      <Label for="reply">Reply</Label>
                      <Input rows="10" type="textarea" disabled value={list[view].reply} name="reply" id="reply" className='form-control' />
                    </FormGroup>
                    <FormGroup>
                      <Label for="exampleSelect1">category</Label>
                      <Input type="text" disabled id="exampleSelect1" className='form-control' value={list[view].category} />

                    </FormGroup>
                    <FormGroup>
                      <Label for="period1">Period ID</Label>
                      <Input type="text" disabled value={list[view].period} name="period" id="period1" className='form-control' />
                    </FormGroup>
                    <FormGroup>
                      <Label for="content1">Content</Label>
                      <Input type="textarea" disabled value={list[view].content} name="content" id="content1" className='form-control' />
                    </FormGroup>
                    
                  </Form>
                </Col>
              </Row>
            </ModalBody>
          ) : ''
        }

        <ModalFooter>

          <Button color="white" onClick={() => setView(-1)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
      <Modal
        isOpen={addData.state}
        toggle={() => setAddData({ ...addData, state: !addData.state })}
      >
        <ModalHeader toggle={() => setAddData({ ...addData, state: !addData.state })}>Add Complaint & Suggestion</ModalHeader>
        <ModalBody>
          <Row>
            <Col md={12}>
              <Form>
                <FormGroup>
                  <Label for="exampleSelect">category</Label>
                  <Input type="select" value={addData.category} name="select" id="exampleSelect" className='form-control' onChange={(e) => setAddData({ ...addData, category: e.target.value })} >
                    <option>Suggestion</option>
                    <option>Consult</option>
                    <option>Recharge Problem</option>
                    <option>Withdraw Problem</option>
                    <option>Parity Problem</option>
                    <option>Gift Receive Problem</option>
                    <option>Other</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="period">Period ID</Label>
                  <Input type="number" value={addData.period} onChange={(e) => setAddData({ ...addData, period: e.target.value })} name="period" id="period" className='form-control' />
                </FormGroup>
                <FormGroup>
                  <Label for="whatsapp">Whatsapp Number</Label>
                  <Input type="number" value={addData.whatsapp} onChange={(e) => setAddData({ ...addData, whatsapp: e.target.value })} name="whatsapp" id="whatsapp" className='form-control' />
                </FormGroup>
                <FormGroup>
                  <Label for="content">Content</Label>
                  <Input type="textarea" value={addData.content} onChange={(e) => setAddData({ ...addData, content: e.target.value })} name="content" id="content" className='form-control' />
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
    </Page>
  );
};

export default ComplaintPage 
