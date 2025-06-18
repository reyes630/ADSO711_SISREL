const express = require('express'); // Se llama la depenedencia del Framework
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();

app.set('port', process.env.PORT || 4000);

app.use(morgan('dev'));
// Permite recibir datos del formulario
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json()); // Permite recibir solicitudes JSON

// Routes
app.use('/api/v1/users', require('./api/v1/user.routes'))
app.use('/api/v1/roles', require('./api/v1/roles.routes'))
app.use('/api/v1/states', require('./api/v1/states.routes'))

// Rutas del API
// app.get('/', (req, resp)=> {
//     // req = request => es la peticion del usuario
//     // req = response => es la respuesta del servidor al usuario
//     resp.send({
//         'status': 200,
//         'message': 'Prueba API proyecto formativo exitosa'
//     })
// });
// app.get('/saludos', (req, resp)=> {
//     // req = request => es la peticion del usuario
//     // req = response => es la respuesta del servidor al usuario
//     resp.send({
//         'status': 200,
//         'message': 'Hello proyecto formativo'
//     })
// });

// app.post('/newUserTest', (req, resp)=> {
//     console.log(req);
//     console.log(req.body);
//     const documentUser = req.body.documentUser;
//     const nameUser = req.body.nameUser;
//     const emailUser = req.body.emailUser;
//     const telephoneUser = req.body.telephoneUser;
//     const passwordUser = req.body.passwordUser;
//     const {documentUser, nameUser, emailUser, telephoneUser, passwordUser} = req.body;

// })

// Se inicializa el servidor
app.listen(app.get('port'), () => {
    console.log(`Server runing on port ${app.get('port')}`);
})