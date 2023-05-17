import axios from "axios";

let axiosConfig = {
    headers: {
        //"Content-Type" : "multipart/form-data",
        //"Access-Control-Allow-Origin" : "*",
        //"Access-Control-Allow-Headers" : "Content-Type, Authorization, X-Requested-With",
        //"Access-Control-Allow-Methods" : "GET, POST, PUT, DELETE, OPTIONS",
    }
};

const CreateSkillsAPI = async (values) => {
    console.log("New skill add : ",values);

    //This api has to be replaced.
    const url = `https://jsonplaceholder.typicode.com/skills/create`;

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

export default CreateSkillsAPI;