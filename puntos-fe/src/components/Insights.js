import ReactApexChart from "react-apexcharts"
import { getInsightsData } from "../apis/appraisalsApis"
import { useQuery } from "@tanstack/react-query"
import { Space,Spin } from "antd"
import "./insights.css"
export function Insights(){ 
    const {data, isLoading, isError} = useQuery(["getInsightsData"], getInsightsData)
    if (isError){
        return <h1>Error getting data</h1>
    }
    if (isLoading){
        return <Space size={"middle"}>
            <Spin size="large"/>
        </Space>
    }
    if (data){
        var dates = Object.keys(data)
        dates = dates.map((element)=> {
            return element.slice(0,3)+" "+element.slice(3,5)+" "+element.slice(5)
        })
        const numberOfPraisesPerDay = []
        const totalPointsPerDay = []
        for (const date in data){
            numberOfPraisesPerDay.push(data[date]["totalTransactions"])
            totalPointsPerDay.push(data[date]["totalPoints"])
        }
        const chartOptions = {
            title : {
                text : "Insights on your Company",
                align : "center",
                style : {
                    fontSize : '25px',
                    color : "navy"
                }
            },
            chart : {
                type : "line",
                id : "apexchart",
                width : 50,
                height : 50
             },
            xaxis: {
                categories : dates
            },
            series : [
                {
                    name : "Number of Praises Per Day",
                    type : "line",
                    data : numberOfPraisesPerDay
                },
                {
                    name : "Total Points Sent Per Day",
                    type : "line",
                    data : totalPointsPerDay
                }
            ],
            yaxis : [
                {
                    title : {
                        text : "Number of Praises per Day"
                    }
                },
                {
                    opposite : true,
                    title : {
                        text : "Total Points Exchanged per Day"
                    }
                }
            ]
        }
        return <ReactApexChart options={chartOptions} series={chartOptions.series} className={"insightsApexChart"}/>
    }
}