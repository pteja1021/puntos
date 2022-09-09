const firebase = require('./firebase/index')
const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()

async function isPresent(request,response,next){
    try{    
        let isPresent = await prisma.employee.findUnique({
            where : {
                email : request.caller_email,
            }
        })
        return {isPresent : Boolean(isPresent && isPresent.isActive)}
    }
    catch(err){
        console.log("error in getting",err.message)
    }
}

function authMiddleWare(request,response,next){

    const headerToken = request.headers.authorization
    if (!headerToken){
        return response.send({"message" : "Not Logged in"}).status(401)
    }

    if (headerToken && headerToken.split(" ")[0]!=='Bearer'){
        return response.send({"message" : "Invalid Token"}).status(401)
    }

    const token = headerToken.split(" ")[1]
    firebase
    .auth()
    .verifyIdToken(token)
    .then(async (result)=>{
        request.caller_email = result.email;
        const temp = await isPresent(request,response,next)
        if (temp.isPresent){
            console.log("is present in database")
            next()
        }
        else{
            console.log("not present in database")
            return response.send({isPresent: false}).status(401)
        }
    })
    .catch((err)=> response.send({"message" : err.message}))
}

function authMiddleWareForCompanyCreation(request, response, next){
    const headerToken = request.headers.authorization
    if (!headerToken){
        return response.send({"message" : "Not Logged in"}).status(401)
    }

    if (headerToken && headerToken.split(" ")[0]!=='Bearer'){
        return response.send({"message" : "Invalid Token"}).status(401)
    }
    console.log("inside auth middlewarer for company creation")
    const token = headerToken.split(" ")[1]
    firebase
    .auth()
    .verifyIdToken(token)
    .then(async (result)=>{
        request.caller_email = result.email;
        next()
    })
    .catch((err)=> response.send({"message" : err.message}))
}

module.exports = {authMiddleWare, authMiddleWareForCompanyCreation}