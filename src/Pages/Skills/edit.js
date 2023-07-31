import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tooltip } from 'antd';
import processCSVData from './CSVparser';

import { PlusOutlined, EditFilled, DeleteFilled, CloudUploadOutlined } from '@ant-design/icons';
import { Table, Modal, Button, message, Spin, Input, Space, Divider, Select } from 'antd';

import UpdateSkillsAPI from '../../Apis/Skills/EditSkillsAPI';
import GetSkillWithID from '../../Apis/Skills/GetSkillWithID';

import './skills.css';

function EditSkill() {
    const { id } = useParams();

    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [questions, setQuestions] = useState([]);
    console.log("questionsquestions", questions)

    //error boundaries and loaders
    const [loading, setLoading] = useState(false);
    const [hasErr, setHasErr] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const [skillId, setSkillId] = useState(0);
    const [skillName, setSkillName] = useState('');
    const [skillGroup, setSkillGroup] = useState('');

    //for delete confirm box
    const [cnfmDel, setCnfmDel] = useState(false);
    const [delId, setDelId] = useState(0);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [saveLoading, setSaveLoading] = useState(false);

    //for edit popup box
    const [openEdit, setOpenEdit] = useState(false);
    const [editId, setEditId] = useState(0);
    const [editLoading, setEditLoading] = useState(false);
    const [currentEditModel, setCurrentEditModel] = useState({});
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [importance, setImportance] = useState('');

    const fileInputRef = useRef(null);

    //temporary auth token verification process
    //has to create an api for verification of authToken
    useEffect(() => {
        const token = localStorage.getItem('authtoken');
        if (!token) {
            navigate('/auth/login');
        }
    }, []);

    useEffect(() => {
        async function GetSkillDetails() {
            setLoading(true);
            try {
                const apiResponse = await GetSkillWithID(id !== undefined || id !== null ? id : 0);
                console.log(apiResponse);
                //According to the status from API
                if (apiResponse.status === 200) {
                    setSkillId(apiResponse.data.SkillID);
                    setSkillName(apiResponse.data.SkillName);
                    setSkillGroup(apiResponse.data.SkillGroup);
                    setQuestions(apiResponse.data.ListOfQuestions);
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
        setSkillId(id);
        GetSkillDetails();

    }, []);

    const handleCancel = () => {
        navigate(-1);
    }

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleCSVUpload = (e) => {
        const file = e.target.files[0];

        try {
            // Create a FileReader object
            const reader = new FileReader();

            // Define the onload function
            reader.onload = (event) => {
                const csvData = event.target.result;

                // Process the CSV data and extract the necessary information
                const extractedData = processCSVData(csvData);

                // Update the state with the extracted data
                setQuestions([...questions, ...extractedData]);

                messageApi.open({
                    type: 'success',
                    content: 'CSV file uploaded successfully.',
                });
            };
            // Read the contents of the file as text
            reader.readAsText(file);
        } catch (err) {
            console.log(err);
            messageApi.open({
                type: 'error',
                content: err.message,
            })
        }
    };

    const handleSave = async () => {
        try {
            setSaveLoading(true);
            const payload = {
                skillId: skillId,
                skillName: skillName,
                skillGroup: skillGroup,
                questionnaire: questions
            }
            const apiResponse = await UpdateSkillsAPI(payload);
            console.log("apiResponse", apiResponse);

          
            //According to the status from API
            if (apiResponse.status === 200) {
                //setQuestions(apiResponse.data.ListOfQuestions);
                messageApi.open({
                    type: 'success',
                    content: apiResponse?.data.message
                })

                setTimeout(() => {
                    navigate(-1);
                }, 500)
                
                setSaveLoading(false);
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

        //Edit Functionality
        const handleEdit = async (record) => {
            setEditId(record.count);
            setCurrentEditModel(record);
            setQuestion(record.Q);
            setAnswer(record.A);
            setImportance(record.importance);

            setOpenEdit(true);
        }
        const handleEdit2 = () => {
            setEditId(0);
            setCurrentEditModel({
                count: 0,
                Q: '',
                A: '',
                importance: 'beginner',
            });
            setQuestion('');
            setAnswer('');
            setImportance('beginner');

            setOpenEdit(true);
        }
        const handleEditOk = async () => {
            setEditLoading(true);
            try {
                if (editId === 0) {
                    let temp = {
                        count: questions.length > 0
                            ? String(Number(questions[questions.length - 1].count) + 1)
                            : '1',
                        Q: question,
                        A: answer,
                        importance: importance,
                    };
                    setQuestions([...questions, temp]);
                } else {
                    questions.map(ques => {
                        if (ques.count === editId) {
                            ques.Q = question;
                            ques.A = answer;
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
            setCurrentEditModel({});
            setEditId(null);
        }

        // Delete Functionality
        const handleRemove = async (record) => {
            setCnfmDel(true);
            setDelId(record.count);
        }
        const handleDelOk = async () => {
            setConfirmLoading(true);
            try {
                const questionsArragement = questions.filter(ques => ques.count !== delId);
                const questionsNumberArragement = questionsArragement.map((item, index) => ({
                    count: index + 1,
                    A: item.A,
                    Q: item.Q,
                    level: item.level
                }))
                setQuestions(questionsNumberArragement)
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
                dataIndex: 'count',
                key: 'count',
            },
            {
                title: 'Question',
                dataIndex: 'Q',
                key: 'Q',
            },
            {
                title: 'Answer',
                dataIndex: 'A',
                key: 'A',
            },
            {
                title: 'Importance',
                dataIndex: 'level',
                key: 'level',
                render: (importance, record) => {
                    console.log("importance", importance)
                    if (record.count === delId) {
                        return null; // Hide the importance value for the deleted row
                    }
                    return importance;
                },
            },
            {
                title: 'Action',
                dataIndex: '',
                key: 'x',
                render: (record) => (
                    <div className="button-holder">
                        <Button icon={<EditFilled />} onClick={() => handleEdit(record)}></Button>
                        <span></span>
                        <Button icon={<DeleteFilled />} onClick={() => handleRemove(record)}></Button>
                    </div>
                ),
            },
        ];


        return (
            <div className="layout-outer">
                {contextHolder}
                <div className="layout-inner">
                    <div className="title-bar">
                        <h1>Edit Skill</h1>

                        <div className="button-holder">
                            <Button danger onClick={handleCancel} disabled={saveLoading}>Cancel</Button>
                            <span></span>
                            <Button type="primary" onClick={handleSave} loading={saveLoading} >Update</Button>
                        </div>
                    </div>

                    <Divider />

                    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                        <label htmlFor="skillId">Skill Id : </label>
                        <Input
                            placeholder="Skill Id"
                            value={skillId}
                            disabled
                            name="skillId"
                            style={{ maxWidth: '500px' }}
                        ></Input>

                        <label htmlFor="skillName">Skill Name : </label>
                        <Input
                            placeholder="Skill Name"
                            value={skillName}
                            onChange={(e) => setSkillName(e.target.value)}
                            name="skillName"
                            style={{ maxWidth: '500px' }}
                        ></Input>

                        <label htmlFor="skillGroup">Skill Group : </label>
                        <Input
                            placeholder="Skill Group"
                            value={skillGroup}
                            onChange={(e) => setSkillGroup(e.target.value)}
                            name="skillGroup"
                            style={{ maxWidth: '500px' }}
                        ></Input>
                    </Space>

                    <div className="title-bar">
                        <h1>{''}</h1>

                        <div className="button-holder">
                            <Tooltip title="Add Questions">
                                <Button type="primary" shape="circle" onClick={handleEdit2} icon={<PlusOutlined />} />
                            </Tooltip>
                            <span></span>
                            <label htmlFor="csv-upload" style={{ marginBottom: 0 }}>
                                <Tooltip title="Csv File Upload">
                                    <Button type="primary"
                                        shape="circle"
                                        icon={<CloudUploadOutlined />}
                                        onClick={handleUploadClick}
                                    />
                                </Tooltip>

                                <input
                                    type="file"
                                    id="csv-upload"
                                    accept=".csv"
                                    style={{ display: 'none' }}
                                    ref={fileInputRef}
                                    onChange={handleCSVUpload}
                                />
                            </label>
                            <span></span>
                            {/*<Button type="primary" onClick={() => { }}>Auto Generate</Button>*/}
                        </div>
                    </div>
                    <div className="content-wrapper">
                        <Table dataSource={questions} columns={columns} loading={loading} />
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
                        <label htmlFor="slno">Sl No : </label>
                        <Input
                            placeholder="Sl No"
                            defaultValue={currentEditModel.count}
                            value={currentEditModel.count}
                            name="slno"
                            disabled
                        ></Input>

                        <label htmlFor="question">Question : </label>
                        <Input
                            placeholder="Question"
                            defaultValue={currentEditModel.Q}
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            name="question"
                        ></Input>

                        <label htmlFor="answer">Answer : </label>
                        <Input
                            placeholder="Answer"
                            defaultValue={currentEditModel.A}
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            name="answer"
                        ></Input>

                        <label htmlFor="importance">Importance : </label>
                        <Select
                            defaultValue={currentEditModel.importance}
                            value={importance}
                            onChange={(value) => setImportance(value)}
                            style={{
                                width: '100%'
                            }}
                            options={[
                                {
                                    value: 'beginner',
                                    label: 'Beginner'
                                },
                                {
                                    value: 'intermediate',
                                    label: 'Intermediate'
                                },
                                {
                                    value: 'pro',
                                    label: 'Pro'
                                }
                            ]}
                        ></Select>
                    </Space>
                </Modal>
            </div>
        )
    }

    export default EditSkill;