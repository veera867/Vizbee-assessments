import axios from "../axiosInstance.js";

let axiosConfig = {
    headers: {
        // "Content-Type" : "multipart/form-data",
        //"Access-Control-Allow-Origin" : "*",
        //"Access-Control-Allow-Headers" : "Content-Type, Authorization, X-Requested-With",
        //"Access-Control-Allow-Methods" : "GET, POST, PUT, DELETE, OPTIONS",
    }
};

const UpdateJobAPI = async (values) => {
    // console.log("payload : ",values);
    const token = localStorage.getItem('authtoken')
    //This api has to be replaced.
    const token = localStorage.getItem('authtoken');
    values.token = token;

    const url = `update/job`;

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

export default UpdateJobAPI;