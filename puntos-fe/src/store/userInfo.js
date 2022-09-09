import {atom,useRecoilState} from 'recoil'

const userInfo = atom({
    key : "user",
    default:{
        email:null,
        name:null,
    }
})

const useUserInfo = () => {
    const [user, setUser] = useRecoilState(userInfo)
    return [user,setUser]
}

export {userInfo, useUserInfo}