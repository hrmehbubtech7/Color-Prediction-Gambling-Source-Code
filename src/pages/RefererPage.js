import Page from 'components/Page';
import React,{useState,useEffect} from 'react';
import {
  Button,
  Col,
  Row} from 'reactstrap';
import {
  FaArrowCircleLeft} from 'react-icons/fa';
import {Link} from 'react-router-dom';
import Typography from '../components/Typography';
import {MdPersonPin} from 'react-icons/md';
import bn from 'utils/bemnames';
import StyledTab from "components/StyledTab";
import StyledTabs from "components/StyledTabs";
import { Pagination, PaginationItem } from '@material-ui/lab';
const bem = bn.create('page');
const RefererPage = (props) => {
  const [bonus,setBonus]=useState('');
  const [page, setPage] = useState(1);
  const [last, setLast] = useState(1);
  const [tab, setTab] = React.useState(0);
  const handleChange = (event, newValue) => {
    setTab(newValue);
    setPage(1);
  };
  useEffect(()=>{
    (async ()=>{
      const response=await fetch("/api/refered/"+page+"/"+tab, {
        "method": "GET",
        "headers": {
          "content-type": "application/json",
          "Authorization":JSON.parse(localStorage.getItem('auth')).userToken
        }
      });
      if(response.status==401)
        props.history.push('/login');
      const bonus1=await response.json();
      await setBonus(bonus1.data);
      setPage(parseInt(bonus1.page));
      setLast(parseInt(bonus1.last_page));
     
    })();
  },[page,tab]);
  
  return (
    <Page title={(<Link to="/promotion"><Typography type="h4" className={bem.e('title')}><FaArrowCircleLeft /> Referrer</Typography></Link>)} className="MyPage"  >
      <StyledTabs variant="fullWidth" value={tab} onChange={handleChange} aria-label="styled tabs example">
        <StyledTab label="Level 1" value={0} />
        <StyledTab label="Level 2" value={1} />
      </StyledTabs>
      <br />
      <Row>       
        
        <Col xl={12} lg={12} md={12}>
        {
          bonus && bonus.map(ele=>(
            <div style={{height:'60px',padding:'2px 5px',border:'1px solid #aaa',margin:'1px 2px',fontSize:'0.9rem'}}  className='form-control'  >
                <span style={{fontSize:'2rem'}}>
                 <MdPersonPin />
                </span>
                <span style={{fontSize:'1.2rem'}}>{ele}</span>
              </div>
          )) 
          
        }
        
        </Col>
     
        
     
        
      </Row>
      <Row>
        <Pagination color="primary" count={last}
          page={page} onChange={(e, v) => setPage(v)}
          renderItem={(item) => <PaginationItem component="a" {...item} />} size="small" />
      </Row>
      <Row>
        <div style={{ "height": '60px' }}></div>
      </Row>
    </Page>
  );
};

export default RefererPage 
