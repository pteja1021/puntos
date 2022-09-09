import { useQuery } from "@tanstack/react-query";
import { filterAppraisalByDate } from "../apis/appraisalsApis";
import { DatePicker,Space,Card } from "antd";
import { useEffect, useState } from "react";
import { useUserInfo } from "../store/userInfo";

export function GivenRewards(){
    const [feed,setFeed] = useState("loading")
    // eslint-disable-next-line
    const [user,setUser] = useUserInfo()
    const [fromDate, setFromDate] = useState("1-1-2020")
    const [toDate, setToDate] = useState("1-1-2020")
    const [type,setType]=useState("allSent")

    async function handleChangeInDates(date, dateString){
        if (date){
            setFromDate(date[0]._d)
            setToDate(date[1]._d)
            setType("sent")
        }
        else {
            setFromDate("1-1-2020")
            setToDate("1-1-2020")
            setType("allSent")
        }
    }

    const { RangePicker } = DatePicker

    const {data, isLoading, isError} = useQuery(['givenAppraisals',fromDate,toDate,type],filterAppraisalByDate)
    
    useEffect(()=> {
        if (isLoading || isError){
            setFeed("loading")
        }
        if (data){
            setFeed(data)
        }
        // eslint-disable-next-line
    },[setFeed,feed,data])
    

    return (
        <>
        <Space size={"middle"}>
            <RangePicker onChange={handleChangeInDates}/>
        </Space>
        { feed === "loading"?
        <h1>Loading...</h1>:
        feed.appraisalsMade.map((element,index)=>{
        return <Card title={`${user.name} gifted ${element.points} points to ${element.to.name}`} key={index} className="feed-card">
            <p>Date : {element.createdAt}</p>
            <p>
                Title : {element.title}
            </p>
            <p>
                Description : {element.description} 
            </p>
        </Card>})
        }
        </>
    )
}
