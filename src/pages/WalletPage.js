import React, { useState } from 'react';
import PageSpinner from '../components/PageSpinner';
import { Redirect, Link } from 'react-router-dom';
import { stateSetter } from '../components/Service';
import {
  Row,
  Col,
  Card,
  Button as ReactStrapButton,
  CardHeader,
  CardBody,
  Table,
  Modal,
  ModalBody,
  ModalFooter, ButtonGroup,
  ModalHeader
} from 'reactstrap';
import Button from 'components/Button';
import Snackbar from "components/Snackbar.js";
import Page from 'components/Page';
import WithdrawlPage from 'pages/WithdrawlPage';
import RechargePage from 'pages/RechargePage';
import {
  MdReportProblem
} from 'react-icons/md';
import StyledTab from "components/StyledTab";
import StyledTabs from "components/StyledTabs";
import TabPanel from "components/TabPanel";





const WalletPage = (props) => {
  console.log(props);
  const [readModal, setReadModal]=useState(false);
  const [errorStatus, setErrorStatus]=useState(false);
  const [errorMessage, setErrorMessage]=useState('');
  const [tab, setTab] = React.useState((props.match.params.param && props.match.params.param=="withdraw") ? 1 : 0);
  const handleChange = (event, newValue) => {
    setTab(newValue);
  };
  return (
    <Page
      className="walletPage"
      title={(
        <div className="header-userinfo">
          <img src={`/uploads/avatars/${props.auth.user.avatar ? props.auth.user.id + ".jpg" : "user.png"}`} />
          <div>
            <span className="header-nickname">{props.auth.user.nickname}</span>
            <span className="header-balance"><small>₹</small>{props.auth.user.budget}</span>
          </div>
        </div>
      )}
      breadcrumbs={
        (
          <div className="header-buttons">
            <Button component="a" size="sm" style={{ "float": "right" }}
              color="info" onClick={()=>setReadModal(true)}>
              Rules
            </Button>
          </div>
        )
      }
    >
      <Modal
        isOpen={readModal}
        toggle={()=>setReadModal(!readModal)}>
        <ModalHeader toggle={()=>setReadModal(!readModal)}>Rule</ModalHeader>
        <ModalBody>
          <Row className={'read-rule'} style={{ margin: "0 10px" }}>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={()=>setReadModal(!readModal)} >
            Ok
          </Button>
        </ModalFooter>
      </Modal>
      
      <br />
      <StyledTabs variant="fullWidth" value={tab} onChange={handleChange} aria-label="styled tabs example">
        <StyledTab label="Recharge" />
        <StyledTab label="Withdraw" />
      </StyledTabs>
      <TabPanel value={tab} index={0}>
        <RechargePage auth={props.auth} />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <WithdrawlPage auth={props.auth} />
      </TabPanel>

      <Snackbar
        place="tr"
        color="danger"
        icon={MdReportProblem}
        message={errorMessage}
        open={errorStatus}
        closeNotification={() => setErrorStatus(false)}
        close
      />
    </Page>
  );
}

export default WalletPage;
