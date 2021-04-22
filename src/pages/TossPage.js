import React from 'react';
import PageSpinner from '../components/PageSpinner';
import { Redirect, Link } from 'react-router-dom';
import { stateSetter } from '../components/Service';
import AnimatedNumber from "animated-number-react";
import {
  Row,
  Col,
  Button as ReactStrapButton,
  Card,
  CardHeader,
  CardBody,
  Table,
  Modal,
  ModalBody,
  ModalFooter, ButtonGroup,
  ModalHeader, Pagination, PaginationItem, PaginationLink
} from 'reactstrap';
import Page from 'components/Page';
import Button from 'components/Button';
import Snackbar from "components/Snackbar.js";

import Coin from 'components/Coin';
import {
  GiThumbDown,
  GiThumbUp,
} from 'react-icons/gi';
import {

  MdWarning
} from 'react-icons/md';
class TossPage extends React.Component {
  constructor(props) {
    super(props);
    this.setter = stateSetter(this);
    console.log(props.location.state);
  }
  componentWillUnmount() {
    this.setter.cancel();
  }
  state = {
    heads_count: 0,
    tails_count: 0,
    select: 0,
    amount: 0,
    heads: 0,
    tails: 0,
    result: 0,
    profit: 0,
    modal: false,
    redirectToLogin: false,
    status: false,
    wallet: 0,
  };
  componentDidMount() {
    fetch("/api/toss", {
      "method": "GET",
      "headers": {
        "content-type": "application/json",
        "Authorization": this.props.auth.userToken
      }
    })
      .then(response => {
        if (response.status < 400) {
          response.json().then(res => {
            // console.log(res);

            this.setter.setState({
              heads_count: res.heads,
              heads_count: res.tails,
              wallet: res.wallet,
              heads_count: res.heads_count,
              tails_count: res.tails_count,
            });
          });

        } else {
          this.setter.setState({
            redirectToLogin: true
          })
        }
      });
  }

  onButtonClick = num => () => {
    this.setter.setState({
      select: num,
      amount: 10
    });
    // console.log(num);
    return this.toggle()();
  };
  toggle = modalType => () => {
    if (!modalType) {
      return this.setter.setState({
        modal: !this.state.modal,
      });
    }
  };
  onContractChange = num => () => {
    if (num === "+") {
      if (this.refs.contract.innerHTML === '9')
        return;
      this.refs.contract.innerHTML = parseInt(this.refs.contract.innerHTML) + 1;
    } else if (num === "-") {
      if (this.refs.contract.innerHTML === '1')
        return;
      this.refs.contract.innerHTML = parseInt(this.refs.contract.innerHTML) - 1;
    }
    else {
      this.setter.setState({
        amount: parseInt(this.refs.contract.innerHTML) * parseInt(num)
      });
      return;
    }
    if (this.state.amount >= 10000) {
      this.setter.setState({
        amount: parseInt(this.refs.contract.innerHTML) * 10000
      });
    } else if (this.state.amount >= 1000) {
      this.setter.setState({
        amount: parseInt(this.refs.contract.innerHTML) * 1000
      });
    }
    else if (this.state.amount >= 100) {
      this.setter.setState({
        amount: parseInt(this.refs.contract.innerHTML) * 100
      });
    }
    else if (this.state.amount >= 10) {
      //const aa=parseInt(this.refs.contract.innerHTML)<3 ? 3 : parseInt(this.refs.contract.innerHTML);
      this.setter.setState({
        amount: parseInt(this.refs.contract.innerHTML) * 10
      });
    }
  };
  onAddAmount = () => {
    if (this.state.select == 0)
      this.setter.setState({
        heads: this.state.heads + this.state.amount,
        modal: !this.state.modal,
      });
    else
      this.setter.setState({
        tails: this.state.tails + this.state.amount,
        modal: !this.state.modal,
      });
  }

