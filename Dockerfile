FROM denoland/deno

EXPOSE 8000

WORKDIR /app

COPY src/deps.ts src/deps.ts

RUN deno cache src/deps.ts

COPY src .

VOLUME /data

CMD ["run", "--allow-net", "--allow-read", "--allow-write", "simple-upload.ts", "/data"]
