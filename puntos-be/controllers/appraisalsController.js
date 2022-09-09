const { PrismaClient } = require("@prisma/client")
const { default: axios } = require("axios")
const prisma = new PrismaClient()

async function getAllPraisesOfCompany(req,res,next){
    let email = req.caller_email
    try{
        let AllPraises = await prisma.employee.findUnique({
            where : {
                email
            },
            select : {
                company : {
                    select : {
                        allAppraisals : {
                            select : {
                                from:{
                                    select: {
                                        name :true
                                    }
                                },
                                to :{
                                    select : {
                                        name :true
                                    }
                                },
                                points: true,
                                title : true,
                                description : true,
                                createdAt : true
                            },
                            orderBy : {
                                createdAt : 'desc'
                            }
                        }
                    }
                }
            }
        }
        )
        res.json(AllPraises)
    }
    catch(err){
        console.log("error in appraisals controller",err.message)
        next(err)
    }
}

async function makePraise(req,res,next){
    let caller_email = req.caller_email
    if (!caller_email){
        res.send("caller email not present")
    }
    else{
        try{
            let empDetails = await prisma.employee.findUnique({
                where : {
                    email : caller_email
                },
                select : {
                    id : true,
                    company_id : true,
                    name : true 
                }
            })
            try{
                let {to_eid, points, title, description} = req.body;
                let appraisal = await prisma.appraisals.create({
                    data : {
                        company_id : empDetails.company_id,
                        from_eid : empDetails.id,
                        to_eid : parseInt(to_eid),
                        points,
                        title,
                        description
                    }
                })
                let toEmployeeDetails = await prisma.employee.findUnique({
                    where : {
                        id : to_eid
                    }
                })
                
                // await axios.post(<your channel url>, {
                //     text : `${empDetails.name} has appraised ${toEmployeeDetails.name} with ${points} points for ${title} stating ${description}`
                // })
                res.json(appraisal)
            }
            catch(err){
                console.log("error in appraisals controller",err.message)
                next(err)
            } 
        }
        catch(err){
            console.log("error in appraisals controller",err.message)
            next(err)
        }
    }
}

async function getAggregateAppraisalsofEmployee(req,res,next){
    let caller_email = req.caller_email
    // console.log(caller_email)
    if (!caller_email){
        res.send("caller email not present")
    }
    else{
        try{
            let {appraisalsMade, appraisalsGot} = await prisma.employee.findUnique({
                where : {
                    email : caller_email
                },
                select : {
                    appraisalsMade: true,
                    appraisalsGot: true
                }
            })
            let totalPointsSent = 0
            let totalPointsReceived=0
            for (var i in appraisalsMade){
                totalPointsSent+=parseInt(appraisalsMade[i].points)
            }
            for (var i in appraisalsGot){
                totalPointsReceived+=parseInt(appraisalsGot[i].points)
            }
            let result = { "sent":totalPointsSent, "received": totalPointsReceived}
            res.json(result)
        }
        catch(err){
            console.log(err.message)
            next(err)
        }
    }
}

async function filterAppraisalByDate(req,res,next){
    let caller_email = req.caller_email
    let type = req.query.type
    let fromDate = (new Date(req.params.fromDate)).toISOString()
    let toDate = (new Date(req.params.toDate)).toISOString()
    if (!caller_email){
        res.send("caller email not present")
    }
    else{
        try{
            if (type === 'sent'){
                let appraisalsMade = await prisma.employee.findUnique({
                    where: {
                        email: caller_email,
                    },
                    select:{
                        appraisalsMade: {
                            where : {
                                createdAt : {
                                    gte : fromDate,
                                    lte : toDate
                                }
                            },
                            select : {
                                to : {
                                    select : {
                                        name: true
                                    }
                                },
                                points : true,
                                title : true,
                                description: true,
                                createdAt: true
                            },
                            orderBy : {
                                createdAt : "desc"
                            }
                        }
                    }
                })
                res.json(appraisalsMade)
            }
            if (type === 'received'){
                let appraisalsGot = await prisma.employee.findUnique({
                    where:{
                        email: caller_email,
                    },
                    select:{
                        appraisalsGot:{
                            where : {
                                createdAt : {
                                    gte : fromDate,
                                    lte : toDate
                                }
                            },
                            select : {
                                from : {
                                    select : {
                                        name: true
                                    }
                                },
                                points : true,
                                title : true,
                                description: true,
                                createdAt: true
                            },
                            orderBy : {
                                createdAt : "desc"
                            }
                        }
                    }
                })
                res.json(appraisalsGot)
            }
            if (type === 'allSent'){
                let appraisalsMade = await prisma.employee.findUnique({
                    where: {
                        email: caller_email,
                    },
                    select:{
                        appraisalsMade: {
                            select : {
                                to : {
                                    select : {
                                        name : true
                                    }
                                },
                                points : true,
                                title : true,
                                description: true,
                                createdAt: true
                            },
                            orderBy : {
                                createdAt : "desc"
                            }
                        }
                    }
                })
                res.json(appraisalsMade)
            }
            if (type === 'allReceived'){
                let appraisalsGot = await prisma.employee.findUnique({
                    where:{
                        email: caller_email,
                    },
                    select:{
                        appraisalsGot: {
                            select : {
                                from : {
                                    select : {
                                        name : true
                                    }
                                },
                                points : true,
                            title : true,
                            description: true,
                            createdAt : true
                            },
                            orderBy : {
                                createdAt : "desc"
                            }
                        },
                    }
                })
                res.json(appraisalsGot)
            }
        }
        catch(err){
            console.log(err.message," from filter appraisal by date in appraisals controller")
            next(err)
        }
    }
}

async function updatePointsOfEmployee(req,res,next){
    let caller_email = req.caller_email
    let {updated_points} = req.body
    if (req.body.caller_email){
        caller_email = req.body.caller_email
    }
    if (!caller_email){
        res.send("caller email not present")
    }
    else{
        try{
            let employee = await prisma.employee.update({
                where : {
                    email : caller_email
                },
                data : {
                    current_points : updated_points
                }
            })
            res.json(employee)
        }
        catch(err){
            console.log(err.message, " from decrement points of employee controller")
            next(err)
        }
    }
}

async function getInsightsData(req,res,next){
    const email = req.caller_email
    try{
        let empDetails = await prisma.employee.findUnique({
            where : {
                email
            },
            select : {
                id : true,
                company_id : true
            }
        })
        try{
            let data = await prisma.appraisals.groupBy({
                where : {
                    company_id : empDetails.company_id
                },
                by : ['createdAt'],
                _sum : {
                    points : true
                },
                _count : {
                    id: true
                },
            })
            let grouper ={}
            data.forEach((element => {
                const splitDate = String(element.createdAt).split(" ")
                const appraisalDate =splitDate[1]+splitDate[2]+splitDate[3]
                // console.log(appraisalDate)
                if (grouper[appraisalDate]){
                    grouper[appraisalDate]["totalPoints"] += element._sum.points
                    grouper[appraisalDate]["totalTransactions"] += 1
                }
                else {
                    grouper[appraisalDate] = {totalPoints : element._sum.points, totalTransactions : 1}
                }
            }))
            res.json(grouper)
        }   
        catch(err){
            console.log("error in getinsights",err.message)
            next(err)
        }
    }
    catch(err){
        console.log("error in getInsightsData",err.message)
        next(err)
    }
}

module.exports = { getAllPraisesOfCompany, makePraise, getAggregateAppraisalsofEmployee, filterAppraisalByDate, updatePointsOfEmployee, getInsightsData}