import axios from "../axiosInstance.js";

let axiosConfig = {
    headers: {
        "Content-Type" : "multipart/form-data",
        //"Access-Control-Allow-Origin" : "*",
        //"Access-Control-Allow-Headers" : "Content-Type, Authorization, X-Requested-With",
        //"Access-Control-Allow-Methods" : "GET, POST, PUT, DELETE, OPTIONS",
    }
};

const SendAssessmentStatusAPI = async (values) => {
    const url = `/audio`;
    
    return await axios.post(url, values, axiosConfig)
    .then((result) => {
        return result;
    })
    .catch((error)=>{
        console.log(error);
        console.log(error.config);
        throw error;
    })
}

export default SendAssessmentStatusAPI;