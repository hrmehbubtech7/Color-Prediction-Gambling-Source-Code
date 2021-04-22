
import Page from 'components/Page';
import {FaSearch} from 'react-icons/fa'
import React,{useState, useEffect} from 'react';
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,

  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from 'reactstrap';

const SearchPage =(props)=> {
  const [list,setList]=useState('');
  var [modal,setModal]=useState(false);
  var [listNo,setListNo]=useState(0);
  //products
  const [listVisible,setListVisible]=useState(list);

  
  useEffect(() => {
    if(list==''){
      (async ()=>{
        const response=await fetch("/json/List", {
          "method": "GET",
          "headers": {
            "content-type": "application/json"
          }
        });
        const data=await response.json();
        setList(data.items);
        setListVisible(data.items);
    
      })();
    }
    
      
  });



  return (
    <Page
      className="SearchPage"    
    >
      {/* <Carousel >

      </Carousel> */}
      <Row>
        {
          list!=='' ? (
          <InputGroup>
            <InputGroupAddon addonType="prepend"><span className="input-group-text"><FaSearch /></span></InputGroupAddon>
            <Input  placeholder="" onChange={(e)=>{setListVisible(list.filter(ele=>{return ele.title.toUpperCase().indexOf(e.target.value.toUpperCase())>=0;}))}}/>
          </InputGroup>
          ) : ''
        }
        
      </Row>
      <Row className={'mt-2 ml-2 mr-2'}>
        {
          (listVisible!=='' && listVisible.length!==0) ? listVisible.map((ele,key)=>(
            <Col md={2} sm={3} xs={6} className="mb-3 pl-2 pr-2" key={key}>
              <Card className={'list-products'} onClick={()=>{setListNo(key);setModal(true);}}>
                <CardImg top src={ele.img} />
                <CardBody>
                  <CardTitle  >{ele.title}</CardTitle>
                  <CardText>
                    {ele.text}
                  </CardText>
                </CardBody>
              </Card>
            </Col>
          )) : ""
          
        }    

      </Row>
     
      <Row >
        <div style={{"height":'60px'}}></div>
      </Row>
      {
        (listVisible!=='' && listVisible.length!==0) ? (
          <Modal
            isOpen={modal}
            toggle={()=>setModal(!modal)}
            className={props.className}>
            <ModalHeader toggle={()=>setModal(!modal)}>{listVisible[listNo].title}</ModalHeader>
            <ModalBody>
              <Row>     
                <img src={listVisible[listNo].img}  className={'modal-image'} ></img>  
                              
              </Row>
              <Row className="list-product mt-2 ml-2 mr-2" >
                {list[listNo].text} 
              </Row>
              <Row className="mt-2 ml-2 mr-2">
                <Button color='grey'  disabled>Sold out</Button>
              </Row>
              
            </ModalBody>
            <ModalFooter>
            
              <Button color="secondary" onClick={()=>setModal(!modal)}>
                Close
              </Button>
            </ModalFooter>
          </Modal>
        ) : ''
      }
      
      
    </Page>
  );
 
}
export default SearchPage;
