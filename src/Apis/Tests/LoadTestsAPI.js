import axios from "../axiosInstance.js";

let axiosConfig = {
    headers: {
        //"Content-Type" : "application/json",
        //"Access-Control-Allow-Origin" : "*",
        //"Access-Control-Allow-Headers" : "Content-Type, Authorization, X-Requested-With",
        //"Access-Control-Allow-Methods" : "GET, POST, PUT, DELETE, OPTIONS",
    }
};

const LoadTestsAPI = async () => {

    //This api has to be replaced.
    const url = `/tests/list`;

    return await axios.get(url,axiosConfig)
    .then((result)=>{
        return result;
    })
    .catch((error)=>{
        console.log(error);
        console.log(error.config);
        throw error;
    })
}

export default LoadTestsAPI;