
serve:
	deno run --allow-net --allow-read --allow-write src/simple-upload.ts ./files

docker-build:
	docker build -t simple-upload .

docker-run:
	docker run -it --init -p 8000:8000 -v $(shell pwd)/files-docker:/data simple-upload