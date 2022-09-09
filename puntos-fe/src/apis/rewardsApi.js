import axios from "axios"

async function getAllRewards(){
    const {data} = await axios.get("http://localhost:3001/api/rewards/")
    return data;
}
export { getAllRewards }