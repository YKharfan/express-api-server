# react-api-server

## Getting Started

Make sure to have the environment variables configured:

```bash
DB_NAME="dbname"
DB_USER="user"
DB_PASSWORD="password"
DB_HOST="localhost"
DB_DIALECT="mysql"
DB_PORT="3306"
JWT_SECRET=random-secret-key
JWT_EXPIRES_IN=1h
BASIC_AUTH_USER=admin
BASIC_AUTH_PASS=supersecret
PORT=3000
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The api routes are defined in `src/index.ts`.

The database models are defined inside the `src/models`.

## Setting up Production Environment

For production you need to build:

```bash
npm run build
```

The files will be generated into the `dist/` directory.

To start the production server:

```bash
npm start
```

You can set up the environment files in a .env file or in the system environment.