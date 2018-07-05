# Upload a folder to S3

Upload web content (html, jpeg, png, json, otf...) to S3

Make sure you have the rights on the bucket

## Docker build

    docker build -t uploadtos3 .

## Usage
```sh
export AWS_KEY=
export AWS_SECRET=
export AWS_BUCKET=

docker run \
-e AWS_KEY=$AWS_KEY \
-e AWS_SECRET=$AWS_SECRET \
-e AWS_BUCKET=$AWS_BUCKET \
-v ~/path/to/folder:/folder \
uploadtos3
```
