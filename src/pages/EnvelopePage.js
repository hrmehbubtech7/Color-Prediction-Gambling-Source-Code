import Page from 'components/Page';
import React, { useState, useEffect } from 'react';
import {
  Button,
  Col,
  Input,
  Label,
  Row,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,

} from 'reactstrap';
import {
  FaArrowCircleLeft, MdWarning, MdAccountBalanceWallet
} from 'react-icons/fa';
import { MdMonetizationOn } from 'react-icons/md';
import { Link } from 'react-router-dom';
import Typography from '../components/Typography';
import bn from 'utils/bemnames';
const bem = bn.create('page');
const EnvelopePage = (props) => {
  const token = JSON.parse(localStorage.getItem('auth'));
  const [envelope, setEnvelope] = useState('');
  const [envelopeModal, setEnvelopeModal] = useState(false);
  const [succeed, setSucceed] = useState(false);
  const [failed, setFailed] = useState(false);
  const [amount, setAmount] = useState(0);
  useEffect(() => {
    console.log(props.match.params.id);
    fetch("/api/red-envelope-existed/" + props.match.params.id, {
      "method": "GET",
      "headers": {
        "content-type": "application/json",
        "Authorization": token.userToken
      }
    })
      .then(response => {
        if (response.status < 400) {
          response.json().then(res => {
            setEnvelope(res.envelope);
            setEnvelopeModal(true);
          });
        } else {
          props.history.push('/');
        }
      }).catch(err => {
        props.history.push('/');
      });
  }, [])
  const enveloped = () => {
    fetch("/api/red-envelope/" + props.match.params.id, {
      "method": "GET",
      "headers": {
        "content-type": "application/json",
        "Authorization": token.userToken
      }
    })
      .then(response => {
        setEnvelopeModal(false);
        if (response.status < 400) {
          response.json().then(res => {
            setSucceed(true);
            setAmount(res.message);
          }).catch(err => {
            setFailed(true);
          });
        } else {
          setFailed(true);
        }
      });
  }
  return (
    <Page title={(<Link to="/"><Typography type="h4" className={bem.e('title')}><FaArrowCircleLeft /> Red Envelope</Typography></Link>)} className="MyPage"  >
      <Modal
        isOpen={envelopeModal}
        toggle={() => setEnvelopeModal(!envelopeModal)}
      >
        <ModalHeader toggle={() => setEnvelopeModal(!envelopeModal)}></ModalHeader>
        {
          (envelope) ? (
            <ModalBody>
              <Row>
                <img onClick={enveloped} src="/img/envelope.jpg" style={{ width: '100%' }} />
                <h4 className="text-warning" style={{ margin: "auto auto" }}><small>₹ </small>{
                  envelope.amount
                }       </h4>
              </Row>
              <Row>
                <div style={{ height: "150px", overflow: "auto", margin: "5px 20px", padding: '10px', width: "100%", border: "1px solid green" }}>
                  <h5 className="text-danger">Awarded List</h5>
                  {
                    envelope.awarding.map((ele, key) => (
                      <div key={key} style={{}}>
                        <img src="/img/user.jpg" style={{ width: '20px', marginRight: "10px" }} /> {ele.phone}
                      </div>
                    ))
                  }
                </div>
              </Row>


            </ModalBody>
          ) : ''
        }

      </Modal>
      <Modal
        isOpen={succeed}
        toggle={() => setSucceed(!succeed)}
      >
        <ModalHeader toggle={() => setSucceed(!succeed)}></ModalHeader>
        <ModalBody>
          <Row>
            <img onClick={() => props.history.push('/')} src="/img/succeed.jpg" style={{ width: '100%' }} />
            <div style={{ color: "#00FF00", position: "absolute", top: "200px", left: "calc(50% - 50px)" }}>
              <h5 style={{ fontWeight: "600" }}>
                Rewarded
              </h5>
              <h2 style={{ fontWeight: "800" }}>Rs. {amount}</h2>

            </div>
          </Row>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={failed}
        toggle={() => setFailed(!failed)}
      >
        <ModalHeader toggle={() => setFailed(!failed)}></ModalHeader>
        <ModalBody>
          <Row>
            <img onClick={() => props.history.push('/')} src="/img/failed.jpg" style={{ width: '100%' }} />

          </Row>
        </ModalBody>
      </Modal>
    </Page>
  );
};

export default EnvelopePage 
