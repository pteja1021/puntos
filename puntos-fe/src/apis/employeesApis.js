import axios from "axios"
async  function isAdmin(){
    const {data} = await axios.get("http://localhost:3001/api/employees/isAdmin")
    return data
}

async function getAllEmployees(){
    const {data} = await axios.get("http://localhost:3001/api/employees/")
    return data
}

async function getMonthlyPoints(){
    const {data} = await axios.get("http://localhost:3001/api/employees/getMonthlyPoints")
    return data 
}
export {isAdmin, getAllEmployees, getMonthlyPoints}