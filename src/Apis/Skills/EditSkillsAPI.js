import axios from "../axiosInstance.js";

let axiosConfig = {
    headers: {
        //"Content-Type" : "multipart/form-data",
        //"Access-Control-Allow-Origin" : "*",
        //"Access-Control-Allow-Headers" : "Content-Type, Authorization, X-Requested-With",
        //"Access-Control-Allow-Methods" : "GET, POST, PUT, DELETE, OPTIONS",
    }
};

const UpdateSkillsAPI = async (values) => {
    const token = localStorage.getItem('authtoken');
  
    //This api has to be replaced.
    const link = `updateskill`;

    try {
        const response = await axios.post(link, values, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            },
        });

        return response;
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with an error status
            return error.response;
        } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
            throw error;
        } else {
            // Something else happened during the request
            console.log('Error', error.message);
            throw error;
        }
    }
}

export default UpdateSkillsAPI;