import {Navigate} from "react-router-dom"
import { useUserInfo } from "../store/userInfo"
import { useQuery } from "@tanstack/react-query"
import {Space,Spin} from "antd"
import { isAdmin } from "../apis/employeesApis"
import { checkIfPresent } from "../apis/initApis"
const Protected = ({children}) => {
    // eslint-disable-next-line
    const [user,setUser] = useUserInfo()
    const {data,isLoading,isError} = useQuery(["isUserPresent",user.email],checkIfPresent)
    if (!user.email){
        return <Navigate to={'/'} replace />
    }
    if (isLoading){
        return <h1>Loading</h1>
    }
    if (isError){
        return <h1>Error</h1>
    }
    if (data.isPresent)
        return children
    else {
        return <Navigate to={"/signup"} />
    }
}

const AlreadyPresentProtection = ({children}) => {
    // eslint-disable-next-line
    const [user,setUser] = useUserInfo()
    const {data,isLoading,isError} = useQuery(["isUserPresent",user.email],checkIfPresent)
    if (!user.email){
        return <Navigate to="/" replace/>
    }
    if (isLoading){
        return (
            <Space size={"middle"}>
                <Spin size="large"/>
            </Space>
        )
    }
    if (isError){
        return <h1>error in AlreadyPresentProtection auth</h1>
    }
    if (user.email && data && !data.isPresent){
        return children
    }
    else if (user.email && data && data.isPresent) {
        return <Navigate to={"/home/feed"} />
    }
}

const AdminProtected=({children}) => {
     // eslint-disable-next-line
    const [user,setUser] = useUserInfo()
    const {data,isLoading,isError} = useQuery(["isAdmin",user.email], isAdmin)
    if (!user.email){
        return <Navigate to={'/'} replace />
    }
    if (isLoading){
        return (
            <Space size={"middle"}>
                <Spin size="large"/>
            </Space>
        )
    }
    if (isError){
        return <h1>error in admin protected auth</h1>
    }
    
    if (data){
        if (data.isAdmin){
            return children
        }
        else{
            return <Navigate to={"/"} replace />
        }
    }
}
export {Protected, AdminProtected, AlreadyPresentProtection}