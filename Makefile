.PHONY: server library start

server:
	cd svg-icon-server && node server.js &

library:
	cd svg-icon-library && npm run serve

start: server library

clean:
	# Add commands to clean up build artifacts, etc., if necessary.
