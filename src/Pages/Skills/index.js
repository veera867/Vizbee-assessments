import React,{useState,useEffect} from 'react';
import {PlusOutlined,EditFilled,DeleteFilled} from '@ant-design/icons';
import { Table,Modal ,Button,message, Spin, Input, Space, Divider  } from 'antd';

import GetSkillsAPI from '../../Apis/Skills/getSkillsAPI';
import DeleteSkillsAPI from '../../Apis/Skills/DeleteSkillsAPI';
import EditKSillsAPI from '../../Apis/Skills/EditSkillsAPI';

import './skills.css';

function Skills() {

    const [messageApi, contextHolder] = message.useMessage();

    const [skills,setSkills] = useState([
        //dummy data for testing purpose only. Can be removed!!
        {
            skillId : 1,
            skillName : 'Python',
            question : 'What is Python?'
        },
        {
            skillId : 2,
            skillName : 'Java',
            question : 'What is Java?'
        },
        {
            skillId : 3,
            skillName : 'JavaScript',
            question : 'What is JavaScript?'
        }
    ]);

    //error boundaries and loaders
    const [loading,setLoading] = useState(false);
    const [hasErr,setHasErr] = useState(false);
    const [errMsg,setErrMsg] = useState('');

    //for delete confirm box
    const [cnfmDel,setCnfmDel] = useState(false);
    const [delId,setDelId] = useState(0);
    const [confirmLoading,setConfirmLoading] = useState(false);

    //for edit popup box
    const [openEdit,setOpenEdit] = useState(false);
    const [editId,setEditId] = useState(0);
    const [editLoading,setEditLoading] = useState(false);
    const [currentEditModel,setCurrentEditModel] = useState({});
    const [editName,setEditName] = useState('');
    const [editQues,setEditQues] = useState('');


    useEffect(()=>{
        async function getSkills(){
            setLoading(true);
            try{
                const apiResponse = await GetSkillsAPI({});
                console.log(apiResponse);
    
                //According to the status from API
                if(apiResponse.status === 200){
                    setSkills(apiResponse.data);
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

    //Edit Functionality
    const handleEdit = async (record) => {
        setCurrentEditModel(record);
        setEditName(record.skillName);
        setEditQues(record.question);

        setOpenEdit(true);
        setEditId(record.skillId);
    }
    const handleEditOk = async () => {
        setEditLoading(true);
        try{
            const payload = {
                skillId : editId,
                skillName: editName,
                question: editQues
            };

            const apiResponse = await EditKSillsAPI(payload);
            console.log(apiResponse);

            //According to the status from API
            if(apiResponse.status === 200){
                setEditLoading(false);
                setCnfmDel(false);
                setDelId(null);

                messageApi.open({
                    type: 'success',
                    content: 'Successfully Saved.',
                });              
            } else {
                setEditLoading(false);
                setCnfmDel(false);
                setDelId(null);

                messageApi.open({
                    type: 'error',
                    content: apiResponse.message,
                });              
            }    
        } catch (err) {
            console.log(err.message);
            setEditLoading(false);
            setCnfmDel(false);
            setDelId(null);

            messageApi.open({
                type: 'error',
                content: err.message,
            });              
        }    
    }
    const handleEditCancel = () => {
        setOpenEdit(false);
        setEditId(null);
    }

    // Delete Functionality
    const handleRemove = async (record) => {
        setCnfmDel(true);
        setDelId(record.skillId);
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
            dataIndex: 'skillId',
            key: 'skillId',
        },
        {
            title: 'Skill Name',
            dataIndex: 'skillName',
            key: 'skillName',
        },
        {
            title: 'Question',
            dataIndex: 'question',
            key: 'question',
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (record) => <div className="button-holder">
                <Button icon={<EditFilled />} onClick={() => handleEdit(record)}></Button>
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

                <div className="content-wrapper">
                    {
                        loading
                        ? <Spin tip="loading"></Spin>
                        : <Table dataSource={skills} columns={columns} />
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

            <Modal
                title="Edit Skill"
                open={openEdit}
                onOk={handleEditOk}
                confirmLoading={editLoading}
                onCancel={handleEditCancel}
            >
                <Divider />
                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                    <label for="skillId">Skill Id : </label>
                    <Input 
                        placeholder="Skill Id"
                        defaultValue={currentEditModel.skillId}
                        name="skillId"
                        disabled
                    ></Input>

                    <label for="skillName">Skill Name : </label>
                    <Input 
                        placeholder="Skill Name"
                        defaultValue={currentEditModel.skillName}
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        name="skillName"
                    ></Input>

                    <label for="question">Question : </label>
                    <Input 
                        placeholder="Question"
                        defaultValue={currentEditModel.question}
                        value={editQues}
                        onChange={(e) => setEditQues(e.target.value)}
                        name="question"
                    ></Input>
                </Space>
            </Modal>
        </div>
    )
}

export default Skills