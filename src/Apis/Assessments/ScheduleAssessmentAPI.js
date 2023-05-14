import axios from "axios";

let axiosConfig = {
    headers: {
        "Content-Type" : "multipart/form-data",
        //"Access-Control-Allow-Origin" : "*",
        //"Access-Control-Allow-Headers" : "Content-Type, Authorization, X-Requested-With",
        //"Access-Control-Allow-Methods" : "GET, POST, PUT, DELETE, OPTIONS",
    }
};

const ScheduleAssessmentAPI = async (values) => {
    console.log("payload : ",values);

    //This api has to be replaced.
    const url = `https://8000-gathianalyt-skillmetric-oirvhb1lrus.ws-us96b.gitpod.io/assessment-scheduler/schedule`;

    return await axios.post(url,values,axiosConfig)
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