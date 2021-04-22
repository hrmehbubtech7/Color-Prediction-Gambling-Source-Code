import React from 'react';
import {Redirect} from 'react-router-dom';
import {
  Row,
  Col,
  Button,
  Card,
  CardHeader,
  CardBody} from 'reactstrap';
import PageSpinner from '../components/PageSpinner';
import Page from 'components/Page';
import NotificationSystem from 'react-notification-system';
import {
  FaSyncAlt
  
} from 'react-icons/fa';
import {

  MdWarning,
} from 'react-icons/md';
import {stateSetter} from '../components/Service';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
var timeOut;
class AdminEnjoyPage extends React.Component {
  constructor(props) {
    super(props);
    this.setter = stateSetter(this);
    
    }
    componentWillUnmount() {
      clearTimeout(timeOut);
      this.setter.cancel();
      
      }
  state = {
    // data:[
    //   {
    //     records:'',
    //     bet:'',
    //     time:'',
    //     status:0,
    //     getReult:false,
    //     modal: false,
    //     contract_money:10,
    //     guess:'',
    //     redirectToLogin:false,
    //     my_records:''
    //   },
    //   {
    //     records:'',
    //     bet:'',
    //     time:'',
    //     status:0,
    //     getReult:false,
    //     modal: false,
    //     contract_money:10,
    //     guess:'',
    //     redirectToLogin:false,
    //     my_records:''
    //   },
    //   {
    //     records:'',
    //     bet:'',
    //     time:'',
    //     status:0,
    //     getReult:false,
    //     modal: false,
    //     contract_money:10,
    //     guess:'',
    //     redirectToLogin:false,
    //     my_records:''
    //   },
    //   {
    //     records:'',
    //     bet:'',
    //     time:'',
    //     status:0,
    //     getReult:false,
    //     modal: false,
    //     contract_money:10,
    //     guess:'',
    //     redirectToLogin:false,
    //     my_records:''
    //   }
    // ],
    records:'',
    bet:'',
    time:'',
    redirectToLogin:false,
    result:'',
    level:0,
    reload:false,
    auto:false
  };
  onPostResult=(num)=>()=>{
    if(num==10)
      num=0;
    else if(num===11)
      num=1;
    else if(num===12)
      num=5;
    fetch("/api/enjoy-admin", {
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "Authorization":JSON.parse(localStorage.getItem('auth')).userToken
      },
      body:JSON.stringify({guess:this.state.guess,
        number:num,
        level:this.state.level
      })
        
    })
    .then(response =>{ 
      if(response.status<400){
        response.json().then(res=>{
          // console.log(res);
          if(res.error){
            this.notificationSystem.addNotification({
              title: <MdWarning />,
              message:res.error,
              level: 'info',
            });
          }else{
            this.setter.setState({
              result:num
            });
          }
        });

      }else{
        this.setter.setState({
          redirectToLogin:true
        })
      }

    });
    
  };
  onTimeDecrease=()=>{
    
    fetch("/api/enjoy-admin/"+this.state.level, {
      "method": "GET",
      "headers": {
        "content-type": "application/json",
        "Authorization":JSON.parse(localStorage.getItem('auth')).userToken
      }
    })
    .then(response =>{ 
      if(response.status<400){
        response.json().then(res=>{
          // console.log(res);
          if(res.time>150000){
            this.setter.setState({
              log_time:res.log_time,
              bet:res.bet,
              time:180000-parseInt(res.time),
              result:res.number,
              auto:res.auto
            });
            
          }else{
            this.setter.setState({
              bet:res.bet,          
              time:180000-parseInt(res.time),
              log_time:res.log_time,
              result:res.number,
              auto:res.auto
            });
          }
          clearTimeout(timeOut);
          timeOut=setTimeout(this.onTimeDecrease,1000);
        });

      }else{
        this.setter.setState({
          redirectToLogin:true
        })
      }

    });
  }
  componentDidMount(){


    fetch("/api/enjoy-admin/"+this.state.level, {
      "method": "GET",
      "headers": {
        "content-type": "application/json",
        "Authorization":JSON.parse(localStorage.getItem('auth')).userToken
      }
    })
    .then(response =>{ 
      if(response.status<400){
        response.json().then(res=>{
          // console.log(res);
          if(res.time>150000){
            this.setter.setState({
              log_time:res.log_time,
              bet:res.bet,
              time:180000-parseInt(res.time),
              result:res.number,
              auto:res.auto
            });
            
          }else{
            this.setter.setState({
              bet:res.bet,          
              time:180000-parseInt(res.time),
              log_time:res.log_time,
              result:res.number,
              auto:res.auto
            });
          }
          clearTimeout(timeOut);
          timeOut=setTimeout(this.onTimeDecrease,1000);
        });

      }else{
        this.setter.setState({
          redirectToLogin:true
        })
      }

    });
    
  }
  
  onCategoryClick=num=>()=>{
      this.setter.setState({
        reload:true
      });
      
      fetch("/api/enjoy-admin/"+num, {
        "method": "GET",
        "headers": {
          "content-type": "application/json",
          "Authorization":JSON.parse(localStorage.getItem('auth')).userToken
        }
      })
      .then(response =>{ 
        
        if(response.status<400){
          response.json().then(res=>{
           
            // console.log(res);
            if(res.time>150000){
              this.setter.setState({
                reload:false,
                log_time:res.log_time,
                bet:res.bet,
                time:180000-parseInt(res.time),
                result:res.number,
                auto:res.auto,
                level:num
              });
              
            }else{
              this.setter.setState({
                reload:false,
                bet:res.bet,          
                time:180000-parseInt(res.time),
                log_time:res.log_time,
                result:res.number,
                auto:res.auto,
                level:num
              });
            }
            clearTimeout(timeOut);
            timeOut=setTimeout(this.onTimeDecrease,1000);
          });
  
        }else{
          this.setter.setState({
            redirectToLogin:true
          })
        }
  
      });
    
    
    
  };  
  onReload=()=>{
    this.setter.setState({
      reload:true
    });
    
    fetch("/api/enjoy-admin/"+this.state.level, {
      "method": "GET",
      "headers": {
        "content-type": "application/json",
        "Authorization":JSON.parse(localStorage.getItem('auth')).userToken
      }
    })
    .then(response =>{ 
      if(response.status<400){
        response.json().then(res=>{
          this.setter.setState({
            reload:false
          });
          // console.log(res);
          if(res.time>150000){
            this.setter.setState({
              log_time:res.log_time,
              bet:res.bet,
              time:180000-parseInt(res.time),
              result:res.number,
              auto:res.auto
            });
            
          }else{
            this.setter.setState({
              bet:res.bet,          
              time:180000-parseInt(res.time),
              log_time:res.log_time,
              result:res.number,
              auto:res.auto
            });
          }
          clearTimeout(timeOut);
          timeOut=setTimeout(this.onTimeDecrease,1000);
        });

      }else{
        this.setter.setState({
          redirectToLogin:true
        })
      }

    });
  }
  setTop=num=>()=>{
   
    fetch("/api/enjoy-admin", {
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "Authorization":JSON.parse(localStorage.getItem('auth')).userToken
      },
      body:JSON.stringify({guess:this.state.guess,
        number:num,
        level:this.state.level
      })
        
    })
    .then(response =>{ 
      if(response.status<400){
        response.json().then(res=>{
          // console.log(res);
          if(res.error){
            this.notificationSystem.addNotification({
              title: <MdWarning />,
              message:res.error,
              level: 'info',
            });
          }else{
            this.setter.setState({
              result:num
            });
          }
        });

      }else{
        this.setter.setState({
          redirectToLogin:true
        })
      }

    });
  }
  onAutoMax=()=>{
    fetch("/api/enjoy-admin-auto", {
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "Authorization":JSON.parse(localStorage.getItem('auth')).userToken
      },
      body:JSON.stringify({
        auto:!this.state.auto
      })
        
    })
    .then(response =>{ 
      if(response.status<400){
        this.setState({
          auto:!this.state.auto
        });
      }else{
        this.setter.setState({
          redirectToLogin:true
        })
      }

    });
    

  }
  render() {
    if(this.state.bet.length!==0 && this.state.reload===false && this.state.level<4){
      // console.log(this.state.bet);
      if(this.state.redirectToLogin)
        return (<Redirect to="/login" />);
      var count_down_color;
      if(this.state.time<=30000)
        count_down_color="red";
      else
        count_down_color="black";
      var number_amounts=[0,0,0,0,0,0,0,0,0,0,0,0,0];
      var price_predict=0;
      var budget_predict=0;
      var top_budget_num,top_budget,low_budget,low_budget_num;
      for(var i=0;i<this.state.bet.length;i++){
        for(var k=0;k<13;k++){
          // console.log(this.state.bet[i]);
          number_amounts[k]+=parseInt(this.state.bet[i][2][k]);

        }
        
      }
      var tmp_budget,tmp_price;
      for(i=0;i<10;i++){
        if(i%5===0){
          tmp_price=Math.floor(number_amounts[i]*7.82+number_amounts[12]*3.41+number_amounts[11-(i%2)]*0.47);
          tmp_budget=0;
          for(var k=0;k<13;k++)
            tmp_budget+=number_amounts[k];
          tmp_budget=Math.floor(tmp_budget-tmp_price-number_amounts[i]-number_amounts[12]-number_amounts[11-(i%2)]);
        }else if(i%2===0){
          tmp_price=Math.floor(number_amounts[i]*7.82+number_amounts[11]*0.96);
          tmp_budget=0;
          for(k=0;k<13;k++)
            tmp_budget+=number_amounts[k];
          tmp_budget=Math.floor(tmp_budget-tmp_price-number_amounts[i]-number_amounts[11]);
        }else{
          tmp_price=Math.floor(number_amounts[i]*7.82+number_amounts[10]*0.96);
          tmp_budget=0;
          for(k=0;k<13;k++)
            tmp_budget+=number_amounts[k];
          tmp_budget=tmp_budget-tmp_price-number_amounts[i]-number_amounts[10];
        }
        if(i===parseInt(this.state.result)){
          price_predict=tmp_price;
          budget_predict=tmp_budget;
        }
        else{
          if(top_budget===undefined){
            top_budget=tmp_budget;
            top_budget_num=i;
          }else{
            if(top_budget<tmp_budget){
              top_budget=tmp_budget;
              top_budget_num=i;
            }          
          }
        }
        if(low_budget===undefined){
          low_budget=tmp_budget;
          low_budget_num=i;
        }else{        
          if(low_budget>tmp_budget){
            low_budget=tmp_budget;
            low_budget_num=i;
          }
        }
      }

          
  
      return (
        <Page
          className="EnjoyPage AdminEnjoy"
          title={"Admin panel - Enjoy"}
          breadcrumbs={
             (
              <div style={{'width':'100%'}}>
              <Button color="primary" onClick={this.onAutoMax} style={{"float":"left"}}>{this.state.auto ? 'Manual' : 'Auto'}</Button>
              <Button color="link" onClick={this.onReload} style={{"float":"right"}}><FaSyncAlt /></Button>
              </div>
              )        
            }
        >
          <Row>
            <Col md="12" sm="12" xs="12">
              <Button className={this.state.level===4 && "btn-active"} color="link" onClick={this.onCategoryClick(4)}>All</Button>
              <Button className={this.state.level===0 && "btn-active"} color="link" onClick={this.onCategoryClick(0)}>Star</Button>
              <Button className={this.state.level===1 && "btn-active"} color="link" onClick={this.onCategoryClick(1)}>Parity</Button>
              <Button className={this.state.level===2 && "btn-active"} color="link" onClick={this.onCategoryClick(2)}>Sapre</Button>
              <Button className={this.state.level===3 && "btn-active"} color="link" onClick={this.onCategoryClick(3)}>Bcone</Button>
            </Col>
          </Row>
          <Row>
            <Col md="12" sm="12" xs="12">
              <Card className="mb-3">
                <CardHeader>Count Down : <span style={{'color':count_down_color}}>{parseInt(this.state.time/1000/60)+" : "+ parseInt((this.state.time/1000)%60)}</span></CardHeader>
                  <CardBody>
                    <Row>
                      {
                        number_amounts.map((ele,key)=>(
                          key<10 ?
                          (
                            
                            <Col md={3} sm={6} xs={6} key={key} onClick={this.onPostResult(key)} className='number-line'>
                              {key}{' '}&nbsp;&nbsp;{key%2===1 ? (<span className="green-circle"></span>) : (<span className="red-circle"></span>)}{' '}&nbsp;&nbsp;{key%5===0 ? (<span className="violet-circle"></span>) : ''}&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;{' '} {ele}
                            </Col>
                          ) : (
                            key===10 ? (
                              <Col md={3} sm={6} xs={6} key={key} onClick={this.onPostResult(key)} className='number-line'>
                                <span className="green-circle"></span>{' '}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;{' '} {ele}
                              </Col>
                            ) : (
                              key===11 ? (
                                <Col md={3} sm={6} xs={6} key={key} onClick={this.onPostResult(key)} className='number-line'>
                                  <span className="red-circle"></span>{' '}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;{' '} {ele}
                                </Col>
                              ) : (
                                <Col md={3} sm={6} xs={6} key={key} onClick={this.onPostResult(key)} className='number-line'>
                                  <span className="violet-circle"></span>{' '}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;{' '} {ele}
                                </Col>
                              )
                            )                          
                          )
                        ))
                      }
                        
                    </Row>
                    <Row>
                      <Col md={12} sm={12} xs={12}>
                      Current Result:&nbsp;{this.state.result} 
                      </Col>
                      <Col md={6} sm={6} xs={6}>
                      Price Predict:&nbsp;{price_predict} 
                      </Col>
                      <Col md={6} sm={6} xs={6}>
                      Profit Predict:&nbsp;{budget_predict} 
                      </Col>
                      <Col md={6} sm={6} xs={6}>
                      Top Profit:&nbsp;{top_budget} 
                      </Col>
                      <Col md={6} sm={6} xs={6} onClick={this.setTop(top_budget_num)} className='number-line'>
                      Top Profit Number:&nbsp;{top_budget_num} 
                      </Col>
                      <Col md={6} sm={6} xs={6}>
                      Lowest Profit:&nbsp;{low_budget} 
                      </Col>
                      <Col md={6} sm={6} xs={6}>
                      Lowest Profit Number:&nbsp;{low_budget_num} 
                      </Col>
                        
                    </Row>
                  
                    
                  </CardBody>
                </Card>
            </Col>
          </Row>
          <Row>
            <div style={{"height":'60px'}}></div>
          </Row>
          <NotificationSystem
            dismissible={false}
            ref={notificationSystem =>
              (this.notificationSystem = notificationSystem)
            }
            style={NOTIFICATION_SYSTEM_STYLE}
          />       
        </Page>
      );
    }else if(this.state.level===4 && this.state.bet.length!==0 && this.state.reload===false){
      console.log(this.state.bet);
      if(this.state.redirectToLogin)
        return (<Redirect to="/login" />);
      var count_down_color;
      if(this.state.time<=30000)
        count_down_color="red";
      else
        count_down_color="black";
      var number_amounts=[];
      for(var kkk=0;kkk<4;kkk++)
        number_amounts[kkk]=[0,0,0,0,0,0,0,0,0,0,0,0,0];
      var price_predict=[0,0,0,0];
      var budget_predict=[0,0,0,0];
      var top_budget_num=[],top_budget=[],low_budget=[],low_budget_num=[];
      for(var iii=0;iii<4;iii++){
        
        for(var i=0;i<this.state.bet[iii].length;i++){
          for(var k=0;k<13;k++){
            console.log(this.state.bet[iii][i]);
            number_amounts[iii][k]+=parseInt(this.state.bet[iii][i][2][k]);

          }
          
        }
        var tmp_budget,tmp_price;
        for(i=0;i<10;i++){
          if(i%5===0){
            tmp_price=Math.floor(number_amounts[iii][i]*7.82+number_amounts[iii][12]*3.41+number_amounts[iii][11-(i%2)]*0.47);
            tmp_budget=0;
            for(var k=0;k<13;k++)
              tmp_budget+=number_amounts[iii][k];
            tmp_budget=Math.floor(tmp_budget-tmp_price-number_amounts[iii][i]-number_amounts[iii][12]-number_amounts[iii][11-(i%2)]);
          }else if(i%2===0){
            tmp_price=Math.floor(number_amounts[iii][i]*7.82+number_amounts[iii][11]*0.96);
            tmp_budget=0;
            for(k=0;k<13;k++)
              tmp_budget+=number_amounts[iii][k];
            tmp_budget=Math.floor(tmp_budget-tmp_price-number_amounts[iii][i]-number_amounts[iii][11]);
          }else{
            tmp_price=Math.floor(number_amounts[iii][i]*7.82+number_amounts[iii][10]*0.96);
            tmp_budget=0;
            for(k=0;k<13;k++)
              tmp_budget+=number_amounts[iii][k];
            tmp_budget=tmp_budget-tmp_price-number_amounts[iii][i]-number_amounts[iii][10];
          }
          if(i===parseInt(this.state.result)){
            price_predict[iii]=tmp_price;
            budget_predict[iii]=tmp_budget;
          }
          else{
            if(top_budget[iii]===undefined){
              top_budget[iii]=tmp_budget;
              top_budget_num[iii]=i;
            }else{
              if(top_budget[iii]<tmp_budget){
                top_budget[iii]=tmp_budget;
                top_budget_num[iii]=i;
              }          
            }
          }
          if(low_budget[iii]===undefined){
            low_budget[iii]=tmp_budget;
            low_budget_num[iii]=i;
          }else{        
            if(low_budget[iii]>tmp_budget){
              low_budget[iii]=tmp_budget;
              low_budget_num[iii]=i;
            }
          }
        }
      }
      

          
  
      return (
        <Page
          className="EnjoyPage AdminEnjoy"
          title={"Admin panel - Enjoy"}
          breadcrumbs={
             (
              <div style={{'width':'100%'}}>
              <Button color="primary" onClick={this.onAutoMax} style={{"float":"left"}}>{this.state.auto ? 'Manual' : 'Auto'}</Button>
              <Button color="link" onClick={this.onReload} style={{"float":"right"}}><FaSyncAlt /></Button>
              </div>
              )        
            }
        >
          <Row>
            <Col md="12" sm="12" xs="12">
              <Button className={this.state.level===4 && "btn-active"} color="link" onClick={this.onCategoryClick(4)}>All</Button>
              <Button className={this.state.level===0 && "btn-active"} color="link" onClick={this.onCategoryClick(0)}>Star</Button>
              <Button className={this.state.level===1 && "btn-active"} color="link" onClick={this.onCategoryClick(1)}>Parity</Button>
              <Button className={this.state.level===2 && "btn-active"} color="link" onClick={this.onCategoryClick(2)}>Sapre</Button>
              <Button className={this.state.level===3 && "btn-active"} color="link" onClick={this.onCategoryClick(3)}>Bcone</Button>
            </Col>
          </Row>
          <Row>
            <Col md="12" sm="12" xs="12">
              <Card className="mb-3">
                <CardHeader>Count Down : <span style={{'color':count_down_color}}>{parseInt(this.state.time/1000/60)+" : "+ parseInt((this.state.time/1000)%60)}</span></CardHeader>
                  <CardBody>
                    
                    <Row>
                      <h4>Lucy</h4>
                      {
                        number_amounts[0].map((ele,key)=>(
                          key<10 ?
                          (
                            
                            <Col md={3} sm={6} xs={6} key={key} onClick={this.onPostResult(key)} className='number-line'>
                              {key}{' '}&nbsp;&nbsp;{key%2===1 ? (<span className="green-circle"></span>) : (<span className="red-circle"></span>)}{' '}&nbsp;&nbsp;{key%5===0 ? (<span className="violet-circle"></span>) : ''}&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;{' '} {ele}
                            </Col>
                          ) : (
                            key===10 ? (
                              <Col md={3} sm={6} xs={6} key={key} onClick={this.onPostResult(key)} className='number-line'>
                                <span className="green-circle"></span>{' '}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;{' '} {ele}
                              </Col>
                            ) : (
                              key===11 ? (
                                <Col md={3} sm={6} xs={6} key={key} onClick={this.onPostResult(key)} className='number-line'>
                                  <span className="red-circle"></span>{' '}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;{' '} {ele}
                                </Col>
                              ) : (
                                <Col md={3} sm={6} xs={6} key={key} onClick={this.onPostResult(key)} className='number-line'>
                                  <span className="violet-circle"></span>{' '}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;{' '} {ele}
                                </Col>
                              )
                            )                          
                          )
                        ))
                      }
                        
                    </Row>
                    <Row>
                      <Col md={12} sm={12} xs={12}>
                      Current Result:&nbsp;{this.state.result[0]} 
                      </Col>
                      <Col md={6} sm={6} xs={6}>
                      Price Predict:&nbsp;{price_predict[0]} 
                      </Col>
                      <Col md={6} sm={6} xs={6}>
                      Profit Predict:&nbsp;{budget_predict[0]} 
                      </Col>
                      <Col md={6} sm={6} xs={6}>
                      Top Profit:&nbsp;{top_budget[0]} 
                      </Col>
                      <Col md={6} sm={6} xs={6} className='number-line'>
                      Top Profit Number:&nbsp;{top_budget_num[0]} 
                      </Col>
                      <Col md={6} sm={6} xs={6}>
                      Lowest Profit:&nbsp;{low_budget[0]} 
                      </Col>
                      <Col md={6} sm={6} xs={6}>
                      Lowest Profit Number:&nbsp;{low_budget_num[0]} 
                      </Col>
                        
                    </Row>
                  
                    <Row>
                      <h4>Parity</h4>
                      {
                        number_amounts[1].map((ele,key)=>(
                          key<10 ?
                          (
                            
                            <Col md={3} sm={6} xs={6} key={key} onClick={this.onPostResult(key)} className='number-line'>
                              {key}{' '}&nbsp;&nbsp;{key%2===1 ? (<span className="green-circle"></span>) : (<span className="red-circle"></span>)}{' '}&nbsp;&nbsp;{key%5===0 ? (<span className="violet-circle"></span>) : ''}&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;{' '} {ele}
                            </Col>
                          ) : (
                            key===10 ? (
                              <Col md={3} sm={6} xs={6} key={key} onClick={this.onPostResult(key)} className='number-line'>
                                <span className="green-circle"></span>{' '}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;{' '} {ele}
                              </Col>
                            ) : (
                              key===11 ? (
                                <Col md={3} sm={6} xs={6} key={key} onClick={this.onPostResult(key)} className='number-line'>
                                  <span className="red-circle"></span>{' '}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;{' '} {ele}
                                </Col>
                              ) : (
                                <Col md={3} sm={6} xs={6} key={key} onClick={this.onPostResult(key)} className='number-line'>
                                  <span className="violet-circle"></span>{' '}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;{' '} {ele}
                                </Col>
                              )
                            )                          
                          )
                        ))
                      }
                        
                    </Row>
                    <Row>
                      <Col md={12} sm={12} xs={12}>
                      Current Result:&nbsp;{this.state.result[1]} 
                      </Col>
                      <Col md={6} sm={6} xs={6}>
                      Price Predict:&nbsp;{price_predict[1]} 
                      </Col>
                      <Col md={6} sm={6} xs={6}>
                      Profit Predict:&nbsp;{budget_predict[1]} 
                      </Col>
                      <Col md={6} sm={6} xs={6}>
                      Top Profit:&nbsp;{top_budget[1]} 
                      </Col>
                      <Col md={6} sm={6} xs={6}  className='number-line'>
                      Top Profit Number:&nbsp;{top_budget_num[1]} 
                      </Col>
                      <Col md={6} sm={6} xs={6}>
                      Lowest Profit:&nbsp;{low_budget[1]} 
                      </Col>
                      <Col md={6} sm={6} xs={6}>
                      Lowest Profit Number:&nbsp;{low_budget_num[1]} 
                      </Col>
                        
                    </Row>
                  
                    <Row>
                      <h4>Sapre</h4>
                      {
                        number_amounts[2].map((ele,key)=>(
                          key<10 ?
                          (
                            
                            <Col md={3} sm={6} xs={6} key={key} onClick={this.onPostResult(key)} className='number-line'>
                              {key}{' '}&nbsp;&nbsp;{key%2===1 ? (<span className="green-circle"></span>) : (<span className="red-circle"></span>)}{' '}&nbsp;&nbsp;{key%5===0 ? (<span className="violet-circle"></span>) : ''}&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;{' '} {ele}
                            </Col>
                          ) : (
                            key===10 ? (
                              <Col md={3} sm={6} xs={6} key={key} onClick={this.onPostResult(key)} className='number-line'>
                                <span className="green-circle"></span>{' '}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;{' '} {ele}
                              </Col>
                            ) : (
                              key===11 ? (
                                <Col md={3} sm={6} xs={6} key={key} onClick={this.onPostResult(key)} className='number-line'>
                                  <span className="red-circle"></span>{' '}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;{' '} {ele}
                                </Col>
                              ) : (
                                <Col md={3} sm={6} xs={6} key={key} onClick={this.onPostResult(key)} className='number-line'>
                                  <span className="violet-circle"></span>{' '}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;{' '} {ele}
                                </Col>
                              )
                            )                          
                          )
                        ))
                      }
                        
                    </Row>
                    <Row>
                      <Col md={12} sm={12} xs={12}>
                      Current Result:&nbsp;{this.state.result[2]} 
                      </Col>
                      <Col md={6} sm={6} xs={6}>
                      Price Predict:&nbsp;{price_predict[2]} 
                      </Col>
                      <Col md={6} sm={6} xs={6}>
                      Profit Predict:&nbsp;{budget_predict[2]} 
                      </Col>
                      <Col md={6} sm={6} xs={6}>
                      Top Profit:&nbsp;{top_budget[2]} 
                      </Col>
                      <Col md={6} sm={6} xs={6} className='number-line'>
                      Top Profit Number:&nbsp;{top_budget_num[2]} 
                      </Col>
                      <Col md={6} sm={6} xs={6}>
                      Lowest Profit:&nbsp;{low_budget[2]} 
                      </Col>
                      <Col md={6} sm={6} xs={6}>
                      Lowest Profit Number:&nbsp;{low_budget_num[2]} 
                      </Col>
                        
                    </Row>
                  
                    <Row>
                      <h4>Becone</h4>
                      {
                        number_amounts[3].map((ele,key)=>(
                          key<10 ?
                          (
                            
                            <Col md={3} sm={6} xs={6} key={key} onClick={this.onPostResult(key)} className='number-line'>
                              {key}{' '}&nbsp;&nbsp;{key%2===1 ? (<span className="green-circle"></span>) : (<span className="red-circle"></span>)}{' '}&nbsp;&nbsp;{key%5===0 ? (<span className="violet-circle"></span>) : ''}&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;{' '} {ele}
                            </Col>
                          ) : (
                            key===10 ? (
                              <Col md={3} sm={6} xs={6} key={key} onClick={this.onPostResult(key)} className='number-line'>
                                <span className="green-circle"></span>{' '}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;{' '} {ele}
                              </Col>
                            ) : (
                              key===11 ? (
                                <Col md={3} sm={6} xs={6} key={key} onClick={this.onPostResult(key)} className='number-line'>
                                  <span className="red-circle"></span>{' '}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;{' '} {ele}
                                </Col>
                              ) : (
                                <Col md={3} sm={6} xs={6} key={key} onClick={this.onPostResult(key)} className='number-line'>
                                  <span className="violet-circle"></span>{' '}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;{' '} {ele}
                                </Col>
                              )
                            )                          
                          )
                        ))
                      }
                        
                    </Row>
                    <Row>
                      <Col md={12} sm={12} xs={12}>
                      Current Result:&nbsp;{this.state.result[3]} 
                      </Col>
                      <Col md={6} sm={6} xs={6}>
                      Price Predict:&nbsp;{price_predict[3]} 
                      </Col>
                      <Col md={6} sm={6} xs={6}>
                      Profit Predict:&nbsp;{budget_predict[3]} 
                      </Col>
                      <Col md={6} sm={6} xs={6}>
                      Top Profit:&nbsp;{top_budget[3]} 
                      </Col>
                      <Col md={6} sm={6} xs={6} className='number-line'>
                      Top Profit Number:&nbsp;{top_budget_num[3]} 
                      </Col>
                      <Col md={6} sm={6} xs={6}>
                      Lowest Profit:&nbsp;{low_budget[3]} 
                      </Col>
                      <Col md={6} sm={6} xs={6}>
                      Lowest Profit Number:&nbsp;{low_budget_num[3]} 
                      </Col>
                        
                    </Row>
                  
                  
                    
                  </CardBody>
                </Card>
            </Col>
          </Row>
          <Row>
            <div style={{"height":'60px'}}></div>
          </Row>
          <NotificationSystem
            dismissible={false}
            ref={notificationSystem =>
              (this.notificationSystem = notificationSystem)
            }
            style={NOTIFICATION_SYSTEM_STYLE}
          />       
        </Page>
      );
    } 
  else{
    return (
      <Page
          className="EnjoyPage"
          title={"Admin panel - Enjoy"}
  
        >
          <Row>
            <Col md="12" sm="12" xs="12">
              <Button className={this.state.level===4 && "btn-active"} color="link" onClick={this.onCategoryClick(4)}>All</Button>
              <Button className={this.state.level===0 && "btn-active"} color="link" onClick={this.onCategoryClick(0)}>Lucy</Button>
              <Button className={this.state.level===1 && "btn-active"} color="link" onClick={this.onCategoryClick(1)}>Parity</Button>
              <Button className={this.state.level===2 && "btn-active"} color="link" onClick={this.onCategoryClick(2)}>Sapre</Button>
              <Button className={this.state.level===3 && "btn-active"} color="link" onClick={this.onCategoryClick(3)}>Becone</Button>
            </Col>
          </Row>
          <Row>
            <PageSpinner />
          </Row>
          <NotificationSystem
            dismissible={false}
            ref={notificationSystem =>
              (this.notificationSystem = notificationSystem)
            }
            style={NOTIFICATION_SYSTEM_STYLE}
          />       
        </Page>
    )
  }
}
 
}

export default AdminEnjoyPage;
