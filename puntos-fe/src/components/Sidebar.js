import "./sidebar.css";
import {
  PieChartOutlined,
  HomeOutlined,
  GiftOutlined,
  LaptopOutlined,
  DingdingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Typography } from "antd";
import React, { useEffect, useState } from "react";
import "./sidebar.css";
import AllRoutes from "./AllRoutes";
import { auth } from "../firebase/firebase";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useUserInfo } from "../store/userInfo";
import { useQuery } from "@tanstack/react-query";
import { getAggregateAppraisals } from "../apis/appraisalsApis";
import { isAdmin } from "../apis/employeesApis";
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const { Header, Footer, Content, Sider } = Layout;
const elements = [
  ["Home", "/home/feed", <HomeOutlined />],
  ["Rewards", "/rewards", <GiftOutlined />],
  ["Insights", "/insights", <PieChartOutlined />],
  ["Admin", "/admin/manageEmployees", <LaptopOutlined />],
];

const items = elements.map((element, index) => {
  return getItem(
    <NavLink to={element[1]}>{element[0]}</NavLink>,
    element[1],
    element[2]
  );
});

const Sidebar = () => {
  //eslint-disable-nexr-line
  const { data: adminData, isLoading: adminDataLoading, isError: adminDataError, refetch: adminDataRefetch,} = useQuery(["sidebar-admin-required"], isAdmin);

  const navigate = useNavigate();
  const { data, refetch } = useQuery(["getAggregate"], getAggregateAppraisals);
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useUserInfo();
  let location = useLocation()
  const [current,setCurrent] = useState(
    location.pathname === "/" || location.pathname === ""? "/home/feed" : location.pathname
  )
  
  useEffect(() => {
    async function refecthData() {
      await refetch();
      await adminDataRefetch();
    }
    refecthData();
  }, [user, setUser, refetch, adminDataRefetch]);

  useEffect(()=> {
    if (location) {
      if (current !== location.pathname)
        setCurrent(location.pathname)
    }
  },[location,current])

  const logout = () => {
    if (auth.currentUser) {
      auth
        .signOut()
        .then(() => {
          setUser({ email: null, name: null });
          localStorage.removeItem("lastUrl")
          navigate("/");
        })
        .catch((err) => {
          console.log("error in signing out", err.message);
        });
    }
  };

  if (adminDataLoading) {
    return <h1>Loading</h1>;
  }
 
  return (
    <>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        className="sidebar"
        style={{position: "fixed",zIndex: 5}}
      >
        {collapsed ? (
          <div className="logo" style={{ maxWidth: "100%" }}>
            <DingdingOutlined />
          </div>
        ) : (
          <div className="logo">Puntos</div>
        )}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[current==="/home/myRewards"||current==="/home/givenRewards"?"/home/feed":current]}
          items={
            user.email && adminData?.isAdmin
              ? items
              : items.slice(0, items.length - 1)
          }
        ></Menu>
      </Sider>

      <Layout style={{ height: "100vh", marginLeft: collapsed?"80px":"200px" }} className="site-layout">
        <Header className="site-layout-background site-header" style={{position:"fixed",width :"100%",zIndex:4}}>
          {user.email ? (
            <>
              <Typography.Title level={4} className="header-points" >
                Given: {data ? data.sent : "loading"}
              </Typography.Title>
              <Typography.Title level={4} className="header-points" >
                Received: {data ? data.received : "loading"}
              </Typography.Title>
              <div className="header-right" >
                <Typography.Title level={5} className="header-points">
                  {user.name}
                </Typography.Title>
                <button className="logout-button" onClick={logout}>
                  | Logout <LogoutOutlined /> 
                </button>
              </div>
            </>
          ) : (
            <Typography.Title level={3} className="header-points">
              Welcome
            </Typography.Title>
          )}
        </Header>

        <Content style={{marginTop:"4.6em"}}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: "100%" }}
          >
            <AllRoutes />
          </div>
        </Content>

        <Footer style={{ textAlign: "center" }}>Footer</Footer>
      </Layout>
    </>
  );
};

export default Sidebar;
