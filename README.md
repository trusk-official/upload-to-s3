# Upload a folder to S3

Upload web content (html, jpeg, png, json, otf...) to S3

Make sure you have the rights on the bucket

## Docker build

    docker run -t uploadtos3 build .

## Usage
```sh
docker run \
-e AWS_KEY='KEY' \
-e AWS_SECRET='SECRET' \
-e AWS_BUCKET='BUCKET' \
-v ~/path/to/folder:/folder \
uploadtos3
```
