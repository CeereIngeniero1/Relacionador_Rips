const { Request, TYPES } = require('tedious');
const Router = require('express').Router;
const connection = require('../db');

const router = Router();

router.get('/pruebaHC', async (req, res) => {

    try {
        const request = new Request(
            `SELECT TOP(10) [Id Evaluación Entidad],
            [Documento Entidad], 
            [Fecha Evaluación Entidad] 
            FROM [Evaluación Entidad]`,
            (err) => {
                if (err) {
                    console.error(`Error de ejecución: ${err}`);
                    // En caso de error, enviamos una respuesta y salimos de la función
                    if (!res.headersSent) {
                        res.status(500).send('Error interno del servidor');
                    }
                }
            }
        );

        const resultados = [];

        request.on('row', (columns) => {
            const hc = {
                idevaluacion: columns[0].value,
                fechaevaluacion: columns[1].value,
                DocPaciente: columns[2].value
            };
            resultados.push(hc);
        });

        request.on('requestCompleted', () => {
            console.log('Resultados de la consulta:');
            console.log(resultados);
            if (!res.headersSent) {
                res.json(resultados);  // Envía la respuesta solo si no se ha enviado antes
                // res.status(200).send("holas")
            }
        });

        request.on('error', (err) => {
            console.error('Error en la consulta:', err);
            if (!res.headersSent) {
                res.status(500).send('Error interno del servidor');
            }
        });

        connection.execSql(request);
    } catch (error) {
        console.error('Error en la conexión o en la ejecución de la consulta:', error);
        if (!res.headersSent) {
            res.status(500).send('Error interno del servidor');
        }
    }
});


router.get('/DatosUsuario/:IdEvaluacion', async (req, res) =>{
    try {
        const IdEvaluacion = req.params.IdEvaluacion;

    const request = new Request(
        `SELECT 
                        [Id Evaluación Entidad], [Id Tipo de Evaluación], [Tipo de Evaluación], [Fecha Evaluación Entidad], [Documento Entidad], Identificacion, [Edad Entidad Evaluación Entidad], [Acompañante Evaluación Entidad], 
                        [Id Parentesco], [Teléfono Acompañante], [Diagnóstico General Evaluación Entidad], [Diagnóstico Específico Evaluación Entidad], [Manejo de Medicamentos], [Dirección Domicilio], [Id Ciudad], [Teléfono Domicilio], 
                        [Fecha Nacimiento], [Id Unidad de Medida Edad], [Id Sexo], [Id Estado], [Id Estado Civil], [Id Ocupación], [Documento Aseguradora], [Id Tipo de Afiliado], [Responsable Evaluación Entidad], [Id Parentesco Responsable], 
                        [Teléfono Responsable], [Documento Usuario], [Documento Empresa], [Id Terminal], [Documento Profesional], [Id Estado Web], [Con Orden], [Firma Evaluación Entidad], Sincronizado, PreguntarControl, NombreFormatoAux
        FROM            [Cnsta Relacionador Info Evaluacion Usuario]
        WHERE        ([Id Evaluación Entidad] = ${IdEvaluacion})
        `,
        (err) => {
            if (err) {
                console.error(`Error de ejecución: ${err}`);
                // En caso de error, enviamos una respuesta y salimos de la función
                if (!res.headersSent) {
                    res.status(500).send('Error interno del servidor');
                }
            }
        }

    );
    const resultados = [];
    request.on('row', (columns) => {   
        const row = {};
        columns.forEach((column) =>{
            row[column.metadata.colName]= column.value;
        });
        resultados.push(row);
    });

    request.on ('requestCompleted', () => {
        res.json(resultados);
    })
    console.log(resultados);
     connection.execSql(request);
    } catch (error) {
        
    }
    
});


router.get('/TipodeRips', async (req, res) => {
    try {
        const request = new Request(
            `
                SELECT [Id Tipo Rips]
                ,[Código Tipo Rips]
                ,[Tipo Rips]
                ,[Descripción Tipo Rips]
                ,[Id Estado]
            FROM [Anacatalina].[dbo].[Cnsta Relacionador Tipo Rips]
            `,
            (err) => {
                if(err){
                    console.error(`Error de ejecución: ${err}`);
                    if(!res.headersSent){
                        res.status(500).send("Error interno de servidor");
                    }
                }
            }
        );

        const resultados = [];

        request.on('row', (columns) => {
            const Tiporips = {
                idtiporips: columns[0].value,
                codigotiporips: columns[1].value,
                descripciontiporips: columns[3].value
            }
            resultados.push(Tiporips);
        });


        request.on('requestCompleted', () => {
            console.log('Resultados de la consulta');
            console.log(resultados);
            if(!res.headersSent){
                res.json(resultados);
            }
        });
        
        request.on('error', (err) => {
            console.error(' Error en la consulta:', err);
            if(!res.headersSent){
                res.status(500).send('Error interno del servidor');
            }
        });
        connection.execSql(request);

    } catch (error) {
        console.error('Error en la conexion o en la ejecucion de la consulta ');
        if(!res.headersSent){
            res.status(500).send('Error  interno dels servidor')
        }
    }
});

router.get('/Entidad/:Tipo', async (req, res) => {
    try {
        const Tipo = req.params.Tipo;

        const request = new Request(
            `
            
            `
        )
    } catch (error) {
        
    }
});

module.exports = router;