import {Card, Typography} from "antd"
import { useQuery } from "@tanstack/react-query"
import { getAllAppraisals } from "../apis/appraisalsApis"
import "./feed.css"
export function Feed(){
    const {data, isLoading} = useQuery(["getFeed"],getAllAppraisals)
    if (isLoading){
        return <h1>Loading</h1>
    }
    if (data.message){
        return <h1>login not happened</h1>
    }
    return (
        data?
        data.company.allAppraisals.map((element,index)=>{
            return <Card title= {<Typography.Title level={3}>{`${element.from.name} gifted ${element.points} points to ${element.to.name}`}</Typography.Title>} key={index} className="feed-card">
                <p>Date : {element.createdAt.toString().split("T").join(" ").split("Z")[0]}</p>
                <p>
                    Title : {element.title}
                </p>
                <p>
                    Description : {element.description} 
                </p>
            </Card>
        }):
        <h1> loading </h1>
        
    )
}