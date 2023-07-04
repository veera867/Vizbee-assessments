import axios from "../axiosInstance.js";

let axiosConfig = {
    headers: {
        // 'Authorization': `Bearer ${token}`
        //"Content-Type" : "application/json",
        //"Access-Control-Allow-Origin" : "*",
        //"Access-Control-Allow-Headers" : "Content-Type, Authorization, X-Requested-With",
        //"Access-Control-Allow-Methods" : "GET, POST, PUT, DELETE, OPTIONS",
    }
};

const LoadJobsAPI = async () => {
    const values = {};
    const token = localStorage.getItem('authtoken');
    values.token = token;

    //This api has to be replaced.
    const url = `/jobs/list`;

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

export default LoadJobsAPI;