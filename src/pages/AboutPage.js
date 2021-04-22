import Page from 'components/Page';
import React,{useState} from 'react';
import {
  Button,
  Card,
  CardBody,
  Col,
  Form,
  FormGroup,
  Input,
  Row,  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Collapse
} from 'reactstrap';
import {MdContactMail,MdContactPhone,MdAccountBox,MdSupervisorAccount} from 'react-icons/md';
import {
  FaSignOutAlt,FaThList,
  FaUserEdit,FaListAlt,FaCreditCard,FaShoppingBasket,FaWallet, FaBuilding,FaShieldAlt, FaDownload,FaStickyNote,FaInfoCircle
} from 'react-icons/fa';
import {Link} from 'react-router-dom';
import Typography from '../components/Typography';
import bn from 'utils/bemnames';
const bem = bn.create('page');
const AboutPage = (props) => {  
  
  return (
    <Page title={(<Typography type="h4" className={bem.e('title')}><MdContactMail /> About</Typography>)} className="MyPage"  >
      <Row>       
        
        <Col xl={12} lg={12} md={12}>
        
          <Link className={'form-control'}  color="link" to="/my/aboutUs"  ><MdContactMail className='mr-3' style={{fontSize:'1.2rem'}} /> About Us</Link>
          <Link className={'form-control'}  color="link" to="/my/contact"  ><MdContactPhone className='mr-3' style={{fontSize:'1.2rem'}} /> Contact Us</Link>
          <Link className={'form-control'}  color="link" to="/my/terms"  ><FaThList className='mr-3' style={{fontSize:'1.2rem'}} /> Terms and Condition</Link>
          <Link className={'form-control'}  color="link" to="/my/policy"  ><MdAccountBox className='mr-3' style={{fontSize:'1.2rem'}} /> Privacy policies</Link>
          <Link className={'form-control'}  color="link" to="/my/refund"  ><MdSupervisorAccount className='mr-3' style={{fontSize:'1.2rem'}} /> Refund policies</Link>

        </Col>
      
        
      </Row>
      <Row>
            <div style={{"height":'100px'}}></div>
          </Row>
      
    </Page>
  );
};

export default AboutPage;
