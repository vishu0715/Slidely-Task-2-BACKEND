"use strict";
// server.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const PORT = 3000;
const DB_FILE = './db.json'; // Path to your JSON database file
app.use(body_parser_1.default.json());
// Endpoint to check if server is running
app.get('/ping', (req, res) => {
    try {
        // Respond with success JSON
        res.json({ success: true });
    }
    catch (error) {
        // Handle any unexpected errors
        console.error('Error in /ping endpoint:', error);
        res.status(500).json({ error: 'Failed to process ping request.' });
    }
});
// Endpoint to submit a new form entry
app.post('/submit', (req, res) => {
    // Destructure and map incoming fields to lowercase names
    const { Name: name, Email: email, Phone: phone, GitHubLink: github_link, StopwatchTime: stopwatch_time } = req.body;
    // Validate required fields
    if (!name || !email || !phone) {
        return res.status(400).json({ error: 'Name, Email, and Phone are required fields.' });
    }
    // Construct new submission object
    const newSubmission = {
        name,
        email,
        phone,
        github_link: github_link || '',
        stopwatch_time: stopwatch_time || ''
    };
    // Read existing submissions from JSON file
    fs_1.default.readFile(DB_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to read submissions.' });
        }
        let submissions = JSON.parse(data);
        // Add new submission to the array
        submissions.push(newSubmission);
        // Write updated submissions back to the JSON file
        fs_1.default.writeFile(DB_FILE, JSON.stringify(submissions, null, 2), err => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to save submission.' });
            }
            res.status(201).json({ success: true });
        });
    });
});
// Endpoint to retrieve a specific submission by index
app.get('/read', (req, res) => {
    const index = parseInt(req.query.index, 10);
    // Read submissions from JSON file
    fs_1.default.readFile(DB_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to read submissions.' });
        }
        const submissions = JSON.parse(data);
        // Check if index is valid
        if (index < 0 || index >= submissions.length) {
            return res.status(404).json({ error: 'Submission not found.' });
        }
        // Return the submission at the specified index
        res.json(submissions[index]);
    });
});
// Endpoint to update a specific submission by email
app.post('/update', (req, res) => {
    const updatedSubmission = req.body;
    fs_1.default.readFile(DB_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to read submissions.' });
        }
        let submissions = JSON.parse(data);
        const indexToUpdate = submissions.findIndex(submission => submission.email === updatedSubmission.email);
        if (indexToUpdate === -1) {
            return res.status(404).json({ error: 'Submission not found.' });
        }
        // Update the submission at the found index
        submissions[indexToUpdate] = updatedSubmission;
        // Write updated submissions back to the JSON file
        fs_1.default.writeFile(DB_FILE, JSON.stringify(submissions, null, 2), err => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to save submission.' });
            }
            res.json({ success: true });
        });
    });
});
// Endpoint to retrieve a specific submission by email
app.get('/readByEmail', (req, res) => {
    const email = req.query.email;
    fs_1.default.readFile(DB_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file ${DB_FILE}:`, err);
            return res.status(500).json({ error: 'Failed to read submissions.' });
        }
        try {
            const submissions = JSON.parse(data);
            const submission = submissions.find(submission => submission.email === email);
            if (!submission) {
                return res.status(404).json({ error: 'Submission not found.' });
            }
            res.json(submission);
        }
        catch (error) {
            console.error('Error parsing submissions data:', error);
            return res.status(500).json({ error: 'Failed to process submissions.' });
        }
    });
});
// Endpoint to delete a submission by email
app.delete('/delete', (req, res) => {
    const email = req.query.email;
    fs_1.default.readFile(DB_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file ${DB_FILE}:`, err);
            return res.status(500).json({ error: 'Failed to read submissions.' });
        }
        try {
            let submissions = JSON.parse(data);
            const updatedSubmissions = submissions.filter(submission => submission.email !== email);
            if (submissions.length === updatedSubmissions.length) {
                return res.status(404).json({ error: 'Submission not found.' });
            }
            fs_1.default.writeFile(DB_FILE, JSON.stringify(updatedSubmissions, null, 2), err => {
                if (err) {
                    console.error(`Error writing file ${DB_FILE}:`, err);
                    return res.status(500).json({ error: 'Failed to delete submission.' });
                }
                res.json({ success: true });
            });
        }
        catch (error) {
            console.error('Error parsing submissions data:', error);
            return res.status(500).json({ error: 'Failed to delete submission.' });
        }
    });
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
