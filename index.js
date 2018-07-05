const path = require("path");
const fs = require("fs");
const Promise = require("bluebird");
const walk = require("walk");
const AWS = require("aws-sdk");
const preadFile = Promise.promisify(fs.readFile);

const walkFolder = p => {
  return new Promise((resolve, reject) => {
    const folderPath = path.resolve(p);
    const folderPathArray = folderPath.split("/");
    const folderName = folderPathArray[folderPathArray.length - 1];
    const files = [];
    const walker = walk.walk(folderPath, { followLinks: false });
    walker.on("file", (root, stat, next) => {
      const filePath = `${root}/${stat.name}`;
      const filePathArray = filePath.split(folderPath);
      files.push(`${folderName}${filePathArray[filePathArray.length - 1]}`);
      next();
    });
    walker.on("end", () => {
      resolve(files);
    });
    walker.on("error", error => {
      reject(error);
    });
  });
};

const uploadFile = awsconf => {
  AWS.config.update(awsconf);
  return (bucket, folder, path, acl = "private") => {
    const pathArray = path.split("/");
    const name = pathArray.splice(1).join("/");
    const s3 = new AWS.S3();
    const s3pputObject = Promise.promisify(s3.putObject.bind(s3));
    const contenttypes = {
      html: "text/html",
      jpg: "image/jpg",
      jpeg: "image/jpg",
      png: "image/png",
      css: "text/css",
      js: "application/javascript",
      gif: "image/gif",
      json: "application/json",
      otf: "font/opentype",
      svg: "c"
    };
    return preadFile(path).then(output => {
      return s3pputObject({
        Bucket: bucket,
        Key: `${folder}${name}`,
        Body: new Buffer(output, "binary"),
        ContentType: contenttypes[path.split(".")[path.split(".").length - 1]],
        ACL: acl
      });
    });
  };
};

const uploadFolder = awsconf => (bucket, base, folder) => {
  const fileUploader = uploadFile(awsconf);
  return walkFolder(folder).then(files => {
    return Promise.all(files.map(f => fileUploader(bucket, base, f)));
  });
};

uploadFolder({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET
})(process.env.AWS_BUCKET, "", "/folder")
  .then(_ => {
    console.log(`Upload to ${process.env.AWS_BUCKET} completed.`);
  })
  .catch(e => {
    console.log(e);
  });
