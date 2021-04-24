import logo200Image from 'assets/img/logo/logo_200.png';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import {
  MdWarning, MdSmsFailed
} from 'react-icons/md';
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import PageSpinner from './PageSpinner';
import { stateSetter } from './Service';
import Button from 'components/Button';
import Snackbar from "components/Snackbar.js";
class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.setter = stateSetter(this);

  }

  state = {
    phone: '',
    password: '',
    confirmPassword: '',
    recommendationCode: this.props.params,
    confirmPWDErr: false,
    inProgress: false,
    agree: false,
    verify: '',
    otpProgress: false,
    notiStatus: false,
    notiText: '',
    image: null,
    result: '',
    imageCrop: {
      src: "/uploads/avatars/user.png",
      crop: { unit: 'px', aspect: 1 / 1, width: 200 },
    }
  }
  componentWillUnmount() {
    this.setter.cancel();

  }
  setImage = (arg) => {
    console.log(arg);
    this.setState({
      image: arg
    })
  }
  setCrop = (arg) => {
    this.setState({
      imageCrop: {
        ...this.state.imageCrop,
        crop: arg
      }
    })
  }
  handleFileChange = (e) => {
    if(e.target.files[0])
      this.setState({
        imageCrop: {
          ...this.state.imageCrop,
          src: URL.createObjectURL(e.target.files[0])
        }
      })
  };
  onUpload = () => {

  }

  get isLogin() {
    return this.props.authState === STATE_LOGIN;
  }

  get isSignup() {
    return this.props.authState === STATE_SIGNUP;
  }
  get isPhone() {
    return this.props.authState === STATE_PHONE;
  }
  get isVerify() {
    return this.props.authState === STATE_VERIFY;
  }
  changeAuthState = authState => event => {
    event.preventDefault();
    // console.log(authState);
    this.props.onChangeAuthState(authState);


  };
  sendOTP = () => {
    // console.log(this.state);
    this.setter.setState({
      otpProgress: true
    });
    fetch("/api/phone", {
      "method": "POST",
      "headers": {
        "content-type": "application/json",
      },
      "body": JSON.stringify({
        phone: localStorage.getItem('phone'),
      })
    })
      .then(response => {
        this.setter.setState({
          otpProgress: false
        });
        if (response.status < 400) {
          response.json().then(res => {

          }).catch(() => { });

        } else {
          response.json().then(res => {
            if (res.error) {
              this.setState({
                notiStatus: true,
                notiText: res.error
              });
            } else {
              this.setState({
                notiStatus: true,
                notiText: res.errors[0].param + " " + res.errors[0].msg
              });
            }


          }).catch(() => { });

        }

      })
      .catch(() => { });
  }
  handleSubmit = event => {


    event.preventDefault();
    if (this.props.authState === STATE_LOGIN) {
      this.setter.setState({
        inProgress: true
      })
      fetch("/api/login", {
        "method": "POST",
        "headers": {
          "content-type": "application/json",
        },
        "body": JSON.stringify({
          phone: this.state.phone,
          password: this.state.password
        })
      })
        .then(response => {
          if (response.status < 400) {
            response.json().then(res => {
              localStorage.setItem("auth", JSON.stringify(res));
              this.setter.setState({
                inProgress: false
              });
              this.props.onSubmit();
            });

          } else {
            response.json().then(res => {
              if (res.error == '1') {
                localStorage.setItem("phone", res.phone);
                this.props.onChangeAuthState(STATE_VERIFY);
              } else {
                this.setter.setState({
                  inProgress: false
                });
                if (res.error) {
                  this.setState({
                    notiStatus: true,
                    notiText: res.error
                  });
                } else {
                  this.setState({
                    notiStatus: true,
                    notiText: res.errors[0].param + " " + res.errors[0].msg
                  });
                }
              }


            });

          }

        });

    } else if (this.props.authState === STATE_SIGNUP) {
      // console.log(this.state);
      if (!this.state.confirmPWDErr && this.state.phone !== '' && this.state.recommendationCode !== '' && this.state.agree) {
        // console.log(this.state);
        let base64Image;
        if(this.state.image){
          console.log(this.state.image);
          const canvas = document.createElement("canvas");
          const scaleX = this.state.image.naturalWidth / this.state.image.width;
          const scaleY = this.state.image.naturalHeight / this.state.image.height;
  
          canvas.width = this.state.imageCrop.crop.width;
          canvas.height = this.state.imageCrop.crop.height;
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          console.log(this.state.image);
          ctx.drawImage(
            this.state.image,
            this.state.imageCrop.crop.x * scaleX,
            this.state.imageCrop.crop.y * scaleY,
            this.state.imageCrop.crop.width * scaleX,
            this.state.imageCrop.crop.height * scaleY,
            0,
            0,
            this.state.imageCrop.crop.width,
            this.state.imageCrop.crop.height
          );
  
          base64Image = canvas.toDataURL("image/jpeg");          
        }
        const data = new FormData();
        data.append("avatar", base64Image);
        data.append('phone', this.state.phone);
        data.append('password', this.state.password);
        data.append('recommendationCode', this.state.recommendationCode);
        this.setter.setState({
          inProgress: true
        })
        fetch("/api/signup", {
          "method": "POST",
          // "headers": {
          //   "content-type": "multipart/form-data",
          // },
          "body": data
        })
          .then(response => {
            if (response.status < 400) {
              this.setter.setState({
                inProgress: false
              });
              response.json().then(res => {
                // console.log(res);
                localStorage.setItem("phone", this.state.phone);
                this.props.onChangeAuthState(STATE_VERIFY);
              });

            } else {
              if (response.status == 422) {
                response.json().then(res => {
                  this.setter.setState({
                    inProgress: false
                  });
                  // console.log(this.state.agree);
                  if (res.error) {
                    this.setState({
                      notiStatus: true,
                      notiText: res.error
                    });
                  } else {
                    this.setState({
                      notiStatus: true,
                      notiText: res.errors[0].param + " " + res.errors[0].msg
                    });
                  }
                });
              } else {
                response.json().then(res => {
                  this.setter.setState({
                    inProgress: false
                  });
                  // console.log(this.state.agree);
                  if (res.error) {
                    this.setState({
                      notiStatus: true,
                      notiText: res.error
                    });
                  } else {
                    this.setState({
                      notiStatus: true,
                      notiText: res.errors[0].param + " " + res.errors[0].msg
                    });
                  }
                });
              }
            }

          });
      }

    } else if (this.props.authState === STATE_PHONE) {
      this.setter.setState({
        inProgress: true
      });

      fetch("/api/phone", {
        "method": "POST",
        "headers": {
          "content-type": "application/json",
        },
        "body": JSON.stringify({
          phone: this.state.phone
        })
      })
        .then(response => {
          if (response.status < 400) {
            response.json().then(res => {
              localStorage.setItem("phone", this.state.phone);
              // console.log(this.props);
              this.props.onChangeAuthState(STATE_VERIFY);
            }).catch(() => { });

          } else {
            response.json().then(res => {
              this.setter.setState({
                inProgress: false
              });
              if (res.error) {
                this.setState({
                  notiStatus: true,
                  notiText: res.error
                });
              } else {
                this.setState({
                  notiStatus: true,
                  notiText: res.errors[0].param + " " + res.errors[0].msg
                });
              }

            }).catch(() => { });

          }

        })
        .catch(() => { });
    } else {
      this.setter.setState({
        inProgress: true
      });
      fetch("/api/verify", {
        "method": "POST",
        "headers": {
          "content-type": "application/json",
        },
        "body": JSON.stringify({
          phone: localStorage.getItem('phone'),
          otp: this.state.verify
        })
      })
        .then(response => {
          if (response.status < 400) {
            response.json().then(res => {
              localStorage.clear();
              localStorage.setItem("auth", JSON.stringify(res));
              this.setter.setState({
                inProgress: false
              });
              this.props.onSubmit();
            });

          } else {
            response.json().then(res => {
              this.setter.setState({
                inProgress: false
              });
              if (res.error) {
                this.setState({
                  notiStatus: true,
                  notiText: res.error
                });
              } else {
                this.setState({
                  notiStatus: true,
                  notiText: res.errors[0].param + " " + res.errors[0].msg
                });
              }
            });
          }

        });


    }

  };
  changePhone = event => {
    this.setter.setState({
      phone: event.target.value
    })
  }
  changeVerify = event => {
    this.setter.setState({
      verify: event.target.value
    })
  }
  changePassword = event => {
    if (event.target.value !== this.state.confirmPassword) {
      this.setter.setState({
        confirmPWDErr: true,
        password: event.target.value
      })
    } else {
      this.setter.setState({
        confirmPWDErr: false,
        password: event.target.value
      })
    }
  }
  changeConfirmPassword = event => {
    if (event.target.value !== this.state.password) {
      this.setter.setState({
        confirmPWDErr: true,
        confirmPassword: event.target.value
      })
    } else {
      this.setter.setState({
        confirmPWDErr: false,
        confirmPassword: event.target.value
      })
    }


  }
  changeRecommendationCdoe = event => {

    this.setter.setState({
      recommendationCode: event.target.value
    })
  }

  renderButtonText() {
    const { buttonText } = this.props;

    if (!buttonText && this.isLogin) {
      return 'Login';
    }

    if (!buttonText && this.isSignup) {
      return 'Signup';
    }

    return buttonText;
  }
  onChangeAgree = () => {
    console.log(this.state.agree);
    this.setter.setState({
      agree: !this.state.agree
    });
  }

  render() {
    const {
      showLogo,
      usernameInputProps,
      passwordInputProps,
      confirmPasswordInputProps,
      children,
      onLogoClick,
      recommendationCodeInputProps
    } = this.props;
    if (this.state.inProgress) {
      return (
        <PageSpinner />
      );
    } else {
      if (!this.isPhone && !this.isVerify) {
        return (
          <Form onSubmit={this.handleSubmit}>
            { (!this.isSignup && showLogo) && (
              <div className="text-center pb-4">
                <img
                  src={logo200Image}
                  className="rounded"
                  style={{ width: 170, height: 100, cursor: 'pointer' }}
                  alt="logo"
                  onClick={onLogoClick}
                />
              </div>
            )}
            {
              this.isSignup && (
                <div className="image-crop-uploader">
                  <ReactCrop
                    src={this.state.imageCrop.src}
                    onImageLoaded={this.setImage}
                    crop={this.state.imageCrop.crop}
                    onChange={this.setCrop}
                  />
                  <br />
                  <input type="file" id="file" onChange={this.handleFileChange} onClick={this.onUpload} />
                  <label htmlFor="file" className="btn-2">Avatar</label>
                </div>
              )
            }
            <FormGroup>
              <Input {...usernameInputProps} onChange={this.changePhone} value={this.state.phone} />
            </FormGroup>
            <FormGroup>
              <Input {...passwordInputProps} onChange={this.changePassword} value={this.state.password} />
            </FormGroup>
            {this.isSignup && (
              <FormGroup>
                <Input {...confirmPasswordInputProps} onChange={this.changeConfirmPassword} value={this.state.confirmPassword} />
                {
                  this.state.confirmPWDErr && (
                    <span className='text-danger'>password not match</span>
                  )
                }
              </FormGroup>

            )}
            {/* {this.isSignup && (
            
              <FormGroup>
              <Label for={verificationCodeLabel}>{verificationCodeLabel}</Label>
              <Input {...verificationCodeInputProps} />
            </FormGroup>
            
            )} */}
            {this.isSignup && (
              <>

                <FormGroup>
                  <Input type='text' {...recommendationCodeInputProps} value={this.state.recommendationCode} onChange={this.changeRecommendationCdoe} />
                </FormGroup>
              </>
            )}
            { this.isSignup && (
              <FormGroup check>
                <Label check>
                  <Input type="checkbox" checked={this.state.agree} onChange={this.onChangeAgree} />{' '}
                Agree the <Link to='/policy'>terms and policy</Link>
                </Label>
              </FormGroup>
            )}
            <hr />

            <Button
              size="lg"
              color="youtube"
              block
              round
              onClick={this.handleSubmit}>
              {this.renderButtonText()}
            </Button>


            { <div className="text-center pt-1">
              <h6>or</h6>
              <h6>
                {
                  this.isSignup ? (
                    <a href="#login" onClick={this.changeAuthState(STATE_LOGIN)}>
                      Login
                    </a>
                  ) : (
                      <>
                        <a href="#signup" onClick={this.changeAuthState(STATE_SIGNUP)}>
                          Signup
                      </a>
                        <br></br>
                        <br></br>
                        <a href="#signup" onClick={this.changeAuthState(STATE_PHONE)}>
                          Forgot password.
                      </a>
                      

                      </>
                    )
                }

              </h6>
            </div>}

            {children}
            <Snackbar
              place="tr"
              color="danger"
              icon={MdSmsFailed}
              message={this.state.notiText}
              open={this.state.notiStatus}
              closeNotification={() => this.setState({ notiStatus: false })}
              close
            />
          </Form>
        );
      }
      else {
        return (
          <Form>
            {showLogo && (
              <div className="text-center pb-4">
                <img
                  src={logo200Image}
                  className="rounded"
                  style={{ width: 170, height: 100, cursor: 'pointer' }}
                  alt="logo"
                  onClick={onLogoClick}
                />
              </div>
            )}

            {
              (this.isPhone) ? (
                <FormGroup>
                  <Input type='text' placeholder='Please type your phone number' value={this.state.phone} onChange={this.changePhone} />
                </FormGroup>
              ) : (
                  <>
                    <FormGroup>
                      <Button onClick={this.sendOTP} color="success" >{this.otpProgress ? (<PageSpinner />) : 'Resend OTP'}</Button>
                    </FormGroup>
                    <FormGroup>
                      <Input type='text' placeholder='Please type the letters on your phone.' value={this.state.verify} onChange={this.changeVerify} />
                    </FormGroup>
                  </>
                )
            }


            <hr />
            {
              this.isPhone ?
                (<Button
                  size="lg"
                  className="bg-gradient-theme-left border-0"
                  block
                  onClick={this.handleSubmit}>
                  OK
                </Button>) : (
                  <Button
                    size="lg"
                    className="bg-gradient-theme-left border-0"
                    block
                    onClick={this.handleSubmit}>
                    Verify
                  </Button>
                )


            }
            {children}
            <Snackbar
              place="tr"
              color="danger"
              icon={MdSmsFailed}
              message={this.state.notiText}
              open={this.state.notiStatus}
              closeNotification={() => this.setState({ notiStatus: false })}
              close
            />
          </Form>
        );
      }
    }

  }
}

