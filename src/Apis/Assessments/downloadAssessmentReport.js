import axios from "../axiosInstance.js";

let axiosConfig = {
    headers: {
        //"Content-Type" : "application/json",
        //"Access-Control-Allow-Origin" : "*",
        //"Access-Control-Allow-Headers" : "Content-Type, Authorization, X-Requested-With",
        //"Access-Control-Allow-Methods" : "GET, POST, PUT, DELETE, OPTIONS",
    }
};

const DownloadAssessmentReports = async (id) => {
    const token = localStorage.getItem('authtoken');
    console.log("DownloadAssessmentReports", id)
    const token = localStorage.getItem('authtoken');
    const payload = {
        scheduleId:id,
        token: token
    }

    //This api has to be replaced.
    const link = `downloadpdff`;

    return await axios.post(link,payload,{
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        }})
    .then((result)=>{
        return result;
    })
    .catch((error)=>{
        console.log(error);
        console.log(error.config);
        throw error;
    })
}

export default DownloadAssessmentReports;