import { useQuery } from "@tanstack/react-query";
import { getAllRewards } from "../apis/rewardsApi";
import {Space,Spin, Table} from "antd"

export function Rewards(){
    const {data, isLoading, isError} = useQuery(["getRewards"],getAllRewards)
    if (isLoading){
        return <Space size={"middle"}>
            <Spin size="large"></Spin>
        </Space>
    }
    if (data){
        const columns = [
            
            {
                title : 'Minimum Points',
                dataIndex : 'minPoints',
                key : 'minPoints',
                render : (text) => <p>{text}</p>
            },
            {
                title : 'Name',
                dataIndex : 'name',
                key : 'name',
                render : (text) => <p>{text}</p>
            },
            {
                title : 'Coupon code',
                dataIndex : 'coupon',
                key : 'coupon',
                render : (text) => <p>{text}</p>
            },
            {
                title : 'Link',
                dataIndex : 'link',
                key : 'link',
                render : (text) => <a>{text}</a>
            }
        ]
        const rewardsData = data.company.rewards.map((element)=>{
            return {key: element.id, minPoints : element.minimum_points, coupon : element.coupon, link: element.Link, name:element.name }
        })
        return <Table columns={columns} dataSource={rewardsData}></Table>
    }
}