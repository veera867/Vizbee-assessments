import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Button,message, Divider, Form, Input, Select, Space , DatePicker } from 'antd';

import './dashboard.css';
import ScheduleAssessmentAPI from '../../Apis/Assessments/ScheduleAssessmentAPI';

function Schedule() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [jdNumber,setJdNumber] = useState();
    const [jdName,setJdName] = useState();
    const [test,setTest] = useState();
    const [date,setDate] = useState();
    const [cmail,setCmail] = useState();
    const [hmail,setHmail] = useState();

    const [saveLoading,setSaveLoading] = useState(false);


    const handleSave = async () => {
        try{
            setSaveLoading(true);

            const payload = {
                jdName : jdName,
                jdNumber: jdNumber,
                testName: test,
                candidateEmail : cmail,
                hrEmail : hmail,
                scheduleDate: date
            }
            const apiResponse = await ScheduleAssessmentAPI(payload);
            console.log(apiResponse);

            //According to the status from API
            if(apiResponse.status === 200){
                setSaveLoading(false);
                messageApi.open({
                    type: 'success',
                    content: apiResponse.message,
                });           
                navigate(-1);
            } else {
                setSaveLoading(false);
                messageApi.open({
                    type: 'error',
                    content: apiResponse.message,
                });                  
            }    
        } catch (err) {
            setSaveLoading(false);
            console.log(err.message);

            messageApi.open({
                type: 'error',
                content: err.message,
            }); 
        }
    }

    const handleCancel = () => {
        navigate(-1);
    }

    return (
        <div className="layout-outer">
            {contextHolder}
            <div className="layout-inner">
                <div className="title-bar">
                    <h1>Schedule Assessment</h1>

                    <div className="button-holder">
                        <Button onClick={handleCancel}>Back</Button>
                    </div>
                </div>

                <Divider />
                
                <div className="content-wrapper form-center">
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
                        <Space direction="horizontal" size="middle" style={{ display: 'flex' }}>
                            <Form.Item
                                label="JD Number"
                                name="jdNumber"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter value!',
                                    },
                                ]}
                            >
                                <Input 
                                    value={jdNumber}
                                    onChange={(value)=>setJdNumber(value)}
                                />
                            </Form.Item>

                            <Form.Item
                                label="JD Name"
                                name="jdName"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter value!',
                                    },
                                ]}
                            >
                                <Input 
                                    value={jdName}
                                    onChange={(value)=>setJdName(value)}                                    
                                />
                            </Form.Item>
                        </Space>

                        <Form.Item
                            label="Test"
                            name="test"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select!',
                                }
                            ]}
                        >
                            <Select
                                defaultValue='React'
                                value={test}
                                onChange={(value)=>{setTest(value)}}
                                style={{
                                    width : '100%'
                                }}
                                options={[
                                    {
                                        value: 'React',
                                        label: 'React'
                                    },
                                    {
                                        value: 'Html',
                                        label: 'Html'
                                    },
                                    {
                                        value: 'Java',
                                        label: 'Java'
                                    }
                                ]}
                            ></Select>
                        </Form.Item>

                        <Form.Item
                            label="Schedule Date"
                            name="Schedule Date"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select Date!',
                                },
                            ]}
                        >
                            <DatePicker value={date} onChange={(value)=>{setDate(value)}} style={{width:'100%'}}/>
                        </Form.Item>

                        <Form.Item
                            label="Candidate EMail"
                            name="candidateMail"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter valid mail!',
                                },
                            ]}
                        >
                            <Input 
                                placeholder='john@gmail.com'
                                value={cmail}
                                onChange={(value)=>setCmail(value)}
                            />
                        </Form.Item>

                        <Form.Item
                            label="HR EMail"
                            name="hrMail"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter valid mail!',
                                },
                            ]}
                        >
                            <Input 
                                placeholder='virat@gmail.com'
                                value={hmail}
                                onChange={(value)=>setHmail(value)}
                            />
                        </Form.Item>

                        <div className="title-bar">
                            <h1>{''}</h1>

                            <Form.Item>
                                <div className="button-holder">
                                    <Button danger onClick={handleCancel}>Cancel</Button>
                                    <span></span>
                                    {
                                        saveLoading
                                        ? <Button type="primary" htmlType="submit" loading>Save</Button>
                                        : <Button type="primary" htmlType="submit">Save</Button>
                                    }
                                </div>
                            </Form.Item>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default Schedule