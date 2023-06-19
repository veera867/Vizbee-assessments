import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tooltip } from 'antd';
import processCSVData from './CSVparser';

import { PlusOutlined, EditFilled, DeleteFilled, CloudUploadOutlined } from '@ant-design/icons';
import { Table, Modal, Button, message, Spin, Input, Space, Divider, Select } from 'antd';

import CreateSkillsAPI from '../../Apis/Skills/CreateSkillsAPI';
import GetSkillWithID from '../../Apis/Skills/GetSkillWithID';

import './skills.css';

function EditSkill() {
    const { id } = useParams();

    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [questions, setQuestions] = useState([]);

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

    const [saveLoading,setSaveLoading] = useState(false);

    //for edit popup box
    const [openEdit, setOpenEdit] = useState(false);
    const [editId, setEditId] = useState(0);
    const [editLoading, setEditLoading] = useState(false);
    const [currentEditModel, setCurrentEditModel] = useState({});
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [importance, setImportance] = useState('');

    const fileInputRef = useRef(null);

    useEffect(() => {
        //dummy data for testing purpose only. Can be removed!!
        const dummy = {
            "status": "success",
            "message": "specific skill  is success",
            "SkillID": 612064758,
            "SkillName": "python",
            "SkillGroup": "Data Science",
            "ListOfQuestions": [
                {
                    "count": "1",
                    "Q": "What is the difference between a list and a tuple in Python?",
                    "A": "A list is a collection of items that can be modified, while a tuple is an immutable collection of items.",
                    "importance": "intermediate"
                },
                {
                    "count": "2",
                    "Q": "What is a dictionary in Python?",
                    "A": "A dictionary is an unordered collection of key-value pairs. It is used to store data in a key-value format, where keys are unique and values can be any Python object.",
                    "importance": "intermediate"
                },
                {
                    "count": "3",
                    "Q": "What is an exception in Python?",
                    "A": "An exception is an error that occurs during the execution of a program. Python provides a number of built-in exceptions to help debug errors and to handle errors gracefully.",
                    "importance": "intermediate"
                },
                {
                    "count": "4",
                    "Q": "What is the difference between a for loop and a while loop?",
                    "A": "A for loop is used to iterate over a sequence of items, while a while loop is used to execute code until a certain condition is met.",
                    "importance": "intermediate"
                },
                {
                    "count": "5",
                    "Q": "What is a function in Python?",
                    "A": "A function is a block of organized, reusable code that is used to perform a single, related action. Functions provide better modularity for your application and a high degree of code reusing.",
                    "importance": "intermediate"
                },
                {
                    "count": "6",
                    "Q": "What is the difference between local and global variables in Python?",
                    "A": "A local variable is only visible in the scope in which it is declared, while a global variable is visible throughout the entire program.",
                    "importance": "intermediate"
                },
                {
                    "count": "7",
                    "Q": "What is the purpose of the break statement in Python?",
                    "A": "The break statement is used to terminate the execution of a loop. It allows the program to \"break out\" of the loop and continue executing the code after the loop.",
                    "importance": "intermediate"
                },
                {
                    "count": "8",
                    "Q": "What is the purpose of the continue statement in Python?",
                    "A": "The continue statement is used to skip the rest of the code in a loop and move on to the next iteration. This is useful when you want to skip certain parts of the loop body.",
                    "importance": "intermediate"
                },
                {
                    "count": "9",
                    "Q": "What is the purpose of the pass statement in Python?",
                    "A": "The pass statement is used as a placeholder for code that has not yet been written. It is also used to prevent syntax errors when the code is not yet complete.",
                    "importance": "intermediate"
                },
                {
                    "count": "10",
                    "Q": "What is the difference between shallow and deep copy in Python?",
                    "A": "A shallow copy only copies the reference to an object, while a deep copy creates a new object and copies all of its contents.",
                    "importance": "intermediate"
                }
            ]
        }

        setSkillId(dummy.SkillID);
        setSkillName(dummy.SkillName);
        setSkillGroup(dummy.SkillGroup);
        setQuestions(dummy.ListOfQuestions);
        setLoading(false);        
        /*
        async function GetSkillDetails() {
            setLoading(true);
            try {
                const apiResponse = await GetSkillWithID(id !== undefined || id !== null ? id : 0);
                console.log(apiResponse);

                //According to the status from API
                if (apiResponse.status === 200) {
                    setSkillId(apiResponse.data.SelectkillId);
                    setSkillName(apiResponse.data.SkillName);
                    setSkillGroup(apiResponse.data.SkillGroup);
                    setQuestions(apiResponse.data.ListOfQuestions);

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

        setSkillId(id);
        GetSkillDetails();
        */
    }, []);

    const handleCancel = () => {
        navigate(-1);
    }

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleCSVUpload = (e) => {
        const file = e.target.files[0];

        try{
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
                SkillID: skillId,
                SkillName: skillName,
                SkillGroup: skillGroup,
                ListOfQuestions: questions
            }
            const apiResponse = await CreateSkillsAPI(payload);
            console.log(apiResponse);

            //According to the status from API
            if (apiResponse.status === 200) {
                //setQuestions(apiResponse.data.ListOfQuestions);
                messageApi.open({
                    type: 'success',
                    content: 'Saved successfully!'
                })
                navigate(-1);
                setSaveLoading(false);
            } else {
                setHasErr(true);
                setErrMsg(apiResponse.message);
                setSaveLoading(false);

                messageApi.open({
                    type: 'error',
                    content: apiResponse.message,
                });
            }
        } catch (err) {
            console.log(err.message);
            setSaveLoading(false);

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
            Q : '',
            A : '',
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
                    count : questions.length > 0
                        ? String(Number(questions[questions.length - 1].count) + 1)
                        : '1',
                    Q : question,
                    A : answer,
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
            setQuestions(questions.filter(ques => ques.count !== delId));

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
                    <h1>Edit Skill</h1>

                    <div className="button-holder">
                        <Button danger onClick={handleCancel} disabled={saveLoading}>Cancel</Button>
                        <span></span>
                        <Button type="primary" onClick={handleSave} disabled={saveLoading}>Save</Button>
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

export default EditSkill