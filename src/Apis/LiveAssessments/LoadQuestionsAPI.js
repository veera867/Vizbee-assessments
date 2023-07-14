import axios from '../axiosInstance.js';

let axiosConfig = {
    headers: {
        //"Content-Type" : "application/json",
        //"Access-Control-Allow-Origin" : "*",
        //"Access-Control-Allow-Headers" : "Content-Type, Authorization, X-Requested-With",
        //"Access-Control-Allow-Methods" : "GET, POST, PUT, DELETE, OPTIONS",
    }
};

const LoadQuestionsAPI = async (payload) => {
    const token = localStorage.getItem('authtoken');
    payload.token = token;

    console.log("load", payload)
    // const payload = {
    //     test_id : id
    // }
    //This api has to be replaced.
    const url = `/getquestions`;

    return await axios.post(url,payload,axiosConfig)
    .then((result)=>{
        return result;
    })
    .catch((error)=>{
        console.log(error);
        console.log(error.config);
        throw error;
    })
}

export default LoadQuestionsAPI;