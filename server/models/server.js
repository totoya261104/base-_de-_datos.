let express = require("express");
let sha1 = require ("sha1");
let session = require("express-session"); //linea 3
let cookie = require("cookie-parser"); //linea 4




class server {
    constructor (){
        this.app = express();
        this.port = process.env.PORT;

        this.middlewares();
        this.routers();
    }

    middlewares(){
        //paginas estaticas
        this.app.use(express.static('public'));
        //View engine
        this.app.set('view engine', 'ejs');
        this.app.use(cookie());


        //sesiones//////////////////
        

        this.app.use(session({
            secret: "amar",
            saveUninitialized: true,
            resave: true
        }));
        ////////////////////////////

    }

    routers(){






//ruta hola///
        this.app.get('/hola',(req, res) => {
         if(req.session.user){

            if(req.session.rol=="admin"){
                res.send("<h1 style= 'color: red;'> Iniciaste como Administrador!!!</h1>");

            }
         
         else{
            res.send("hi style='color:blue;'>ERROR NO HAS INICIADO !!<h1/>");
         }
        }
         else{
            res.send("<h1 style='color: red; '>Hola soy ruth!</h1>");
         }


        });
/// ruta login///
        this.app.get("/login",(req,res)=>{
            let usuario=req.query.nombre_usuario;
            let contraseña =req.query.contraseña;

            // cifradoooooooo  contrasena//
            let passSha1 =sha1(contraseña);
            ////////////////////////////////////////////////////////
           //conexion msql//////
            let mysql = require('mysql');
            
            let conn=mysql.createConnection({
                host:"localhost",
                user:'root',
                password:'Amarillo11',
                database:'escuela'
            });
            conn.connect(function(err){
                if(err) throw err;
                console.log('Conectado!!!');
                let sql="SELECT * FROM usuarios WHERE nombre_usuario='"+usuario+"'";
                conn.query(sql,function(err,result){
                    if(err) throw err;
                        if(result.length>0)
                            if (result[0].contraseña==passSha1){




                    //sesion
                  let user = {
                    nam: usuario,
                    psw: contraseña,
                    rol: result[0].rol
                  }
                    req.session.user=user
                    req.session.save();
                    res.render("inicio", {nombre: result[0].nombre_usuario,
                    rol: result[0].rol});
                    

                    }             
                            else
                                res.render("login", {error:"contraseña incorrecta"});
                        else
                            res.render("login", {error:"usuario no existe!!!"});
                });
            });
          
        });

// ruta para dar de baja alumnos
  




//ruta registrar
            this.app.get("/registrar", (req, res) => {

             let mat = req.query.matricula;
             let nombre = req.query.nombre;
             let cuatri = req.query.cuatrimestre;  

             let mysql = require('mysql');

let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Amarillo11",
  database: "escuela"
});


con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  let sql = "INSERT INTO Alumno values ("+ mat +",'" + nombre +"','"+ cuatri +"')"; 
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.render("registrado",{mat:mat,nombre:nombre,cuatri:cuatri})
    console.log("1 record inserted");
  });
});
});


this.app.get("/resgiscurso", (req, res) => {

    let id_curso = req.query.id_curso;
    let nombre = req.query.nombre;
    let mysql = require('mysql');

let con = mysql.createConnection({
host: "localhost",
user: "root",
password: "Amarillo11",
database: "escuela"
});


con.connect(function(err) {
if (err) throw err;
console.log("Connected!");
let sql = "INSERT INTO curso values ("+ id_curso +",'" + nombre +"')"; 
con.query(sql, function (err, result) {
if (err) throw err;
res.render("resgiscurso",{id_curso:id_curso,nombre:nombre})
console.log("1 record inserted");
});
});
});


this.app.get("/inscribirse", (req, res) => {

    let matricula = req.query.matricula;
    let id_curso= req.query.id_curso;
    
let mysql = require('mysql');

let con = mysql.createConnection({
host: "localhost",
user: "root",
password: "Amarillo11",
database: "escuela"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    let sql = "INSERT INTO inscripto values ("+ matricula +",'" + id_curso +"')"; 
    con.query(sql, function (err, result) {
    if (err) throw err;
    res.render("inscribirse",{matricula:matricula,id_curso:id_curso})
    console.log("1 record inserted");
    });
    });
    });

    }

listen(){

    this.app.listen(this.port, () => {
        console.log("http://127.0.0.1:" + this.port);
    });
}

}

module.exports = server;
