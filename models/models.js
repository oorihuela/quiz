var path = require('path');

// POSTGRES DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite DATABASE_URL = sqlite://:@:/

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;


// Cargar modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
                        { dialect: protocol,
                          protocol: protocol,
                          port: port,
                          host: host,
                          storage: storage, // Solo SQLite (.env)
                          omitNull: true // Solo Postgres
                        }
                    );

// Importar la definici�n de la tabla Quiz en quiz.js
var quiz_path = path.join(__dirname, 'quiz');
var Quiz = sequelize.import(quiz_path);

// Importar definici�n de la tabla Comment en quiz.js
var comment_path = path.join(__dirname, 'comment');
var Comment = sequelize.import(comment_path);

Comment.belongsTo(Quiz, { onDelete: 'cascade' });
Quiz.hasMany(Comment);

exports.Quiz = Quiz; // Exportar definici�n de tabla Quiz
exports.Comment = Comment; // Exportar definici�n de tabla Comment

// sequelize.sync() crea e inicializa tabla de preguntas en DB

sequelize.sync().then(function () {

    // success ejecuta el manejador una vez creada la tabla

    Quiz.count().then(function (count) {
    if (count === 0) { // La tabla se inicializa s�lo si est� vac�a
        Quiz.create( { pregunta: 'Capital de Italia',
                       respuesta: 'Roma',
                       tema: 'Otro'
                     });
        Quiz.create( { pregunta: 'Capital de Portugal',
                       respuesta: 'Lisboa',
                       tema: 'Otro'
                     })
        .then(function() { console.log('Base de datos inicializada') });
    };
});
});