import Page from 'components/Page';
import React, { useState, useEffect } from 'react';
import {
  Button,
  Col,
  Row,
} from 'reactstrap';
import {
  FaArrowCircleLeft, FaRegCheckCircle, FaRegTimesCircle
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Typography from '../components/Typography';
import bn from 'utils/bemnames';
import StyledTab from "components/StyledTab";
import StyledTabs from "components/StyledTabs";
import { Pagination, PaginationItem } from '@material-ui/lab';
const bem = bn.create('page');
const PromotionListPage = (props) => {
  const [bonus, setBonus] = useState('');
  const [page, setPage] = useState(1);
  const [last, setLast] = useState(1);
  const [tab, setTab] = React.useState(0);
  const handleChange = (event, newValue) => {
    setTab(newValue);
    setPage(1);
  };
  useEffect(() => {
    (async () => {
      const response = await fetch("/api/bonus/"+(tab == 0 ? 1 : 11)+"/" + page, {
        "method": "GET",
        "headers": {
          "content-type": "application/json",
          "Authorization": JSON.parse(localStorage.getItem('auth')).userToken
        }
      });
      if (response.status == 401)
        props.history.push('/login');
      try {
        if (response.status < 400) {
          const data = await response.json();
          setBonus(data.data);
          setPage(parseInt(data.page));
          setLast(parseInt(data.last_page));
        }

      } catch (err) {

      }

    })();
  }, [page,tab]);
  return (
    <Page title={(<Link to="/promotion"><Typography type="h4" className={bem.e('title')}><FaArrowCircleLeft /> Promotion List</Typography></Link>)} className="MyPage"  >
      <StyledTabs variant="fullWidth" value={tab} onChange={handleChange} aria-label="styled tabs example">
        <StyledTab label="Level 1" value={0} />
        <StyledTab label="Level 2" value={1} />
      </StyledTabs>
      <br />
      <Row>

        <Col xl={12} lg={12} md={12}>
          {
            bonus ? bonus.map((ele, key) => (
              <div key={key} style={{ clear:'both',height:'60px',padding: '2px 5px', border: '1px solid #aaa', margin: '1px 2px', fontSize: '0.9rem' }} className='form-control'>
                <span style={{ float: 'left', fontSize: '2rem' }}>
                  {ele.applied ? (<FaRegCheckCircle style={{ color: "green" }} />) : (<FaRegTimesCircle style={{ color: "red" }} />)}
                </span>
                <span className='ml-2 mt-2' style={{ fontSize: '1.1rem', fontWeight: '400' }}>₹ {ele.money}{' '} {ele.applied ? 'Applied' : 'Not applied'}</span>
                <br />
                <span className='ml-2'> {ele.createdAt} </span>
              </div>
            )) : ""
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

export default PromotionListPage 
