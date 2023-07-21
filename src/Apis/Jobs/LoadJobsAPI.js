import axios from "../axiosInstance.js";

const LoadJobsAPI = async () => {
    const token = localStorage.getItem('authtoken');

    const url = `/jobs/list`

    //This api has to be replaced.
    // const url = `/jobs/list`;

    try {
        const response = await axios.get(url, {
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

export default LoadJobsAPI;