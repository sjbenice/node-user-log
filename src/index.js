require('dotenv').config({ path: './.env' })
const express = require('express');
const apiRouter = require('./backend/api');
const pool = require('./backend/db');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, './frontend/build')));

// Routes
app.use('/api', apiRouter);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './frontend/build/index.html'));
});

// Attach shutdown middleware
async function shutdown() {
    // Perform cleanup tasks here
    await pool.end(); // Close the database connection pool
    console.log('Pool has ended');
}
  
app.use((req, res, next) => {
    if (req.path === '/shutdown') {
        console.log('Received shutdown request. Shutting down gracefully...');
        shutdown().then(() => {
        res.status(200).send('Server shutting down gracefully.');
    });
    } else {
        next();
    }
});
  
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
