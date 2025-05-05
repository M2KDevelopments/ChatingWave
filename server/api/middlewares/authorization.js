const jwt = require('jsonwebtoken');

exports.auth = async function (req, res, next) {

    //verify bearer token
    const bearerHeader = req.headers['authorization'];

    if (bearerHeader) {

        //e.g Bearer ADFKNADLFNAJDFN
        const token = bearerHeader.split(' ')[1];
        const key = process.env.ACCESS_TOKEN_SECRET;

        jwt.verify(token, key, (err, decoded) => {

            //if fields exists
            if (decoded) {
                req.user = decoded; //{email, cid, uid}
                req.token = token;
                //call next middleware
                return next();
            } else {
                console.log('Not Authorized: ' + token)
                return res.sendStatus(403);
            }
        });
    } else {
        console.log('No Token')
        return res.sendStatus(403);
    }
}


exports.server = async function (req, res, next) {
    //verify bearer token
    const bearerHeader = req.headers['authorization'];

    if (bearerHeader) {

        //e.g Bearer ADFKNADLFNAJDFN
        const token = bearerHeader.split(' ')[1];
        const key = process.env.ACCESS_TOKEN_SECRET;

        jwt.verify(token, key, (err, decoded) => {

            //if fields exists
            if (decoded) {
                req.user = decoded; //{email, cid, uid}
                req.token = token;
                //call next middleware

                if (["m2ksoftiez@gmail.com", "m2kdevelopments@gmail.com"].indexOf(decoded.email) === -1) {
                    console.log('Not Authorized: Not an admin');
                    return res.sendStatus(403);
                }

                return next();
            } else {
                console.log('Not Authorized: ' + token)
                return res.sendStatus(403);
            }
        });
    } else {
        console.log('No Token')
        return res.sendStatus(403);
    }
}