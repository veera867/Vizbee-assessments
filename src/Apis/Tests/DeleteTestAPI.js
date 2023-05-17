import axios from "axios";

let axiosConfig = {
    headers: {
        //"Content-Type" : "multipart/form-data",
        //"Access-Control-Allow-Origin" : "*",
        //"Access-Control-Allow-Headers" : "Content-Type, Authorization, X-Requested-With",
        //"Access-Control-Allow-Methods" : "GET, POST, PUT, DELETE, OPTIONS",
    }
};

const DeleteTestAPI = async (id) => {
    console.log("Delete request id : ",id);

    //This api has to be replaced.
    const link = `https://jsonplaceholder.typicode.com/tests/delete/${id}`;

    return await axios.delete(link,axiosConfig)
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