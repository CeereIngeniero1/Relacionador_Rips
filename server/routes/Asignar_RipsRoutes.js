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


router.get('/DatosUsuario/:IdEvaluacion', async (req, res) => {
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
            columns.forEach((column) => {
                row[column.metadata.colName] = column.value;
            });
            resultados.push(row);
        });

        request.on('requestCompleted', () => {
            res.json(resultados);
        })
        console.log(resultados);
        connection.execSql(request);
    } catch (error) {

    }

});

router.get('/UsuariosHC/:DocumentoUsuario/:fechaInicio/:fechaFin', async (req, res) => {
    try {
        const DocumentoUsuario = req.params.DocumentoUsuario;
        const fechaInicio = req.params.fechaInicio;
        const fechaFin = req.params.fechaFin;

        const request = new Request(
            `SELECT  
                [DocumentoPaciente]
                ,[NombreCompletoPaciente]
            FROM [Cnsta Relacionador Usuarios HC]
            WHERE DocumentoUsuario = '${DocumentoUsuario}' AND FechaEvaluacion BETWEEN '${fechaInicio}' AND '${fechaFin}'
            GROUP BY DocumentoPaciente , NombreCompletoPaciente
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
            columns.forEach((column) => {
                row[column.metadata.colName] = column.value;
            });
            resultados.push(row);
        });

        request.on('requestCompleted', () => {
            res.json(resultados);
        })
        console.log(resultados);
        connection.execSql(request);
    } catch (error) {

    }

});


router.get('/DatosdeUsuarioHC/:DocumentoPaciente', async (req, res) => {
    try {
        const DocumentoPaciente = req.params.DocumentoPaciente;

        const request = new Request(
            `
        SELECT        DocumentoPaciente, PrimerApellidoPaciente, 
        SegundoApellidoPaciente, PrimerNombrePaciente, SegundoNombrePaciente, 
        NombreCompletoPaciente, Sexo, Edad, Direccion, Tel, DocumentoTipoDOC
        FROM            [Cnsta Relacionador Usuarios Info]
        WHERE        (DocumentoPaciente = N'${DocumentoPaciente}')
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
            columns.forEach((column) => {
                row[column.metadata.colName] = column.value;
            });
            resultados.push(row);
        });

        request.on('requestCompleted', () => {
            res.json(resultados);
        })
        console.log(resultados);
        connection.execSql(request);
    } catch (error) {

    }

});

