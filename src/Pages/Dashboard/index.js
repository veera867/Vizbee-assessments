import React,{useState,useEffect} from 'react';
import {PlusOutlined} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { Table ,Button,message, Spin, Divider  } from 'antd';
import {EyeFilled} from '@ant-design/icons';

import LoadAssessmentsAPI from '../../Apis/Assessments/LoadAssessmentsAPI';

import './dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const filterJobData = location.state;
    console.log(filterJobData);
    // console.log("filterJobData", filterJobData)
    const [messageApi, contextHolder] = message.useMessage();

    const [assessments,setAssessments] = useState([]);

    //error boundaries and loaders
    const [loading,setLoading] = useState(false);
    const [hasErr,setHasErr] = useState(false);
    const [errMsg,setErrMsg] = useState('');

    //temporary auth token verification process
    //has to create an api for verification of authToken
    useEffect(()=>{
        const token = localStorage.getItem('authtoken');
        if(!token){
            navigate('/auth/login');
        }
    },[]);

    useEffect(()=>{
        async function getAssessments(){
            setLoading(true);
            try{
                const apiResponse = await LoadAssessmentsAPI({});
                console.log(apiResponse);
    
                //According to the status from API
                if(apiResponse.status === 200){
                    let dupData;
                    if(filterJobData !== null || filterJobData?.jobID !== undefined){
                        dupData = apiResponse.data.skills.filter(item => item.testId === filterJobData?.JobID);
                    }else {
                        dupData = apiResponse.data.skills;
                    }
                    console.log("dupData", dupData)
                    setAssessments(apiResponse.data.skills);
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
      
        setTimeout(() =>{
            getAssessments(); 
        }, 1000) 
       
    },[]);
    
    const columns = [
        {
            title: 'JD Name',
            dataIndex: 'jdName',
            key: 'jdName',
        },
        {
            title: 'candidate Name',
            dataIndex: 'candidateName',
            key: 'candidateName',
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
            dataIndex: 'status',
            key: 'status',
        },
    //       {
    //         title: 'Max Score',
    //         dataIndex: 'max_score',
    //          key: 'max_score',
    //    }, 
        {
            title: 'Percentage',
             dataIndex: 'percentage',
             key: 'percentage',
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (record) => <div className="button-holder">
                 <Button icon={<EyeFilled />} onClick={() => navigate("/app/asmt-dashboard/reports", {state:record})} />                            
            </div>
        } 

        // {
        //     title: 'Report',
        //     dataIndex: 'report',
        //     key: 'report',
       // }
    ];

    const handleEyeClick = (record) => {
        console.log("handleEyeClick",record)
        navigate("asmt-dashboard/reports", {state:record})
    }

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
                    <Table dataSource={assessments} columns={columns} loading={loading}/>
                </div>
            </div>
        </div>
    )
}

export default Dashboard