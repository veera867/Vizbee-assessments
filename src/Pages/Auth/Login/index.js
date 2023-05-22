import React, { useState } from 'react';
import {Form,Input,Button,message} from 'antd';
import { useNavigate } from 'react-router-dom';

import { A11y,Autoplay } from 'swiper';
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

    const [mail,setMail] = useState('');
    const [password,setPassword] = useState('');

    const [loading,setLoading] = useState(false);

    const [messageApi, contextHolder] = message.useMessage();

    const handleSave = async () => {
        setLoading(true);
        try{
            const payload = {
                'email': mail,
                'password': password
            }
            const apiResponse = await LoginAPI(payload);
            console.log("apiResponse",apiResponse);

            //According to the status from API
            if(apiResponse.status === 200){
                setLoading(false);
                messageApi.open({
                    type: 'success',
                    content: apiResponse.message,
                });          
                
                //Auto redirection
                setTimeout(()=>{
                    navigate("/app/jobs");
                },1000);
            } else {
                setLoading(false);

                messageApi.open({
                    type: 'error',
                    content: apiResponse.message,
                });      
                
                //Auto redirection remove this
                setTimeout(()=>{
                    navigate("/app/jobs");
                },1000);
            }    
        } catch (err) {
            console.log(err.message);
            setLoading(false);

            messageApi.open({
                type: 'error',
                content: err.message,
            }); 

            //Auto redirection remove this
            setTimeout(()=>{
                navigate("/app/jobs");
            },1000);
        }    
    }

    return (
        <div className="login_layout">
            {contextHolder}
            <div className='left_wrapper'>
                <Swiper 
                    className="imageCarousel"
                    modules={[A11y,Autoplay]}
                    autoplay={{
                        delay: 2000,
                        disableOnInteraction: false,
                    }}          
                    spaceBetween={0}
                    slidesPerView={1}
                >
                    <SwiperSlide className="carousel imgHolder">
                        <img src="/assets/login-img-1.jpg" alt="carousel-img-1"/>
                    </SwiperSlide>
                    <SwiperSlide className="carousel imgHolder">
                        <img src="/assets/login-img-2.jpg" alt="carousel-img-2"/>
                    </SwiperSlide>
                    <SwiperSlide className="carousel imgHolder">
                        <img src="/assets/login-img-3.jpg" alt="carousel-img-3"/>
                    </SwiperSlide>
                </Swiper>
            </div>
            <div className='login_container'>
                <div className='login_box'>
                    <div className='title_box'>
                        <h1>Apexon</h1>
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
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter Email ID!',
                                }
                            ]}
                        >
                            <Input 
                                value={mail}
                                onChange={(value)=>setMail(value.target.value)}
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
                                onChange={(value)=>setPassword(value.target.value)}
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
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default Login