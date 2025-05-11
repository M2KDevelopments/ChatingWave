/**
 * author: Martin Kululanga
 * Github: https://github.com/m2kdevelopments
*/

//imports
const User = require('../models/user');
const Campaign = require('../models/campaign');
const OpenAITool = require('../models/openai.tool');


// API URL - https://{domain}/api/user
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.uid).select('-password').lean();
        const userinfo = {
            _id: user._id,
            name: user.name,
            email: user.email,
            image: user.image,
            google: user.googleSheetsAccessToken ? true : false,
            balance: user.openAITokens || 0,
            openAI: (user.openAIKey || user.openAIUs) ? true : false,
            openAITemperature: user.openAITemperature,
            openAIModel: user.openAIModel,
        }
        
        console.log(`User (${req.user.uid}) requested their info`)
        return res.status(200).json({ result: true, user: userinfo });
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ result: false, message: e.message });
    }
}


// API URL - https://{domain}/api/user
exports.deleteUser = async (req, res) => {

    try {
        await User.findByIdAndDelete(req.user.uid).exec();
        await OpenAITool.deleteMany({ user: req.user.uid })
        await Campaign.deleteMany({ user: req.user.uid })
        return res.status(201).json({ message: `Account was deleted`, result: true });
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ message: e.message, result: false });
    }
}