router.get('/DatosdeHC/:DocumentoPaciente/:DocumentoUsuario/:fechaInicio/:fechaFin', async (req, res) => {
    try {
        const DocumentoPaciente = req.params.DocumentoPaciente;
        const DocumentoUsuario = req.params.DocumentoUsuario;
        const fechaInicio = req.params.fechaInicio;
        const fechaFin = req.params.fechaFin;
        const request = new Request(
            `
        SELECT          [FechaEvaluacionTexto]
                ,[DocumentoPaciente]
                ,[IdTipodeEvaluacion]
                ,[DescripcionTipodeEvaluación]
                ,[Formato_Diagnostico]
                ,[DiagnósticoEspecíficoEvaluacionEntidad]
                ,[DocumentoUsuario]
                ,[IdEvaluaciónEntidad]
                ,[HoraEvaluacion]
        FROM            [Cnsta Relacionador Info Historias]
        WHERE        (DocumentoPaciente = N'${DocumentoPaciente}') 
        AND (FechaEvaluacion BETWEEN '${fechaInicio}' AND '${fechaFin}') 
        AND (DocumentoUsuario = N'${DocumentoUsuario}')

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
            columns.forEach((column) => {
                row[column.metadata.colName] = column.value;
            });
            resultados.push(row);
        });

        request.on('requestCompleted', () => {
            res.json(resultados);
        })
        console.log(resultados);
        connection.execSql(request);
    } catch (error) {

    }

});

///////////////////////Endpoint para listas de Rips
router.get('/TipodeRips', async (req, res) => {
    try {
        const request = new Request(
            `
            SELECT        IdTipoRips, CódigoTipoRips, TipoRips, 
            DescripcionTipoRips, IdEstado
            FROM            [Cnsta Relacionador Tipo Rips]
            

            `,
            (err) => {
                if (err) {
                    console.error(`Error de ejecución: ${err}`);
                    if (!res.headersSent) {
                        res.status(500).send("Error interno de servidor");
                    }
                }
            }
        );

        const resultados = [];
        request.on('row', (columns) => {
            const row = {};
            columns.forEach((column) => {
                row[column.metadata.colName] = column.value;
            });
            resultados.push(row);
        });

        request.on('requestCompleted', () => {
            console.log('Resultados de la consulta');
            console.log(resultados);
            if (!res.headersSent) {
                res.json(resultados);
            }
        });

        request.on('error', (err) => {
            console.error(' Error en la consulta:', err);
            if (!res.headersSent) {
                res.status(500).send('Error interno del servidor');
            }
        });
        connection.execSql(request);

    } catch (error) {
        console.error('Error en la conexion o en la ejecucion de la consulta ');
        if (!res.headersSent) {
            res.status(500).send('Error  interno dels servidor')
        }
    }
});

router.get('/Entidad/:Tipo', async (req, res) => {
    try {
        const Tipo = req.params.Tipo;

        const request = new Request(
            `
                SELECT        TOP (200) NombreCompletoPaciente, [Id Función], Función, DocumentoEntidad
                FROM            [Cnsta Relacionador Entidades Rips]
                WHERE        ([Id Función] = ${Tipo})
                `,
            (err) => {
                if (err) {
                    console.error(`Error de ejecución: ${err}`);
                    if (!res.headersSent) {
                        res.status(500).send("Error interno de servidor");
                    }
                }
            }
        );

        const resultados = [];
        request.on('row', (columns) => {
            const row = {};
            columns.forEach((column) => {
                row[column.metadata.colName] = column.value;
            });
            resultados.push(row);
        });

        request.on('requestCompleted', () => {
            console.log('Resultados de la consulta');
            console.log(resultados);
            if (!res.headersSent) {
                res.json(resultados);
            }
        });

        request.on('error', (err) => {
            console.error(' Error en la consulta:', err);
            if (!res.headersSent) {
                res.status(500).send('Error interno del servidor');
            }
        });
        connection.execSql(request);



    } catch (error) {

    }
});

router.get('/ModalidadAtencion', async (req, res) => {
    try {


        const request = new Request(
            `
             SELECT        IdModalidadAtencion, Codigo, NombreModalidadAtencion, 
             DescripcionModalidadAtencion, OrdenModalidadAtencion, [Id Estado]
                FROM            [Cnsta Relacionador Modalidad Atencion]
                `,
            (err) => {
                if (err) {
                    console.error(`Error de ejecución: ${err}`);
                    if (!res.headersSent) {
                        res.status(500).send("Error interno de servidor");
                    }
                }
            }
        );

        const resultados = [];
        request.on('row', (columns) => {
            const row = {};
            columns.forEach((column) => {
                row[column.metadata.colName] = column.value;
            });
            resultados.push(row);
        });

        request.on('requestCompleted', () => {
            console.log('Resultados de la consulta');
            console.log(resultados);
            if (!res.headersSent) {
                res.json(resultados);
            }
        });

        request.on('error', (err) => {
            console.error(' Error en la consulta:', err);
            if (!res.headersSent) {
                res.status(500).send('Error interno del servidor');
            }
        });
        connection.execSql(request);



    } catch (error) {

    }
});

router.get('/GrupoServicios', async (req, res) => {
    try {


        const request = new Request(
            `
              SELECT        IdGrupoServicios, Codigo, NombreGrupoServicios, 
              DescripcionGrupoServicios, [Orden Grupo Servicios], [Id Estado]
                FROM            [Cnsta Relacionador ModalidadGrupoServicioTecSal]
                `,
            (err) => {
                if (err) {
                    console.error(`Error de ejecución: ${err}`);
                    if (!res.headersSent) {
                        res.status(500).send("Error interno de servidor");
                    }
                }
            }
        );

        const resultados = [];
        request.on('row', (columns) => {
            const row = {};
            columns.forEach((column) => {
                row[column.metadata.colName] = column.value;
            });
            resultados.push(row);
        });

        request.on('requestCompleted', () => {
            console.log('Resultados de la consulta');
            console.log(resultados);
            if (!res.headersSent) {
                res.json(resultados);
            }
        });

        request.on('error', (err) => {
            console.error(' Error en la consulta:', err);
            if (!res.headersSent) {
                res.status(500).send('Error interno del servidor');
            }
        });
        connection.execSql(request);



    } catch (error) {

    }
});


router.get('/Servicios/:Tipo', async (req, res) => {
    try {
        const Tipo = req.params.Tipo;

        const request = new Request(
            `
                SELECT        [Id Servicios], [Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado], [Codigo Grupo Servicios],  [Id Grupo Servicios]
                FROM            [Cnsta Relacionador Servicios]
                WHERE        ( [Id Grupo Servicios] = N'${Tipo}')
                `,
            (err) => {
                if (err) {
                    console.error(`Error de ejecución: ${err}`);
                    if (!res.headersSent) {
                        res.status(500).send("Error interno de servidor");
                    }
                }
            }
        );

        const resultados = [];
        request.on('row', (columns) => {
            const row = {};
            columns.forEach((column) => {
                row[column.metadata.colName] = column.value;
            });
            resultados.push(row);
        });

        request.on('requestCompleted', () => {
            console.log('Resultados de la consulta');
            console.log(resultados);
            if (!res.headersSent) {
                res.json(resultados);
            }
        });

        request.on('error', (err) => {
            console.error(' Error en la consulta:', err);
            if (!res.headersSent) {
                res.status(500).send('Error interno del servidor');
            }
        });
        connection.execSql(request);



    } catch (error) {

    }
});

router.get('/FinalidadV2/:Tipo', async (req, res) => {
    try {
        const Tipo = req.params.Tipo;

        const request = new Request(
            `
                
                SELECT        IdFinalidadConsulta, Codigo, NombreRIPSFinalidadConsultaVersion2, DescripcionRIPSFinalidadConsultaVersion2, RIPSFinalidadConsultaVersion2, AC, AP, [Id Estado]
                FROM            [Cnsta Relacionador Finalidad]
                WHERE        (${Tipo} = N'Si')

                `,
            (err) => {
                if (err) {
                    console.error(`Error de ejecución: ${err}`);
                    if (!res.headersSent) {
                        res.status(500).send("Error interno de servidor");
                    }
                }
            }
        );

        const resultados = [];
        request.on('row', (columns) => {
            const row = {};
            columns.forEach((column) => {
                row[column.metadata.colName] = column.value;
            });
            resultados.push(row);
        });

        request.on('requestCompleted', () => {
            console.log('Resultados de la consulta');
            console.log(resultados);
            if (!res.headersSent) {
                res.json(resultados);
            }
        });

        request.on('error', (err) => {
            console.error(' Error en la consulta:', err);
            if (!res.headersSent) {
                res.status(500).send('Error interno del servidor');
            }
        });
        connection.execSql(request);



    } catch (error) {

    }
});

router.get('/CausaExterna', async (req, res) => {
    try {


        const request = new Request(
            `
              SELECT       [Id RIPS Causa Externa Version2], Codigo, 
              NombreRIPSCausaExternaVersion2, DescripcionRIPSCausaExternaVersion2, 
              RIPSCausaExternaVersion2, [Id Estado]
                FROM            [Cnsta Relacionador Causa Externa]

                `,
            (err) => {
                if (err) {
                    console.error(`Error de ejecución: ${err}`);
                    if (!res.headersSent) {
                        res.status(500).send("Error interno de servidor");
                    }
                }
            }
        );

        const resultados = [];
        request.on('row', (columns) => {
            const row = {};
            columns.forEach((column) => {
                row[column.metadata.colName] = column.value;
            });
            resultados.push(row);
        });

        request.on('requestCompleted', () => {
            console.log('Resultados de la consulta');
            console.log(resultados);
            if (!res.headersSent) {
                res.json(resultados);
            }
        });

        request.on('error', (err) => {
            console.error(' Error en la consulta:', err);
            if (!res.headersSent) {
                res.status(500).send('Error interno del servidor');
            }
        });
        connection.execSql(request);



    } catch (error) {

    }
});


router.get('/DXPrincipal', async (req, res) => {
    try {


        const request = new Request(
            `
              SELECT        IdTipodeDiagnósticoPrincipal, CódigoTipodeDiagnósticoPrincipal, 
              TipodeDiagnósticoPrincipal, DescripcionTipodeDiagnósticoPrincipal,
               ordenTipodeDiagnósticoPrincipal, [Id Estado]
                FROM            [Cnsta Relacionador Tipo Diagnostico Principal]

                `,
            (err) => {
                if (err) {
                    console.error(`Error de ejecución: ${err}`);
                    if (!res.headersSent) {
                        res.status(500).send("Error interno de servidor");
                    }
                }
            }
        );

        const resultados = [];
        request.on('row', (columns) => {
            const row = {};
            columns.forEach((column) => {
                row[column.metadata.colName] = column.value;
            });
            resultados.push(row);
        });

        request.on('requestCompleted', () => {
            console.log('Resultados de la consulta');
            console.log(resultados);
            if (!res.headersSent) {
                res.json(resultados);
            }
        });

        request.on('error', (err) => {
            console.error(' Error en la consulta:', err);
            if (!res.headersSent) {
                res.status(500).send('Error interno del servidor');
            }
        });
        connection.execSql(request);



    } catch (error) {

    }
});


router.get('/ViaIngresoUsuario', async (req, res) => {
    try {


        const request = new Request(
            `
             SELECT        IdViaIngresoUsuario, Codigo, NombreViaIngresoUsuario,
             DescripcionViaIngresoUsuario, OrdenViaIngresoUsuario, [Id Estado]
            FROM            [Cnsta Relacionador Via Ingreso Usuario]
                `,
            (err) => {
                if (err) {
                    console.error(`Error de ejecución: ${err}`);
                    if (!res.headersSent) {
                        res.status(500).send("Error interno de servidor");
                    }
                }
            }
        );

        const resultados = [];
        request.on('row', (columns) => {
            const row = {};
            columns.forEach((column) => {
                row[column.metadata.colName] = column.value;
            });
            resultados.push(row);
        });

        request.on('requestCompleted', () => {
            console.log('Resultados de la consulta');
            console.log(resultados);
            if (!res.headersSent) {
                res.json(resultados);
            }
        });

        request.on('error', (err) => {
            console.error(' Error en la consulta:', err);
            if (!res.headersSent) {
                res.status(500).send('Error interno del servidor');
            }
        });
        connection.execSql(request);



    } catch (error) {

    }
});

router.get('/Cups/:Tipo', async (req, res) => {
    try {
        const Tipo = req.params.Tipo;

        const request = new Request(
            `
        SELECT        Codigo, Descripcion, Nombre, Tipo
FROM            [Cnsta Relacionador Cups]
WHERE        (Tipo = '${Tipo}')
            `,
            (err) => {
                if (err) {
                    console.error(`Error de ejecución: ${err}`);
                    if (!res.headersSent) {
                        res.status(500).send("Error interno de servidor");
                    }
                }
            }
        );

        const resultados = [];
        request.on('row', (columns) => {
            const row = {};
            columns.forEach((column) => {
                row[column.metadata.colName] = column.value;
            });
            resultados.push(row);
        });

        request.on('requestCompleted', () => {
            console.log('Resultados de la consulta');
            console.log(resultados);
            if (!res.headersSent) {
                res.json(resultados);
            }
        });

        request.on('error', (err) => {
            console.error(' Error en la consulta:', err);
            if (!res.headersSent) {
                res.status(500).send('Error interno del servidor');
            }
        });
        connection.execSql(request);



    } catch (error) {

    }
});

router.get('/Cie', async (req, res) => {
    try {


        const request = new Request(
            `
        SELECT         Codigo, Nombre, Descripcion, AplicaASexo, EdadMinima, EdadMaxima, 
        GrupoMortalidad, Extra_V, Extra_VI_Capitulo, SubGrupo, Sexo
FROM            [Cnsta Relacionador Cie10]
            `,
            (err) => {
                if (err) {
                    console.error(`Error de ejecución: ${err}`);
                    if (!res.headersSent) {
                        res.status(500).send("Error interno de servidor");
                    }
                }
            }
        );

        const resultados = [];
        request.on('row', (columns) => {
            const row = {};
            columns.forEach((column) => {
                row[column.metadata.colName] = column.value;
            });
            resultados.push(row);
        });

        request.on('requestCompleted', () => {
            console.log('Resultados de la consulta');
            // console.log(resultados);
            if (!res.headersSent) {
                res.json(resultados);
            }
        });

        request.on('error', (err) => {
            console.error(' Error en la consulta:', err);
            if (!res.headersSent) {
                res.status(500).send('Error interno del servidor');
            }
        });
        connection.execSql(request);



    } catch (error) {

    }
});

router.post('/RegistrarRips/:IdEvaluacion/:TipoUsuario/:Entidad/:ModalidadGrupoServicioTecSal/:GrupoServicios/:CodServicio/:FinalidadTecnologiaSalud/:CausaMotivoAtencion/:TipoDiagnosticoPrincipal/:ViaIngresoServicioSalud/:Cups1/:Cups2/:Cie1/:Cie2/:TipoRips',  (req, res) => {
   


    
    const IdEvaluacion = req.params.IdEvaluacion;
    const TipoUsuario = req.params.TipoUsuario;
    const Entidad = req.params.Entidad;
    const ModalidadGrupoServicioTecSal = req.params.ModalidadGrupoServicioTecSal;
    const GrupoServicios = req.params.GrupoServicios;
    const CodServicio = req.params.CodServicio;
    const FinalidadTecnologiaSalud = req.params.FinalidadTecnologiaSalud;
    const CausaMotivoAtencion = req.params.CausaMotivoAtencion;
    const TipoDiagnosticoPrincipal = req.params.TipoDiagnosticoPrincipal;
    const ViaIngresoServicioSalud = req.params.ViaIngresoServicioSalud;
    const Cups1 = req.params.Cups1;
    const Cups2 = req.params.Cups2;
    const Cie1 = req.params.Cie1;
    const Cie2 = req.params.Cie2;
    const TipoRips = req.params.TipoRips;
    var Actoquirurgico;
    if (TipoRips == 'AC' || TipoRips == 'AP') {
        Actoquirurgico = 1;
    } else {
        Actoquirurgico = 2;
    }
    console.log(`IdEvaluacion ${IdEvaluacion}`);
    console.log(`TipoUsuario ${TipoUsuario}`);
    console.log(`Entidad ${Entidad}`);
    console.log(`ModalidadGrupoServicioTecSal ${ModalidadGrupoServicioTecSal}`);
    console.log(`GrupoServicios ${GrupoServicios}`);
    console.log(`CodServicio ${CodServicio}`);
    console.log(`FinalidadTecnologiaSalud ${FinalidadTecnologiaSalud}`);
    console.log(`CausaMotivoAtencion ${CausaMotivoAtencion}`);
    console.log(`TipoDiagnosticoPrincipal ${TipoDiagnosticoPrincipal}`);
    console.log(`ViaIngresoServicioSalud ${ViaIngresoServicioSalud}`);
    console.log(`Cups1 ${Cups1}`);
    console.log(`Cups2 ${Cups2}`);
    console.log(`Cie1 ${Cie1}`);
    console.log(`Cie2 ${Cie2}`);
    console.log(`TipoRips ${TipoRips}`);
    // console.log(`IdEvaluacion ${IdEvaluacion}`);

    const requestInsert = new Request(
        `
    INSERT INTO [Evaluación Entidad Rips] 
    (
    [Id Evaluación Entidad] ,
    [Codigo Rips],
    [Codigo Rips2],
    [Diagnostico Rips],
    [Diagnostico Rips2],
    [Id Tipo de Rips],
    [Documento Tipo Rips],
    [Id Causa Externa],
    [Id Tipo de Diagnóstico Principal],
    [Id Finalidad Consulta],
    [Id Acto Quirúrgico],
    [Id Modalidad Atencion],
    [Id Grupo Servicios],
    [Id Servicios],
    [Id Via Ingreso Usuario] 
    )
    VALUES 
    (
    @IdEvaluacion,
    @Cups1,
    @Cups2,
    @Cie1,
    @Cie2,
    @TipoUsuario,
    @Entidad,
    @CausaMotivoAtencion,
    @TipoDiagnosticoPrincipal,
    @FinalidadTecnologiaSalud,
    @Actoquirurgico, 
    @ModalidadGrupoServicioTecSal,
    @GrupoServicios,
    @CodServicio,
    @ViaIngresoServicioSalud
    ) 
    `, (err) => {
        if (err) {
            console.error('Error al insertar el Rips:', err.message);
            res.status(500).json({ error: 'Error al insertar el RIPS' });
        } else {
            console.log('Inserción ejecutada con éxito');
            res.json({ success: true, message: 'Rips insertado correctamente' });
        }
    });

      // Ajustar los parámetros según las columnas y datos que estás insertando
    requestInsert.addParameter('IdEvaluacion', TYPES.Int, IdEvaluacion);
    requestInsert.addParameter('TipoUsuario', TYPES.Int, TipoUsuario);
    requestInsert.addParameter('Entidad', TYPES.NVarChar, Entidad);
    requestInsert.addParameter('ModalidadGrupoServicioTecSal', TYPES.Int, ModalidadGrupoServicioTecSal);
    requestInsert.addParameter('GrupoServicios', TYPES.Int, GrupoServicios);
    requestInsert.addParameter('CodServicio', TYPES.Int, CodServicio);
    requestInsert.addParameter('FinalidadTecnologiaSalud', TYPES.Int, FinalidadTecnologiaSalud);
    requestInsert.addParameter('CausaMotivoAtencion', TYPES.Int, CausaMotivoAtencion);
    requestInsert.addParameter('TipoDiagnosticoPrincipal', TYPES.Int, TipoDiagnosticoPrincipal);
    requestInsert.addParameter('ViaIngresoServicioSalud', TYPES.Int, ViaIngresoServicioSalud);
    requestInsert.addParameter('Cups1', TYPES.NVarChar, Cups1);
    requestInsert.addParameter('Cups2', TYPES.NVarChar, Cups2);
    requestInsert.addParameter('Cie1', TYPES.NVarChar, Cie1);
    requestInsert.addParameter('Cie2', TYPES.NVarChar, Cie2);
    requestInsert.addParameter('Actoquirurgico', TYPES.Int, Actoquirurgico);

    
connection.execSql(requestInsert);
});



module.exports = router;