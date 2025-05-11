const bcrypt = require('bcryptjs');
const generatePassword = require('generate-password');
const jwt = require('jsonwebtoken');
const { send } = require('../utils/email');
const User = require('../models/user');
const path = require('path');
const SECRET = process.env.ACCESS_TOKEN_SECRET;

exports.passwordForgotView = async (req, res) => {
    try {
        return res.status(200).render(path.join(__dirname, '../views/forgot'), { data: req.query })
    } catch (e) {
        console.log(e);
        return res.status(500).json({ result: false, message: e.message });
    }
}

exports.oauth = async (req, res) => {
    try {
        const { email, password } = req.body;

        // validate email and password
        if (!email || !email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
            console.log(`Please enter email`);
            return res.status(400).json({ result: false, message: `Please enter email` });
        }

        // get user
        const user = await User.findOne({ email: email });
        if (!user) {
            console.log('Could find user', email);
            return res.status(400).json({ result: false, message: `This email is not registered here.` });
        }

        // compare password
        const result = await bcrypt.compare(password, user.password);
        if (!result) {
            console.log('Password do not match', email);
            return res.status(400).json({ result: false, message: `Wrong email or password provided` });
        }

        // create access token for user
        const access_token = jwt.sign({ uid: user._id.toString(), email: user.email, name: user.name }, SECRET)

        // if this is the first time logging in send welcome email
        if (!user.verified) {
            console.log(`First Time User ${user.email}`)
            user.verified = true;
            const html = `
            <div style="width:100vw;background:rgb(255, 255, 255);border: 0px solid #959da533;border-radius:20px;box-shadow: #959da533 0px 8px 24px;">
                <img src="${process.env.APP_LOGO}" alt="Chating Wave" width="250px"/>
                <br/>
                <div style="font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;color:rgb(67, 96, 121);text-align:center;padding:20px;margin:auto 0;width:500px;height:400px;background:rgb(255, 255, 255);border: 0px solid #959da533;border-radius:20px;box-shadow: #959da533 0px 8px 24px;">
                    <h2 style="color:#203444;">
                        Hey there, ${user.name}, this must be your first time signing up for <a href="https://www.chatingwave.com"><strong>Chating Wave</strong></a>.
                    </h2>
                    <h2>Welcome to Chating Wave</h2>
                    <br/><br/><br/>
                </div>
    
            </div>
            `
            // email user account
            await user.save();
            await send([email], `Welcome to Chating Wave`, html);

        }

        return res.status(200).json({ result: true, message: `Login successful`, access_token })
    } catch (e) {
        console.log(e);
        return res.status(500).json({ result: false, message: e.message });
    }
}

exports.signup = async (req, res) => {
    try {
        const { name, email } = req.body;
        const { ref } = req.query;

        if (!name) {
            console.log(`Please enter name`);
            return res.status(400).json({ result: false, message: `Please enter name` });
        }

        if (typeof name !== 'string') {
            console.log(`Please enter a valid name`);
            return res.status(400).json({ result: false, message: `Please enter a valid name` });
        }

        if (name.length < 3) {
            console.log(`Please enter name with 3 or more characters`);
            return res.status(400).json({ result: false, message: `Please enter name with 3 or more characters` });
        }


        if (!email || !email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
            console.log(`Please enter email`);
            return res.status(400).json({ result: false, message: `Please enter email` });
        }

        const exists = await User.findOne({ email: email }).select('name email verified verifiedDeadline').lean();

        // If user exists or resend verification email
        if (exists && exists.verified) {
            console.log(`User ${exists.name} (${exists.email}) already exists`);
            return res.status(400).json({ result: false, message: `User with this email (${exists.email}) already exists` });
        } else if (exists && !exists.verified) {
            // Re-send email
            if (exists.verifiedDeadline && exists.verifiedDeadline.getTime() < new Date().getTime()) {
                // email user account
                try {
                    console.log('Waiting for verification 1')
                    await send([exists.email], 'Verification Email', `Welcome back ${exists.name} (${exists.email}) to Chating Wave`);
                } catch (err) {
                    console.log(err.message);
                }
            } else if (!exists.verifiedDeadline) {
                // email user account
                try {
                    console.log('Waiting for verification 2')
                    await send([exists.email], 'Verification Email', `Welcome back ${exists.name} (${exists.email}) to Chating Wave`);
                } catch (err) {
                    console.log(err.message);
                }
            } else {
                console.log(`Email already sent to`, exists.email);
                return res.status(200).json({ result: true, message: "Please check your email for verification." });
            }
        }

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

        // Referral System with cookies
        let referred = null;
        if (ref) {
            try {
                const referral = await User.findById(ref).select("name email");
                if (referral) {
                    console.log(`Refered by`, referral.name, referral.email);
                    referred = referral._id;
                }
            } catch (err) {
                console.log(err.message);
            }
        }

        let referralCode = name.replace(/\s/gmi, '-')
        const count = await User.count({ referralCode })
        if (count) referralCode += `${referralCode}`;

        //create user account
        const days = 3;
        const time = days * 24 * 60 * 60 * 1000
        const newuser = new User({
            name, email,
            password: hash,
            referredBy: referred,
            referralCode: referralCode,
            verifiedDeadline: new Date(Date.now() + time),
        })
        const user = await newuser.save();
        console.log(`Created an account form`, user.email, user._id);


        const html = `
        <div style="width:100vw;background:rgb(255, 255, 255);border: 0px solid #959da533;border-radius:20px;box-shadow: #959da533 0px 8px 24px;">
        
        <div style="font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;color:rgb(67, 96, 121);text-align:center;padding:20px;margin:auto 0;width:500px;height:700px;background:rgb(255, 255, 255);border: 0px solid #959da533;border-radius:20px;box-shadow: #959da533 0px 8px 24px;">
            <img src="${process.env.APP_LOGO}" alt="Chating Wave" width="250px"/>
            <br/>
            <h2 style="color:#203444;">
                Welcome to <i>${user.name} (${user.email})</i> <b>Chating Wave</b>. You're Awesome for Registering with us.
            </h2>
            <br/><br/><br/>
            <h1>YOUR PASSWORD</h1>
            <div style="margin: auto 0; text-align:center;font-weight:900; font-size: 4rem;width:90%; padding:20px; background:rgb(237, 237, 237);border: 0px solid #959da533;border-radius:20px;box-shadow: #959da533 0px 8px 24px;">
                ${password}
            </div>
            <br/><br/>
            <h2>
                <a href="https://www.chatingwave.com">Go To <strong>Chating Wave</strong> Website</a>
            </h2>
        </div>

        </div>
        `
        // email user account
        try {
            await send([email], 'Verification Email', html);
        } catch (err) {
            console.log(err.message);
        }

        return res.status(201).json({ result: true, message: `Thank you for signing up to Chating Wave. Your Awesome!` })
    } catch (e) {
        console.log(e);
        return res.status(500).json({ result: false, message: e.message });
    }
}

