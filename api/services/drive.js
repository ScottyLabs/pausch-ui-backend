const { google } = require('googleapis');
const stream = require('stream');
var path = require('path');

let controller = {};

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

const TOKEN_PATH = path.join(__dirname,'token.json');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
var REDIRECT_URIS = ["urn:ietf:wg:oauth:2.0:oob", "http://localhost"];

/**
 * Send a image to Drive
 * @param {String} imgName
 * @param {String} file
 * @param {Function} callback
 */
controller.sendImgToDrive = (imgName, file, callback, req, res) => {
    // Load client secrets from a local file.



    authorize(addImg(imgName, file, callback, req, res));

};


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize( callback) {
    var client_secret = CLIENT_SECRET;
    var client_id = CLIENT_ID;
    var redirect_uris = REDIRECT_URIS;

    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    const token = {
        access_token: process.env.ACCESS_TOKEN,
        refresh_token: process.env.REFRESH_TOKEN,
        scope: "https://www.googleapis.com/auth/drive.file",
        token_type: "Bearer",
        expiry_date: process.env.TOKEN_EXPIRY_DATE
    };

    oAuth2Client.setCredentials(token);
    callback(oAuth2Client);
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

function addImg(imgName, file, callback, req, res) {
    return (auth) => {

        console.log('hey');

        const drive = google.drive({ version: 'v3', auth });
        const folder_id = '1M4J4uWrKrD_MixqQOPCqxd0NlFCYVbna';
        var fileMetadata = {
            'name': imgName,
            'mimeType': 'image/png',
            'parents': [folder_id]
        };
        var media = {
            mimeType: 'image/png',
            body: file
        };
        drive.files.create({
            resource: fileMetadata,
            media: media,
        }, (err, file) => {
            if (err) {
                console.error(err);
                callback(err);
            } else {
                callback(req, res, file.data.id, err);
            }
        });

        console.log('hi');
    }
}




module.exports = controller;
