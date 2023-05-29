const SERVER_PORT = 8000;


const express = require('express');
const app = express();

const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



// Handle POST requests to /api/login
app.post('/api/login', (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;


  console.log("recebi merdas")

  const user = {
    username: username,
    password: password,
    nome: "John Pork",
    id: -1
  }
  // TODO: Validate the user's credentials
  // If the credentials are valid, create a JWT and send it back to the client
  // If the credentials are invalid, send an error response
  let isValid = true;

  if (isValid) {
    res.status(200).json({ user: user });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Start the server
app.listen(SERVER_PORT, () => {
  console.log('Server started on port ' + SERVER_PORT);
});
