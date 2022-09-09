const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getAllRewards(req, res, next) {
  let email = req.caller_email;
  try {
    let allRewards = await prisma.employee.findUnique({
      where: {
        email,
      },
      select: {
        company: {
            select: {
                rewards:true,
            }
        },
      },
    });
    res.json(allRewards)
  } 
  catch (err) {
    console.log("inside rewards controller ", err.message);
    next(err);
  }
}

async function updateReward(req,res,next){
  let email = req.caller_email
  try{
    let adminCheck = await prisma.employee.findUnique({
      where : {
        email
      }
    })
    if (adminCheck.isAdmin && adminCheck.isActive){
      let {id,minimum_points,name, coupon, link} = req.body
      try {
        let updatedReward = await prisma.rewards.update({
          where : {
            id 
          },
          data : {
            minimum_points ,
            name,
            coupon,
            Link : link
          }
        })
        res.json(updatedReward)
      }
      catch(err){
        console.log("rewards controller error",err.message)
        next(err)
      }
    }
  }
  catch(err){
    console.log("rewards controller error",err.message)
    next(err)
  }
}

async function addNewReward(req,res,next){
  let email = req.caller_email
  try {
    let adminCheck = await prisma.employee.findUnique({
      where : {
        email
      }
    })
    if (adminCheck.isActive && adminCheck.isAdmin){
      let {minimum_points, name, coupon, link} = req.body
      try {
        let newReward = await prisma.rewards.create({
          data : {
            minimum_points,
            name,
            coupon,
            Link : link ,
            company_rewards : {
              connect : {
                id : adminCheck.company_id
              }
            }
          }
        })
        res.json(newReward)
      }
      catch(err){
        console.log("rewards controller error in creating new rewards",err.message)
        next(err)
      }
    }
  }
  catch(err){
    console.log("rewards controller error",err.message)
    next(err)
  }
}
module.exports = { getAllRewards, addNewReward, updateReward };
