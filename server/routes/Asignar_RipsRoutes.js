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
                SELECT        TOP (200) NombreCompletoPaciente, [Id Función], Función
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
                SELECT        TOP (200) [Id Servicios], [Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado]
                FROM            [Cnsta Relacionador Servicios]
                WHERE        ([Descripción Servicios] = N'${Tipo}')
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




module.exports = router;