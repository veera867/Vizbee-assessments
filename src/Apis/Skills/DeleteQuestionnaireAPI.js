import axios from "../axiosInstance.js";

let axiosConfig = {
    headers: {
        //"Content-Type" : "multipart/form-data",
        //"Access-Control-Allow-Origin" : "*",
        //"Access-Control-Allow-Headers" : "Content-Type, Authorization, X-Requested-With",
        //"Access-Control-Allow-Methods" : "GET, POST, PUT, DELETE, OPTIONS",
    }
};

const DeleteQuestionnaireAPI = async (id) => {
    const token = localStorage.getItem('authtoken');
    //This api has to be replaced.
    const link = `/questionnaire/delete/${id}`;

    return await axios.delete(link,
        {
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

export default DeleteQuestionnaireAPI;