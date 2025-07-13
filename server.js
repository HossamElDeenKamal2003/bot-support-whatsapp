const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const upload = multer({ dest: 'uploads/' });
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.render('index', { message: null });
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const customMessageTemplate = req.body.customMessage;
    const filePath = req.file.path;

    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    let successCount = 0;
    let errorCount = 0;

    for (const row of data) {
      const { Gmail, AppPassword, PhoneNumber } = row;

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: Gmail,
          pass: AppPassword
        }
      });

      // Replace placeholder in message
      const customMessage = customMessageTemplate.replace(/{{PhoneNumber}}/g, PhoneNumber);

      const mailOptions = {
        from: Gmail,
        to: 'spam@telegram.org',
        subject: `Request for Review of Blocked Number: ${PhoneNumber}`,
        text: customMessage
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent for ${PhoneNumber}`);
        successCount++;
      } catch (err) {
        console.error(`❌ Failed for ${PhoneNumber}:`, err.message);
        errorCount++;
      }
    }

    fs.unlinkSync(filePath);
    const message = `✅ ${successCount} emails sent successfully, ❌ ${errorCount} failed.`;
    res.render('index', { message });

  } catch (error) {
    console.error('❌ Error:', error.message);
    res.render('index', { message: 'Error processing the file: ' + error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
