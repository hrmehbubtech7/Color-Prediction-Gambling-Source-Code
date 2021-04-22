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
  ModalHeader,Pagination, PaginationItem, PaginationLink
} from 'reactstrap';
import {FaBoxOpen,FaCartPlus,FaTrashAlt,
  FaArrowCircleLeft} from 'react-icons/fa';
import {Link} from 'react-router-dom';
import Typography from '../components/Typography';
import bn from 'utils/bemnames';
const bem = bn.create('page');
const AdminReward = (props) => {
  const [list, setList]=useState([]);
  const [add,setAdd]=useState(false);
  const [addData,setAddData]=useState({money:0,userphone:''});
  const [page,setPage]=useState(1);
  const [last_page,setLast_page]=useState(1);
  const deleteReward=async (id)=>{
    if(window.confirm('Really remove reward?')){
      const response=await fetch("/api/reward/"+id, {
        "method": "DELETE",
        "headers": {
          "content-type": "application/json",
          "Authorization":JSON.parse(localStorage.getItem('auth')).userToken
  
        }
      });
      if(response.status==401)
        props.history.push('/login');
      gotoPage(page)();
    }
    
 
  };
  const createReward=()=>{
    if(addData.userphone!="" && addData.money!=""){
      (async ()=>{
        const response=await fetch("/api/reward", {
          "method": "POST",
          "headers": {
            "content-type": "application/json",
            "Authorization":JSON.parse(localStorage.getItem('auth')).userToken
  
          },
          body:JSON.stringify({
            ...addData
          })
        });
        if(response.status==401)
          props.history.push('/login');
        await setAdd(false);
        await setAddData({money:0,userphone:''});
        console.log(page);
        gotoPage(page)();
      })();  
    }else{
      setAdd(false);
      setAddData({money:0,userphone:''});
    }

    
  };
  const gotoPage=ttt=>async ()=>{
    const response=await fetch("/api/rewards/"+ttt, {
      "method": "GET",
      "headers": {
        "content-type": "application/json",
        "Authorization":JSON.parse(localStorage.getItem('auth')).userToken

      }
    });
    if(response.status==401)
      props.history.push('/login');
    const data=await response.json();
    await setList(data.rewards);
    await setPage(parseInt(data.page));
    await setLast_page(data.last_page);
  };
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
    (async ()=>{
      const response=await fetch("/api/rewards/1", {
        "method": "GET",
        "headers": {
          "content-type": "application/json",
          "Authorization":JSON.parse(localStorage.getItem('auth')).userToken

        }
      });
      if(response.status==401)
        props.history.push('/login');
      const data=await response.json();
      await setList(data.rewards);
      await setLast_page(data.last_page);
      // console.log(data.data);
      
    })();      
  },[]);
  return (
    <Page title={(<><Link to="/account"><Typography type="h4" className={bem.e('title')}><FaArrowCircleLeft /> Admin Rewards</Typography></Link><Button color="link" onClick={()=>setAdd(true)} style={{"padding":"20px"}}><FaCartPlus /></Button></>)} className="MyPage" 
    >     

      <Row>   
        <Col md={12}>
        {
          (list && list.length>0) ?
          list.map((ele,key)=>(
          <div className={'form-control'} key={key} style={{ marginBottom: '0rem',height:'100px'}}>
            <span>{process.env.REACT_APP_SOURCE_URL}/api/reward/{ele._id}</span><br />
            <span>₹ {ele.money} </span><br />
            <span>Phone : {ele.userphone}</span>
            {' '}&nbsp;
            <span>rewared by : {ele.createdBy ? ele.createdBy.phone : ''}</span>
            {' '}&nbsp;
            {
              ele.status==false ? (
                <Button size={'sm'} color="danger" onClick={()=>deleteReward(ele._id)}><FaTrashAlt /></Button>
              ) : ''
            }
            
            </div>
          )) : ''
        }    

        </Col> 
        <Col>
          <Pagination size="sm" aria-label="Page navigation example">
            {
              page>1 ? (
                <PaginationItem>
                  <PaginationLink previous onClick={gotoPage(1)} />
                </PaginationItem>
              ) : ''
            }
            {
              page>1 ? (
                <PaginationItem>
                  <PaginationLink onClick={gotoPage(page-1)}>
                    {page-1}
                  </PaginationLink>
                </PaginationItem>
              ) : ''
            }
            
            <PaginationItem active>
              <PaginationLink onClick="">
                {page}
              </PaginationLink>
            </PaginationItem>
            {
              page<last_page ? (
                <PaginationItem>
                  <PaginationLink onClick={gotoPage(page+1)}>
                    {page+1}
                  </PaginationLink>
                </PaginationItem>
              ) : ''
            }
            {
              page<last_page ? (
                <PaginationItem>
                  <PaginationLink next onClick={gotoPage(last_page)} />
                </PaginationItem>
              ) : ''
            }
            
            
          </Pagination>
        </Col>
        
      </Row>
      <Row>
            <div style={{"height":'100px'}}></div>
          </Row>
      <Modal
        isOpen={add}
        toggle={()=>setAdd(!add)}
        >
        <ModalHeader toggle={()=>setAdd(!add)}>Add new Reward</ModalHeader>
            <ModalBody>        
              <Row>  
                <Col md={12}>
                <Form>
                <FormGroup>
                  <Label for="money">Amount of Money</Label>
                  <Input type="number" id="money" onChange={(e)=>setAddData({...addData,money:e.target.value})} className='form-control' value={addData.money} />
                  
                </FormGroup>
                <FormGroup>
                  <Label for="userphone">User Phone</Label>
                  <Input type="text" id="userphone" onChange={(e)=>setAddData({...addData,userphone:e.target.value})} className='form-control' value={addData.userphone} />
                  
                </FormGroup>
                </Form>   
                </Col>                       
              </Row>            
            </ModalBody>
        <ModalFooter>
       
          <Button color="primary" onClick={()=>createReward()}>
            Ok
          </Button>
          <Button color="secondary" onClick={()=>setAdd(!add)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
      
    </Page>
  );
};

export default AdminReward 
