import React, { useState } from 'react';
import { Form, Input, Button, message, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import UserRegister from '../register/register';

import { A11y, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';

import './login.css';
import LoginAPI from '../../../Apis/Auth/LoginAPI';

function Login() {
    const navigate = useNavigate();

    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);

    const [messageApi, contextHolder] = message.useMessage();
    const [visible, setVisible] = useState(false)

    const handleSave = async () => {
        setLoading(true);
        try {
            const payload = {
                'username': mail,
                'password': password
            }
            const apiResponse = await LoginAPI(payload);
            console.log("apiResponse", apiResponse);

            
            //According to the status from API
            if (apiResponse.status === 200) {
                setLoading(false);
                messageApi.open({
                    type: 'success',
                    content: apiResponse.message,
                });

                //on sucess I have to get authtoken
                //store it in localstorage
                localStorage.setItem("authtoken",apiResponse?.data?.authToken);
                // let token = mail + apiResponse.message
                //  localStorage.setItem("authtoken",token);

                //Auto redirection
                setTimeout(() => {
                    navigate("/app/jobs");
                }, 1000);
            } else {
                setLoading(false);

                messageApi.open({
                    type: 'error',
                    content: apiResponse.message,
                });
             
            }
        } catch (err) {
            console.log(err.message);
            setLoading(false);

            messageApi.open({
                type: 'error',
                content: err.message,
            });

        }
    }

    const handleRegister = () => {
        // setVisible(true)
        navigate('/auth/register');
    }

    const handleNextCancelClick = () =>{
        setVisible(false)
    }

    return (
        <div className="login_layout">
            {contextHolder}
            <div className='left_wrapper'>
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
            <div className='login_container'>
                <div className='login_box'>
                    <div className='title_box'>
                        <div className='header-logo-wrapper'>
                            <img alt="logo" src="/apexon-logo.jpg" />
                            <h1>Apexon</h1>
                        </div>
                        <span>Login to access your account.</span>
                    </div>

                    <Form
                        name="basic"
                        layout="vertical"
                        style={{
                            width: '100%',
                            maxWidth: 600,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        autoComplete="off"
                        onFinish={handleSave}
                    >
                        <Form.Item
                            label="UserName"
                            name="email"
                            rules={[
                                {

                                    required: true,
                                    message: 'Please enter User Name!',
                                }
                            ]}
                        >
                            <Input
                                value={mail}
                                onChange={(value) => setMail(value.target.value)}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter Password!',
                                }
                            ]}
                        >
                            <Input.Password
                                value={password}
                                onChange={(value) => setPassword(value.target.value)}
                            />
                        </Form.Item>

                        <Form.Item
                            style={{
                                width: '100%',
                            }}
                        >
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{
                                    width: '100%',
                                }}
                                loading={loading}
                            >
                                Login
                            </Button>
                        </Form.Item>
                        <Button 
                            type="link" 
                            onClick={handleRegister} 
                            style={{
                                width: '100%',
                            }}
                        >Create New User</Button>
                        {/* <Modal
                            title="Next Question"
                            open={visible}
                            // onOk={handleNextConfirmClick}
                                onCancel={handleNextCancelClick}
                            // confirmLoading={confirmLoading}
                        >
                            <UserRegister />
                        </Modal> */}
                        
                    </Form>

                </div>
            </div>
        </div>
    )
}

export default Login