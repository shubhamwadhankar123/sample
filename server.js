// server.js
const express = require('express');
const multer = require('multer');
const mysql = require('mysql');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'your_database',
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
    }
});

const upload = multer({ storage: storage });

// Endpoint to save service details
app.post('/api/save-service', upload.single('service_image'), (req, res) => {
    const { name, service_name, address, mobile_no } = req.body;
    const service_image = req.file.path; // Path to the uploaded image

    const sql = 'INSERT INTO services (name, service_name, address, mobile_no, service_image) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, service_name, address, mobile_no, service_image], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error.' });
        }
        res.json({ success: true });
    });
});

// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// Endpoint to get all services
app.get('/api/get-services', (req, res) => {
    const sql = 'SELECT * FROM services';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error.' });
        }
        res.json({ success: true, services: results });
    });
});
