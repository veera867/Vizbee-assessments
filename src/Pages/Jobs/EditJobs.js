import React, {useState,useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button,message, Divider, Form, Input, Select } from 'antd';

import GetSkillsAPI from '../../Apis/Skills/getSkillsAPI';
import CreateJobAPI from '../../Apis/Jobs/CreateJobAPI';
import GetJobWithID from '../../Apis/Jobs/GetJobWithID';
import '../Dashboard/dashboard.css';

function EditJobs() {
    const {id} = useParams();
    const navigate = useNavigate();

    const [messageApi, contextHolder] = message.useMessage();

    //error boundaries and loaders
    const [loading,setLoading] = useState(false);
    const [hasErr,setHasErr] = useState(false);
    const [errMsg,setErrMsg] = useState('');    

    const [jdId,setJdId] = useState(0);
    const [jdName,setJdName] = useState();
    const [mskills,setMskills] = useState();
    const [oskills,setOskills] = useState();
    const [complexity,setComplexity] = useState();

    const [skillsDataList,setSkillsDataList] = useState();
    const [skillsData, setSkillsData] = useState()

    const [saveLoading,setSaveLoading] = useState(false);

    useEffect(()=> {
        fetchSkillsData()
        console.log("useEffect")
    },[])

    const fetchSkillsData = async() => {
        console.log("fetch")
        try{
            const response = await GetSkillsAPI()
            console.log("response", response)

            if(response.status === 200){
                const selectOptions = response.data.skills.map(item => ({
                    value: item.SkillName,
                    label: item.SkillName
                }))
                setSkillsData(selectOptions);
                setSkillsDataList(selectOptions);
            } else {
                messageApi.open({
                    type: 'error',
                    content: response.message,
                });                  
            }
        } catch (err) {
            console.log(err);
            messageApi.open({
                type: 'error',
                content: err.message,
            });                  
        }
    }

    useEffect(()=>{
        async function GetJobDetails(){
            setLoading(true);
            try{
                const apiResponse = await GetJobWithID(id !== undefined || id !== null ? id : 0);
                console.log(apiResponse);
    
                //According to the status from API
                if(apiResponse.status === 200){
                    setJdId(apiResponse.data.jdId);
                    setJdName(apiResponse.data.jdName);
                    setMskills(apiResponse.data.mandatorySkills);
                    setOskills(apiResponse.data.optionalSkills);
                    setComplexity(apiResponse.data.complexity);
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

        setJdId(id);
        GetJobDetails();
    },[]);

    const handleSave = async () => {
        try{
            setSaveLoading(true);
            const payload = {
                jdId: id,
                jdName: jdName,
                mandatorySkills: mskills,
                optionalSkills: oskills,
                complexity: complexity
            }
            const apiResponse = await CreateJobAPI(payload);
            console.log(apiResponse);

            //According to the status from API
            if(apiResponse.status === 200){
                setSaveLoading(false);
                messageApi.open({
                    type: 'success',
                    content: apiResponse.message,
                });           
                navigate(-1);
            } else {
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

    const handleCancel = () => {
        navigate(-1);
    }

    //to capture the mskills and update the skillsData list
    useEffect(()=>{
        const filteredOptions = skillsDataList?.filter(item => mskills === item.skillName);
        setSkillsData(filteredOptions);

        if(mskills === oskills){
            setOskills(null);
        }
    },[mskills]);

    const updateMSkills = (value) => {       
        setMskills(value);
    }

    const updateOSkills = (value) => {       
        setOskills(value);
    }

    return (
        <div className="layout-outer">
            {contextHolder}
            <div className="layout-inner">
                <div className="title-bar">
                    <h1>Edit Job</h1>

                    <div className="button-holder">
                        <Button onClick={handleCancel}>Back</Button>
                    </div>
                </div>

                <Divider />
                
                <div className="content-wrapper form-center">
                    <Form
                        name="basic"
                        layout="vertical"
                        style={{
                            width: '100%',
                            maxWidth: 600,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        autoComplete="off"
                        onFinish={handleSave}
                    >
                        <Form.Item
                            label="Job ID"
                            name="jdId"
                        >
                            <Input 
                                value={jdId}
                                defaultValue={id}
                                disabled
                            />
                        </Form.Item>

                        <Form.Item
                            label="JD Name"
                            name="jdName"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter name!',
                                }
                            ]}
                        >
                            <Input 
                                value={jdName}
                                onChange={(value)=>setJdName(value)}
                            />
                        </Form.Item>


                        <Form.Item
                            label="Mandatory Skills"
                            name="mandatorySkills"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select!',
                                },
                            ]}
                        >
                            <Select
                                value={mskills}
                                onChange={(value)=>updateMSkills(value)}
                                //mode="multiple"
                                style={{
                                    width : '100%'
                                }}
                                options={skillsData}
                            ></Select>
                        </Form.Item>

                        <Form.Item
                            label="Optional Skills"
                            name="optionalSkills"
                        >
                            <Select
                                value={oskills}
                                onChange={(value)=>updateOSkills(value)}
                                //mode="multiple"
                                style={{
                                    width : '100%'
                                }}
                                options={skillsData}
                            ></Select>
                        </Form.Item>

                        <Form.Item
                            label="Complexity"
                            name="complexity"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select!',
                                },
                            ]}
                        >
                            <Select
                                value={complexity}
                                onChange={(value)=>{setComplexity(value)}}
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
                        </Form.Item>

                        <div className="title-bar">
                            <h1>{''}</h1>

                            <Form.Item>
                                <div className="button-holder">
                                    <Button danger onClick={handleCancel}>Cancel</Button>
                                    <span></span>
                                    {
                                        saveLoading
                                        ? <Button type="primary" htmlType="submit" loading>Save</Button>
                                        : <Button type="primary" htmlType="submit">Save</Button>
                                    }
                                </div>
                            </Form.Item>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default EditJobs