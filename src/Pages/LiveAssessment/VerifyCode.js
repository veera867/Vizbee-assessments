import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Row } from 'antd';
import { Divider, Form, Select, DatePicker, TimePicker } from 'antd';
import { Layout, Button, message, Input, Space, Card, List } from 'antd';
// import VerifyCodeAPI from '../../Apis/Assessments/verifyCodeAPI';

const { Header } = Layout;

function VerifyCode() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [code, setCode] = useState();
    const [currentCompanyName, setCurrentCompanyName] = useState()
    const [designation, setDesignation] = useState()
    const [totalExperince, setTotalExperince] = useState()
    const [relavantExperince, setRelavantExperince] = useState()
    const [role, setRole] = useState()
    const [noticePeriod, setNoticePeriod] = useState()
    
    const handleRedirect = async () => {
        const payload = {
            currentCompanyName: currentCompanyName,
            designation: designation,
            totalExperince: totalExperince,
            relavantExperince: relavantExperince,
            code: code,
            role: role,
            noticePeriod: noticePeriod
        }
        navigate(`/assessment/${code}`, { state: payload });

        /*
        try{
            const apiResponse = await VerifyCodeAPI(code);

            if(apiResponse.status === 200){
                navigate(`/assessment/${code}`, {state: code} );
            } else {
                messageApi.open({
                    type: 'error',
                    content: apiResponse.message,
                });                  
            }
        } catch (err) {
            console.log(err);
            messageApi.open({
                type: 'error',
                content: err.message,
            });                  
        }
        */
    }

    return (
        <Layout>
            <Header>
                <div className="header-wrapper">
                    <div className="logo-header">
                        <img alt="logo" src="/apexon-logo.jpg" />
                        <h1>Apexon Assessment System</h1>
                    </div>
                </div>
            </Header>
            <div className="layout-outer">
                {contextHolder}


                <div className="layout-inner">
                    <div className="content-wrapper form-center">
                        <Card
                            title="Instructions"
                            style={{
                                width: '100%'
                            }}
                        >
                            <List>
                                <List.Item>Make sure that no one else is present in the room. Make sure that your phone is away and on silent mode. Make sure that your laptop/desktop is connected to the power supply and/or UPS</List.Item>
                                <List.Item>Make sure that your face is well-lit and clearly visible in the camera. Please make sure that you complete the test in a single go.</List.Item>
                            </List>
                        </Card>
                        <br />
                        <br />
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
                        onFinish={handleRedirect}
                    >
                        <Row>
                            <Col span={4} ></Col>
                            <Col span={6}  >
                                <Form.Item
                                    label="Current Company"
                                    name="currentCompany"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter  Name!',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder='Apexon'
                                        // value={cName}
                                        onChange={(event) => setCurrentCompanyName(event.target.value)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={4} ></Col>
                            <Col span={6}>
                                <Form.Item
                                    label="Designation"
                                    name="designation"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter valid Designation!',
                                        },
                                    ]}

                                >
                                    <Input
                                        placeholder='Software Engineer'
                                        style={{
                                            width: '100%'
                                        }}

                                        // value={cmail}
                                        // onChange={handleEmailChange}
                                        onChange={(e) => setDesignation(e.target.value)}
                                    />
                                </Form.Item>
                            </Col>
                            {/* <Col span={8} ></Col> */}
                            <Col span={4} ></Col>
                            <Col span={4} ></Col>
                            <Col span={6}>
                                <Form.Item
                                    label="Total Years Of Experince"
                                    name="totalExperince"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter valid Total Tears Of Experince!',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder='4 years 5months'
                                        // value={hmail}
                                        onChange={(e) => setTotalExperince(e.target.value)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={4} ></Col>
                            <Col span={6}>
                                <Form.Item
                                    label="Relavant Experince"
                                    name="relavantExperince"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter valid Relavant Experince!',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder='2 years 6months'
                                        // value={hmail}
                                        onChange={(e) => setRelavantExperince(e.target.value)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={4} ></Col>
                            <Col span={4} ></Col>
                            <Col span={6}>
                                <Form.Item
                                    label="Role"
                                    name="role"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter valid Total Role!',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder='4 years 5months'
                                        // value={hmail}
                                        onChange={(e) => setRole(e.target.value)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={4} ></Col>
                            <Col span={6}>
                                <Form.Item
                                    label="Notice Period"
                                    name="noticePeriod"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter valid Notice Notice!',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder='15 days or 1 month or 2 months'
                                        // value={hmail}
                                        onChange={(e) => setNoticePeriod(e.target.value)}
                                    />
                                </Form.Item>
                            </Col>


                            <Col span={10} ></Col>

                            <Col span={8} style={{ display: 'flex', alignItems: 'center' }} >
                                <Form.Item
                                    label="Assessment Code"
                                    name="assessmentCode"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter valid Assessment Code!',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="123456"
                                        value={code}
                                        onChange={(value) => setCode(value.target.value.trim())}
                                    />
                                </Form.Item>
                                <Button style={{ marginTop: '5px' }} type="primary" htmlType="submit">Start</Button>                            </Col>
                            <Col span={6} ></Col>
                        </Row>
                    </Form>

                </div>
            </div>
        </Layout>
    )
}

export default VerifyCode