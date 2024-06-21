// server.ts

import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

const app = express();
const PORT = 3000;
const DB_FILE = './db.json'; // Path to your JSON database file

app.use(bodyParser.json());

// Interface for submission object
interface Submission {
  name: string;
  email: string;
  phone: string;
  github_link?: string;
  stopwatch_time?: string;
}

// Endpoint to check if server is running
app.get('/ping', (req: Request, res: Response) => {
  try {
    // Respond with success JSON
    res.json({ success: true });
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error in /ping endpoint:', error);
    res.status(500).json({ error: 'Failed to process ping request.' });
  }
});

// Endpoint to submit a new form entry
app.post('/submit', (req: Request, res: Response) => {
  // Destructure and map incoming fields to lowercase names
  const { Name: name, Email: email, Phone: phone, GitHubLink: github_link, StopwatchTime: stopwatch_time } = req.body;

  // Validate required fields
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Name, Email, and Phone are required fields.' });
  }

  // Construct new submission object
  const newSubmission: Submission = {
    name,
    email,
    phone,
    github_link: github_link || '',
    stopwatch_time: stopwatch_time || ''
  };

  // Read existing submissions from JSON file
  fs.readFile(DB_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read submissions.' });
    }

    let submissions: Submission[] = JSON.parse(data);

    // Add new submission to the array
    submissions.push(newSubmission);

    // Write updated submissions back to the JSON file
    fs.writeFile(DB_FILE, JSON.stringify(submissions, null, 2), err => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to save submission.' });
      }
      res.status(201).json({ success: true });
    });
  });
});

// Endpoint to retrieve a specific submission by index
app.get('/read', (req: Request, res: Response) => {
  const index = parseInt(req.query.index as string, 10);

  // Read submissions from JSON file
  fs.readFile(DB_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read submissions.' });
    }

    const submissions: Submission[] = JSON.parse(data);

    // Check if index is valid
    if (index < 0 || index >= submissions.length) {
      return res.status(404).json({ error: 'Submission not found.' });
    }

    // Return the submission at the specified index
    res.json(submissions[index]);
  });
});

// Endpoint to update a specific submission by email
app.post('/update', (req: Request, res: Response) => {
  const updatedSubmission: Submission = req.body;

  fs.readFile(DB_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read submissions.' });
    }

    let submissions: Submission[] = JSON.parse(data);
    const indexToUpdate = submissions.findIndex(submission => submission.email === updatedSubmission.email);

    if (indexToUpdate === -1) {
      return res.status(404).json({ error: 'Submission not found.' });
    }

    // Update the submission at the found index
    submissions[indexToUpdate] = updatedSubmission;

    // Write updated submissions back to the JSON file
    fs.writeFile(DB_FILE, JSON.stringify(submissions, null, 2), err => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to save submission.' });
      }
      res.json({ success: true });
    });
  });
});


// Endpoint to retrieve a specific submission by email
app.get('/readByEmail', (req: Request, res: Response) => {
  const email: string = req.query.email as string;

  fs.readFile(DB_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file ${DB_FILE}:`, err);
      return res.status(500).json({ error: 'Failed to read submissions.' });
    }

    try {
      const submissions: Submission[] = JSON.parse(data);
      const submission = submissions.find(submission => submission.email === email);

      if (!submission) {
        return res.status(404).json({ error: 'Submission not found.' });
      }

      res.json(submission);
    } catch (error) {
      console.error('Error parsing submissions data:', error);
      return res.status(500).json({ error: 'Failed to process submissions.' });
    }
  });
});

// Endpoint to delete a submission by email
app.delete('/delete', (req: Request, res: Response) => {
  const email: string = req.query.email as string;

  fs.readFile(DB_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file ${DB_FILE}:`, err);
      return res.status(500).json({ error: 'Failed to read submissions.' });
    }

    try {
      let submissions: Submission[] = JSON.parse(data);
      const updatedSubmissions = submissions.filter(submission => submission.email !== email);

      if (submissions.length === updatedSubmissions.length) {
        return res.status(404).json({ error: 'Submission not found.' });
      }

      fs.writeFile(DB_FILE, JSON.stringify(updatedSubmissions, null, 2), err => {
        if (err) {
          console.error(`Error writing file ${DB_FILE}:`, err);
          return res.status(500).json({ error: 'Failed to delete submission.' });
        }
        res.json({ success: true });
      });
    } catch (error) {
      console.error('Error parsing submissions data:', error);
      return res.status(500).json({ error: 'Failed to delete submission.' });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
