import Page from 'components/Page';
import React, { useState, useEffect } from 'react';
import {
  Button as ReactStrapButton,
  Card,
  CardBody,
  Col,
  Form,
  FormGroup,
  Input,
  Row, Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  

} from 'reactstrap';
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  FaBoxOpen,
  FaUserEdit, FaCreditCard
} from 'react-icons/fa';
import { GoOrganization, GoShield, GoQuestion, GoSignOut } from "react-icons/go";
import { GiTrophyCup } from "react-icons/gi";
import { Link } from 'react-router-dom';
import Button from 'components/Button';
const MyPage = (props) => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState('');
  const [imageCrop, setImageCrop] = useState({
    src: `/uploads/avatars/${props.auth.user.avatar ? props.auth.user.id + ".jpg" : "user.png"}`,
    crop: { unit: 'px', aspect: 1 / 1, width: 200 },
  });
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const [isOpen1, setIsOpen1] = useState(false);
  const [nickname, setNickname] = useState({ isOpen: false, name: props.auth.user.nickname });
  const toggle1 = () => setIsOpen1(!isOpen1);
  const handleFileChange = (e) => {
    if (e.target.files[0])
      setImageCrop({
        ...imageCrop,
        src: URL.createObjectURL(e.target.files[0])
      })
  };
  const postNickname = () => {
    // console.log(nickname.name);
    (async () => {
      let base64Image;
      if (image) {
        console.log(image);
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = imageCrop.crop.width;
        canvas.height = imageCrop.crop.height;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        console.log(image);
        ctx.drawImage(
          image,
          imageCrop.crop.x * scaleX,
          imageCrop.crop.y * scaleY,
          imageCrop.crop.width * scaleX,
          imageCrop.crop.height * scaleY,
          0,
          0,
          imageCrop.crop.width,
          imageCrop.crop.height
        );

        base64Image = canvas.toDataURL("image/jpeg");
      }
      const data = new FormData();
      data.append("avatar", base64Image);
      data.append('nickname', nickname.name);     


      const response = await fetch("/api/nickname", {
        "method": "POST",
        "headers": {
          "Authorization": props.auth.userToken

        },
        "body": data
      });
      if (response.status == 401)
        props.history.push('/login');
      var auth = JSON.parse(localStorage.getItem('auth'));
      auth.user.nickname = nickname.name;
      auth.user.avatar = "jpg";
      localStorage.setItem('auth', JSON.stringify(auth));
      setNickname({ ...nickname, isOpen: false });
    })();
  };
  useEffect(() => {
    (async () => {
      const response = await fetch("/api/budget", {
        "method": "GET",
        "headers": {
          "content-type": "application/json",
          "Authorization": props.auth.userToken

        }
      });
      if (response.status == 401)
        props.history.push('/login');
      const data = await response.json();
      var tmp = JSON.parse(localStorage.getItem('auth'));
      tmp.user.budget = data.budget;
      localStorage.setItem('auth', JSON.stringify(tmp));

    })();
  }, []);
  return (
    <Page
      className="MyPage AccountPage"
    >
      <Row className="next-header">
        <Col xl={12} lg={12} md={12} >
          <div className="mt-2" >
            <div className="mr-3" style={{ float: "left", overflow: "hidden", width: "50px", height: "50px", borderRadius: "50px", backgroundColor: "#424242" }}>
              <img src={`/uploads/avatars/${props.auth.user.avatar ? props.auth.user.id + ".jpg" : "user.png"}`} />
            </div>
            <span className="mt-2" style={{ fontWeight: '200' }}>Nickname: {nickname.name}</span>
            <br />
            <span style={{ fontWeight: '200' }}>Referral Code: {props.auth.user.recommendationCode}</span>
          </div>
          <div style={{ clear: 'both', padding: "0 12px", fontSize: '1.4rem' }}>Phone: {props.auth.user.phone}</div>
          <div style={{ padding: "0 12px", fontSize: '1.4rem' }}>Available Balance: <small>₹</small> {props.auth.user.budget} </div>
          <div style={{ padding: "0 12px" }}>
            <Button color="info" onClick={() => props.history.push("/wallet")}  >Recharge</Button>&nbsp;
          <Button onClick={() => setNickname({ ...nickname, isOpen: true })} color="warning">Change User Info</Button>
          </div>
        </Col>
      </Row>
      <Row>
        {
          props.auth.user.admin ? (
            <Col xl={12} lg={12} md={12}>
              <>
                <Link className={'form-control form-list'} to="/users"  ><FaUserEdit className='mr-3' /> Admin Users</Link>
                <Link className={'form-control form-list'} to="/complaint-admin"  ><FaUserEdit className='mr-3' /> Admin Complaints</Link>
                <Link className={'form-control form-list'} to="/recharge-admin"  ><FaUserEdit className='mr-3' /> Admin Recharge</Link>
                <Link className={'form-control form-list'} to="/withdrawl-admin"  ><FaUserEdit className='mr-3' /> Admin Withdrawal</Link>
                <Link className={'form-control form-list'} to="/reward-admin"  ><FaBoxOpen className='mr-3' /> Admin Rewards</Link>
              </>
            </Col>
          ) : ""
        }
      </Row>
      <Row>
        <Col xl={4} lg={4} md={4} xs={4} className="account-item" onClick={()=>props.history.push("/promotion")}>
          <GoOrganization />
          <br />
          <span>Invite Friends</span>
        </Col>
        <Col xl={4} lg={4} md={4} xs={4} className="account-item" onClick={()=>props.history.push("/game-records")}>
          <GiTrophyCup />
          <br />
          <span>Game Records</span>
        </Col>
        <Col xl={4} lg={4} md={4} xs={4} className="account-item" onClick={()=>props.history.push("/bank")}>
          <FaCreditCard />
          <br />
          <span>Bank Card</span>
        </Col>
      </Row>
      <Row>
        <Col xl={4} lg={4} md={4} xs={4} className="account-item" onClick={()=>props.history.push("/security")}>
          <GoShield />
          <br />
          <span>Account Security</span>
        </Col>
        <Col xl={4} lg={4} md={4} xs={4} className="account-item" onClick={()=>props.history.push("/support")}>
          <GoQuestion />
          <br />
          <span>Help Center</span>
        </Col>
        <Col xl={4} lg={4} md={4} xs={4} className="account-item" onClick={()=>props.history.push("/logout")}>
          <GoSignOut />
          <br />
          <span>Logout</span>
        </Col>


      </Row>
      <Row>
        <div style={{ "height": '100px' }}></div>
      </Row>
      <Modal
        isOpen={nickname.isOpen}
        toggle={() => setNickname({ ...nickname, isOpen: false })}
      >
        <ModalHeader toggle={() => setNickname({ ...nickname, isOpen: false })}>Change User Info</ModalHeader>
        <ModalBody>
          <Row>
            <div className="image-crop-uploader">
              <ReactCrop
                src={imageCrop.src}
                onImageLoaded={setImage}
                crop={imageCrop.crop}
                onChange={arg => setImageCrop({ ...imageCrop, crop: arg })}
              />
              <br />
              <input type="file" id="file" onChange={handleFileChange} onClick={() => { }} />
              <label htmlFor="file" className="btn-2">Avatar</label>
            </div>
            <Col md={12}>
              <Form>
                <FormGroup>
                  <Input type="text" onChange={(e) => { setNickname({ ...nickname, name: e.target.value }) }} id="exampleSelect1" className='form-control' value={nickname.name} />

                </FormGroup>
              </Form>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={postNickname}>
            Ok
          </Button>
          <Button onClick={() => setNickname({ ...nickname, isOpen: false })}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </Page>
  );
};

export default MyPage;
