import axios from "../axiosInstance.js";


const LogoutAPI = async (values) => {
    const token = localStorage.getItem('authtoken');
    // console.log("payload : ",values);

    //This api has to be replaced.
    const url = `logout`;

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

export default LogoutAPI;