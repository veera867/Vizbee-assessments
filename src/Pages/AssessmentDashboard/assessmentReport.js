// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Button, message, Divider } from 'antd';
// import { Document, Page } from 'react-pdf';
// import { Space, Spin, Card } from 'antd';
// import { Col, Row } from 'antd';
// import './dashboard.css';
// import GetAssessmentReports from '../../Apis/Assessments/assessmentReports'
// import ScheduleAssessmentAPI from '../../Apis/Assessments/ScheduleAssessmentAPI';
// import LoadJobsAPI from '../../Apis/Jobs/LoadJobsAPI'
// import LoadTestsAPI from '../../Apis/Tests/LoadTestsAPI'
// import PdfToImage from './sample';



// const AssesmentReport = () => {
//     const navigate = useNavigate();
//     const location = useLocation()
//     const [messageApi, contextHolder] = message.useMessage();
//     const [responseData, setResponseData] = useState()
//     const [loading, setLoading] = useState(false);
//     const [decodedContent, setDecodedContent] = useState('');
//     const [base64Data, setBase64Data] = useState('');
//     const [base64Pdf, setBase64Pdf] = useState('');

//     const handleBase64Response = (base64Response) => {
//         const decodedString = atob(base64Response); // Decode the base64 string
//         setDecodedContent(decodedString);
//     };


//     //pdf data
//     const [pdfData, setPdfData] = useState('');

//     const [pdfBlob, setPdfBlob] = React.useState(null);
//     // React.useEffect(() => {
//     //     // Base64-encoded PDF data
//     //     const base64Pdf = apiResponse.data;

//     //     // Decode base64 to Blob object
//     //     const byteCharacters = atob(base64Pdf);
//     //     const byteArrays = [];

//     //     for (let i = 0; i < byteCharacters.length; i++) {
//     //         byteArrays.push(byteCharacters.charCodeAt(i));
//     //     }

//     //     const blob = new Blob([new Uint8Array(byteArrays)], { type: 'application/pdf' });
//     //     console.log("blobbbb", URL.createObjectURL(blob))
//     //     setPdfBlob(blob);
//     // }, []);


//     //temporary auth token verification process
//     //has to create an api for verification of authToken
//     useEffect(() => {
//         const token = localStorage.getItem('authtoken');
//         if (!token) {
//             navigate('/auth/login');
//         }
//     }, []);

//     React.useEffect(() => {
//         // Base64-encoded PDF data
//         const base64Pdf = 'here we need to pass api response data i.e, base64 path';

//         // Decode base64 to Blob object
//         const byteCharacters = atob(base64Pdf);
//         const byteArrays = [];

//         for (let i = 0; i < byteCharacters.length; i++) {
//             byteArrays.push(byteCharacters.charCodeAt(i));
//         }

//         const blob = new Blob([new Uint8Array(byteArrays)], { type: 'application/pdf' });
//         console.log("blobbbb", URL.createObjectURL(blob))
//         setPdfBlob(blob);
//     }, []);

//     const base64ToBlob = (base64Data) => {
//         const byteCharacters = atob(base64Data);
//         const byteArrays = [];

//         for (let i = 0; i < byteCharacters.length; i++) {
//             byteArrays.push(byteCharacters.charCodeAt(i));
//         }

//         return new Blob([new Uint8Array(byteArrays)], { type: 'application/pdf' });
//     };


//     const fetchAssessmentReportsData = async (jdNumber) => {
//         setLoading(true)
//         const apiResponse = await GetAssessmentReports(jdNumber)
//         console.log("fetchReportsData", apiResponse)

//         // const pdfBlob = base64ToBlob(apiResponse?.data);

//         // // Read the Blob object as a data URL
//         // const reader = new FileReader();
//         // reader.onloadend = () => {
//         //     setPdfData(reader.result);
//         // };
//         // reader.readAsDataURL(pdfBlob);




//         if (apiResponse.status == 200) {
//             setResponseData(apiResponse.data.reports)
//             setBase64Pdf(apiResponse.data.data);
//             setLoading(false)
//             setBase64Data(apiResponse?.data?.data);
//             const decodedUrl = window.atob(apiResponse?.data?.data);
//             // handleBase64Response(apiResponse?.data?.data)
//             const base64Pdf = apiResponse.data.data;

//         // Decode base64 to Blob object
//         const byteCharacters = atob(base64Pdf);
//         const byteArrays = [];

//         for (let i = 0; i < byteCharacters.length; i++) {
//             byteArrays.push(byteCharacters.charCodeAt(i));
//         }

//         const blob = new Blob([new Uint8Array(byteArrays)], { type: 'application/pdf' });
//         console.log("blobbbb", URL.createObjectURL(blob))
//         setPdfBlob(blob);

//         }
//         else {
//             setLoading(false)
//             messageApi.open({
//                 type: 'error',
//                 content: apiResponse.message,
//             });
//         }
//     }

   

   


//     const handleCancel = () => {
//         navigate(-1);
//     }

//     return (
//         <div className="layout-outer">
//             {contextHolder}
//             <div className="layout-inner">
//                 <div className="title-bar">
//                     <h1> Assessment Report</h1>

//                     <div className="button-holder">
//                         <Button onClick={handleCancel}>Back</Button>
//                     </div>
//                 </div>
//                 <Divider />
//                 {loading ? (
//                     <> <Space size="middle">
//                         <Spin size="large" />
//                     </Space>
//                     </>
//                 ) : (
//                     <div className="content-wrapper form-center">
//                         <Row>
//                             <Col span={12}>
//                             </Col>
//                             <Col span={12}>
//                                 <PdfToImage pdfData={pdfBlob} />
//                             </Col>
//                         </Row>
//                     </div>
//                 )}
//             </div>

//         </div>
//     )
// }
// export default AssesmentReport;