import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Space, Spin, Table, Button, Input, Form, Modal } from "antd";
import axios from "axios";
import { useState } from "react";
import { getAllEmployees, getMonthlyPoints } from "../apis/employeesApis";

export function EmployeeManage(){

    const queryClient = useQueryClient()
    const [isModalVisible,setModalVisibility] = useState(false)

    const addEmployeeMutation = useMutation(newEmployee => {
        return axios.post(`http://localhost:3001/api/employees/`, newEmployee)
    })
    const updatePointsMutation = useMutation(newData => {
        return axios.put("http://localhost:3001/api/appraisals/updatePointsOfEmployee", newData)
    })
    const inactivateMutation = useMutation(body => {
        return axios.put(`http://localhost:3001/api/employees/inactivate`, body)
    })
    const makeAdminMutation = useMutation(body => {
        return axios.put(`http://localhost:3001/api/employees/toggleAdmin/?type=on`,body)
    })
    const revokeAdminMutation = useMutation(body => {
        return axios.put(`http://localhost:3001/api/employees/toggleAdmin/?type=off`,body)
    })
    
    const inactivateAnEmployee =(eid)=>{
        inactivateMutation.mutate({eid}, {onSuccess :async ()=> {await queryClient.refetchQueries(["getAllEmployees","adminTab"])} })
    }
    const makeAdmin = (eid)=> {
        makeAdminMutation.mutate({eid}, {onSuccess : async ()=> {await queryClient.refetchQueries(["getAllEmployees","adminTab"])}})
    }
    const revokeAdmin = (eid)=> {
        revokeAdminMutation.mutate({eid}, {onSuccess : async ()=> {await queryClient.refetchQueries(["getAllEmployees","adminTab"])}})
    }

    const [form] = Form.useForm()
    const {data,isLoading,isError} = useQuery(["getAllEmployees","adminTab"], getAllEmployees)
    const {data:pointsData, isLoading:pointsDataLoading, isError:pointsDataError} = useQuery(["getMonthlyPoints"], getMonthlyPoints)
    if (isLoading || pointsDataLoading){
        return <Space size={"middle"}>
            <Spin size="large"/>
        </Space>
    }
    if (isError || pointsDataError){
        return <h1>Error retrieving the data</h1>
    }
    if (data && pointsData){
        const columns = [
            {
                title : <strong style={{fontSize:"1.3em"}}>Employee ID</strong>,
                dataIndex : "id",
                key : "id",
            },
            {
                title : <strong style={{fontSize:"1.3em"}}>Employee Name</strong>,
                dataIndex : "name",
                key : "name",
            },
            {
                title : <strong style={{fontSize:"1.3em"}}>Employee Email</strong>,
                dataIndex : "email",
                key : "email",
            },
            {
                title : <strong style={{fontSize:"1.3em"}}>Employee Points</strong>,
                dataIndex : "current_points",
                key : "current_points",
            },
            {
                title : <strong style={{fontSize:"1.3em"}}>Employee Status</strong>,
                dataIndex : "isActive",
                key : "isActive",
            },
            {
                title : <strong style={{fontSize:"1.3em"}}>Employee Role</strong>,
                dataIndex : "isAdmin",
                key : "isAdmin",
            }
        ]
        const handleSubmit= (values) => {
            addEmployeeMutation.mutate(values,{onSuccess : async () => {await queryClient.refetchQueries(["getAllEmployees","adminTab"])}})
            form.resetFields()
            setModalVisibility(false)
        }
    
        const handleCancel = () => {
            setModalVisibility(false)
            form.resetFields()
        }
        const showModal =() => {
            setModalVisibility(true)
        }
        const addMonthlyPoints = () => {
            const monthlyPoints = pointsData.monthly_points
            for (var employee of data.employees){
                // console.log(employee)
                updatePointsMutation.mutate({updated_points : employee.current_points+monthlyPoints, caller_email : employee.email }, {onSuccess : async () => {await queryClient.refetchQueries(["getAllEmployees","adminTab"])}})
            }
            console.log(monthlyPoints)
        }
        const employeeData = data.employees.map((element)=> {
            return {
                ...element, 
                key : element.id, 
                isActive : element.isActive?[<p key={"description"}>Active </p>,<Button key={"button"} type="primary" style={{padding : "0em 0.2em"}} onClick= {() =>{inactivateAnEmployee(element.id)}}>Inactivate</Button>]:"Inactive", 
                isAdmin : element.isActive?element.isAdmin?[<p key={"description"}>Admin </p>,<Button key={"button"} type="primary" style={{padding : "0em 0.2em"}} onClick={()=>{revokeAdmin(element.id)}}>Revoke Admin</Button>]:[<p key={"description"}>Employee </p>,<Button key={"button"} type="primary" style={{padding : "0em 0.2em"}} onClick={()=>makeAdmin(element.id)}>Make Admin</Button>]:"No Access"
            }
        })
        return <>
            <Button type="primary" style={{margin: "1em"}} onClick={showModal}>Add Employee</Button>
            <Button type="primary" style={{margin: "1em"}} onClick={addMonthlyPoints}>Add Monthly Points</Button>
            <Modal title={"Create an Employee"} visible={isModalVisible} onOk={form.submit} onCancel={handleCancel} getContainer={false}>
                <Form form={form} onFinish={handleSubmit} autoComplete="off" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                    <Form.Item label="Name" name="name" rules={[{required : true}]} >
                        <Input placeholder="name" type={"string"}/>
                    </Form.Item>

                    <Form.Item label="Email" name="email" rules={[{required: true}]}>
                        <Input placeholder={"email"} type={"email"}  />
                    </Form.Item>
                </Form>
            </Modal>
            <Table columns={columns} dataSource={employeeData} style={{border : "1px solid black", backgroundColor: "grey", marginTop: "1em"}} />
        </>     
    } 
}