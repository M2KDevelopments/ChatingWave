const nodemailer = require('nodemailer');
const fs = require('fs');

const transporter = nodemailer.createTransport({
    service: process.env.NODEMAILER_SERVICE,
    secure: true,
    port: 465,
    host: process.env.NODEMAILER_HOST,
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS,
    }
});

const transporterService = nodemailer.createTransport({
    service: process.env.NODEMAILER_SERVICE,
    secure: true,
    port: 465,
    host: process.env.NODEMAILER_HOST,
    auth: {
        user: "campaign@chatingwave.com",
        pass: process.env.NODEMAILER_PASS,
    }
});

//node mailer send email function - return promise
exports.send = (emails, subject, html) => {
    const mailOptions = {
        from: `${process.env.NODEMAILER_NAME} <${process.env.NODEMAILER_EMAIL}>`,
        to: emails,
        subject: subject,
        html: html,
    };

    // sending email promise
    return transporter.sendMail(mailOptions);
}

exports.sendReport = (name, email, count, filePath) => {

    const html = `
    <div style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9f9f9; color: #333;">
        <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #ff9800; color: white; padding: 20px; text-align: center;">
                <img src="https://chatingwave.com/wp-content/uploads/2024/12/logo512.png" alt="Superhero Dog Logo" style="max-height: 60px;">
                <h1 style="margin: 10px 0;">🐾 Fetch Complete!</h1>
            </div>
            <div style="padding: 20px; line-height: 1.6;">
                <h1 style="color: #ff9800; font-size: 24px; margin: 0 0 10px;">Your Leads Are Here!</h1>
                <p style="font-size: 16px; margin: 0 0 10px;">
                    Hey there! Our superhero dog sidekick has done it again – fetching the leads you need to supercharge your business. 
                    Attached to this email, you’ll find a CSV file with all the leads ready for your next big move.
                </p>
                <p style="font-size: 16px; margin: 0 0 20px;">
                    Whether you're closing deals, building connections, or growing your business, these leads are here to help you succeed. 
                    If you have any questions or need further assistance, don’t hesitate to bark at us!
                </p>
            </div>
            <div style="background-color: #f1f1f1; color: #666; text-align: center; padding: 10px; font-size: 14px;">
                <p style="margin: 0;">Thank you for choosing Chating Wave. Need help? <a href="mailto:support@chatingwave.com" style="color: #ff9800; text-decoration: none;">Contact Us</a></p>
            </div>
        </div>
    </div>
    `;
    // sending email promise
    return transporterService.sendMail({
        from: `Chating Wave Reports <campaign@chatingwave.com>`,
        to: [email],
        subject: `🐕‍🦺 Hey ${name} Done Fetching ${count} Leads`,
        html: html,
        attachments: [
            {   // stream as an attachment
                filename: 'Your Leads.csv',
                content: fs.createReadStream(filePath)
            }
        ]
    });
}

exports.sendWarningOpenAIEmail = (name, email, title, subject, message) => {

    const html = `
    <div style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9f9f9; color: #333;">
        <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #ff9800; color: white; padding: 20px; text-align: center;">
                <img src="https://chatingwave.com/wp-content/uploads/2024/12/logo512.png" alt="Superhero Dog Logo" style="max-height: 60px;">
                <h1 style="margin: 10px 0;">🐾 ${title}</h1>
            </div>
            <div style="padding: 20px; line-height: 1.6;">
                <h1 style="color: #ff9800; font-size: 24px; margin: 0 0 10px;">${subject}</h1>
                <p style="font-size: 16px; margin: 0 0 10px;">${message}</p>
            </div>
            <div style="background-color: #f1f1f1; color: #666; text-align: center; padding: 10px; font-size: 14px;">
                <p style="margin: 0;">Thank you for choosing Chating Wave. Need help? <a href="mailto:support@chatingwave.com" style="color: #ff9800; text-decoration: none;">Contact Us</a></p>
            </div>
        </div>
    </div>
    `;
    
    // sending email promise
    return transporterService.sendMail({
        from: `Chating Wave Support <campaign@chatingwave.com>`,
        to: [email],
        subject: `🐕‍🦺 Hey ${name} ${title}`,
        html: html,
    });
}
