# svg-collection

## Specify a port (default is 8000)
python3 -m http.server 8080

## Bind to a specific address
python3 -m http.server --bind 127.0.0.1

## Serve a specific directory
python3 -m http.server --directory /path/to/directory

## Combine multiple flags
python3 -m http.server --bind 127.0.0.1 --directory /path/to/directory 8080