  onPostState = () => {
    if (this.state.heads == 0 && this.state.tails == 0)
      return;
    this.setter.setState({
      status: true,
      result: -1
    })
    fetch("/api/toss", {
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "Authorization": this.props.auth.userToken
      },
      body: JSON.stringify({
        heads: this.state.heads,
        tails: this.state.tails
      })

    })
      .then(response => {
        if (response.status < 400) {
          response.json().then(res => {
            // console.log(res);
            if (res.error) {
              this.setState({successMessage:"You got ₹" + res.error});
              this.setter.setState({
                status: false,
                heads: 0,
                tails: 0
              });
            } else {
              this.setter.setState({
                result: res.result,
              });
              setTimeout(() => {
               
                if(res.profit<0){
                  this.setState({errorMessage:"You lost ₹" + (-res.profit)});
                }else{
                  this.setState({successMessage:"You got ₹" + res.profit});
                }
                this.setter.setState({
                  status: false,
                  profit: res.profit,
                  wallet: res.wallet,
                  heads: 0,
                  heads_count: res.heads_count,
                  tails_count: res.tails_count,
                  tails: 0
                });
                this.props.auth.user.budget=res.wallet;
                localStorage.setItem("auth", JSON.stringify(this.props.auth));
              }, 2000);
            }
          });
        } else {
          this.setter.setState({
            redirectToLogin: true
          })
        }
      });

  };

  onRecharge = () => {
    this.props.history.push('/wallet');
    // console.log('recharge');
  }
  render() {
    if (this.state.redirectToLogin)
      return (<Redirect to="/login" />);
    var count_down_color;
    if (this.state.time <= 20000)
      count_down_color = "red";
    else
      count_down_color = "black";
    if (this.state.reload === true) {
      return (
        <PageSpinner />
      );
    }
    else {
      return (
        <Page
        className="EnjoyPage"
        title={(
          <div className="header-userinfo">
            <img src={`/uploads/avatars/${this.props.auth.user.avatar ? this.props.auth.user.id + ".jpg" : "user.png"}`} />
            <div>
              <span className="header-nickname">{this.props.auth.user.nickname}</span>
              <span className="header-balance"><small>₹</small>{this.props.auth.user.budget}</span>
            </div>
          </div>
        )}
        breadcrumbs={
         (
              <div className="header-buttons">
                <Button component="a" size="sm" style={{ "float": "right", marginTop:"-30px" }}
                  color="primary" onClick={() => this.props.history.push("/wallet")}>
                  Recharge
              </Button>
               
              </div>
            )
        }
      >

          <Row>
            <Col md="12" sm="12" xs="12">
              <Card className="mb-3">
                <CardHeader>
                  <div style={{ textAlign: "center" }}>
                    Total bet : {this.state.heads_count + this.state.tails_count}, heads {this.state.heads_count}, tails {this.state.tails_count}
                  </div>
                </CardHeader>
                <CardBody >
                  {
                    (!this.state.status) ? (
                      <Row >
                        <Col lg="6" md="6" sm="6" xs="6" style={{ textAlign: 'center' }}>
                          <Button round color="behance" onClick={this.onButtonClick(0)} style={{ height: "50px", width: "80%", maxWidth: "180px", fontSize: "1rem", fontWeight: "200" }}>
                            <span>Heads</span></Button>
                          <br /><span style={{ color: "darkorange" }}>₹ {this.state.heads}</span>
                        </Col>
                        <Col lg="6" md="6" sm="6" xs="6" style={{ textAlign: 'center' }}>
                          <Button round color="dribbble" onClick={this.onButtonClick(1)} style={{ height: "50px", width: "80%", maxWidth: "180px", fontSize: "1rem", fontWeight: "200" }}>
                            <span>Tails</span></Button>
                          <br /><span style={{ color: "darkorange" }}>₹ {this.state.tails}</span>
                        </Col>
                        <Modal
                          isOpen={this.state.modal}
                          toggle={this.toggle()}
                          className={this.props.className}>
                          <ModalHeader toggle={this.toggle()}>Contract Money on "{this.state.select == 1 ? "Tails" : "Heads"}"</ModalHeader>
                          <ModalBody>
                            <Row>
                              <span style={{ 'padding': '6px 12px' }}>
                                Contract Money :
                              </span>
                              <br />
                              <ButtonGroup className=" mb-3 ml-auto mr-auto">
                                <ReactStrapButton style={{ fontWeight: '600' }} color='link' onClick={this.onContractChange('10')} className={(this.state.amount > 9 && this.state.amount < 100) ? "btn-active" : ''}>10</ReactStrapButton>
                                <ReactStrapButton style={{ fontWeight: '600' }} color='link' onClick={this.onContractChange('100')} className={(this.state.amount > 99 && this.state.amount < 1000) ? "btn-active" : ''}>100</ReactStrapButton>
                                <ReactStrapButton style={{ fontWeight: '600' }} color='link' onClick={this.onContractChange('1000')} className={(this.state.amount > 999 && this.state.amount < 10000) ? "btn-active" : ''}>1000</ReactStrapButton>
                                <ReactStrapButton style={{ fontWeight: '600' }} color='link' onClick={this.onContractChange('10000')} className={(this.state.amount > 9999 && this.state.amount < 100000) ? "btn-active" : ''}>10000</ReactStrapButton>
                              </ButtonGroup>
                            </Row>
                            <Row>
                              <span style={{ 'padding': '10px 12px' }}>
                                Number :
                              </span>
                              <br />
                              <div>
                                <ReactStrapButton color='link' style={{ fontSize: '1.5rem' }} onClick={this.onContractChange('-')}> - </ReactStrapButton>
                                <span style={{ 'padding': '6px 12px' }} ref='contract'>1</span>

                                <ReactStrapButton color='link' style={{ fontSize: '1.5rem' }} onClick={this.onContractChange('+')}> + </ReactStrapButton>
                              </div>

                            </Row>
                            <Row>
                              <span style={{ 'padding': '0 12px' }}>
                                Total contract money is &nbsp;
                              </span>
                              <span style={{ fontWeight: '600' }} className="text-success">{' '}{this.state.amount}</span>
                            </Row>
                          </ModalBody>
                          <ModalFooter>
                            <Button color="primary" onClick={this.onAddAmount}>
                              OK
                            </Button>{' '}
                            <Button onClick={this.toggle()}>
                              Cancel
                            </Button>
                          </ModalFooter>
                        </Modal>
                      </Row>
                    ) : (
                        <Row >
                          <Col lg="6" md="6" sm="6" xs="6" style={{ textAlign: 'center' }}>
                            <Button round  disabled style={{ height: "50px", width: "80%", maxWidth: "180px", fontSize: "1rem", fontWeight: "200" }}>
                              <span>Heads</span></Button>
                              <br /><span style={{ color: "darkorange" }}>₹ {this.state.heads}</span>
                          </Col>
                          <Col lg="6" md="6" sm="6" xs="6" style={{ textAlign: 'center' }}>
                            <Button round  disabled style={{ height: "50px", width: "80%", maxWidth: "180px", fontSize: "1rem", fontWeight: "200" }}>
                              <span>Tails</span></Button>
                              <br /><span style={{ color: "darkorange" }}>₹ {this.state.tails}</span>
                          </Col>
                        </Row>
                      )
                  }
                  <Row>
                    <div style={{ width: "100%", marginLeft: "auto", marginRight: "auto" }}>
                      <Coin side={this.state.result == 0 ? 'heads' : (this.state.result == 1 ? 'tails' : '')} />
                    </div>
                    <br />
                    <Button color="primary" onClick={this.onPostState} style={{ height: "50px", width: "60%", maxWidth: "200px", borderRadius: "20px", fontSize: "20px", fontWeight: "300", marginLeft: "auto", marginRight: "auto" }}>
                      Flip Coin</Button>
                  </Row>
                </CardBody>
              </Card>
            </Col>


          </Row>
          <Row>
            <div style={{ "height": '60px' }}></div>
          </Row>
          <Snackbar
            place="tr"
            color="danger"
            icon={GiThumbDown}
            message={this.state.errorMessage}
            open={this.state.errorMessage}
            closeNotification={() => this.setState({ errorMessage: false })}
            close
          />
          <Snackbar
            place="tr"
            color="success"
            icon={GiThumbUp}
            message={this.state.successMessage}
            open={this.state.successMessage}
            closeNotification={() => this.setState({ successMessage: false })}
            close
          />
        </Page>
      );
    }

  }
}

export default TossPage;
