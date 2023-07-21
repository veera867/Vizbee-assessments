import axios from "../axiosInstance.js";



const CreateJobAPI = async (values) => {
    const token = localStorage.getItem('authtoken');
    values.token = token;
    console.log("payload : ",values);
    //const token = localStorage.getItem('authtoken');
    //This api has to be replaced.
    const url = `/jobs/create`;

    try {
        const response = await axios.post(url, values, {
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

export default CreateJobAPI;