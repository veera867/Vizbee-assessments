import React,{useState,useEffect} from 'react';
import {PlusOutlined,EditFilled,DeleteFilled,EyeFilled} from '@ant-design/icons';
import { Table,Modal ,Button,message, Spin, Divider  } from 'antd';

import LoadJobsAPI from '../../Apis/Jobs/LoadJobsAPI';
import DeleteJobAPI from '../../Apis/Jobs/DeleteJobAPI';
import '../Skills/skills.css';

function Jobs() {

    const [messageApi, contextHolder] = message.useMessage();

    const [jobs,setJobs] = useState([
        /*
        {
            jdId : 1,
            jdName: 'Developer',
            mandatorySkills: ['Html','Java'],
            optionalSkills: ['React'],
            totalScore: 85,
            pass: 'Pass',
            fail: '',
        },
        {
            jdId : 2,
            jdName: 'Testing',
            mandatorySkills: ['Regression','Java'],
            optionalSkills: ['Selenium'],
            totalScore: 45,
            pass: '',
            fail: 'Fail',
        }
        */
    ]);

    //error boundaries and loaders
    const [loading,setLoading] = useState(false);
    const [hasErr,setHasErr] = useState(false);
    const [errMsg,setErrMsg] = useState('');

    //for delete confirm box
    const [cnfmDel,setCnfmDel] = useState(false);
    const [delId,setDelId] = useState(0);
    const [confirmLoading,setConfirmLoading] = useState(false);
    
    console.log("jobs", jobs)
    useEffect(()=>{
        async function getJobs(){
            setLoading(true);
            try{
                const apiResponse = await LoadJobsAPI({});
                console.log("apiResponse",apiResponse);
    
                //According to the status from API
                if(apiResponse.status == 200){
                    console.log("success")
                    setJobs(apiResponse.data.skills);
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
            getJobs();
        }, 1000) 

        
    },[]);

    // Delete Functionality
    const handleRemove = async (record) => {
        setCnfmDel(true);
        setDelId(record.testId);
    }
    const handleDelOk = async () => {
        setConfirmLoading(true);
        try{
            const apiResponse = await DeleteJobAPI(delId);
            console.log(apiResponse);

            //According to the status from API
            if(apiResponse.status === 200){
                setConfirmLoading(false);
                setCnfmDel(false);
                setDelId(null);

                messageApi.open({
                    type: 'success',
                    content: 'Deleted Successfully',
                });              
            } else {
                setConfirmLoading(false);
                setCnfmDel(false);
                setDelId(null);

                messageApi.open({
                    type: 'error',
                    content: apiResponse.message,
                });              
            }    
        } catch (err) {
            console.log(err.message);
            setConfirmLoading(false);
            setCnfmDel(false);
            setDelId(null);

            messageApi.open({
                type: 'error',
                content: err.message,
            });              
        }    
    }
    const handleDelCancel = () => {
        setCnfmDel(false);
        setDelId(null);
    }
    
    const columns = [
        {
            title: 'JD Name',
            dataIndex: 'jdName',
            key: 'jdName',
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
            title: 'Total No Of Positions',
            dataIndex: 'totalPositions',
            key: 'totalPositions',
        },
        // {
        //     title: 'Selected Positions',
        //     dataIndex: 'pass',
        //     key: 'pass',
        // },
        // {
        //     title: 'Remaining Positions',
        //     dataIndex: 'fail',
        //     key: 'fail',
        // },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (record) => <div className="button-holder">
                <Button icon={<EyeFilled />} href={`/app/asmt-dashboard/`} />
                <span></span>
                <Button icon={<EditFilled />} href={`jobs/edit/${record.jdId}`}></Button>
                <span></span>
                <Button icon={<DeleteFilled />} onClick={() => handleRemove(record)}></Button>
            </div>,
        }        
    ];

    return (
        <div className="layout-outer">
            {contextHolder}
            <div className="layout-inner">
                <div className="title-bar">
                    <h1>Jobs Dashboard</h1>

                    <div className="button-holder">
                        <Button type="primary" icon={<PlusOutlined />} href={`jobs/new`}>Create Job</Button>
                    </div>
                </div>

                <Divider />
                
                <div className="content-wrapper">
                    {
                        loading
                        ? <Spin tip="loading"></Spin>
                        : <Table dataSource={jobs} columns={columns} />
                    }
                </div>
            </div>
            <Modal
                title="Delete"
                open={cnfmDel}
                onOk={handleDelOk}
                confirmLoading={confirmLoading}
                onCancel={handleDelCancel}
            >
                <p>Are you sure to delete?</p>
            </Modal>
        </div>
    )
}

export default Jobs