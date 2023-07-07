import axios from "../axiosInstance.js";


const CreateTestAPI = async (values) => {
    const token = localStorage.getItem('authtoken');

    //This api has to be replaced.
    const url = `/tests/create`;

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

export default CreateTestAPI;