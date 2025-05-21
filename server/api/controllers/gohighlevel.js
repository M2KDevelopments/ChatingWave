const { Gohighlevel } = require('gohighlevel')
const GHL = new Gohighlevel({
    clientId: process.env.GHL_CLIENT_ID,
    clientSecret: process.env.GHL_CLIENT_SECRET,
    redirectUri: process.env.GHL_REDIRECT_URI
});


exports.oauth = async (req, res) => {
    const url = GHL.oauth.scopeSurveysReadonly().getOAuthURL();
    return res.status(200).redirect(url);
}

exports.callback = async (req, res) => {
    try {
        const { code, refresh_token } = req.query;
        const auth = await GHL.oauth.getCallbackAuthTokens({ code, refresh_token });
        return res.status(201).json({ access_token: auth.access_token });
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ result: false, message: e.message });
    }
}
