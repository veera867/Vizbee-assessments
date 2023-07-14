import axios from "../axiosInstance.js";



const ScheduleAssessmentAPI = async (values) => {
    const token = localStorage.getItem('authtoken');    
    const url = `/assessment-scheduler/schedule`;

    return await axios.post(url,values,{
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

export default ScheduleAssessmentAPI;