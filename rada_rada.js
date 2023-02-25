
// const client = new OAuth2Client(
//     credentials.web.client_id,
//     credentials.web.client_secret,
//     credentials.web.redirect_uris[0]
//   );

// Set up Google Drive API client
// const auth = new google.auth.OAuth2({
//   clientId: process.env.CLIENT_ID,
//   clientSecret:process.env.CLIENT_SECRET,
//   redirectUri: process.env.REDIRECT_URI
// });


// async function getAccessToken(code) {
//     const { tokens } = await client.getToken(code);
//     auth.setCredentials({
//         access_token: tokens.access_token
//       });
//   }


// const drive = google.drive({ version: 'v3', auth });





app.post('/submit', upload.single('resume'), (req, res) => {
  const { name, email, phone } = req.body;
  const resumeFile = req.file;
  console.log(name);

  // Create a new file in Google Drive
  const fileMetadata = {
    name: resumeFile.originalname,
    parents: ['FOLDER_ID']
  };
  const media = {
    mimeType: resumeFile.mimetype,
    body: require('fs').createReadStream(resumeFile.path)
  };
  drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id'
  }, (err, file) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error uploading file');
      return;
    }

    console.log(`File ID: ${file.data.id}`);

    // Save the application data to a Google Sheet
    const sheets = google.sheets({ version: 'v4', auth });
    sheets.spreadsheets.values.append({
      spreadsheetId: 'SPREADSHEET_ID',
      range: 'Sheet1!A:B',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[name, email, phone, file.data.id, new Date().toISOString()]]
      }
    }, (err, response) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error saving data');
        return;
      }

      console.log(response.data);

      res.status(200).send('Application submitted successfully');
    });
  });
});
