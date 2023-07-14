import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Button,message, Divider, Form, Input, Select } from 'antd';

import CreateTestAPI from '../../Apis/Tests/CreateTestAPI';
import '../AssessmentDashboard/dashboard.css';
import GetSkillsAPI from '../../Apis/Skills/getSkillsAPI'
function CreateTest() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [testName,setTestName] = useState();
    const [mskills,setMskills] = useState([]);
    const [oskills,setOskills] = useState([]);
    const [complexity,setComplexity] = useState();

    const [saveLoading,setSaveLoading] = useState(false);

    const [skillsDataList,setSkillsDataList] = useState();
    const [skillsData, setSkillsData] = useState();

    //temporary auth token verification process
    //has to create an api for verification of authToken
    useEffect(()=>{
        const token = localStorage.getItem('authtoken');
        if(!token){
            navigate('/auth/login');
        }
    },[]);

    useEffect(()=> {
        fetchSkillsData()
        console.log("useEffect")
    },[])

    const fetchSkillsData = async() => {
        try{
            const response = await GetSkillsAPI()
            console.log("response", response)

            if(response.status === 200){
                const selectOptions = response.data.skills.map(item => ({
                    value: item.SkillName,
                    label: item.SkillName
                }))
                setSkillsData(selectOptions);
                setSkillsDataList(selectOptions);
            } else {
                messageApi.open({
                    type: 'error',
                    content: response.message,
                });                  
            }
        } catch (err) {
            console.log(err);
            messageApi.open({
                type: 'error',
                content: err.message,
            });                  
        }
    }

    const handleSave = async () => {
        try{
            setSaveLoading(true);
            const payload = {
                testName: testName,
                mandatorySkills: mskills,
                optionalSkills: oskills,
                complexity: complexity
            }
            const apiResponse = await CreateTestAPI(payload);
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

    //to capture the mskills and update the skillsData list
    useEffect(()=>{
        const filteredOptions = skillsDataList?.filter(
            (item) => !mskills.includes(item.value)
        );
        setSkillsData(filteredOptions);

        const filteredOskills = oskills.filter(
            (item) => !mskills.includes(item)
        );
        setOskills(filteredOskills);      
    },[mskills]);    

    const handleCancel = () => {
        navigate(-1);
    }

    const updateMSkills = (value) => {
        // let arr = mskills;
        // arr.push(value);
        setMskills(value);
    }

    const updateOSkills = (value) => {
        // let arr = oskills;
        // arr.push(value);
        setOskills(value);
    }

    return (
        <div className="layout-outer">
            {contextHolder}
            <div className="layout-inner">
                <div className="title-bar">
                    <h1>Create Test</h1>

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
                            label="Test Name"
                            name="testName"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter name!',
                                }
                            ]}
                        >
                            <Input 
                                value={testName}
                                onChange={(value)=>setTestName(value.target.value)}
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
                                onChange={(value)=>updateMSkills(value)}
                                mode="multiple"
                                style={{
                                    width : '100%'
                                }}
                                options={skillsData}
                            ></Select>
                        </Form.Item>

                        <Form.Item
                            label="Optional Skills"
                            name="optionalSkills"
                        >
                            <Select
                                value={oskills}
                                mode="multiple"
                                onChange={(value)=>updateOSkills(value)}
                                style={{
                                    width : '100%'
                                }}
                                options={skillsData}
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

export default CreateTest