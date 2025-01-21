const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL Connection Setup
let connection;

// Initialize the database connection
async function initializeDB() {
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'Dragon5187$',
            database: process.env.DB_NAME || 'gamerating',
            port: process.env.DB_PORT || 3306,
        });
        console.log('Connected to the database.');
    } catch (err) {
        console.error('Error connecting to the database:', err.stack);
        process.exit(1);
    }
}

// Utility function to execute a query
const executeQuery = async (query, params = []) => {
    try {
        const [results] = await connection.execute(query, params);
        return results;
    } catch (error) {
        console.error('Error executing query:', error);
        throw new Error(`Error executing query: ${error.message}`);
    }
};

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(403).send('No token provided.');

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).send('Failed to authenticate token.');
        req.userId = decoded.id;
        next();
    });
};

// User Registration
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    try {
        await executeQuery('INSERT INTO Users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.status(201).send({ message: "User registered successfully!" });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).send('Username already exists.');
        }
        res.status(500).send('Error registering user');
    }
});

// User Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    try {
        const users = await executeQuery('SELECT * FROM Users WHERE username = ?', [username]);
        if (users.length === 0) return res.status(401).send('Invalid username or password.');

        const user = users[0];
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) return res.status(401).send('Invalid username or password.');

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 86400 });
        res.status(200).send({ auth: true, token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error logging in');
    }
});

// Fetch All Questions
app.get('/api/questions', async (req, res) => {
    try {
        const questions = await executeQuery('SELECT id, questions_text FROM questions');
        res.status(200).json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error.message);
        res.status(500).send('Error fetching questions');
    }
});

// Add New Question
app.post('/api/questions', verifyToken, async (req, res) => {
    const { questions_text } = req.body;
    if (!questions_text) return res.status(400).send('Question text is required.');

    try {
        await executeQuery('INSERT INTO questions (questions_text) VALUES (?)', [questions_text]);
        res.status(201).send('Question added successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding question');
    }
});

// Add New Answer with Username
app.post('/api/answers', verifyToken, async (req, res) => {
    const { answer_text, question_id } = req.body;
    if (!answer_text || !question_id) {
        return res.status(400).send('Answer text and question ID are required.');
    }

    try {
        // First, insert the answer into the table
        await executeQuery('INSERT INTO answers (answer_text, question_id, user_id) VALUES (?, ?, ?)', [answer_text, question_id, req.userId]);
        
        // Next, fetch the username to include with the answer
        const [usernameResult] = await executeQuery('SELECT username FROM Users WHERE id = ?', [req.userId]);
        const username = usernameResult.length > 0 ? usernameResult[0].username : 'Anonymous';

        res.status(201).json({ message: 'Answer submitted successfully!', username });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error submitting answer');
    }
});

// Fetch Answers for a Specific Question with Usernames
app.get('/api/answers/:questionId', async (req, res) => {
    const questionId = req.params.questionId;
    try {
        const answers = await executeQuery(
            `SELECT a.id, a.answer_text, u.username 
            FROM answers a 
            JOIN Users u ON a.user_id = u.id 
            WHERE a.question_id = ?`, [questionId]
        );
        res.status(200).json(answers);
    } catch (error) {
        console.error('Error fetching answers:', error.message);
        res.status(500).send('Error fetching answers');
    }
});

// Delete an Answer
app.delete('/api/answers/:id', verifyToken, async (req, res) => {
    const answerId = req.params.id;

    try {
        const result = await executeQuery('DELETE FROM answers WHERE id = ? AND user_id = ?', [answerId, req.userId]);
        if (result.affectedRows === 0) {
            return res.status(404).send('Answer not found or you do not have permission to delete it.');
        }
        res.status(200).send('Answer deleted successfully!');
    } catch (error) {
        console.error('Error deleting answer:', error);
        res.status(500).send('Error deleting answer');
    }
});

// Custom error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ status: 'error', message: err.message });
});

// Start the server and initialize the database connection
const startServer = async () => {
    await initializeDB();

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

// Close the database connection on exit
const closeConnection = async () => {
    try {
        if (connection) {
            await connection.end();
            console.log('Database connection closed.');
        }
        process.exit();
    } catch (error) {
        console.error('Error closing the connection:', error);
        process.exit(1);
    }
};

process.on('SIGINT', closeConnection);
process.on('SIGTERM', closeConnection);

// Start server
startServer();