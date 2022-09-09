const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient() 

const sgmail = require("@sendgrid/mail")
sgmail.setApiKey(process.env.SENDGRID_API_KEY)
async function getAllEmployeesOfCompany(req,res,next){
    let caller_email = req.caller_email
    if (!caller_email){
        res.send({"message":"caller email not present"})
    }
    else{
        try{
            let allEmployees = await prisma.company.findMany({
                where : {
                    employees : {
                        some : {
                            email : caller_email
                        }
                    }
                },
                select : {
                    employees : {
                        select : {
                            email : true,
                            name : true,
                            id: true,
                            isActive : true,
                            isAdmin : true,
                            current_points : true
                        },
                        orderBy: {
                            id : "asc"
                        }
                    }
                }
            })
            // console.log(allEmployees)
            res.send(allEmployees[0])
        }
        catch(err){
            console.log("error in employees controller, unable to get company id",err.message)
            next(err)
        }
    }
}

async function createEmployeeInCompany(req,res,next){
    let caller_email = req.caller_email
    if (!caller_email){
        res.send({"message": "caller email not provided"})
    }
    else{
        try{
            let employee = await prisma.employee.findUnique({
                where : {
                    email: caller_email
                }
            })
            if (!employee.isAdmin){
                res.send({"message" : "Not an admin, No access"})
            }
            else{
                let monthlyPoints = 100;
                try{
                    monthlyPoints = await prisma.company.findUnique({
                        where : {
                            id : parseInt(employee.company_id)
                        },
                        select : {
                            monthly_points : true
                        }
                    })
                }
                catch(err){
                    console.log("cannot get default points on company table",err.message)
                    next(err)
                }
                let { name, email } = req.body
                try{
                    let newEmployee = await prisma.employee.create({
                        data:{
                            name,
                            email, 
                            isAdmin : false, 
                            current_points : monthlyPoints.monthly_points,
                            company : {
                                connect : {
                                    id : employee.company_id
                                }
                            }
                        }
                    })
                    const msg = {
                        to : email ,
                        from : 'pteja1021@gmail.com',
                        subject : 'Invitation to Puntos',
                        text : "You have been added by your admin to checkout Puntos, Go to the following Link",
                        html : `<a href='http://localhost:3000/'>Puntos App</a>`
                    }
                    sgmail.send(msg).then(() => console.log("email sent")).catch(err=> console.log("error in sending mail"))
                    console.log("new employee created")
                    res.json(newEmployee)
                }
                catch(err){
                    console.log("error in companies controller, creating an employee",err.message)
                    next(err)
                }
            }

        }
        catch(err){
            console.log("error in companies controller, cannot verify if an admin",err.message)
            next(err)
        }
    }
}

async function isAdmin(req,res,next) {
    let email = req.caller_email
    try {
        let adminCheck = await prisma.employee.findUnique({
            where :{
                email
            },
            select :{
                isAdmin : true
            }
        })
        if (adminCheck.isAdmin){
            res.send({isAdmin: true})
        }
        else {
            res.send({isAdmin : false})
        }
    }
    catch(err){
        console.log("inside employee controller",err.message)
        next(err)
    }
}

async function toggleAdminPrivilege(req,res,next){
    const type = req.query.type 
    const eid = parseInt(req.body.eid)

    try{
        let adminCheck = await prisma.employee.findUnique({
            where: {
                email : req.caller_email
            },
            select : {
                isAdmin : true
            }
        })
        if (!adminCheck.isAdmin){
            res.send({"message": "No access to do so"})
        }
        else {
            try{
                let employee = await prisma.employee.update({
                    where:{
                        id: eid
                    },
                    data : {
                        isAdmin : type==="on"?true:false
                    }
                })
                res.json(employee)
            }
            catch(err){
                console.log("error in employees controller, toggling admin privileges", err.message)
                next(err)
            }
        }
    }
    catch(err){
        console.log("error in employees controller, toggling admin privileges", err.message)
        next(err)
    }

    
}

async function inactivateAnEmployee(req,res,next){
    const eid=parseInt(req.body.eid)
    try{
        let adminCheck = await prisma.employee.findUnique({
            where: {
                email : req.caller_email
            },
            select : {
                isAdmin : true
            }
        })
        if (!adminCheck.isAdmin){
            res.send({"message": "No access to do so"})
        }
        else{
            try{
                let employee = await prisma.employee.update({
                    where : {
                        id: eid
                    },
                    data:{
                        isActive : false
                    }
                })
                res.json(employee)
            }
            catch(err){
                console.log('error in employees controller in inactivate api', err.message)
                next(err)
            }
        }
    }
    catch(err){
        console.log('error in employees controller in inactivate api', err.message)
        next(err)
    }

}

async function getMonthlyPoints(req,res,next){
    let email = req.caller_email
    try { 
        let monthlyPoints = await prisma.employee.findUnique({
            where : {
                email
            },
            select: {
                company : {
                    select : {
                        monthly_points : true 
                    }
                }
            }
        })
        res.json(monthlyPoints.company)
    }
    catch(err){
        console.log("error in employees controller", err.message)
        next(err)
    }
}
module.exports = { getAllEmployeesOfCompany, createEmployeeInCompany, toggleAdminPrivilege, inactivateAnEmployee, isAdmin, getMonthlyPoints }