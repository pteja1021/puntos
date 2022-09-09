const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function createCompany(req,res,next){
    let { company_name, gstin, monthly_points, admin_name, admin_email } = req.body
    monthly_points = parseInt(monthly_points)
    try{
        let company = await prisma.company.create({
            data : {
                name : company_name,
                gstin,
                monthly_points,
                employees : {
                    create : {
                        name : admin_name,
                        email : admin_email,
                        isAdmin : true,
                        current_points : monthly_points 
                    }
                }
            }
        })
        res.send(company)
    }
    catch(err){
        console.log("error in creating company profile: ",err.message)
        next(err)
    }
}



module.exports = { createCompany }