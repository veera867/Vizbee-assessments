import axios from "../axiosInstance.js";

const LoadJobsAPI = async () => {
    const token = localStorage.getItem('authtoken');

    const url = `/jobs/list`

    //This api has to be replaced.
    // const url = `/jobs/list`;

    return await axios.get(url, {
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
        }
    })
        .then((result) => {
            return result;
        })
        .catch((error) => {
            console.log(error);
            console.log(error.config);
            throw error;
        })
}

export default LoadJobsAPI;