import Page from 'components/Page';
import React, { useState, useEffect } from 'react';
import {
  Button as ReactStrapButton,
  Col,
  Row
} from 'reactstrap';
import {
  FaArrowCircleLeft,
  FaBars
} from 'react-icons/fa';
import { MdReportProblem, MdCheckCircle } from 'react-icons/md';
import { Link } from 'react-router-dom';
import Typography from '../components/Typography';
import bn from 'utils/bemnames';
import StyledTab from "components/StyledTab";
import StyledTabs from "components/StyledTabs";
import Button from 'components/Button';
import Snackbar from "components/Snackbar.js";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {ImMenu3} from "react-icons/im";
const bem = bn.create('page');

const PromotionPage = (props) => {
  const [tab, setTab] = React.useState(0);
  const handleChange = (event, newValue) => {
    setTab(newValue);
  };
  const [bonus, setBonus] = useState('');
  const [errorMessage, setErrorMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/bonus/" + (tab == 0 ? 0 : 10), {
        "method": "GET",
        "headers": {
          "content-type": "application/json",
          "Authorization": JSON.parse(localStorage.getItem('auth')).userToken
        }
      });
      if (response.status == 401)
        props.history.push('/login');
      const bonus1 = await response.json();
      await setBonus(bonus1);

    })();
  }, [tab]);
  const copyLink = () => {
    const tmp_tag = document.createElement("input");
    tmp_tag.value = `${process.env.REACT_APP_SOURCE_URL}/signup/${bonus.ref_code}`;
    document.body.appendChild(tmp_tag);
    tmp_tag.select();
    document.execCommand("copy");
    document.body.removeChild(tmp_tag);
    setSuccessMessage("Promotion Link copied.")
  };
  const apply = () => {
    if (parseInt(bonus.total) < 100)
      setErrorMessage('Less than ₹ 100');
    else
      (async () => {
        try {
          const response = await fetch("/api/apply/" + (tab == 0 ? 0 : 10), {
            "method": "post",
            "headers": {
              "content-type": "application/json",
              "Authorization": JSON.parse(localStorage.getItem('auth')).userToken
            }
          });
          await setBonus({ ...bonus, total: 0, count: 0 });
        } catch (err) {
          setErrorMessage('Failed');
        }


      })();
  }
  return (
    <Page title={(<><Link to="/account"><Typography type="h4" className={bem.e('title')}><FaArrowCircleLeft /> Promotion</Typography></Link>
      <div>
        <Button simple aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} color="info" style={{padding:"12px 10px"}}>
         <ImMenu3 />
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={()=>props.history.push("/promotionList")}>Promotion List</MenuItem>
          <MenuItem onClick={()=>props.history.push("/apply")}>Applied List</MenuItem>
          <MenuItem onClick={()=>props.history.push("/referers")}>Referrers List</MenuItem>
        </Menu>
      </div>
    </>)} className="MyPage"
    >

      <StyledTabs variant="fullWidth" value={tab} onChange={handleChange} aria-label="styled tabs example">
        <StyledTab label="Level 1" />
        <StyledTab label="Level 2" />
      </StyledTabs>
      <br />
      <Row>

        <Col md={12} style={{ textAlign: 'center' }} className={'mt-3'}>
          <div style={{ display: 'inline-block' }}>Total People
          <br />
            <span>
              {bonus && bonus.count}</span>
          </div>
          <div style={{ display: 'inline-block' }} className={'ml-5'}>Contribution
          <br />
            <span style={{ color: "#f90" }}>
              ₹ {bonus && bonus.total}
            </span>
          </div>
        </Col>
        <Col md={12} style={{ textAlign: 'center' }} className={'mt-3'}>
          <ReactStrapButton onClick={apply} color="success"> Apply </ReactStrapButton>
        </Col>
        <Col md={12} className={'mt-4 ml-3 mr-3'} >
          My Promotion Code
          <span style={{ float: 'right', textDecoration: 'underline' }} className={'mr-5'}>&nbsp;&nbsp;&nbsp;{bonus.ref_code}&nbsp;&nbsp;&nbsp;</span>
        </Col>
        <Col md={12} className={'mt-4 ml-3 mr-3'} >
          My Promotion Link
          <span style={{ float: 'right', textDecoration: 'underline', color: "#6a82fb" }} className={'mr-5'}> {process.env.REACT_APP_SOURCE_URL}/signup/{bonus.ref_code} </span>
        </Col>
        <Col md={12} style={{ textAlign: 'center' }} className={'mt-3'}>
          <Button simple color="success" onClick={copyLink} style={{ fontWeight: '500' }} > Copy Link </Button>
        </Col>
      </Row>
      <Row>
        <div style={{ "height": '60px' }}></div>
      </Row>
      <Snackbar
        place="tr"
        color="danger"
        icon={MdReportProblem}
        message={errorMessage}
        open={errorMessage}
        closeNotification={() => setErrorMessage(false)}
        close
      />
      <Snackbar
        place="tr"
        color="success"
        icon={MdCheckCircle}
        message={successMessage}
        open={successMessage}
        closeNotification={() => setSuccessMessage(false)}
        close
      />
    </Page>
  );
};

export default PromotionPage 
