FROM denoland/deno

EXPOSE 8080

ENV OUTPUT_DIR=/data

WORKDIR /app

COPY aleph-app/deps.ts deps.ts

RUN deno cache deps.ts

COPY aleph-app .

VOLUME /data

RUN deno run --allow-all https://deno.land/x/aleph@v0.3.0-beta.19/cli.ts build

CMD ["run", "--allow-run", "--allow-env", "--allow-net", "--allow-read", "--allow-write", "https://deno.land/x/aleph@v0.3.0-beta.19/cli.ts", "start"]
