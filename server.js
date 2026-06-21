// const { createServer } = require('http');
// const { parse } = require('url');
// const next = require('./node_modules/next');

// const dev = process.env.NODE_ENV !== 'production';
// const hostname = 'localhost';
// const port = process.env.PORT || 3000;

// // Initialize Next.js app
// const app = next({ dev, hostname, port, dir: __dirname });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   createServer(async (req, res) => {
//     try {
//       // Parse the URL to get the pathname and query
//       const parsedUrl = parse(req.url, true);

//       // Let Next.js handle the request
//       await handle(req, res, parsedUrl);
//     } catch (err) {
//       console.error('Error occurred handling', req.url, err);
//       res.statusCode = 500;
//       res.end('Internal Server Error');
//     }
//   })
//     .once('error', (err) => {
//       console.error(err);
//       process.exit(1);
//     })
//     .listen(port, () => {
//       console.log(`> Ready on http://${hostname}:${port}`);
//     });
// });


const { createServer } = require('http');
const next = require('next');

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

const port = process.env.PORT || 3200;

const app = next({
    dev: false,
    hostname: '0.0.0.0',
    port,
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
    createServer((req, res) => {
        handle(req, res);
    }).listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});