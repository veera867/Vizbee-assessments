import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, message, Divider, Form, Input, Select, Space, DatePicker, TimePicker } from 'antd';

import './dashboard.css';
import ScheduleAssessmentAPI from '../../Apis/Assessments/ScheduleAssessmentAPI';
import LoadJobsAPI from '../../Apis/Jobs/LoadJobsAPI'
import LoadTestsAPI from '../../Apis/Tests/LoadTestsAPI'

function Schedule() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [jdNumber, setJdNumber] = useState();
    const [jdName, setJdName] = useState();
    const [test, setTest] = useState();
    const [testId, setTestId] = useState()
    const [date, setDate] = useState();
    const [cmail, setCmail] = useState();
    const [cName, setCName] = useState()
    const [hmail, setHmail] = useState();
    const [jdNumberOptions, setJdNumberOptions] = useState()
    const [jdNameOptions, setJdNameOptions] = useState()
    const [testDataOptions, setTestDataOptions] = useState()
    const [jDData, setJDData] = useState()
    const [testData, setTestData] = useState()
    //console.log(hmail, "cmail", cmail)

    //usermail from localstore has to be fetched here and displayed
    useEffect(()=>{
        let hrmail = localStorage.getItem('usermail');
        setHmail(hrmail);
    },[]);

    const [saveLoading, setSaveLoading] = useState(false);
    const [mandatorySkills, setMandatorySkills] = useState()
    const [optionalSkills, setOptionalSkills] = useState()

    const handleDateSelect = (value) => {
        // const date = new Date(value);
        //console.log(value);
        const date = new Date(value); 
        let timeString = date.toTimeString().substring(0,5);
        let dateString = date.toISOString().substring(0,10);

        const formattedDate = dateString+' '+timeString;    
        console.log(formattedDate);
        
        setDate(formattedDate)
    }

    const handleTestSelectChange = (value) => {
        setTest(value)
        const filterData = testData.filter(item => item.testName == value)
        setTestId(filterData[0].testId)
        setMandatorySkills(filterData[0].mandatorySkills)
        setOptionalSkills(filterData[0].optionalSkills)
    }

    const handleEmailChange = (e) => {
        const value  = e.taget.value;
        const emaiList = value.split(',').map((email) => email.trim())
        setCmail(emaiList)
    }

    const handleJdNameChange = (values) => {
        console.log(jDData, "values", values)
        setJdNumber(values)
        const data = jDData.filter(item => item.JobID == values)
        console.log("data", data)
        const JdNumberoptionsdata = data.map(item => ({
            value: item.JobID,
            label: item.JobID
        }))
        setJdName(data[0].jdName)
        setJdNumberOptions(JdNumberoptionsdata)
        // setJdNameOptions(JdNameoptionsdata)
        // setJdName(data[0].JobID)
    }

    useEffect(() => {
        fetchJobDashboardData()
    }, [])

    const fetchJobDashboardData = async () => {
        const apiResponse = await LoadJobsAPI();
        console.log("apiResponse", apiResponse)
        setJDData(apiResponse.data.skills)
        //  setJdNumberOptions(apiResponse.data.skills)
        const JdnumOptions = apiResponse.data.skills.map(item => ({
            value: item.JobID,
            label: item.JobID

        }))

        const JdnameOptions = apiResponse.data.skills.map(item => ({
            value: item.JobID,
            label: item.jdName

        }))
        setJdNumberOptions(JdnumOptions)
        setJdNameOptions(JdnameOptions)

    }

    useEffect(() => {
        fetchTestData()
    }, [])

    const fetchTestData = async () => {
        try{
            const response = await LoadTestsAPI();
            console.log("test response", response)

            if(response.status === 200){
                const testOptions = response.data.skills.map( item => ({
                    value: item.testName,
                    label: item.testName
                }))
                setTestDataOptions(testOptions);
                setTestData(response.data.skills);
            }
        } catch(err) {
            console.log(err);
        }
    }

    const handleSave = async () => {
        try {
            setSaveLoading(true);

            const payload = {
                jdName: jdName,
                jdNumber: jdNumber,
                testName: test,
                testId: testId,
                candidateName: cName,
                candidateEmail: cmail,
                hrEmail: hmail,
                scheduleDate: date,
                mandatorySkills:mandatorySkills,
                optionalSkills:optionalSkills
            }
            const apiResponse = await ScheduleAssessmentAPI(payload);
            console.log(apiResponse);

            //According to the status from API
            if (apiResponse.status == 200) {
                console.log("aaaaaa")
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
                        <Space 
                            direction="horizontal" 
                            size="large" 
                            style={{ 
                                width:'100%',
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}
                        >
                        <Form.Item
                                label="JD Name"
                                name="JD Name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select!',
                                    }
                                ]}
                                style={{
                                    width: '100%',
                                }}
                            >
                                <Select
                                    value={jdName}
                                    onChange={handleJdNameChange}
                                    style={{
                                        width: '100%'
                                    }}
                                    options={jdNameOptions}
                                ></Select>
                            </Form.Item>

                            {/* <Form.Item
                                label="JD Number"
                                name="JD Number"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select!',
                                    }
                                ]}
                                style={{
                                    width: '100%',
                                }}
                            >
                                <Select
                                    value={jdNumber}
                                    // onChange={(value)=>{setJdNumber(value)}}
                                   // onChange={handleJDnumberSelect}
                                    style={{
                                        width: '100%'
                                    }}
                                    options={jdNumberOptions}

                                ></Select>
                            </Form.Item>                           */}



                            {/* <Form.Item
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
                            </Form.Item> */}
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
                                value={test}
                                // onChange={(value)=>{setTest(value)}}
                                onChange={handleTestSelectChange}
                                style={{
                                    width: '100%'
                                }}
                                options={testDataOptions}
                            ></Select>
                        </Form.Item>

                        <Form.Item
                            label="Schedule Date and Time"
                            name="Schedule Date"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select Date!',
                                },
                            ]}
                        >
                            {/*<DatePicker value={date} onChange={handleDateSelect} style={{ width: '100%' }}/>*/}
                            <DatePicker
                                showTime
                                format="YYYY-MM-DD HH:mm"
                                placeholder="ex. 12/06/2023 08:30"
                                value={date}
                                onChange={handleDateSelect}
                                onOk={handleDateSelect}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Candidate Name"
                            name="candidateName"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter  Name!',
                                },
                            ]}
                        >
                            <Input
                                placeholder='john'
                                value={cName}
                                onChange={(value) => setCName(value.target.value)}
                            />
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
                                // onChange={handleEmailChange}
                                onChange={(value) => setCmail(value.target.value)}
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
                                onChange={(value) => setHmail(value.target.value)}
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