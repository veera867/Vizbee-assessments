import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, message, Divider, Form, Input, Select, Spin } from 'antd';

import UpdateTestAPI from '../../Apis/Tests/updateTest';
import GetTestWithID from '../../Apis/Tests/GetTestWithID';
import '../AssessmentDashboard/dashboard.css';
import GetSkillsAPI from '../../Apis/Skills/getSkillsAPI';

const EditTests = () =>{
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
    const [initialValues, setInitialValues] = useState({
        testId: 0,
        testName: '',
        mandatorySkills: [],
        optionalSkills: [],
        complexity: ''
    });

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
    }, [])

    const fetchSkillsData = async () => {
        setLoading(true);
        try {
            const apiResponse = await GetSkillsAPI()

            if (apiResponse.status === 200) {
                const selectOptions = apiResponse.data.skills.map(item => ({
                    value: item.SkillName,
                    label: item.SkillName
                }))
                setSkillsData(selectOptions);
                setSkillsDataList(selectOptions);
                setLoading(false);
            }
            else if (apiResponse.status === 401) {
                // Authentication failed
                messageApi.open({
                    type: 'error',
                    content: `${apiResponse.statusText}  ${apiResponse.data.detail}`,
                });
                setLoading(false);
                setTimeout(() => {
                    navigate('/auth/login');
                }, 1000)
                
            } else if (apiResponse.status === 403) {
                // Permission denied
                setLoading(false);
                setHasErr(true);
                setErrMsg(apiResponse.message);
                messageApi.open({
                    type: 'error',
                    content: apiResponse.statusText,
                });
            } else if (apiResponse.status === 404) {
                // Skill not found
                setLoading(false);
                setHasErr(true);
                setErrMsg(apiResponse.statusText);
                messageApi.open({
                    type: 'error',
                    content: apiResponse.statusText,
                });
            } else {
                setLoading(false);
                setHasErr(true);
                setErrMsg(apiResponse.message);
                messageApi.open({
                    type: 'error',
                    content: apiResponse.message,
                });
            }
        } catch (err) {
            setLoading(false);
            setHasErr(true);
            setErrMsg(err.message);

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
                    setInitialValues({
                        testId: apiResponse.data.TestID,
                        testName: apiResponse.data.TestName,
                        mandatorySkills: apiResponse.data.MandatorySkills,
                        optionalSkills: apiResponse.data.OptionalSkills,
                        complexity: apiResponse.data.Complexity
                    });

                }
                else if (apiResponse.status === 401) {
                    // Authentication failed
                    messageApi.open({
                        type: 'error',
                        content: `${apiResponse.statusText}  ${apiResponse.data.detail}`,
                    });
                    setLoading(false);
                    setTimeout(() => {
                        navigate('/auth/login');
                    }, 1000)
                    
                } else if (apiResponse.status === 403) {
                    // Permission denied
                    setLoading(false);
                    setHasErr(true);
                    setErrMsg(apiResponse.message);
                    messageApi.open({
                        type: 'error',
                        content: apiResponse.statusText,
                    });
                } else if (apiResponse.status === 404) {
                    // Skill not found
                    setLoading(false);
                    setHasErr(true);
                    setErrMsg(apiResponse.statusText);
                    messageApi.open({
                        type: 'error',
                        content: apiResponse.statusText,
                    });
                } else {
                    setLoading(false);
                    setHasErr(true);
                    setErrMsg(apiResponse.message);
                    messageApi.open({
                        type: 'error',
                        content: apiResponse.message,
                    });
                }
            } catch (err) {
                setLoading(false);
                setHasErr(true);
                setErrMsg(err.message);
    
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
                setTimeout(() => {
                navigate(-1);
                }, 500)
            } 
            else if (apiResponse.status === 401) {
                // Authentication failed
                messageApi.open({
                    type: 'error',
                    content: `${apiResponse.statusText}  ${apiResponse.data.detail}`,
                });
                setSaveLoading(false);
                setTimeout(() => {
                    navigate('/auth/login');
                }, 1000)
                
            } else if (apiResponse.status === 403) {
                // Permission denied
                setSaveLoading(false);
                setHasErr(true);
                setErrMsg(apiResponse.message);
                messageApi.open({
                    type: 'error',
                    content: apiResponse.statusText,
                });
            } else if (apiResponse.status === 404) {
                // Skill not found
                setLoading(false);
                setHasErr(true);
                setErrMsg(apiResponse.statusText);
                messageApi.open({
                    type: 'error',
                    content: apiResponse.statusText,
                });
            } else {
                setSaveLoading(false);
                setHasErr(true);
                setErrMsg(apiResponse.message);
                messageApi.open({
                    type: 'error',
                    content: apiResponse.message,
                });
            }
        } catch (err) {
            setSaveLoading(false);
            setHasErr(true);
            setErrMsg(err.message);

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
    useEffect(() => {
        const filteredOptions = skillsDataList?.filter(
            (item) => !mskills.includes(item.value)
        );
        setSkillsData(filteredOptions);

        const filteredOskills = oskills?.filter(
            (item) => !mskills.includes(item)
        );
        setOskills(filteredOskills);
    }, [mskills]);

    const updateMSkills = (value) => {
        // Update the mandatory skills state
        setMskills(value);
      
        // Update the optional skills dropdown options
        const filteredOptions = skillsDataList?.filter(
          (item) => !value.includes(item.value)
        );
        setOskills(filteredOptions);
      
        // Remove any initially selected optional skills that are now part of the mandatory skills
        const filteredOskills = oskills?.filter(
          (item) => !value.includes(item)
        );
        setOskills(filteredOskills);
      };

    const updateOSkills = (value) => {
        setOskills(value);

        // Update the mandatorySkills dropdown options
        // const filteredOptions = skillsDataList?.filter(
        //     (item) => !value.includes(item.value)
        // );
        // setMskills(filteredOptions);
    };

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
                            initialValues={initialValues}
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
                                    onChange={updateMSkills} // Update the onChange prop here
                                    mode="multiple"
                                    style={{
                                        width: '100%',
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
                                    onChange={updateOSkills}
                                    mode="multiple"
                                    style={{
                                        width: '100%',
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
                                                ? <Button type="primary" htmlType="submit" loading>Updateing</Button>
                                                : <Button type="primary" htmlType="submit">Update</Button>
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