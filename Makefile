
serve:
	deno run --allow-net --allow-read --allow-write simple-upload.ts

docker-build:
	docker build -t simple-upload .

docker-run:
	docker run -it --init -p 8000:8000 simple-upload