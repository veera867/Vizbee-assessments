import axios from "../axiosInstance.js";

let axiosConfig = {
    headers: {
        //"Content-Type" : "multipart/form-data",
        //"Access-Control-Allow-Origin" : "*",
        //"Access-Control-Allow-Headers" : "Content-Type, Authorization, X-Requested-With",
        //"Access-Control-Allow-Methods" : "GET, POST, PUT, DELETE, OPTIONS",
    }
};

const DeleteTestAPI = async (id) => {
    const payload ={
        testId:id
    }
    //This api has to be replaced.
    const link = `test/delete`;

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

export default DeleteTestAPI;