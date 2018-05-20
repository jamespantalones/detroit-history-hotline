const FtpDeploy = require('ftp-deploy');
const ftp = new FtpDeploy();

require('dotenv').config();

const config = {
  username: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
  host: process.env.FTP_HOST,
  port: 21,
  localRoot: __dirname,
  include: ['build/*'],
  remoteRoot: 'prod/www/specials/detroit-history-hotline-dev-01/',
  deleteRoot: false
};

ftp.on('uploading', data => {
  console.log(data.filename);
});

ftp.deploy(config, err => {
  if (err) {
    console.log(err);
  } else {
    console.log('FINISHED');
  }
});
