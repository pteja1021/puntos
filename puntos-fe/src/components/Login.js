import React, { useState, useEffect } from "react";
import { auth } from "../firebase/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Button, Space, Card, Typography, Spin } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import "./login.css";
import { useUserInfo } from "../store/userInfo";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { checkIfPresent } from "../apis/initApis";

export function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //eslint-disable-next-line
  const [user, setUser] = useUserInfo();
  const { data, isLoading, refetch } = useQuery(["checkUser",user?.email], checkIfPresent, {
    enabled: false,
  });

  useEffect(()=> {
      if (user.email){
          refetch();
          setLoading(true)
      }
      else {
        navigate("/")
      }
      //eslint-disable-next-line
  },[user])

  useEffect(()=> {
    if (!isLoading && data){
      setLoading(false)
      if (data.isPresent) {
        localStorage.getItem("lastUrl")?navigate(localStorage.getItem("lastUrl")):navigate("/home/feed");
      } 
      else {
        if (user.email)
        navigate("/signup");
      }
    }
    //eslint-disable-next-line
  },[isLoading,data])

  async function googleLogin() {
    setLoading(true)
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        console.log("sign in with popup logged in", result);
        const tokenResult = await auth.currentUser?.getIdTokenResult(false);
        localStorage.setItem("jwt-token", tokenResult.token);
      })
      .catch((error) => {
        console.log("error in signinWithPopUp", error.message);
      });
  }

  const [loadings, setLoadings] = useState([]);
  const enterLoading = (index) => {
    if (loading) {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = true;
        return newLoadings;
      });
    } else {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }
  };

  return !loading ? (
    <div
      className="site-card-border-less-wrapper"
      style={{ textAlign: "center" }}
    >
      <Card
        title={<Typography.Title level={1}>Login to Continue</Typography.Title>}
        bordered={true}
        style={{ textAlign: "center" }}
        className="login-card"
      >
        <Space style={{ width: "100%", textAlign: "center" }}>
          <Button
            type="primary"
            loading={loadings[0]}
            onClick={() => {
              enterLoading(0);
              googleLogin();
            }}
            icon={<GoogleOutlined />}
            size="large"
          >
            Click Here
          </Button>
        </Space>
      </Card>
    </div>
  ) : (
    <Space size={"middle"}>
      <Spin size="large"></Spin>
    </Space>
  );
}
