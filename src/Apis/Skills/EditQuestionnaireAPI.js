import axios from "axios";

let axiosConfig = {
    headers: {
        //"Content-Type" : "multipart/form-data",
        //"Access-Control-Allow-Origin" : "*",
        //"Access-Control-Allow-Headers" : "Content-Type, Authorization, X-Requested-With",
        //"Access-Control-Allow-Methods" : "GET, POST, PUT, DELETE, OPTIONS",
    }
};

const EditQuestionnaireAPI = async (values) => {
    console.log("Edit request id : ",values.slno);

    //This api has to be replaced.
    const link = `https://jsonplaceholder.typicode.com/skills/questionnaire/edit/${values.slno}`;

    return await axios.post(link,values,axiosConfig)
    .then((result)=>{
        return result;
    })
    .catch((error)=>{
        console.log(error);
        console.log(error.config);
        throw error;
    })
}

export default EditQuestionnaireAPI;