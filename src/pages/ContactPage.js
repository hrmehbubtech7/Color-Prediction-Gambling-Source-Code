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
const PolicyPage = () => {
  
  return (
    <Page title={(<Link to="/my/about"><Typography type="h4" className={bem.e('title')}><FaArrowCircleLeft /> Contact us</Typography></Link>)} className="MyPage"  >

      <Row>       
        
        <Col xl={12} lg={12} md={12} >
        <div style={{padding:"10px 10px"}}>
          <p>
            Email: gurjeetloveall@gmail.com
          </p>
          <p>
            Phone:7617712351
          </p>
          <p>          
            Bada bazar pilibhit up
          </p>
        </div>
        </Col>
     
        
      </Row>
    </Page>
  );
};

export default PolicyPage 
