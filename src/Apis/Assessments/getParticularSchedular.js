import axios from "../axiosInstance.js";



const GetSpecificSchdules = async (id) => {
    const token = localStorage.getItem('authtoken');
    const payload = {
        jobId:id
    }

    //This api has to be replaced.
    const link = `getspecificschedules`;

    return await axios.post(link,payload,{
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

export default GetSpecificSchdules;