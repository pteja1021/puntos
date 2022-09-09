var express = require("express");
const router = express.Router();
const rewardController = require("../controllers/rewardsController");

router.get("/", rewardController.getAllRewards);
router.put("/",rewardController.updateReward);
router.post("/",rewardController.addNewReward)
module.exports = router
