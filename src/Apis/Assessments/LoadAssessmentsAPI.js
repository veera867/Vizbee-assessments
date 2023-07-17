import axios from "../axiosInstance.js";

const LoadAssessmentsAPI = async (id) => {
    const token = localStorage.getItem('authtoken');

    //This api has to be replaced.
    const url = `/assessment-dashboard/list`;

    return await axios.get(url,{
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

export default LoadAssessmentsAPI;