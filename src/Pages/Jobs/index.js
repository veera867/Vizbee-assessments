import React, { useState, useEffect } from 'react';
import { PlusOutlined, EditFilled, DeleteFilled, EyeFilled, DownloadOutlined } from '@ant-design/icons';
import { Table, Modal, Button, message, Spin, Divider, Tooltip } from 'antd';

import { CSVLink } from 'react-csv';

import LoadJobsAPI from '../../Apis/Jobs/LoadJobsAPI';
import DeleteJobAPI from '../../Apis/Jobs/DeleteJobAPI';
import '../Skills/skills.css';
import { useNavigate } from 'react-router-dom';
import GetSpecificSchdules from '../../Apis/Assessments/getParticularSchedular';

const Jobs = () => {
    const navigate = useNavigate()
    const [messageApi, contextHolder] = message.useMessage();

    const [jobs, setJobs] = useState([]);



    //error boundaries and loaders
    const [loading, setLoading] = useState(false);
    const [hasErr, setHasErr] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    //for delete confirm box
    const [cnfmDel, setCnfmDel] = useState(false);
    const [delId, setDelId] = useState(0);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [isModalOpenForEyeIcon, setIsModalOpenForEyeIcon] = useState(false)
    const [selectedRowData, setSelectedRowData] = useState()
    const [selectedRowId, setSelectedRowId] = useState()
    const [deletedSkillId, setDeletedSkillId] = useState(null);

    //temporary auth token verification process
    //has to create an api for verification of authToken
    useEffect(() => {
        const token = localStorage.getItem('authtoken');
        if (!token) {
            navigate('/auth/login');
        }
    }, []);

    console.log("jobs", jobs)
    useEffect(() => {
        async function getJobs() {
            setLoading(true);
            // let token = localStorage.getItem("authToken");
            try {
                const apiResponse = await LoadJobsAPI();
                console.log("apiResponse", apiResponse);

                //According to the status from API
                if (apiResponse.status == 200) {
                    console.log("success")
                    setJobs(apiResponse.data.skills);
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
            getJobs();
        }, 1000)


    }, []);

    // Delete Functionality
    useEffect(() => {
        if (deletedSkillId) {
            setJobs(prevSkills => prevSkills.filter(skill => skill.JobID !== deletedSkillId));
            setDeletedSkillId(null);
        }
    }, [deletedSkillId]);
    console.log("jobsssssssss", jobs)

    const handleRemove = async (record) => {
        setCnfmDel(true);
        setDelId(record.JobID);
    }
    const handleDelOk = async () => {
        setConfirmLoading(true);
        try {
            const apiResponse = await DeleteJobAPI(delId);
            console.log(apiResponse);

            //According to the status from API
            if (apiResponse.status === 200) {
                setConfirmLoading(false);
                setCnfmDel(false);
                setDelId(null);
                setDeletedSkillId(delId); // Store the deleted skill ID

                setJobs(prevSkills => prevSkills.filter(skill => skill.JobID !== delId));

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

    useEffect(() => {
        if (isModalOpenForEyeIcon) {
            getParticularAssesmentData(selectedRowId);
        }
    }, [isModalOpenForEyeIcon])

    const getParticularAssesmentData = async () => {
        setLoading(true)
        try {
            const apiResponse = await GetSpecificSchdules(selectedRowId)
            if (apiResponse.status === 200) {
                setLoading(false)
                setSelectedRowData(apiResponse?.data.schedules)
                console.log("getParticularAssesmentData", apiResponse)
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

    const handleEyeClick = async (rowData) => {

        setSelectedRowId(rowData.JobID)
        setLoading(true)
        setIsModalOpenForEyeIcon(true)

    }

    const handleEyeCancel = () => {
        setIsModalOpenForEyeIcon(false)
    }



    const assessmentDashboardColumns = [
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
            title: 'Score',
            dataIndex: 'act_Score',
            key: 'act_Score',
        }

        // {
        //     title: 'Report',
        //     dataIndex: 'report',
        //     key: 'report',
        // }
    ];

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
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (record) => <div className="button-holder">
                <Button icon={<EyeFilled />} onClick={() => handleEyeClick(record)} />
                <span></span>
                <Button icon={<EditFilled />} href={`jobs/edit/${record.JobID}`}></Button>
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
                    <Table dataSource={jobs} columns={columns} loading={loading} rowKey="JobID" />
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
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: "20px" }}>
                        <div>Filter Data</div>
                        {/* Title of the modal */}
                        {selectedRowData?.length > 0 &&
                            <CSVLink data={selectedRowData} filename="schedule.csv" style={{ marginRight: '35px' }}>
                                {/* <Tooltip title="Download CSV" > */}
                                <DownloadOutlined style={{ fontSize: "24px" }} />
                                {/* </Tooltip> */}
                                <span >  Download CSV </span>
                            </CSVLink>
                        }
                    </div>
                }
                open={isModalOpenForEyeIcon}
                width="1000px"
                onCancel={handleEyeCancel}
                onOk={handleEyeCancel}
            >
                <Table dataSource={selectedRowData} columns={assessmentDashboardColumns} loading={loading} rowKey="JobID" />
            </Modal>
        </div>
    );
}

export default Jobs;