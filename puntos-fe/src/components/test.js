var nodemailer = require("nodemailer")
var cors = require("cors")

const addEmployee = () => {
    console.log("employee add function")
}
async function sendMail(){
let transporter = nodemailer.createTransport({
    service : "gmail",
    auth : {
        user : "pteja1021@gmail.com",
        pass : "ongkiayfmrfhynbf" 
    }
})
let info = await transporter.sendMail({
    from : "Puntos <noreply@puntos.com>",
    to : "pteja1021@gmail.com",
    subject : "Email Verification",
    html : "<div><h2>You have been invited to checkout the puntos App</h2></div>"
})
console.log(info.messageId)
}
sendMail().then(console.log("mail sent successfully"))