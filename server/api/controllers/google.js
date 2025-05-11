const axios = require('axios');
const bcrypt = require('bcryptjs');
const generatePassword = require('generate-password');
const jwt = require('jsonwebtoken');
const { send } = require('../helpers/email');
const User = require('../models/user');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');
const SECRET = process.env.ACCESS_TOKEN_SECRET;


exports.oauth = async (req, res) => {
    try {
        const oAuth2Client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_CLIENT_REDIRECT_URL
        );

        // Generate the url that will be used for the consent dialog.
        const authorizeUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile'
            ],
        });

        return res.status(200).redirect(authorizeUrl);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ result: false, message: e.message });
    }
}

exports.callback = async (req, res) => {
    try {
        const { state, code } = req.query;
        const oAuth2Client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_CLIENT_REDIRECT_URL
        );

        // const body = {
        //     grant_type: 'authorization_code',
        //     access_type: "offline",
        //     client_id: process.env.GOOGLE_CLIENT_ID,
        //     client_secret: process.env.GOOGLE_CLIENT_SECRET,
        //     redirect_uri: process.env.GOOGLE_CLIENT_REDIRECT_URL,
        //     code: code,
        // }
        // const body = new FormData();
        // body.append('grant_type', 'authorization_code');
        // body.append('access_type', 'offline');
        // body.append('client_id', process.env.GOOGLE_CLIENT_ID);
        // body.append('client_secret', process.env.GOOGLE_CLIENT_SECRET);
        // body.append('redirect_uri', process.env.GOOGLE_CLIENT_REDIRECT_URL);
        // body.append('code', code);
        // const response = await axios.post(`https://oauth2.googleapis.com/token`, body)
        const repsonse = await oAuth2Client.getToken(code);
        const { access_token, refresh_token } = repsonse.res.data;
        // const { access_token, refresh_token } = response.data;

        // Update Google Sheets
        if (state) {
            const user = await User.findById(state);
            user.googleSheetsAccessToken = access_token;
            user.googleSheetsRefreshToken = refresh_token;

            await user.save();
            return res.status(200).send('Google Sheets Connected. You can close this window')
        }


        const headers = { 'Authorization': `Bearer ${access_token}` }
        const gmailresponse = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, { headers })
        const gmail = gmailresponse.data;

        // Create new account
        const password = generatePassword.generate({
            length: 10,
            numbers: true,
            symbols: true,
            uppercase: true,
            excludeSimilarCharacters: true,
        });

        // Generate a salt
        const rounds = 10
        const salt = await bcrypt.genSalt(rounds);

        // Hash the password with the salt
        const hash = await bcrypt.hash(password, salt);

        // Generate referral code
        let referralCode = gmail.name.replace(/\s/gmi, '-')
        const count = await User.countDocuments({ referralCode })
        if (count) referralCode += `${referralCode}`;


        // Generate For new user
        const userinfo = {
            name: gmail.name,
            image: gmail.picture,
            googleID: gmail.id,
            email: gmail.email,
            verified: gmail.verified_email,
            referralCode,
            password: hash,
        }

        // Get if user exists
        let user = await User.findOne({ email: userinfo.email });
        if (!user) {

            user = await (new User(userinfo)).save();

            const html = `
        <div style="width:100vw;background:rgb(255, 255, 255);border: 0px solid #959da533;border-radius:20px;box-shadow: #959da533 0px 8px 24px;">
        
        <div style="font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;color:rgb(67, 96, 121);text-align:center;padding:20px;margin:auto 0;width:500px;height:700px;background:rgb(255, 255, 255);border: 0px solid #959da533;border-radius:20px;box-shadow: #959da533 0px 8px 24px;">
            <img src="${process.env.APP_LOGO}" alt="${process.env.APP_NAME}" width="250px"/>
            <br/>
            <h2 style="color:#203444;">
                Welcome to <i>${userinfo.name} (${userinfo.email})</i> <b>${process.env.APP_NAME}</b>. You're Awesome for Registering with us.
            </h2>
            <br/><br/><br/>
            <h1>YOUR PASSWORD</h1>
            <div style="margin: auto 0; text-align:center;font-weight:900; font-size: 4rem;width:90%; padding:20px; background:rgb(237, 237, 237);border: 0px solid #959da533;border-radius:20px;box-shadow: #959da533 0px 8px 24px;">
                ${password}
            </div>
            <br/><br/>
            <h2>
                <a href="https://www.chatingwave.com">Go To <strong>${process.env.APP_NAME}</strong> Page</a>
            </h2>
        </div>

        </div>
        `
            // email user account
            console.log('Creating new account', user.email);
            try {
                await send([userinfo.email], 'Verification Email', html);
            } catch (err) {
                console.log(err.message);
            }
        }


        // create access token for user
        const accessToken = jwt.sign({ uid: user._id.toString(), email: user.email, name: user.name }, SECRET)

        return res.status(200).render(path.join(__dirname, '../views/oauth'), { data: accessToken })
    } catch (e) {
        console.log(e);
        return res.status(500).json({ result: false, message: e.message });
    }
}

