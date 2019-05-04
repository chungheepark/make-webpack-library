DEFAULT_BUILD = dev
WEBPACK = ./node_modules/.bin/webpack

all: clean build-dev build-real
dev: clean build-dev
build: clean build-real

clean:
	rm -f ./lib.*
	rm -f ./examples/lib.*

deploy:
	cp ./lib.* ./examples

build-dev:
	$(WEBPACK)

build-real:
	$(WEBPACK) -p