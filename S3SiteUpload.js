// Consider having directory as input
// Add verbosity argument
// This does the same thing:
// aws s3 cp src/public s3://fake-or-real --recursive
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  accessKeyId: AWS.config.credentials.accessKeyId,
  secretAccessKey: AWS.config.credentials.secretAccessKey
});
const BUCKET_NAME = 'fake-or-real';
const PUBLIC_DIR = (fileName) => `src/public/${fileName}`;
const PARENT = (prefix, fileName) => `${prefix != ''? prefix + '/' : ''}${fileName}`;

// Desired Upload Files (pick and choose by adding or removing from list)
/*
schema file = {
  Key: <String>,
  ContentType: <MIME> // Const MIME type
}

schema directory = {
  Key: <String>,
  ContentType: <function: file -> MIME> // MIME Match function
}
*/
const files = [
  {
    Key: 'index.html',
    ContentType: 'text/html'
  },
  {
    Key: 'game.html',
    ContentType: 'text/html'
  },
  {
    Key: 'script.js',
    ContentType: 'application/javascript'
  },
  {
    Key: 'style.css',
    ContentType: 'text/css'
  }
];
const directories = [
  {
    Key: 'images',
    ContentType: fileName => {
      // match on file extension
      const ext = fileName.split('.').pop();
      const image = type => `image/${type}`;
      switch (ext) {
        case 'jpg':
          return image('jpeg');
        case 'png':
          return image('png');
        case 'gif':
          return image('gif');
        default:
          console.log('[S3SiteUpload] ContentType validation error:', fileName);
          return 'binary/octet-stream';
      }
    }
  }
];

// Functions (call at bottom)
function uploadFile(file, filePath, prefix = '') {
  fs.readFile(filePath, (err, fileContent) => {
    if (err) {
      console.log(`[S3SiteUpload] Could not open ${file.Key}:`, err);
    } else {
      const params = {
        Bucket: BUCKET_NAME,
        Key: PARENT(prefix, file.Key),
        Body: fileContent,
        ContentType: file.ContentType
      };
      s3.upload(params, (err, data) => {
        if (err) {
          console.log(`[S3SiteUpload] Could not upload ${file.Key}:`, err);
        } else {
          console.log(`[S3SiteUpload] ${PARENT(prefix, file.Key)} data:`, data);
        }
      })
    }
  });
}

function uploadSite() {
  // Upload files
  files.forEach(file => {
    const filePath = path.join(__dirname, PUBLIC_DIR(file.Key));
    uploadFile(file, filePath);
  });

  // Upload files with directory extension
  // TODO
  directories.forEach(directory => {
    const directoryPath = path.join(__dirname, PUBLIC_DIR(directory.Key));
    fs.readdir(directoryPath, (err, dirFiles) => {
      if (err) {
        console.log(`[S3SiteUpload] Could not scan directory ${directory.Key}:`, err);
      } else {
        dirFiles.forEach(fileName => {
          const filePath = path.join(directoryPath, fileName);
          const file = {
            Key: fileName,
            ContentType: directory.ContentType(fileName)
          }
          uploadFile(file, filePath, directory.Key);
        })
      }
    })
  });
}

console.log('UPLOADING TO S3...');
uploadSite();