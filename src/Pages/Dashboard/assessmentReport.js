import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, message, Divider } from 'antd';
import { Space, Spin } from 'antd';
import { Col, Row } from 'antd';
import './dashboard.css';
import GetAssessmentReports from '../../Apis/Assessments/assessmentReports'
import ScheduleAssessmentAPI from '../../Apis/Assessments/ScheduleAssessmentAPI';
import LoadJobsAPI from '../../Apis/Jobs/LoadJobsAPI'
import LoadTestsAPI from '../../Apis/Tests/LoadTestsAPI'

const AssesmentReport = () => {
    const navigate = useNavigate();
    const location = useLocation()
    const [messageApi, contextHolder] = message.useMessage();
    const [responseData, setResponseData] = useState()
    const [loading, setLoading] = useState(false);

    //temporary auth token verification process
    //has to create an api for verification of authToken
    useEffect(()=>{
        const token = localStorage.getItem('authtoken');
        if(!token){
            navigate('/auth/login');
        }
    },[]);

    const fetchAssessmentReportsData = async (jdNumber) => {
        setLoading(true)
        const apiResponse = await GetAssessmentReports(jdNumber)
        console.log("fetchReportsData", apiResponse)
        if (apiResponse.status == 200) {
            setResponseData(apiResponse.data.reports)
            setLoading(true)
        }
        else{
            setLoading(true)
            messageApi.open({
                type: 'error',
                content: apiResponse.message,
            });
        }
    }

    useEffect(() => {
        fetchAssessmentReportsData(location?.state?.jdNumber)
    }, [])




    const handleCancel = () => {
        navigate(-1);
    }

    return (
        <div className="layout-outer">
            {contextHolder}
            <div className="layout-inner">
                <div className="title-bar">
                    <h1> Assessment Report</h1>

                    <div className="button-holder">
                        <Button onClick={handleCancel}>Back</Button>
                    </div>
                </div>
                <Divider />
                {loading ? (
                    <> <Space size="middle">
                            <Spin size="large" />
                        </Space>
                    </>
                ) : (
                    <div className="content-wrapper form-center">
                        <Row>
                            <Col span={12}>
                            </Col>
                            <Col span={12}>
                                <img src="" alt="candidate iamge" />
                            </Col>
                        </Row>
                    </div>
                )}
             </div>
                
        </div>
    )
}
export default AssesmentReport;