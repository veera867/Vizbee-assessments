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
            try {
                const apiResponse = await LoadJobsAPI({});
                console.log("apiResponse", apiResponse);

                //According to the status from API
                if (apiResponse.status == 200) {
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
        setTimeout(() => {
            getJobs();
        }, 1000)


    }, []);

    // Delete Functionality
    const handleRemove = async (record) => {
        setCnfmDel(true);
        setDelId(record.testId);
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

    useEffect(() => {
        if (isModalOpenForEyeIcon) {
            getParticularAssesmentData(selectedRowId);
        }
    }, [isModalOpenForEyeIcon])

    const getParticularAssesmentData = async () => {
        setLoading(true)
        const apiResponse = await GetSpecificSchdules(selectedRowId)
        if (apiResponse.status === 200) {
            setLoading(false)
            setSelectedRowData(apiResponse?.data.schedules)
            console.log("getParticularAssesmentData", apiResponse)
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
                    <Table dataSource={jobs} columns={columns} loading={loading} />
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
                <Table dataSource={selectedRowData} columns={assessmentDashboardColumns} loading={loading} />
            </Modal>
        </div>
    );
}

export default Jobs;