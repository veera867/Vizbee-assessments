import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, message, Divider, Form, Input, Select, Spin } from 'antd';

import GetSkillsAPI from '../../Apis/Skills/getSkillsAPI';
import UpdateJobAPI from '../../Apis/Jobs/updateJob';
import GetJobWithID from '../../Apis/Jobs/GetJobWithID';
import '../AssessmentDashboard/dashboard.css';

function EditJobs() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [messageApi, contextHolder] = message.useMessage();

    //error boundaries and loaders
    const [loading, setLoading] = useState(true);
    const [fetchFinished, setFetchFinished] = useState(false);

    const [hasErr, setHasErr] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const [data, setData] = useState([]);

    const [jdId, setJdId] = useState(0);
    const [jdName, setJdName] = useState('');
    const [mskills, setMskills] = useState([]);
    const [oskills, setOskills] = useState([]);
    const [complexity, setComplexity] = useState('');
    const [totalPositions, setTotalPositions] = useState('');
    const [jobDescription, setJobDescription] = useState('')

    const [skillsDataList, setSkillsDataList] = useState();
    const [skillsData, setSkillsData] = useState()

    const [saveLoading, setSaveLoading] = useState(false);
    const [initialFormValues, setInitialFormValues] = useState({
        jdId: '',
        jdName: '',
        mandatorySkills: [],
        optionalSkills: [],
        complexity: '',
        totalPositions: '',
        jobDescription: ''
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
            console.log("response", apiResponse)

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
        console.log("Data changed : ", data);
        //console.log("fetch Finished : ",fetchFinished);

        if (fetchFinished) {
            setLoading(false);

            setJdId(data.JobID);
            setJdName(data.jdName);
            setMskills(data.mandatorySkills);
            setOskills(data.optionalSkills);
            setComplexity(data.complexity);
            setTotalPositions(data.totalPositions);
            setJobDescription(data.jobDescription)
            setInitialFormValues({
                jdId: data.JobID,
                jdName: data.jdName,
                mandatorySkills: data.mandatorySkills,
                optionalSkills: data.optionalSkills,
                complexity: data.complexity,
                totalPositions: data.totalPositions,
                jobDescription: data.jobDescription
            });
        }
    }, [data, fetchFinished]);

    useEffect(() => {
        async function GetJobDetails() {
            setLoading(true);

            try {
                const apiResponse = await GetJobWithID(id !== undefined || id !== null ? id : 0);

                //According to the status from API
                if (apiResponse.status === 200) {
                    console.log("success", apiResponse);
                    setData(apiResponse.data);
                    setFetchFinished(true);
                    setLoading(true);
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

        setJdId();
        GetJobDetails();
    }, []);

    const handleSave = async () => {
        try {
            setSaveLoading(true);
            const payload = {
                JobID: jdId,
                jdName: jdName,
                mandatorySkills: mskills,
                optionalSkills: oskills,
                complexity: complexity,
                totalPositions: totalPositions,
                jobDescription: jobDescription
            }
            const apiResponse = await UpdateJobAPI(payload);
            //According to the status from API
            if (apiResponse.status === 200) {
                setSaveLoading(false);
                messageApi.open({
                    type: 'success',
                    content: apiResponse.data.message,
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
                setSaveLoading(false);
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
        setMskills(value);
    }

    const updateOSkills = (value) => {
        setOskills(value);
    }


    const handleNameChange = (event) => {
        setJdName(event.target.value);
    }

    return (
        <div className="layout-outer">
            {contextHolder}
            <div className="layout-inner">
                {
                    !loading
                        ? hasErr
                            ? <p>{errMsg}</p>
                            : <>
                                <div className="title-bar">
                                    <h1>Edit Job</h1>

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
                                        initialValues={initialFormValues}
                                        autoComplete="off"
                                        onFinish={handleSave}
                                    >
                                        <Form.Item
                                            label="Job ID"
                                            name="jdId"
                                        >
                                            <Input
                                                value={jdId}
                                                // defaultValue={id}
                                                disabled
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            label="JD Name"
                                            name="jdName"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please enter name!',
                                                }
                                            ]}
                                        >
                                            <Input
                                                value={jdName}
                                                // defaultValue={jdName}
                                                onChange={handleNameChange}
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
                                                defaultActiveFirstOption={mskills}
                                                //   defaultValue={mskills}
                                                onChange={(value) => updateMSkills(value)}
                                                mode="multiple"
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
                                                //       defaultValue={oskills}
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
                                                //    defaultValue={complexity}
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
                                        <Form.Item
                                            label="No Of Positions"
                                            name="totalPositions"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please enter No Of Positions!',
                                                }
                                            ]}
                                        >
                                            <Input
                                                value={totalPositions}
                                                onChange={(value) => setTotalPositions(value.target.value)}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Job Description"
                                            name="jobDescription"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please enter Jd Name!',
                                                }
                                            ]}
                                        >

                                            <Input.TextArea rows={4}
                                                value={jobDescription}
                                                onChange={(value) => setJobDescription(value.target.value)}
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
                                                            ? <Button type="primary" htmlType="submit" loading>Updaing</Button>
                                                            : <Button type="primary" htmlType="submit">Update</Button>
                                                    }
                                                </div>
                                            </Form.Item>
                                        </div>
                                    </Form>
                                </div>
                            </>
                        : <Spin></Spin>
                }
            </div>
        </div>
    )
}

export default EditJobs