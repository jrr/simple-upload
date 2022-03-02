
dev:
	cd aleph-app; ../bin/aleph dev
# deno run --allow-net --allow-read --allow-write src/simple-upload.ts ./files

start:
	cd aleph-app; ../bin/aleph start

build:
	cd aleph-app; ../bin/aleph build


docker-build:
	docker build -t simple-upload .

docker-run:
	docker run -it --init -p 8080:8080 -v $(shell pwd)/files-docker:/data -e OUTPUT_DIR=/data simple-upload