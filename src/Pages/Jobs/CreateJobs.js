import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Button,message, Divider, Form, Input, Select } from 'antd';

import CreateJobAPI from '../../Apis/Jobs/CreateJobAPI';
import '../Dashboard/dashboard.css';

function CreateJob() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [jdName,setJdName] = useState();
    const [mskills,setMskills] = useState([]);
    const [oskills,setOskills] = useState([]);
    const [complexity,setComplexity] = useState();

    const [saveLoading,setSaveLoading] = useState(false);


    const handleSave = async () => {
        try{
            setSaveLoading(true);
            const payload = {
                jdName: jdName,
                mandatorySkills: mskills,
                optionalSkills: oskills,
                complexity: complexity
            }
            const apiResponse = await CreateJobAPI(payload);
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
            console.log(err.message);
            setSaveLoading(false);
            
            messageApi.open({
                type: 'error',
                content: err.message,
            }); 
        }
    }

    const handleCancel = () => {
        navigate(-1);
    }

    const updateMSkills = (value) => {        
        setMskills(value);
    }

    const updateOSkills = (value) => {      
        setOskills(value);
    }

    return (
        <div className="layout-outer">
            {contextHolder}
            <div className="layout-inner">
                <div className="title-bar">
                    <h1>Create Job</h1>

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
                        <Form.Item
                            label="JD Name"
                            name="jdName"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter Jd Name!',
                                }
                            ]}
                        >
                            <Input 
                                value={jdName}
                                onChange={(value)=>setJdName(value.target.value)}
                            />
                        </Form.Item>


                        <Form.Item
                            label="Mandatory Skills"
                            name="mandatorySkills"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select!',
                                },
                            ]}
                        >
                            <Select
                                value={mskills}
                                onChange={updateMSkills}
                                mode="multiple"
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
                            label="Optional Skills"
                            name="optionalSkills"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select!',
                                },
                            ]}
                        >
                            <Select
                                value={oskills}
                                mode="multiple"
                                onChange={updateOSkills}
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
                            label="Complexity"
                            name="complexity"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select!',
                                },
                            ]}
                        >
                            <Select
                                value={complexity}
                                onChange={(value)=>{setComplexity(value)}}
                                style={{
                                    width : '100%'
                                }}
                                options={[
                                    {
                                        value: 'Beginner',
                                        label: 'Beginner'
                                    },
                                    {
                                        value: 'Intermediate',
                                        label: 'Intermediate'
                                    },
                                    {
                                        value: 'Pro',
                                        label: 'Pro'
                                    }
                                ]}
                            ></Select>
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

export default CreateJob