export const STATE_LOGIN = 'LOGIN';
export const STATE_SIGNUP = 'SIGNUP';
export const STATE_PHONE = 'PHONE';
export const STATE_VERIFY = 'VERIFY';
AuthForm.propTypes = {
  authState: PropTypes.oneOf([STATE_LOGIN, STATE_SIGNUP]).isRequired,
  showLogo: PropTypes.bool,
  usernameLabel: PropTypes.string,
  usernameInputProps: PropTypes.object,
  passwordLabel: PropTypes.string,
  passwordInputProps: PropTypes.object,
  confirmPasswordLabel: PropTypes.string,
  confirmPasswordInputProps: PropTypes.object,
  // verificationCodeLabel: PropTypes.string,
  // verificationCodeInputProps: PropTypes.object,
  recommendationCodeLabel: PropTypes.string,
  recommendationCodeInputProps: PropTypes.object,
  onLogoClick: PropTypes.func,
};

AuthForm.defaultProps = {
  authState: 'LOGIN',
  showLogo: true,
  usernameLabel: 'Phone',
  usernameInputProps: {
    type: 'string',
    placeholder: 'your phone number',
  },
  passwordLabel: 'Password',
  passwordInputProps: {
    type: 'password',
    placeholder: 'your password',
  },
  confirmPasswordLabel: 'Confirm Password',
  confirmPasswordInputProps: {
    type: 'password',
    placeholder: 'confirm your password',
  },
  recommendationCodeLabel: 'Recommendation Code',
  recommendationCodeInputProps: {
    type: 'string',
    placeholder: 'recommendation code',
  },

  onLogoClick: () => { },
};

export default AuthForm;
