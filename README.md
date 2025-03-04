# GlamSage Test Setup and Stress Test

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher recommended)
- npm (comes with Node.js)

## Setup

1. Clone the repository or download the source code.
2. Navigate to the project directory:
   ```sh
   cd glamsage-test
   ```
3. Install dependencies:s
   ```sh
   npm install
   ```

## Running the Express App

Start the server with the following command:

```sh
node index.js
```

The server should now be running on `http://localhost:3000`.

## Testing the API

Before running the tests be sure to set the TOTAL\_REQUESTS and CONCURRENCY as per your testing criterion.\
To run the stress test:

```sh
node test.js
```

This will send multiple requests to the `/scrape` endpoint and log performance metrics.

## Troubleshooting

- If you encounter errors, ensure all dependencies are installed correctly by running:
  ```sh
  npm install
  ```
- Check if your Node.js version is up-to-date with:
  ```sh
  node -v
  ```

