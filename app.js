require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const {pool} =require('./db/database');

//configuracion
app.set('port', process.env.PORT || 3000)

//middlewares
app.use(morgan('dev'))


//rutas
app.get('/', async (req, res) => {
    let results = {}
    let con = pool;

    try {

        let body = req.body

        let name = String("marco") || "";
        let apellido_paterno = String("cruzado") || "";
        let apellido_materno = String("gonzales") || "";
        let document_number = String(70072332) || "";
        let document_type = String('dni') || "";
        let phone_number = String(9224513071) || "";
        let option = String('1') || "";//opcon 1 es para validacion de nombre y apellido,opcion 2 es para validacion de documento,opcion 3 es para validacion de telefono

        if (option == '1') {
            //validar el nombre que sean solo letras y espacios
            /* 
                cuerpo de peticion a la API 
                {
                    "name":"marco",
                    "apellido_paterno":"cruzado",
                    "apellido_materno":"gonzales",
                    option:"1"
                }
            */
            let regex = /^[a-zA-Z\s]*$/;
            if ((regex.test(name) == false) || (regex.test(apellido_paterno) == false) || (regex.test(apellido_materno) == false)) {
                results.statusCode = 0;
                results.error = "los parametros son invalidos";
                res.status(400).json(results)
            } else {
                //consultar a la base de datos si exite el nombre
                let query = `SELECT * FROM public."userBlackList" WHERE nombre ='${name}' AND apellido_paterno = '${apellido_paterno}' AND apellido_materno = '${apellido_materno}'`;
                //consuulta para insertar en la base de datos
                let result = await con.query(query);
                //si existe un registro con ese nombre y apellido exacto avisarle que ya existe en la base de datos
                if (result.rowCount > 0) {
                    results.statusCode = 0;
                    results.error = "ya existe un usuario con ese nombre y apellido";
                    res.status(400).json(results)
                } else {
                    //decirle que el nombre es valido y aun lo puede registrar en la base de datos
                    results.statusCode = 1;
                    results.message = "El nombre es valido --> continua con el registro del documento"
                    res.status(200).json(results)
                }             
            }
        } else if (option == '2') {
            //EVALUALO BIEN SI ES CORRECTO ASI QUE QUEDELA API 
            /* 
                cuerpo de peticion a la API
                {
                    "telefono":9224513071,
                    "option":"2"
                }
            */
            //validaremos que el dni sean solo numero y si comienzan con ceros igual que los traigan
            let regex = /^[0-9]*$/;
            if ((regex.test(document_number) == false) || (document_number.length != 8)) {
                results.statusCode = 0;
                results.error = "los parametros son invalidos";
                res.status(400).json(results)
            }else{
                //consultar a la base de datos si exite el dni
                let query = `SELECT * FROM public."userBlackList" WHERE numero_documento ='${document_number}'`;
                //consuulta para insertar en la base de datos
                let result = await con.query(query);
                //si existe un registro con ese dni avisarle que ya existe en la base de datos
                if (result.rowCount > 0) {
                    results.statusCode = 0;
                    results.error = "ya existe un usuario con ese dni";
                    res.status(400).json(results)
                } else {
                    //decirle que el dni es valido y aun lo puede registrar en la base de datos
                    results.statusCode = 1;
                    results.message = "El dni es valido --> continua con el registro del telefono"
                    res.status(200).json(results)
                }
            }

        } else if (option == '3') {

        } else {
            results.error = 'opcion no valida'
            res.status(200).json(results);
        }

    } catch (e) {
        results.errorMessage = e.errorMessage || "Missing parameter";
        results.errorCode = e.statusCode || 404; //500
        results.message = "Parametros incorrectos " + e.message;
        results.code = 0;
    }
})




//archivos estaticos



module.exports = {
    app
}