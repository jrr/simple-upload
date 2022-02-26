FROM denoland/deno

EXPOSE 8000

WORKDIR /app

COPY simple-upload.ts .

RUN deno cache simple-upload.ts

VOLUME /data

CMD ["run", "--allow-net", "--allow-read", "--allow-write", "simple-upload.ts", "/data"]
