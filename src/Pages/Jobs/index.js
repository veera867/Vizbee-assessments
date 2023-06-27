import React,{useState,useEffect} from 'react';
import {PlusOutlined,EditFilled,DeleteFilled,EyeFilled} from '@ant-design/icons';
import { Table,Modal ,Button,message, Spin, Divider  } from 'antd';
// import { stringify } from 'csv-stringify';
import { CSVLink } from 'react-csv';

import LoadJobsAPI from '../../Apis/Jobs/LoadJobsAPI';
import DeleteJobAPI from '../../Apis/Jobs/DeleteJobAPI';
import '../Skills/skills.css';
import { useNavigate } from 'react-router-dom';
import GetSpecificSchdules from '../../Apis/Assessments/getParticularSchedular';

function Jobs() {
    const navigate = useNavigate()
    const [messageApi, contextHolder] = message.useMessage();

    const [jobs,setJobs] = useState([
        
        // {
        //     "JobID": 619212406,
        //     "jdName": "sai",
        //     "mandatorySkills": "['python']",
        //     "optionalSkills": "['React']",
        //     "totalPositions": "2"
        // }
        
    ]);

    // const assesmentDashboardData = [
    //     {
    //         "ScheduleID": 619212545,
    //         "jdNumber": 619212407,
    //         "jdName": "sai",
    //         "testName": "pptp",
    //         "testId": 619212452,
    //         "candidateName": "sai",
    //         "candidateEmail": "careers.apexon@gmail.com",
    //         "hrEmail": "careers.apexon@gmail.com",
    //         "scheduleDate": "2023-06-23T21:33:00Z",
    //         "mandatorySkills": "['python']",
    //         "optionalSkills": "['React']",
    //         "status": null,
    //         "max_score": null,
    //         "act_Score": null,
    //         "percentage": null
    //     },
    //     {
    //         "ScheduleID": 619212853,
    //         "jdNumber": 619212406,
    //         "jdName": "sai",
    //         "testName": "pptp",
    //         "testId": 619212452,
    //         "candidateName": "sd",
    //         "candidateEmail": "shivendrakumar.tiwari@apexon.com",
    //         "hrEmail": "shivendrakumar.tiwari@apexon.com",
    //         "scheduleDate": "2023-06-20T21:28:00Z",
    //         "mandatorySkills": "['python']",
    //         "optionalSkills": "['React']",
    //         "status": null,
    //         "max_score": null,
    //         "act_Score": null,
    //         "percentage": null
    //     }
    // ]

    //error boundaries and loaders
    const [loading,setLoading] = useState(false);
    const [hasErr,setHasErr] = useState(false);
    const [errMsg,setErrMsg] = useState('');

    //for delete confirm box
    const [cnfmDel,setCnfmDel] = useState(false);
    const [delId,setDelId] = useState(0);
    const [confirmLoading,setConfirmLoading] = useState(false);
    const [isModalOpenForEyeIcon, setIsModalOpenForEyeIcon] = useState(false)
    const [selectedRowData, setSelectedRowData] = useState()
    const [selectedRowId, setSelectedRowId] = useState()
    
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

    useEffect(() => {
        if(isModalOpenForEyeIcon){
            getParticularAssesmentData(selectedRowId);
        }
    },[isModalOpenForEyeIcon])

    const getParticularAssesmentData = async() =>{
        const apiResponse = await GetSpecificSchdules(selectedRowId)
        setSelectedRowData(apiResponse?.data?.schedules)
        console.log("getParticularAssesmentData", apiResponse)
    }

    const handleEyeClick = async(rowData) => {

        setSelectedRowId(rowData.JobID)
        console.log("rowData", rowData)
        // setSelectedRowData(rowData)
        setIsModalOpenForEyeIcon(true)

    }

    const handleEyeCancel = () => {
        setIsModalOpenForEyeIcon(false)
    }

    /*
    const convertToCSV = (data) => {
        const csvData = [];
        const headers = Object.keys(data[0]);
        
        csvData.push(headers); // Add headers as the first row

        data.forEach((row) => {
            const rowData = [];
            headers.forEach((header) => {
                rowData.push(row[header]);
            });
            csvData.push(rowData);
        });
    
        return csvData;
    };      

    const handleDownloadCSV = () => {
        const csvData = convertToCSV(selectedRowData);

        stringify(csvData, (err, output) => {
            if (err) {
                console.error('Error converting data to CSV:', err);
                return;
            }

            // Create a Blob from the CSV data
            const blob = new Blob([output], { type: 'text/csv;charset=utf-8;' });

            // Create a temporary link element to trigger the download
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.download = 'table_data.csv';

            // Simulate a click on the link to trigger the download
            link.click();

            // Clean up the temporary URL
            URL.revokeObjectURL(url);
        });
    };  
    */    

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
                    <Table dataSource={jobs} columns={columns} loading={loading}/>
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
                title="Filter Data"
                open={isModalOpenForEyeIcon}
                width="1000px"
                onCancel={handleEyeCancel}                
            >
                
                    {/* <CSVLink data={selectedRowData} filename="output.csv">
                        Download CSV
                    </CSVLink> */}
                
                <Table  dataSource={selectedRowData} columns={assessmentDashboardColumns}/>
            </Modal>
        </div>
    )
}

export default Jobs