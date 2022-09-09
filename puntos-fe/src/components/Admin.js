import { Layout,Menu } from "antd"
import React from "react"
import {NavLink,Outlet} from "react-router-dom"

const {Content} = Layout;
export function Admin(){
    const items = [['/admin/manageEmployees','Manage Employees'], ['/admin/manageRewards',"Manage Rewards"]].map((item,index)=>{
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
        <Content style={{margin: '0 16px',}}>
            <Outlet />
        </Content>
    </Layout>
    )
}