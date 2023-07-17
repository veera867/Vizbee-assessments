import React, { useState } from 'react';
import { Form, Input, Button, message, Row, Col } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { A11y, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';
import UserRegistrationApi from '../../../Apis/Auth/registerApi';
import { useNavigate } from 'react-router';

const UserRegister = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const payload = {
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        password: password,
        email: email,
      };
      const apiResponse = await UserRegistrationApi(payload);
      console.log('apiResponse', apiResponse);

      // According to the status from API
      if (apiResponse.status === 200) {
        setLoading(false);
        messageApi.open({
          type: 'success',
          content: apiResponse.message,
        });

        // on success, get authtoken and store it in localstorage
        localStorage.setItem('authtoken', apiResponse.authToken);

        // Auto redirection
        setTimeout(() => {
          navigate('/auth/login');
        }, 1000);
      } else {
        setLoading(false);

        messageApi.open({
          type: 'error',
          content: apiResponse.message,
        });

        // Auto redirection remove this
      }
    } catch (err) {
      console.log(err.message);
      setLoading(false);
      messageApi.open({
        type: 'error',
        content: err.message,
      });
    }
  };

  // Custom validation function for confirm password
  const validateConfirmPassword = (_, value) => {
    if (value && value !== password) {
      return Promise.reject('Passwords do not match');
    }
    return Promise.resolve();
  };

  return (
    <div className="login_layout">
      {contextHolder}
      <div className="left_wrapper">
        {/* <LoginFormComponent /> */}
        <Swiper
          className="imageCarousel"
          modules={[A11y, Autoplay]}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          spaceBetween={0}
          slidesPerView={1}
        >
          <SwiperSlide className="carousel imgHolder">
            <img src="/assets/login-img-1.jpg" alt="carousel-img-1" />
          </SwiperSlide>
          <SwiperSlide className="carousel imgHolder">
            <img src="/assets/apexon.png" alt="carousel-img-2" />
          </SwiperSlide>
          <SwiperSlide className="carousel imgHolder">
            <img src="/assets/login-img-3.jpg" alt="carousel-img-3" />
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="login_container">
        <div className="login_box">
          <div className="title_box">
            <div className="header-logo-wrapper">
              <img alt="logo" src="/apexon-logo.jpg" />
              <h1>Apexon</h1>
            </div>
            <span>Create an account.</span>
          </div>

          <Form
            name="basic"
            layout="vertical"
            style={{
              width: '100%',
              // maxWidth: 600,
            }}
            initialValues={{
              remember: true,
            }}
            autoComplete="off"
            onFinish={handleRegister}
          >
            <Row>
              <Col span={10}>
                <Form.Item
                  label="First Name"
                  name="fName"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your First Name!',
                    },
                  ]}
                >
                  <Input onChange={(e) => setFirstName(e.target.value)} />
                </Form.Item>
              </Col>
              <Col span={4} />
              <Col span={10}>
                <Form.Item
                  label="Last Name"
                  name="lName"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your Last Name!',
                    },
                  ]}
                >
                  <Input onChange={(e) => setLastName(e.target.value)} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your Username!',
                    },
                  ]}
                >
                  <Input onChange={(e) => setUserName(e.target.value)} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your Email!',
                    },
                  ]}
                >
                  <Input onChange={(e) => setEmail(e.target.value)} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your password!',
                    },
                  ]}
                >
                  <Input.Password onChange={(e) => setPassword(e.target.value)} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Confirm Password"
                  name="confirmPassword"
                  dependencies={['password']}
                  rules={[
                    {
                      required: true,
                      message: 'Please confirm your password!',
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        return validateConfirmPassword(_, value, getFieldValue);
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      width: '100%',
                    }}
                    loading={loading}
                  >
                    Register
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
