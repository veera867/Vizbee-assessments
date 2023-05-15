import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

import {PlusOutlined,EditFilled,DeleteFilled,CloudUploadOutlined} from '@ant-design/icons';
import { Table,Modal ,Button,message, Spin, Input, Space, Divider, Select  } from 'antd';

import CreateSkillsAPI from '../../Apis/Skills/CreateSkillsAPI';
import GetQuestionnaireAPI from '../../Apis/Skills/GetQuestionnaireAPI';

import './skills.css';

function CreateSkill() {

    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [questions,setQuestions] = useState([
        //dummy data for testing purpose only. Can be removed!!
        {
            slno : 1,
            question : 'What is Python?',
            answer : 'Python is a porgramming language.',
            importance: 'Beginner',
        },
        {
            slno : 2,
            question : 'What is Java?',
            answer : 'Java is a porgramming language.',
            importance: 'Intermediate',
        },
        {
            slno : 3,
            question : 'What is JavaScript?',
            answer : 'JavaScript is a porgramming language.',
            importance: 'Beginner',
        },
    ]);

    //error boundaries and loaders
    const [loading,setLoading] = useState(false);
    const [hasErr,setHasErr] = useState(false);
    const [errMsg,setErrMsg] = useState('');

    const [skillName,setSkillName] = useState('');
    const [skillGroup,setSkillGroup] = useState('');

    //for delete confirm box
    const [cnfmDel,setCnfmDel] = useState(false);
    const [delId,setDelId] = useState(0);
    const [confirmLoading,setConfirmLoading] = useState(false);

    //for edit popup box
    const [openEdit,setOpenEdit] = useState(false);
    const [editId,setEditId] = useState(0);
    const [editLoading,setEditLoading] = useState(false);
    const [currentEditModel,setCurrentEditModel] = useState({});
    const [question,setQuestion] = useState('');
    const [answer,setAnswer] = useState('');
    const [importance,setImportance] = useState('');


    useEffect(()=>{
        async function getQuestionnaire(){
            setLoading(true);
            try{
                const apiResponse = await GetQuestionnaireAPI({});
                console.log(apiResponse);
    
                //According to the status from API
                if(apiResponse.status === 200){
                    setQuestions(apiResponse.data);
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

        getQuestionnaire();
    },[]);

    const handleCancel = () => {
        navigate(-1);
    }

    const handleSave = async () => {
        try{
            const payload = {
                skillName : skillName,
                skillGroup : skillGroup,
                questionnaire : questions
            }
            const apiResponse = await CreateSkillsAPI(payload);
            console.log(apiResponse);

            //According to the status from API
            if(apiResponse.status === 200){
                setQuestions(apiResponse.data);
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

    //Edit Functionality
    const handleEdit = async (record) => {
        setEditId(record.slno);
        setCurrentEditModel(record);
        setQuestion(record.question);
        setAnswer(record.answer);
        setImportance(record.importance);

        setOpenEdit(true);
    }
    const handleEdit2 = () =>{
        setEditId(0);
        setCurrentEditModel({
            slno : 0,
            question : '',
            answer : '',
            importance: 'Beginner',
        });
        setQuestion('');
        setAnswer('');
        setImportance('Beginner');

        setOpenEdit(true);
    }
    const handleEditOk = async () => {
        setEditLoading(true);
        try{
            if(editId === 0){
                let temp = {
                    slno : questions.length > 0 
                                ? question.length === 1 
                                    ? questions.length+1 
                                    : question.length 
                                : 1,
                    question : question,
                    answer : answer,
                    importance: importance,
                };
                setQuestions([...questions,temp]);
            } else {
                questions.map(ques => {
                    if(ques.slno === editId){
                        ques.question = question;
                        ques.answer = answer;
                        ques.importance = importance;
                    }
    
                    return null;
                })
            }
            setEditLoading(false);
            setOpenEdit(false);
            setEditId(null);
        } catch (err) {
            console.log(err.message);
            setEditLoading(false);
            setOpenEdit(false);
            setEditId(null);

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
        setDelId(record.slno);
    }
    const handleDelOk = async () => {
        setConfirmLoading(true);
        try{
            setQuestions(questions.filter(ques => ques.slno !== delId));

            setConfirmLoading(false);
            setCnfmDel(false);
            setDelId(null);
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
            title: 'Sl. no',
            dataIndex: 'slno',
            key: 'slno',
        },
        {
            title: 'Question',
            dataIndex: 'question',
            key: 'question',
        },
        {
            title: 'Answer',
            dataIndex: 'answer',
            key: 'answer',
        },
        {
            title: 'Importance',
            dataIndex: 'importance',
            key: 'importance',
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
                    <h1>Create New</h1>

                    <div className="button-holder">
                        <Button danger onClick={handleCancel}>Cancel</Button>
                        <span></span>
                        <Button type="primary" onClick={handleSave}>Save</Button>
                    </div>
                </div>

                <Divider />

                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                    <label for="skillName">Skill Name : </label>
                    <Input 
                        placeholder="Skill Name"
                        value={skillName}
                        onChange={(e) => setSkillName(e.target.value)}
                        name="skillName"
                        style={{maxWidth:'500px'}}
                    ></Input>

                    <label for="skillGroup">Skill Group : </label>
                    <Input 
                        placeholder="Skill Group"
                        value={skillGroup}
                        onChange={(e) => setSkillGroup(e.target.value)}
                        name="skillGroup"
                        style={{maxWidth:'500px'}}
                    ></Input>
                </Space>

                <div className="title-bar">
                    <h1>{''}</h1>

                    <div className="button-holder">
                        <Button type="primary" shape="circle" onClick={handleEdit2} icon={<PlusOutlined />}/>
                        <span></span>
                        <Button type="primary" shape="circle" onClick={()=>{}} icon={<CloudUploadOutlined />}/>
                        <span></span>
                        <Button type="primary" onClick={()=>{}}>Auto Generate</Button>
                    </div>
                </div>
                <div className="content-wrapper">
                    {
                        loading
                        ? <Spin tip="loading"></Spin>
                        : <Table dataSource={questions} columns={columns} />
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
                title="Edit Questionnaire"
                open={openEdit}
                onOk={handleEditOk}
                confirmLoading={editLoading}
                onCancel={handleEditCancel}
            >
                <Divider />
                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                    <label for="slno">Sl No : </label>
                    <Input 
                        placeholder="Sl No"
                        defaultValue={editId}
                        value={editId}
                        name="slno"
                        disabled
                    ></Input>

                    <label for="question">Question : </label>
                    <Input 
                        placeholder="Question"
                        defaultValue={currentEditModel.question}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        name="question"
                    ></Input>

                    <label for="answer">Answer : </label>
                    <Input 
                        placeholder="Answer"
                        defaultValue={currentEditModel.answer}
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        name="answer"
                    ></Input>

                    <label for="importance">Importance : </label>
                    <Select
                        defaultValue='Beginner'
                        onChange={(value)=>setImportance(value)}
                        style={{
                            width : '100%'
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
                </Space>
            </Modal>
        </div>
    )
}

export default CreateSkill