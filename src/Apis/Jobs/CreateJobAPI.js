import axios from "../axiosInstance.js";



const CreateJobAPI = async (values) => {
    const token = localStorage.getItem('authtoken');
    values.token = token;
    console.log("payload : ",values);
    //const token = localStorage.getItem('authtoken');
    //This api has to be replaced.
    const url = `/jobs/create`;

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

export default CreateJobAPI;