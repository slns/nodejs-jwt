const app = require("express")();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

require('dotenv-safe').config({
  allowEmptyValues: true,
  example: './.env.example'
});

if (process.env.ENV === 'dev') {
  console.log(`
  ****************************
  Environment Mode Development
  ****************************
  `);
}

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// Conecta no MongoDB
mongoose.connect(process.env.DB_URL + process.env.DB_NAME, {
  useNewUrlParser: true
})
.then(() => console.log(`
  =============
  DB Connected!
  =============
  `))
.catch(err => {
    console.log(`
    ####################################
    DB Connection Error: ${err.message}
    ###################################
    `);
  });

// Carrega o model de Utilizador
require("./models/user");

app.use(bodyParser.json());

// Inicia as rotas da API
app.use("/api", require("./controllers/userController"));

app.listen(3000);