const nodemailer = require("nodemailer");

module.exports.sendMail = async function (recepient, password, username) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: "hrithikguptaxcelerator@gmail.com",
      to: recepient,
      subject: "Your New Password",
      text:
        "Dear " +
        username +
        ",\n\nYour new password is: '" +
        password +
        "'\n\nFor security reasons, we recommend changing your password after logging in.\n\nIf you have any concerns, please contact our support team.",
    });
    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
