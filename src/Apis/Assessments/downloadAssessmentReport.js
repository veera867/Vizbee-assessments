import axios from "../axiosInstance.js";



const DownloadAssessmentReports = async (id) => {
    const token = localStorage.getItem('authtoken');
    console.log("DownloadAssessmentReports", id)
    //const token = localStorage.getItem('authtoken');
    const payload = {
        scheduleId:id,
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