# Simple-Upload

Extremely simple dockerized file uploader. Visit the page, upload files, see
them appear in a volume on the server.

Useful for getting files off of a device that has a web browser.

Image is published to [Docker Hub](https://hub.docker.com/r/jrrr/simple-upload).

## Try it

```
docker run -it --init -p 8000:8000 -v $PWD/uploaded-files:/data jrrr/simple-upload
```

For local development check out the Makefile.
