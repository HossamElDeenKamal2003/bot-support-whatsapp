const nodemailer = require('nodemailer');

// بيانات الجيميل
const senderEmail = 'boshtahoma@gmail.com';         
const appPassword = 'rftaiaifufmzooim';           
const recipientEmail = 'support@whatsapp.com';    
const phoneNumber = '+201274219127';              
// إعداد المرسل
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: senderEmail,
    pass: appPassword
  }
});

// إعداد الرسالة
const mailOptions = {
  from: senderEmail,
  to: recipientEmail,
  subject: `Request for Review of Blocked Number: ${phoneNumber}`,
  text: `
Hello WhatsApp Support,

I’m contacting you because the following phone number appears to be blocked or restricted on WhatsApp:

${phoneNumber}

We believe this might be a mistake and kindly request a review of the account.

Thank you for your time and support.

Best regards,  
Hossam Kamal
`
};

// الإرسال
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.error('❌ Error sending email:', error.message);
  }
  console.log('✅ Email sent successfully:', info.response);
});
