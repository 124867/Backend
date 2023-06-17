const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const session = require('express-session');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Pet Shelter API',
        version: '1.0.0',
    },
};

const options = {
    swaggerDefinition,
    // Paths to files containing OpenAPI definitions
    apis: ['./route/*.js'],
};


const swaggerSpec = swaggerJSDoc(options);
const swaggerYaml = YAML.stringify(swaggerSpec);


const CatsRouter = require('./route/CatRoute');
const userRoute = require('./route/userRoute');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.static('images'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(fileUpload());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
        url: "/api-docs.yaml", // This is the URL of the YAML file
    },
    customCss: '.swagger-ui .topbar { display: none }', // Example of custom CSS
}));;
const url =
    'mongodb+srv://LOl:n20WKfhzy3jH2YHc@cluster0.8lnqldf.mongodb.net/?retryWrites=true&w=majority';

mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to database'))
    .catch((err) => console.error(err));

app.use(session({
    secret: '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',
    resave: false,
    saveUninitialized: true,
}));




app.use('/user', userRoute);

app.use('/cats', CatsRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
