import Page from 'components/Page';
import React from 'react';
import {
  Col,
  Row} from 'reactstrap';
import {
  FaArrowCircleLeft} from 'react-icons/fa';
import {Link} from 'react-router-dom';
import Typography from '../components/Typography';
import bn from 'utils/bemnames';
const bem = bn.create('page');
const AddressPage = () => {
  
  return (
    <Page title={(<Link to="/my"><Typography type="h4" className={bem.e('title')}><FaArrowCircleLeft /> Address</Typography></Link>)} className="MyPage"  >

      <Row>       
        
        <Col xl={12} lg={12} md={12}>
        
        
        </Col>
     
        
      </Row>
    </Page>
  );
};

export default AddressPage 
