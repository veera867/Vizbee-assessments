import React,{useState,useEffect} from 'react';
import {PlusOutlined} from '@ant-design/icons';
import { Table ,Button,message, Spin, Divider  } from 'antd';

import LoadAssessmentsAPI from '../../Apis/Assessments/LoadAssessmentsAPI';

import './dashboard.css';

function Dashboard() {

    const [messageApi, contextHolder] = message.useMessage();

    const [assessments,setAssessments] = useState([
        //dummy data for testing purpose only. Can be removed!!
        {
            jdNumber : 1,
            candidate : 'Veera',
            mandatorySkills : 'React',
            optionalSkills : 'Java',
            scheduleDate : '15/05/2023',
            interviewStatus : 'Scheduled'
        },
        {
            jdNumber : 2,
            candidate : 'Shiva',
            mandatorySkills : 'Java',
            optionalSkills : '.NET',
            scheduleDate : '10/05/2023',
            interviewStatus : 'Completed'
        },
        {
            jdNumber : 3,
            candidate : 'Venkat',
            mandatorySkills : 'React',
            optionalSkills : 'Java',
            scheduleDate : '14/05/2023',
            interviewStatus : 'Scheduled'
        },
        {
            jdNumber : 4,
            candidate : 'John',
            mandatorySkills : 'C++',
            optionalSkills : 'C | DSA',
            scheduleDate : '13/05/2023',
            interviewStatus : 'Scheduled'
        }
    ]);

    //error boundaries and loaders
    const [loading,setLoading] = useState(false);
    const [hasErr,setHasErr] = useState(false);
    const [errMsg,setErrMsg] = useState('');

    useEffect(()=>{
        async function getSkills(){
            setLoading(true);
            try{
                const apiResponse = await LoadAssessmentsAPI({});
                console.log(apiResponse);
    
                //According to the status from API
                if(apiResponse.status === 200){
                    setAssessments(apiResponse.data);
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

        getSkills();
    },[]);
    
    const columns = [
        {
            title: 'JD Number',
            dataIndex: 'jdNumber',
            key: 'jdNumber',
        },
        {
            title: 'Candidate',
            dataIndex: 'candidate',
            key: 'candidate',
        },
        {
            title: 'Mandatory Skills',
            dataIndex: 'mandatorySkills',
            key: 'mandatorySkills',
        },
        {
            title: 'Optional Skills',
            dataIndex: 'optionalSkills',
            key: 'optionalSkills',
        },
        {
            title: 'Schedule Date',
            dataIndex: 'scheduleDate',
            key: 'scheduleDate',
        },
        {
            title: 'Interview Status',
            dataIndex: 'interviewStatus',
            key: 'interviewStatus',
        },
        {
            title: 'Report',
            dataIndex: 'report',
            key: 'report',
        }
    ];

    return (
        <div className="layout-outer">
            {contextHolder}
            <div className="layout-inner">
                <div className="title-bar">
                    <h1>Assessment Dashboard</h1>

                    <div className="button-holder">
                        <Button type="primary" href={`/app/asmt-dashboard/schedule`}>Schedule Assessment</Button>
                    </div>
                </div>

                <Divider />
                
                <div className="content-wrapper">
                    {
                        loading
                        ? <Spin tip="loading"></Spin>
                        : <Table dataSource={assessments} columns={columns} />
                    }
                </div>
            </div>
        </div>
    )
}

export default Dashboard