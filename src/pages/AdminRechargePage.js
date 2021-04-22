import Page from 'components/Page';
import React,{useState,useEffect} from 'react';
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
import {FaHourglassHalf,FaMoneyCheck,FaRegTimesCircle,
  FaArrowCircleLeft} from 'react-icons/fa';
import {Link} from 'react-router-dom';
import Typography from '../components/Typography';
import bn from 'utils/bemnames';
const bem = bn.create('page');
const AdminRechargePage = (props) => {
  const [status,setStatus]=useState(2);
  const [list, setList]=useState([]);
  const [view,setView]=useState(-1);
  const [page, setPage] = useState(1);
  const [last, setLast] = useState(1);
  const toggle=(no)=>()=>{
    // console.log(no);
    // console.log(list.findIndex(ele=>ele.userId===no));
    setView(no);
  };
  const postReply=(id,approve)=>{
    (async ()=>{
      const response=await fetch("/api/recharge-admin", {
        "method": "POST",
        "headers": {
          "content-type": "application/json",
          "Authorization":JSON.parse(localStorage.getItem('auth')).userToken

        },
        body:JSON.stringify({
          id:list[id]._id,
          status:approve
        })
      });
      try{
        if(response.status==200){
          if(approve==1){
            let tmp=JSON.parse(JSON.stringify(list));
            tmp[id].status=1;
            setList(tmp);
          }else{
            let tmp=JSON.parse(JSON.stringify(list));
            tmp.splice(id,1);
            setList(tmp);
          }
        }  
      }catch(err){

      }     

      setView(-1);
    })();  
  }
  
  useEffect(() => {
    (async ()=>{
      const response=await fetch(`/api/recharge-admin/${page}`, {
        "method": "GET",
        "headers": {
          "content-type": "application/json",
          "Authorization":JSON.parse(localStorage.getItem('auth')).userToken

        }
      });
      if(response.status==401)
        props.history.push('/login');
      try{
        if (response.status < 400){
          const data = await response.json();
          await setList(data.data);
          setPage(parseInt(data.page));
          setLast(parseInt(data.last_page));
        }      
      }catch(err){

      }
      
      // console.log(data.data);
      
    })();      
  },[status, page]);
  return (
    <Page title={(<><Link to="/account"><Typography type="h4" className={bem.e('title')}><FaArrowCircleLeft /> Admin Recharge</Typography></Link></>)} className="MyPage" 
    >      
    <Row>
        <Col md={12}>
          <Input type="select" value={status} onChange={(e)=>setStatus(e.target.value)} >
            <option value="2">All</option>
            <option value="0">Waiting</option>
            <option value="1">Completed</option>           
          </Input>
        </Col>
      </Row>
      <Row>   
        <Col md={12}>
        {
          (list && list.length>0) ?
          list.map((ele,key)=>(
            <Button tag="a" className={'form-control admin-recharge-control'} color="link" onClick={toggle(key)} key={key} style={{ marginBottom: '0rem' }}>{ele.userPhone}, {ele.userNickname} : ₹ {ele.money} 
            <br />
            {ele.orderID}
            <br />  {ele.createdAt}
            <span style={{float:'right'}}>{ele.status==1 ? (<FaMoneyCheck className='text-success' />) : 
             (<FaHourglassHalf className='text-warning' />)}</span></Button>
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
            <div style={{"height":'60px'}}></div>
          </Row>
      <Modal
        isOpen={view!==-1}
        toggle={()=>setView(-1)}
        >
        <ModalHeader toggle={()=>setView(-1)}>Recharge Information</ModalHeader>
        {
          (view>-1 && list[view]) ? (
            <ModalBody>        
              <Row>  
                <Col md={12}>
                <Form>
                <FormGroup>
                  <Label for="exampleSelect1">User ID</Label>
                  <Input type="text" disabled  id="exampleSelect1" className='form-control' value={list[view].userId} />
                  
                </FormGroup>
                <FormGroup>
                  <Label for="period1">User Phone Number</Label>
                  <Input type="text" disabled value={list[view].userPhone} name="period" id="period1" className='form-control' />               
                </FormGroup>
                  <FormGroup>
                  <Label for="whatsapp1">NickName</Label>
                  <Input type="text" disabled value={list[view].userNickname} name="whatsapp" id="whatsapp1" className='form-control'/>               
                </FormGroup>
                <FormGroup>
                  <Label for="content1">Required amounts</Label>
                  <Input type="text" disabled value={"₹"+list[view].money} name="content" id="content1" className='form-control'/>               
                </FormGroup>
                <FormGroup>
                  <Label for="history">Transaction History</Label>
                  <Input type="text" disabled value={list[view].orderID} name="history" id="history" className='form-control'/>               
                </FormGroup>
                </Form>   
                </Col>                       
              </Row>     
              <Row>
                <Button style={{width:'130px',marginLeft:'auto',marginRight:'auto'}} color="primary" onClick={()=>postReply(view,1)}>
                  Approve
                </Button>
                <Button style={{width:'130px',marginLeft:'auto',marginRight:'auto'}} color="secondary" onClick={()=>postReply(view,-1)}>
                  Remove
                </Button>
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

export default AdminRechargePage 
