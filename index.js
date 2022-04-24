const { app } = require('./app')


//inicalr conexion

//iniciamos el servidor
app.listen(app.get('port'), () => {

    console.log('Server on port', app.get('port'))
})



