const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// const swaggerJsDoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');

const userRoutes = require('./api/routes/users');

// Implement swagger
// const swaggerOptions = {
//   swaggerDefinition: {
//     info: {
//       title: 'User API',
//       description: 'User API Information',
//       contact: {
//         name: 'munazil'
//       },
//       servers: [{
//         url: "http://localhost:8080"
//       }       
//       ]
//     }
//   },
//   apis: ['./api/routes/users.js']
// };

// const swaggerDocs = swaggerJsDoc(swaggerOptions);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// console.log(swaggerDocs)

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(
  'mongodb+srv://munazil:' + process.env.MONGO_ATLAS_PW + '@take-home-assignment.c3qaj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
{
  useNewUrlParser: true, 
  useUnifiedTopology: true
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

//Routes that handle requests
app.get('/fana',(req, res, next) => {
  res.status(200).json({
    message: 'helloe'
  })
});

app.use('/user', userRoutes);

app.use((req, res, next) => {
    const error = new Error('api not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
      error:{
        message: error.message
      }
  });
});

module.exports = app;