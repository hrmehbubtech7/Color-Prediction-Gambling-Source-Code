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
  FaArrowCircleLeft,FaRegEyeSlash
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Typography from '../components/Typography';
import bn from 'utils/bemnames';
const bem = bn.create('page');
const ComplaintPage = (props) => {
  const [status, setStatus] = useState(1);
  const [list, setList] = useState([]);
  const [view, setView] = useState(-1);
  const [page, setPage] = useState(1);
  const [last, setLast] = useState(1);
  const toggle = (no) => () => {
    // console.log(list.findIndex(ele=>ele._id===no));
    setView(list.findIndex(ele => ele._id === no))
  };
  const postReply = (id) => {
    (async () => {
      const response = await fetch("/api/complaints-admin", {
        "method": "POST",
        "headers": {
          "content-type": "application/json",
          "Authorization": JSON.parse(localStorage.getItem('auth')).userToken

        },
        body: JSON.stringify({
          id: list[id]._id,
          reply: list[id].reply
        })
      });
      if (response.status == 401)
        props.history.push('/login');
      var aa = JSON.parse(JSON.stringify(list));
      aa[id].status = true;
      setList(aa);
      setView(-1);
    })();
  }
  // const addSuggestion=()=>{
  //   if(addData.period!='' && addData.content!=='')
  //   {
  //     (async ()=>{
  //       const response=await fetch("/api/complaints-admin", {
  //         "method": "POST",
  //         "headers": {
  //           "content-type": "application/json",
  //           "Authorization":JSON.parse(localStorage.getItem('auth')).userToken

  //         },
  //         body:JSON.stringify({...addData})
  //       });
  //       const data=await response.json();
  //       alert(data.message);  
  //       setAddData({state:false,whatsapp:'',period:'',category:'Suggestion'}); 
  //       setStart(!start);
  //     })();  
  //   }
  // };
  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/complaints-admin/${status}/` + page, {
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
          setList(data.data);
          setPage(parseInt(data.page));
          setLast(parseInt(data.last_page));
        }

      } catch (err) {

      }

      // console.log(data.data);

    })();
  }, [status, page]);
  return (
    <Page title={(<><Link to="/account"><Typography type="h4" className={bem.e('title')}><FaArrowCircleLeft /> Admin Complaint</Typography></Link></>)} className="MyPage"
    >
      <Row style={{ flexFlow: "row wrap", "justifyContent": "space-between" }} className="category-bar">
        <Button className={status === 1 && "btn-active"} color="link" onClick={() => setStatus(1)}>Completed</Button>
        <Button className={status === 0 && "btn-active"} color="link" onClick={() => setStatus(0)}>Wait</Button>
      </Row>

      <Row>
        <Col md={12}>
          {
            (list && list.length > 0) ?
              list.filter(ele => ele.status === (status==1 ? true : false)).map((ele, key) => (
                <Button tag="a" className={'form-control'} color="link" onClick={toggle(ele._id)} key={key} style={{ marginBottom: '0rem',height:'50px' }}>{ele.category}-{ele.period}
                <span style={{ float: 'right' }}>{(ele.status==true && ele.view_status==false) ? (<FaRegEyeSlash className="text-danger" />) : ""}</span>
                </Button>
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
                      <Label for="exampleSelect1">category</Label>
                      <Input type="text" disabled id="exampleSelect1" className='form-control' value={list[view].category} />

                    </FormGroup>
                    <FormGroup>
                      <Label for="period1">Period ID</Label>
                      <Input type="text" disabled value={list[view].period} name="period" id="period1" className='form-control' />
                    </FormGroup>
                    <FormGroup>
                      <Label for="whatsapp1">Whatsapp Number</Label>
                      <Input type="text" disabled value={list[view].whatsapp} name="whatsapp" id="whatsapp1" className='form-control' />
                    </FormGroup>
                    <FormGroup>
                      <Label for="content1">Content</Label>
                      <Input type="textarea" disabled value={list[view].content} name="content" id="content1" className='form-control' />
                    </FormGroup>
                    <FormGroup>
                      <Label for="reply">Reply</Label>
                      <Input disabled={list[view].status > 0 ? 'disabled' : ''} type="textarea" value={list[view].reply} onChange={(e) => { var aa = JSON.parse(JSON.stringify(list)); aa[view].reply = e.target.value; setList(aa); }} name="reply" id="reply" className='form-control' />
                    </FormGroup>
                  </Form>
                </Col>
              </Row>
            </ModalBody>
          ) : ''
        }

        <ModalFooter>

          <Button color="primary" onClick={() => postReply(view)}>
            Ok
          </Button>
          <Button color="secondary" onClick={() => setView(-1)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

    </Page>
  );
};

export default ComplaintPage 
