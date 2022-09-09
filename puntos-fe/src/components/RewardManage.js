import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {Button, Form, InputNumber, Space, Spin, Table, Modal, Input } from "antd"
import axios from "axios";
import { useState } from "react";
import { getAllRewards } from "../apis/rewardsApi";
export function RewardManage(){
    const queryClient = useQueryClient()
    const [form] = Form.useForm()
    const [updateForm] = Form.useForm()
    const [isModalVisible, setModalVisibility] = useState(false)
    const [isUpdateModalVisible, setUpdateModalVisibility] = useState(false)
    const [idToUpdate, setidToUpdate] = useState("")
    const {data, isLoading, isError} = useQuery(["getAllRewards","adminTab"],getAllRewards)
    const addRewardMutation = useMutation( newReward => {
        return axios.post("http://localhost:3001/api/rewards", newReward)
    })
    const updateRewardMutation = useMutation ( updatedReward => {
        return axios.put("http://localhost:3001/api/rewards", updatedReward)
    })
    if (isError){
        return <h1>Error</h1>
    }
    if (isLoading){
        return <Space size={"middle"}>
            <Spin size="large"/>
        </Space>
    }
    if (data){
        const columns = [
            {
                title : <strong style={{fontSize:"1.3em"}}>Reward ID</strong>,
                dataIndex : "id",
                key : "id",
            },
            {
                title : <strong style={{fontSize:"1.3em"}}>Reward Name</strong>,
                dataIndex : "name",
                key : "name",
            },
            {
                title : <strong style={{fontSize:"1.3em"}}>Minimum Points</strong>,
                dataIndex : "minimum_points",
                key : "minimum_points",
            },
            {
                title : <strong style={{fontSize:"1.3em"}}>Coupon</strong>,
                dataIndex : "coupon",
                key : "coupon",
            },
            {
                title : <strong style={{fontSize:"1.3em"}}>Link</strong>,
                dataIndex : "Link",
                key : "link",
                //eslint-disable-next-line
                render : (text) => <a>{text}</a>
            },
            {
                title : <strong style={{fontSize:"1.3em"}}>Update</strong>,
                dataIndex : "update_button",
                key : "update_button",
            }
        ]
        const tableData= data.company.rewards.map((element) => {
            return {
                ...element,
                update_button : <Button type="primary" key={element.id} onClick={() => showUpdateModal(element.id)}>Update</Button>,
                key : element.id
            }
        })

        const handleSubmit = (values) => {
            addRewardMutation.mutate(values, {onSuccess : async () => await queryClient.refetchQueries(["getAllRewards","adminTab"])})
            form.resetFields()
            setModalVisibility(false)
        }
        const handleCancel = () => {
            setModalVisibility(false)
            setUpdateModalVisibility(false)
            form.resetFields()
            updateForm.resetFields()
        }
        const showModal =() => {
            setModalVisibility(true)
        }
        const updateHandleSubmit = (values) => {
            updateRewardMutation.mutate({...values, id: idToUpdate}, {onSuccess : async () => await queryClient.refetchQueries(["getAllRewards","adminTab"])})
            updateForm.resetFields()
            setUpdateModalVisibility(false)
        }
        const showUpdateModal =(id) => {
            setidToUpdate(parseInt(id))
            setUpdateModalVisibility(true)
        }

        return <>
            <Button type="primary" style={{margin:"1em"}} onClick={showModal}>Add new Reward</Button>
            <Modal title={"Create a Reward"} visible={isModalVisible} onOk={form.submit} onCancel={handleCancel} getContainer={false}>
                <Form form={form} onFinish={handleSubmit} autoComplete="off" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                    <Form.Item label="Name" name="name" rules={[{required : true}]} >
                        <Input placeholder="name" type={"string"}/>
                    </Form.Item>

                    <Form.Item label="Coupon" name="coupon" rules={[{required: true}]}>
                        <Input placeholder={"coupon"} type={"string"}  />
                    </Form.Item>

                    <Form.Item label="Minimum Points" name="minimum_points" rules={[{required: true}]}>
                        <InputNumber min={0} placeholder={"Minimum Points"}  />
                    </Form.Item>

                    <Form.Item label="Link" name="link" rules={[{required: true}]}>
                        <Input placeholder={"link"} type={"string"}  />
                    </Form.Item>
                </Form>
            </Modal> 

            <Modal title={"Update a Reward"} visible={isUpdateModalVisible} onOk={updateForm.submit} onCancel={handleCancel} getContainer={false}>
                <Form form={updateForm} onFinish={updateHandleSubmit} autoComplete="off" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                    <Form.Item label="ID" name="id" >
                        <Input placeholder={idToUpdate} disabled={true} value={idToUpdate}/>
                    </Form.Item>
                    
                    <Form.Item label="Name" name="name" rules={[{required : true}]} >
                        <Input placeholder="name" type={"string"}/>
                    </Form.Item>

                    <Form.Item label="Coupon" name="coupon" rules={[{required: true}]}>
                        <Input placeholder={"coupon"} type={"string"}  />
                    </Form.Item>

                    <Form.Item label="Minimum Points" name="minimum_points" rules={[{required: true}]}>
                        <InputNumber min={0} placeholder={"Minimum Points"}  />
                    </Form.Item>

                    <Form.Item label="Link" name="link" rules={[{required: true}]}>
                        <Input placeholder={"link"} type={"string"}  />
                    </Form.Item>
                </Form>
            </Modal> 

            <Table columns={columns} dataSource={tableData} style={{border : "1px solid black", backgroundColor: "grey", marginTop: "1em"}}/>
        </>
    }
}