exports.signIn = async (req, res) => {
    try {
        const { access_token } = req.body;
        const headers = { 'Authorization': `Bearer ${access_token}` }
        const gmailresponse = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, { headers })
        const gmail = gmailresponse.data;

        // Create new account
        const password = generatePassword.generate({
            length: 10,
            numbers: true,
            symbols: true,
            uppercase: true,
            excludeSimilarCharacters: true,
        });

        // Generate a salt
        const rounds = 10
        const salt = await bcrypt.genSalt(rounds);

        // Hash the password with the salt
        const hash = await bcrypt.hash(password, salt);

        // Generate referral code
        let referralCode = gmail.name.replace(/\s/gmi, '-')
        const count = await User.countDocuments({ referralCode })
        if (count) referralCode += `${referralCode}`;


        // Generate For new user
        const userinfo = {
            name: gmail.name,
            image: gmail.picture,
            googleID: gmail.id,
            email: gmail.email,
            verified: gmail.verified_email,
            referralCode,
            password: hash,
        }

        // Get if user exists
        let user = await User.findOne({ email: userinfo.email });
        if (!user) {

            user = await (new User(userinfo)).save();

            const html = `
        <div style="width:100vw;background:rgb(255, 255, 255);border: 0px solid #959da533;border-radius:20px;box-shadow: #959da533 0px 8px 24px;">
        
        <div style="font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;color:rgb(67, 96, 121);text-align:center;padding:20px;margin:auto 0;width:500px;height:700px;background:rgb(255, 255, 255);border: 0px solid #959da533;border-radius:20px;box-shadow: #959da533 0px 8px 24px;">
            <img src="${process.env.APP_LOGO}" alt="${process.env.APP_NAME}" width="250px"/>
            <br/>
            <h2 style="color:#203444;">
                Welcome to <i>${userinfo.name} (${userinfo.email})</i> <b>${process.env.APP_NAME}</b>. You're Awesome for Registering with us.
            </h2>
            <br/><br/><br/>
            <h1>YOUR PASSWORD</h1>
            <div style="margin: auto 0; text-align:center;font-weight:900; font-size: 4rem;width:90%; padding:20px; background:rgb(237, 237, 237);border: 0px solid #959da533;border-radius:20px;box-shadow: #959da533 0px 8px 24px;">
                ${password}
            </div>
            <br/><br/>
            <h2>
                <a href="https://www.chatingwave.com">Go To <strong>${process.env.APP_NAME}</strong> Page</a>
            </h2>
        </div>

        </div>
        `
            // email user account
            console.log('Creating new account', user.email);
            try {
                await send([userinfo.email], 'Verification Email', html);
            } catch (err) {
                console.log(err.message);
            }
        }


        // create access token for user
        const accessToken = jwt.sign({ uid: user._id.toString(), email: user.email, name: user.name }, SECRET)

        return res.status(200).json({ result: true, message: 'Logged In', access_token: accessToken })
    } catch (e) {
        console.log(e);
        return res.status(500).json({ result: false, message: e.message });
    }
}
 