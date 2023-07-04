import axios from "../axiosInstance.js";

let axiosConfig = {
    headers: {
        //"Content-Type" : "application/json",
        //"Access-Control-Allow-Origin" : "*",
        //"Access-Control-Allow-Headers" : "Content-Type, Authorization, X-Requested-With",
        //"Access-Control-Allow-Methods" : "GET, POST, PUT, DELETE, OPTIONS",
    }
};

const GetTestWithID = async (id) => {

    const token = localStorage.getItem('authtoken');
    const payload = {
        TestID: id,
        token : token
    }
    //This api has to be replaced.
    const url = `test/get-particular-test`;

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

export default GetTestWithID;