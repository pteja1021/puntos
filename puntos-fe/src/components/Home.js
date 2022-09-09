import { Layout,Menu } from "antd"
import React from "react"
import {NavLink,Outlet} from "react-router-dom"
import { GiveAppraisal } from "./GiveAppraisal";
const {Content} = Layout;
function Home(){
    const items = [['/home/feed','Feed'], ['/home/myRewards',"My Rewards"], ['/home/givenRewards',"Given Rewards"]].map((item,index)=>{
                                                                                                                                return {
                                                                                                                                    key: index,
                                                                                                                                    icon: undefined,
                                                                                                                                    children: undefined,
                                                                                                                                    label : <NavLink to={item[0]}>{item[1]}</NavLink>
                                                                                                                                }   
                                                                                                                            })
    return (
        <Layout className="layout">
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['0']} items={items} />
            <GiveAppraisal />
            <Content style={{margin: '0 16px',}}>
                <Outlet />
            </Content>
        </Layout>
    )
}

export default Home;