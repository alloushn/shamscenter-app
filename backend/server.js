const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let students = [];

app.get('/students', (req, res) => {
    res.json(students);
});

app.post('/students', (req, res) => {
    const student = req.body;
    students.push(student);
    res.json({message: 'Student added'});
});

app.listen(3000, () => console.log('Server running on port 3000'));
