// Import Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize App
const app = express();
const PORT = 3000;

// =======================
// Middleware
// =======================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/percentage_calculator/views')));
app.set('view engine', 'ejs');

// =======================
// Helper Functions
// =======================
const sumArray = (arr) => arr.reduce((acc, num) => acc + num, 0);

// =======================
// Routes
// =======================

// GET: Home Page - Displays the form
app.get('/', (req, res) => {
  res.render('index');
});

// POST: Generate Checkboxes
app.post('/generate', (req, res) => {
  const numCheckboxes = parseInt(req.body.numCheckboxes, 10) || 0;
  res.render('checkBox', { count: numCheckboxes });
});

// POST: Calculate Results
app.post('/result', (req, res) => {
  const subjectCount = parseInt(req.body.subjectCount, 10) || 0;

  const totalMarks = [];
  const obtainedMarks = [];

  // Collect marks from request body
  for (let i = 1; i <= subjectCount; i++) {
    totalMarks.push(parseInt(req.body[`totalMarks${i}`], 10) || 0);
    obtainedMarks.push(parseInt(req.body[`obtainedMarks${i}`], 10) || 0);
  }

  // Calculate sums
  const totalSum = sumArray(totalMarks);
  const obtainedSum = sumArray(obtainedMarks);

  // Calculate percentage safely
  const percentage =
    totalSum > 0 ? ((obtainedSum / totalSum) * 100).toFixed(2) : 0;

  // Render results page
  res.render('result', {
    totalMarks: totalSum,
    obtainedMarks: obtainedSum,
    percentage,
  });
});

// =======================
// Start Server
// =======================
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
