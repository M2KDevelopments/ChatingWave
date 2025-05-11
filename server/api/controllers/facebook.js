const axios = require('axios');
const bcrypt = require('bcryptjs');
const generatePassword = require('generate-password');
const jwt = require('jsonwebtoken');
const { send } = require('../helpers/email');
const User = require('../models/user');
const SECRET = process.env.ACCESS_TOKEN_SECRET;


exports.callback = async (req, res) => {
    try {
        const { code, state } = req.query;
        const client_id = process.env.FACEBOOK_CLIENT_ID;
        const client_secret = process.env.FACEBOOK_CLIENT_SECRET;
        const redirect_uri = state || "https://api.chatingwave.com/api/facebook/callback";


        const response = await axios.get(`https://graph.facebook.com/v20.0/oauth/access_token?client_id=${client_id}&redirect_uri=${redirect_uri}&client_secret=${client_secret}&code=${code}`)
        const { access_token } = response.data;
        const scope = "id,name,email,picture";

        //get facebook data
        //https://developers.facebook.com/docs/graph-api/reference/user/#default-public-profile-fields
        const fbresponse = await axios.get(`https://graph.facebook.com/v20.0/me?fields=${scope}&access_token=${access_token}`);
        const fbuser = fbresponse.data;

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
        let referralCode = fbuser.name.replace(/\s/gmi, '-')
        const count = await User.countDocuments({ referralCode })
        if (count) referralCode += `${referralCode}`;

        console.log(fbuser);

        // Generate For new user
        const userinfo = {
            name: fbuser.name,
            image: fbuser.picture.data.url,
            facebookID: fbuser.id,
            email: fbuser.email,
            verified: true,
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
        if (e.response) console.log(e.response.data);
        else console.log(e);
        return res.status(500).json({ result: false, message: e.message });
    }
}


exports.webhookVerify = async (req, res) => {
    try {
        const token = process.env.FACEBOOK_WEBHOOK_VERIFY_TOKEN;
        if (!req.query['hub.verify_token'] == token) return res.status(400).json({ result: false, message: 'Invalid Token' });
        console.log('Verified', req.query)
        return res.status(200).send(req.query['hub.challenge'])
    } catch (err) {
        console.log(err);
        return res.status(500).json({ result: false, message: err.message });
    }
}

exports.webhook = async (req, res) => {
    try {
        if (req.body.object == 'user') console.log(req.body.entry);
        else if (req.body.object == 'ad_account') console.log(req.body.entry);
        else console.log('Facebook Data', req.body)
        return res.status(200).json({ result: true, message: "Webhook successful" })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ result: false, message: err.message });
    }
}
