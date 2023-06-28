import axios from "../axiosInstance.js";

let axiosConfig = {
    headers: {
        //"Content-Type" : "application/json",
        //"Access-Control-Allow-Origin" : "*",
        //"Access-Control-Allow-Headers" : "Content-Type, Authorization, X-Requested-With",
        //"Access-Control-Allow-Methods" : "GET, POST, PUT, DELETE, OPTIONS",
    }
};

const GetSpecificSchdules = async (id) => {
    const payload = {
        jobId:id
    }

    //This api has to be replaced.
    const link = `getspecificschedules`;

    return await axios.post(link,payload,axiosConfig)
    .then((result)=>{
        return result;
    })
    .catch((error)=>{
        console.log(error);
        console.log(error.config);
        throw error;
    })
}

export default GetSpecificSchdules;