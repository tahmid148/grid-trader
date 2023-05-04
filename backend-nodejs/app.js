const express = require('express');
const app = express();


// Set EJS as the templating engine
app.set('view engine', 'ejs');

app.use(express.static('scripts'));


// Define a route that renders the index.ejs file
app.get('/', (req, res) => {
//   const message = 'This content is dynamic!';
  res.render('index');
});

app.listen(5001, () => {
  console.log('Server started on port 5001');
});
