import { useMutation, useQuery } from "@tanstack/react-query"
import {Button, Modal,Form, Input, Space, Spin, InputNumber, Select} from "antd"
import axios from "axios"
import { checkIfPresent } from "../apis/initApis"
import { useState } from "react"
import {useUserInfo} from "../store/userInfo"
import {getAllEmployees} from "../apis/employeesApis"

export function GiveAppraisal(){
    const {Option}= Select
    const [isModalVisible, setModalVisibility] = useState(false)
    //eslint-disable-next-line
    const [user,setUser] = useUserInfo()

    const {data, isLoading} = useQuery(["getPoints",user?.email], checkIfPresent)
    const {data:allEmployeesData, isLoading:allEmployeesDataLoading} = useQuery(["getAllEmployees"], getAllEmployees)

    const appraisalMutation = useMutation(appraisal => {
        return axios.post("http://localhost:3001/api/appraisals/create",appraisal)
    })
    const userPointsMutation = useMutation(newPoints => {
        return axios.put("http://localhost:3001/api/appraisals/updatePointsOfEmployee", newPoints)
    })

    const showModal= () => {
        setModalVisibility(true)
    }

    const handleSubmit= (values) => {
        console.log(values)

        userPointsMutation.mutate({updated_points : data.current_points - values.points},{ onSuccess : console.log("put to decrement successful")})
        appraisalMutation.mutate(values, {onSuccess : alert(`Appraisal of ${values.points} made to ${values.to_eid}`)})
        form.resetFields()
        setModalVisibility(false)
    }

    const handleCancel = () => {
        setModalVisibility(false)
        form.resetFields()
    }

    const [form] = Form.useForm()

    if (allEmployeesDataLoading){
        return <Space size={"middle"}>
            <Spin size="large"/>
        </Space>
    }

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Give Appraisal 
            </Button>
            <Modal title={"Appraise your Peers!"} visible={isModalVisible} onOk={form.submit} onCancel={handleCancel} getContainer={false}>
                {isLoading?
                <Space size={"middle"}>
                    <Spin size="large"/>
                </Space>
                :<Form form={form} onFinish={handleSubmit} autoComplete="off" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                    <Form.Item label="Peer Name" name="to_eid" rules={[{required : true}]}>
                       <Select placeholder={"Peer Name"} >
                                    {allEmployeesData?allEmployeesData.employees.map((element,index)=> {
                                            if (element.email !== user.email && element.isActive)
                                                return <Option value={element.id} key={element.id}>{`${element.name} <${element.id}>`}</Option>
                                    }):<h1>Loading...</h1>}
                        </Select>
                    </Form.Item>
                    
                    <Form.Item label="Points" name="points" rules={[{required : true}]} >
                        <InputNumber max={data?.current_points} min={1} placeholder="points" />
                    </Form.Item>

                    <Form.Item label="Title" name="title" rules={[{required: true}]}>
                        <Input placeholder={"title"} type={"string"}  />
                    </Form.Item>

                    <Form.Item label="Description" name="description" rules={[{required: true}]}>
                        <Input placeholder={"Description"} type={"string"}  />
                    </Form.Item>
                </Form>}
            </Modal>
        </>
    )
}