import axios from "../axiosInstance.js";

const UpdateJobAPI = async (values) => {
    const token = localStorage.getItem('authtoken')
    //This api has to be replaced.
    //const token = localStorage.getItem('authtoken');
    values.token = token;

    const url = `update/job`;

    return await axios.post(url,values,{
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

export default UpdateJobAPI;