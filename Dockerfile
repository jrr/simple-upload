FROM denoland/deno

EXPOSE 8000

WORKDIR /app

COPY deps.ts .

RUN deno cache deps.ts

COPY simple-upload.ts .

VOLUME /data

CMD ["run", "--allow-net", "--allow-read", "--allow-write", "simple-upload.ts", "/data"]
