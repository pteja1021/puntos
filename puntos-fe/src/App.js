import './App.css';
import "antd/dist/antd.min.css";
import Sidebar from './components/Sidebar'
import axios from "axios"
import {auth} from "./firebase/firebase"
import {Layout} from "antd"
import {useEffect} from "react"
import {useUserInfo} from "./store/userInfo"

axios.interceptors.request.use(async (config)=>{
  try{
    const tokenResult = await auth.currentUser?.getIdTokenResult(false)
    if (tokenResult){
      config.headers["Authorization"] = `Bearer ${tokenResult.token}`
    }
    return config
  }
  catch (err){
    console.log(err)
  }
})

function App() {

    window.onbeforeunload = () => {
      localStorage.setItem("lastUrl",window.location.pathname)
    }
    // eslint-disable-next-line
    const [user, setUser] = useUserInfo()
    useEffect(() => {
      auth.onAuthStateChanged(async (loggedInUser) => {
        if (loggedInUser) {
          console.log("user logged in")
          setUser({ email: loggedInUser.email ,name : loggedInUser.displayName});
        }
        else {
          console.log("user logged out")
        }
      });
      //eslint-disable-next-line
    }, []);
    
    return (
      <>
          <Layout style={{minHeight: '100vh'}}>
            <Sidebar />
          </Layout>
      </>
    );
  }

export default App;
