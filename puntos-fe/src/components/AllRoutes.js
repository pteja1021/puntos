import {Routes, Route} from 'react-router-dom'
import { Login } from './Login'
import Home from "./Home"
import {Feed} from "./Feed"
import {GivenRewards} from "./GivenRewards"
import {MyRewards} from "./MyRewards"
import {Rewards} from "./Rewards"
import {Insights} from "./Insights"
import {Admin} from "./Admin"
import {EmployeeManage} from "./EmployeeManage"
import {RewardManage} from "./RewardManage"
import { MakeCompany } from './MakeCompany'
import {Protected,AdminProtected,AlreadyPresentProtection} from "./Protected"
import {PageNotFound} from "./PageNotFound"

function AllRoutes(){    
    return (
        <Routes>
            <Route path="/" element={<Login />}/>
            <Route path="signup" element={<AlreadyPresentProtection><MakeCompany/></AlreadyPresentProtection>} />
            <Route exact path="home" element=  {<Protected><Home/></Protected> } >
                <Route index path="feed" element={<Protected><Feed /></Protected>} />
                <Route path="myRewards" element={<Protected><MyRewards /></Protected>} />
                <Route path="givenRewards" element={<Protected><GivenRewards/></Protected>} />
            </Route>
            <Route path="rewards" element={<Protected><Rewards /></Protected> } />
            <Route path="insights" element={<Protected><Insights /></Protected>} />
            <Route path="admin" element={<AdminProtected><Admin /></AdminProtected>}>
                <Route path="manageEmployees" element={<AdminProtected><EmployeeManage /></AdminProtected>} />
                <Route path="manageRewards" element={<AdminProtected><RewardManage /></AdminProtected>} />
            </Route>
            <Route path="*" element={<PageNotFound />}/>
        </Routes>
    )

}
export default AllRoutes