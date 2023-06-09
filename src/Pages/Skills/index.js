import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {PlusOutlined,EditFilled,DeleteFilled} from '@ant-design/icons';
import { Table,Modal ,Button,message, Divider  } from 'antd';

import GetSkillsAPI from '../../Apis/Skills/getSkillsAPI';
import DeleteSkillsAPI from '../../Apis/Skills/DeleteSkillsAPI';

import './skills.css';

function Skills() {

    const navigate= useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [skills,setSkills] = useState([
        //dummy data for testing purpose only. Can be removed!!
        // {
        //     SkillID : 1,
        //     SkillName : 'Python',
        //     // questionnaire: [
        //     //     {
        //     //         question : 'What is Python',
        //     //         answer : 'Pytho is a programming langauge'
        //     //     },
        //     //     {
        //     //         question : 'How to compile python code?',
        //     //         answer : 'Using Python file.py cmd'
        //     //     },
        //     //     {
        //     //         question : 'What is the stable version of Python?',
        //     //         answer : 'Latest LTS is 3.10.0'
        //     //     }
        //     // ]
        // },
        // {
        //     SkillID : 2,
        //     SkillName : 'Java',
        //     // questionnaire: [
        //     //     {
        //     //         question : 'What is Java',
        //     //         answer : 'Java is a programming langauge'
        //     //     },
        //     //     {
        //     //         question : 'How to compile Java code?',
        //     //         answer : 'Using javac file.java cmd'
        //     //     },
        //     //     {
        //     //         question : 'What is the stable version of Java?',
        //     //         answer : 'Latest LTS is 16.8.0'
        //     //     }
        //     // ]
        // },
        // {
        //     SkillID : 3,
        //     SkillName : 'JavaScript',
        //     // questionnaire: [
        //     //     {
        //     //         question : 'What is JavaScript',
        //     //         answer : 'JavScript is a programming langauge'
        //     //     },
        //     //     {
        //     //         question : 'How to compile JavaScript code?',
        //     //         answer : 'Using node file.js or in browser console.'
        //     //     },
        //     //     {
        //     //         question : 'What is the stable version of JavaScript?',
        //     //         answer : 'Latest ECMAScript'
        //     //     }
        //     // ]
        // }
    ]);

    //error boundaries and loaders
    const [loading,setLoading] = useState(false);
    const [hasErr,setHasErr] = useState(false);
    const [errMsg,setErrMsg] = useState('');

    //for delete confirm box
    const [cnfmDel,setCnfmDel] = useState(false);
    const [delId,setDelId] = useState(0);
    const [confirmLoading,setConfirmLoading] = useState(false);

    //temporary auth token verification process
    //has to create an api for verification of authToken
    useEffect(()=>{
        const token = localStorage.getItem('authtoken');
        if(!token){
            navigate('/auth/login');
        }
    },[]);

    useEffect(()=>{
        async function getSkills(){
            setLoading(true);
            try{
                const apiResponse = await GetSkillsAPI({});
                console.log(apiResponse);
    
                //According to the status from API
                if(apiResponse.status == 200){
                    setSkills(apiResponse.data.skills);
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
            getSkills();
        }, 1000) 
       
    },[]);

    // Delete Functionality
    const handleRemove = async (record) => {
        setCnfmDel(true);
        setDelId(record.SkillID);
    }
    const handleDelOk = async () => {
        setConfirmLoading(true);
        try{
            const apiResponse = await DeleteSkillsAPI(delId);
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
            title: 'Skill Id',
            dataIndex: 'SkillID',
            key: 'SkillID',
        },
        {
            title: 'Skill Name',
            dataIndex: 'SkillName',
            key: 'SkillName',
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (record) => <div className="button-holder">
                <Button icon={<EditFilled />} href={`skills/edit/${record.SkillID}`}></Button>
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
                    <h1>Skills Dashboard</h1>

                    <div className="button-holder">
                        <Button type="primary" icon={<PlusOutlined />} href={`skills/new`}>Add skill</Button>
                    </div>
                </div>

                <Divider />
                
                <div className="content-wrapper">
                    <Table dataSource={skills} columns={columns} loading={loading}/>
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

export default Skills