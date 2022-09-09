import {Form,Input,Button} from 'antd'
import { useState } from 'react'
import { useUserInfo } from '../store/userInfo'
import {useMutation} from "@tanstack/react-query"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
export function MakeCompany(){
    const navigate= useNavigate()
    const [user,setUser] = useUserInfo()
    const [form]= Form.useForm()
    const [formLayout,setFormLayout]=useState('horizontal')

    const mutation = useMutation(newCompany => {
        return axios.post("http://localhost:3001/api/companies/create", newCompany)
    })
    const formItemLayout = {
        labelCol : {
            span : 8
        },
        wrapperCol : {
            span:16
        }
    }

    const buttonItemLayout ={
        wrapperCol : {
            span :14,
            offset : 10
        }
    }

    const handleFinish = (values) => {
        console.log(values)
        mutation.mutate(values, {onSuccess : navigate("../home/feed")})
    }
    
    return (
        <Form {...formItemLayout} layout={formLayout} form={form} initialValues={{layout: formLayout,admin_name: user.name, admin_email: user.email}} onFinish={handleFinish}>
            
            <Form.Item label="Company Name" name="company_name" rules={[{required : true}]}>
                <Input placeholder="Company Name" />
            </Form.Item>

            <Form.Item label="Company GSTIN" name="gstin" rules={[{required : true}]} >
                <Input placeholder="company gstin"/>
            </Form.Item>

            <Form.Item label="Monthly Points" name="monthly_points" >
                <Input placeholder={"Monthly points"} rules={[{required: true}]} />
            </Form.Item>

            <Form.Item label="Admin Name" name="admin_name" >
                <Input placeholder={user?.name} disabled={true} value={user?.name}/>
            </Form.Item>

            <Form.Item label="Admin email"  name="admin_email">
                <Input placeholder= {user?.email} disabled={true} value={user?.email}/>
            </Form.Item>

            <Form.Item {...buttonItemLayout}>
                <Button type="primary" htmlType='submit'>Submit</Button>
            </Form.Item>

        </Form>
    )
}