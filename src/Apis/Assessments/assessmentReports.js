import axios from "../axiosInstance.js";



const GetAssessmentReports = async (id) => {
    const token = localStorage.getItem('authtoken');
    const payload = {
        jobId:id
    }

    //This api has to be replaced.
    const link = `Display`;

    return await axios.get(link,payload,{
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

export default GetAssessmentReports;