exports.reset = async (req, res) => {
    try {
        const { newPassword, confirmPassword, token } = req.body;
        const decode = jwt.decode(token, SECRET);
        const { uid, username, useremail, expires } = decode;

        if (!uid) {
            console.log('No user ID', useremail);
            return res.status(200).render(path.join(__dirname, '../views/reset'))
        }

        if (!newPassword || !confirmPassword) {
            console.log('Missing required fields', useremail);
            return res.status(200).render(path.join(__dirname, '../views/reset'))
        }

        if (newPassword !== confirmPassword) {
            console.log('New password and confirm password do not match', useremail);
            return res.status(200).render(path.join(__dirname, '../views/reset'))
        }

        const user = await User.findById(uid).select("email password");
        if (!user) {
            console.log('No user found', useremail);
            return res.status(200).render(path.join(__dirname, '../views/reset'))
        }

        if (Date.now() > new Date(expires).getTime()) {
            console.log('Expired Time to change password', useremail);
            return res.status(200).render(path.join(__dirname, '../views/reset'))
        }


        // Generate a salt
        const rounds = 10
        const salt = await bcrypt.genSalt(rounds);

        // Hash the password with the salt
        const hash = await bcrypt.hash(newPassword, salt);

        // Update the password
        user.password = hash
        await user.save();

        console.log(`Updated Password For`, user.email);
        return res.status(200).render(path.join(__dirname, '../views/reset'))
    } catch (e) {
        console.log(e);
        return res.status(500).json({ result: false, message: e.message });
    }
}

exports.forgot = async (req, res) => {
    try {
        const { email } = req.body;

        // validate email and password
        if (!email || !email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
            console.log(`Please enter email`);
            return res.status(400).json({ result: false, message: `Please enter email` });
        }

        // get user
        const user = await User.findOne({ email: email });
        if (!user) {
            console.log('Could find user', email);
            return res.status(404).json({ result: false, message: `This email is not registered here.` });
        }

        const userToken = jwt.sign({ uid: user._id, username: user.name, useremail: user.email, expires: Date.now() + (120 * 1000) }, SECRET, { expiresIn: 120 })
        const html = `
        <div style="width:100vw;background:rgb(255, 255, 255);border: 0px solid #959da533;border-radius:20px;box-shadow: #959da533 0px 8px 24px;">
        
            <div style="font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;color:rgb(67, 96, 121);text-align:center;padding:20px;margin:auto 0;width:500px;height:400px;background:rgb(255, 255, 255);border: 0px solid #959da533;border-radius:20px;box-shadow: #959da533 0px 8px 24px;">
                <img src="${process.env.APP_LOGO}" alt="Chating Wave" width="250px"/>
                <br/>
                <h2 style="color:#203444;">
                    Hey there, ${user.name}, if you want to reset your password click the button or the link below.
                </h2>
                <h3>
                    <a 
                        style="color: #e4e4e4;text-decoration: none; margin: auto 0; text-align:center;font-weight:900; font-size: 2rem;width:90%; padding:10px 20px; background:linear-gradient(30deg, rgb(161, 62, 247), rgb(4, 62, 130));border: 0px solid #959da533;border-radius:60px;box-shadow: #959da533 0px 8px 24px;"
                        href="${`https://${req.host}/api/email/password/forgot?user=${userToken}`}">Reset Password</a>
                <h3/>
            </div>

        </div>
        `
        // email user account
        const emailresponse = await send([email], 'Reset Your Password', html);
        return res.status(200).json({ result: true, message: `Reset Password Email Sent`, emailresponse })
    } catch (e) {
        console.log(e);
        return res.status(500).json({ result: false, message: e.message });
    }
}