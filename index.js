const Joi = require("joi");
const express = require("express");
const app = express();
const fs = require('fs')
const coursesJ = __dirname + "/courses.json" 

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world!!!");
});

app.get('/api/courses', (req, res) => {
    fs.readFile(coursesJ, 'utf-8', (error, content) => { 
        if (error) return res.status(400).send(error.details[0].message);
        res.send(JSON.parse(content));
    })
});


app.post('/api/courses', (req, res) => {
  const { error } = validateCourse(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  fs.readFile(coursesJ, 'utf-8', (error, content) => {
    if (error) return res.status(400).send(error.details[0].message);

  const parsedObj = JSON.parse(content)
  const coursesData = parsedObj.courses
  const course = {
    id: coursesData.length + 1,
    name: req.body.name,
  };
  coursesData.push(course);
  const stringToSave = JSON.stringify(parsedObj, null, 1);
  
  
  fs.writeFile(coursesJ, stringToSave, 'utf-8', (err) => {
    if (err) res.status(404).send(err.details[0].message);
    res.send(stringToSave);
  })
})
})



function validateCourse(course) {
    const schema = {
      name: Joi.string().min(3).required(),
    };

    return Joi.validate(course, schema);
};

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));