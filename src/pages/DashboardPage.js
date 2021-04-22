
import Page from 'components/Page';

import React,{useState,useEffect} from 'react';
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
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  Row
} from 'reactstrap';

const DashboardPage =(props)=> {
  var [modal,setModal]=useState(false);
  var [listNo,setListNo]=useState(0);
  //carousel
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [list,setList]=useState('');
  //products
  const [listVisible,setListVisible]=useState(list);
  const [items,setItems]=useState('');
  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  }

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  }

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  }
  const [slides,setSlides]=useState(''); 

  //products
  useEffect(() => {
    if(list=='' && items=='' && listVisible==''){
      (async ()=>{
        const response=await fetch("/json/List", {
          "method": "GET",
          "headers": {
            "content-type": "application/json"
          }
        });
        const data=await response.json();
        await setList(data.items);
        await setListVisible(data.items);
        await setItems(data.carousel);
        setSlides(data.carousel.map((item) => {
          return (
            <CarouselItem
              onExiting={() => setAnimating(true)}
              onExited={() => setAnimating(false)}
              key={item.src}
            >
              <img src={item.src} alt={item.altText} />
            </CarouselItem>
          );
        }));
      })();
    }
    
      
  });
  return (

    <Page
      className="DashboardPage"    
    >
      {/* <Carousel >

      </Carousel> */}
      {
        slides!=='' && slides.length!==0 ? (
          <Carousel style={{'height':'300px'}}
            activeIndex={activeIndex}
            next={next}
            previous={previous}
          >
            <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} />
            {slides}
            <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
            <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
          </Carousel>
        ) : ''
      }
      {
        list!=='' && list.length!==0 ? (
          <>
            <Row className={'mt-2 ml-2 mr-2'}>
            {
              list.map((ele,key)=>(
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
              ))
            }              
            </Row>
          
            <Row >
              <div style={{"height":'60px'}}></div>
            </Row>
            <Modal
              isOpen={modal}
              toggle={()=>setModal(!modal)}
              className={props.className}>
              <ModalHeader toggle={()=>setModal(!modal)}>{list[listNo].title}</ModalHeader>
              <ModalBody>
                <Row>     
                  <img src={list[listNo].img}  className={'modal-image'} ></img>  
                                
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
          </>
        ) : ''
      }
      
      
      
    </Page>
  );
 
}
export default DashboardPage;
