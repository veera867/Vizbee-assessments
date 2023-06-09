import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, message, Divider, Form, Input, Select, Spin } from 'antd';

import UpdateTestAPI from '../../Apis/Tests/updateTest';
import GetTestWithID from '../../Apis/Tests/GetTestWithID';
import '../Dashboard/dashboard.css';
import GetSkillsAPI from '../../Apis/Skills/getSkillsAPI';

function EditTests() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [messageApi, contextHolder] = message.useMessage();

    //error boundaries and loaders
    const [loading, setLoading] = useState(false);
    const [hasErr, setHasErr] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const [testId, setTestId] = useState(0);
    const [testName, setTestName] = useState('');
    const [mskills, setMskills] = useState([]);
    const [oskills, setOskills] = useState([]);
    const [complexity, setComplexity] = useState();

    const [skillsDataList, setSkillsDataList] = useState();
    const [skillsData, setSkillsData] = useState()

    const [saveLoading, setSaveLoading] = useState(false);

    //temporary auth token verification process
    //has to create an api for verification of authToken
    useEffect(() => {
        const token = localStorage.getItem('authtoken');
        if (!token) {
            navigate('/auth/login');
        }
    }, []);

    useEffect(() => {
        fetchSkillsData()
        console.log("useEffect")
    }, [])

    const fetchSkillsData = async () => {
        console.log("fetch")
        try {
            const response = await GetSkillsAPI()
            console.log("response", response)

            if (response.status === 200) {
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

    useEffect(() => {
        async function GetSkillDetails() {
            setLoading(true);
            try {
                const apiResponse = await GetTestWithID(id !== undefined || id !== null ? id : 0);
                console.log(apiResponse);

                //According to the status from API
                if (apiResponse.status === 200) {
                    setTestId(apiResponse.data.TestID);
                    setTestName(apiResponse.data.TestName);
                    setMskills(apiResponse.data.MandatorySkills);
                    setOskills(apiResponse.data.OptionalSkills);
                    setComplexity(apiResponse.data.Complexity);
                    setLoading(false);

                } else {
                    setHasErr(true);
                    setErrMsg(apiResponse.message);
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

        setTestId(id);
        GetSkillDetails();
    }, []);

    const handleSave = async () => {
        try {
            setSaveLoading(true);
            const payload = {
                TestID: id,
                testName: testName,
                mandatorySkills: mskills,
                optionalSkills: oskills,
                complexity: complexity
            }
            const apiResponse = await UpdateTestAPI(payload);
            console.log("UpdateTestAPI", apiResponse);

            //According to the status from API
            if (apiResponse.status === 200) {
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

    //to capture the mskills and update the skillsData list
    // useEffect(()=>{
    //     const filteredOptions = skillsDataList?.filter(
    //         (item) => !mskills.includes(item.value)
    //     );
    //     setSkillsData(filteredOptions);

    //     const filteredOskills = oskills?.filter(
    //         (item) => !mskills.includes(item)
    //     );
    //     setOskills(filteredOskills);      
    // },[mskills]);

    const updateMSkills = (value) => {
        setMskills(value);
    }

    const updateOSkills = (value) => {
        setOskills(value);
    }

    //handling change events
    const handleTestName = (event) => {
        setTestName(event.target.value);
    }

    return (
        <div className="layout-outer">
            {contextHolder}
            <div className="layout-inner">
                <div className="title-bar">
                    <h1>Edit Test</h1>

                    <div className="button-holder">
                        <Button onClick={handleCancel}>Back</Button>
                    </div>
                </div>

                <Divider />
                {loading ? <Spin /> :
                // <Input
                //     placeholder="Skill Name"
                //     value={testName}
                //     // onChange={(e) => setSkillName(e.target.value)}
                //     name="skillName"
                //     style={{ maxWidth: '500px' }}
                // >

                // </Input>

                <div className="content-wrapper form-center">
                    <Form
                        name="basic"
                        layout="vertical"
                        style={{
                            width: '100%',
                            maxWidth: 600,
                        }}
                        initialValues={{
                            testId: testId,
                            testName: testName,
                            mandatorySkills: mskills,
                            optionalSkills: oskills,
                            complexity: complexity
                        }}
                        autoComplete="off"
                        onFinish={handleSave}
                    >
                        <Form.Item
                            label="Test ID"
                            name="testId"
                        >
                            <Input
                                value={testId}
                                defaultValue={id}
                                disabled
                            />
                        </Form.Item>

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
                                defaultValue={testName}
                                onChange={handleTestName}
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
                                onChange={(value) => updateMSkills(value)}
                                mode="multiple"
                                defaultActiveFirstOption
                                style={{
                                    width: '100%'
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
                                onChange={(value) => updateOSkills(value)}
                                mode="multiple"
                                style={{
                                    width: '100%'
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
                                onChange={(value) => { setComplexity(value) }}
                                style={{
                                    width: '100%'
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
}
            </div>
        </div>
    )
}

export default EditTests