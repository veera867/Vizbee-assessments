import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {PlusOutlined,EditFilled,DeleteFilled} from '@ant-design/icons';
import { Table,Modal ,Button,message, Spin, Divider  } from 'antd';

import LoadTestsAPI from '../../Apis/Tests/LoadTestsAPI';
import DeleteTestAPI from '../../Apis/Tests/DeleteTestAPI';

import '../Skills/skills.css';

const  Tests = () => {

    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [tests,setTests] = useState([]);
    const [deletedSkillId, setDeletedSkillId] = useState(null);

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
        async function getTests(){
            setLoading(true);
            try{
                const apiResponse = await LoadTestsAPI({});
                console.log("apiResponse",apiResponse);
    
                //According to the status from API
                if(apiResponse.status == 200){
                    console.log("success")
                    setTests(apiResponse.data.skills);
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
         setTimeout(() => {
            getTests();
         }, 1000)

       
    },[]);

    // Delete Functionality
    const handleRemove = async (record) => {
        setCnfmDel(true);
        setDelId(record.testId);
    }
   
    useEffect(() => {
        if (deletedSkillId) {
            setTests(prevSkills => prevSkills.filter(skill => skill.testId !== deletedSkillId));
          setDeletedSkillId(null);
        }
      }, [deletedSkillId]);

    const handleDelOk = async () => {
        setConfirmLoading(true);
        try{
            const apiResponse = await DeleteTestAPI(delId);
            console.log(apiResponse);

            //According to the status from API
            if(apiResponse.status === 200){
                setConfirmLoading(false);
                setCnfmDel(false);
                setDelId(null);
                setDeletedSkillId(delId); // Store the deleted skill ID

                setTests(prevSkills => prevSkills.filter(skill => skill.testId !== delId));

                messageApi.open({
                    type: 'success',
                    content: 'Deleted Successfully',
                });              
            } 
            else if (apiResponse.status === 401) {
                // Authentication failed
                messageApi.open({
                    type: 'error',
                    content: `${apiResponse.statusText}  ${apiResponse.data.detail}`,
                });
                setConfirmLoading(false);
                setTimeout(() => {
                    navigate('/auth/login');
                }, 1000)
                
            } else if (apiResponse.status === 403) {
                // Permission denied
                setConfirmLoading(false);
                setHasErr(true);
                setErrMsg(apiResponse.message);
                messageApi.open({
                    type: 'error',
                    content: apiResponse.statusText,
                });
            } else if (apiResponse.status === 404) {
                // Skill not found
                setConfirmLoading(false);
                setHasErr(true);
                setErrMsg(apiResponse.statusText);
                messageApi.open({
                    type: 'error',
                    content: apiResponse.statusText,
                });
            } else {
                setConfirmLoading(false);
                setHasErr(true);
                setErrMsg(apiResponse.message);
                messageApi.open({
                    type: 'error',
                    content: apiResponse.message,
                });
            }
        } catch (err) {
            setConfirmLoading(false);
            setHasErr(true);
            setErrMsg(err.message);

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
            title: 'Test Id',
            dataIndex: 'testId',
            key: 'testId',
        },
        {
            title: 'Test Name',
            dataIndex: 'testName',
            key: 'testName',
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
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (record) => <div className="button-holder">
                <Button icon={<EditFilled />} href={`tests/edit/${record.testId}`}></Button>
                <span></span>
                <Button icon={<DeleteFilled />} onClick={() => handleRemove(record)}></Button>
            </div>,
        }        
    ];
    console.log("tests", tests)

    return (
        <div className="layout-outer">
            {contextHolder}
            <div className="layout-inner">
                <div className="title-bar">
                    <h1>Tests Dashboard</h1>

                    <div className="button-holder">
                        <Button type="primary" icon={<PlusOutlined />} href={`tests/new`}>Create Test</Button>
                    </div>
                </div>

                <Divider />
                
                <div className="content-wrapper">
                    <Table dataSource={tests} columns={columns} loading={loading} rowKey="testId"/>
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

export default Tests