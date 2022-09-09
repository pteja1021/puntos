const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()

async function init(req,res,next){
    const email = req.caller_email
    // console.log(email)
    try{
        let user = await prisma.employee.findUnique({
            where : {
                email,
            }
        })
        if (user && user.isActive) {
            res.send({isPresent :true, current_points : user.current_points })
        }
        else {
            res.status(307).send({ isPresent :false})
        }
    }
    catch(err){
        console.log("error in init router",err.message)
        next()
    }
}
module.exports = {init}