const express = require("express");
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");


const PORT = 8080;

const APP_ID = "87bd495cfae04563830088832ac412f3";
const APP_CERTIFICATE  = "99bde5f557234dee8dba0b53b3c24d6f";


const app = express();
const nocache = (req, resp, next) => {
    resp.header('Cache-Contol','private no-cache, no-store, must-revalidate');
    resp.header('Expires', '-1');
    resp.header('Pragma', 'no-cache');
    next();
}

const genrateAccessToken = (req, resp) => {
    // set response header
    resp.header('Access-Control-Allow-Origin', '*');

    // get channel name
    const channelData = req.query.channelData;
    if (!channelData) return resp.status(500).json({ 'error': 'channel is required '});

    // get uid
    let uid = req.query.channelData;
    if (!uid || uid == '') uid = 0;
    
    // get role
    let role = RtcRole.SUBSCRIBER;
    if (req.query.role == 'publisher') role = RtcRole.PUBLISHER;

    // get the expire time
    let expireTime = req.query.expireTime;
    if(!expireTime || expireTime == '') expireTime = 3600;    // 1 hour
    else expireTime = parseInt(expireTime, 10);

    // calculate privilage expire time
    const currentTime = Math.floor(Date.now() / 1000);
    const privilageExpiresTime = currentTime + expireTime;

    // vuild the token
    const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelData, uid, privilageExpiresTime);

    // return the token
    return resp.json({ 'token': token });
}

app.get('/access_token', nocache, genrateAccessToken);

app.listen( PORT, () => {
    console.log(`Server is Listening on port ${PORT}`);
});