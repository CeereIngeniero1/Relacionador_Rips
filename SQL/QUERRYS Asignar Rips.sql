


CREATE VIEW [dbo].[Cnsta Relacionador Info Evaluacion Usuario]
AS
SELECT        dbo.[Evaluación Entidad].[Id Evaluación Entidad], dbo.[Evaluación Entidad].[Id Tipo de Evaluación], dbo.[Tipo de Evaluación].[Tipo de Evaluación], dbo.[Evaluación Entidad].[Fecha Evaluación Entidad], 
                         dbo.[Evaluación Entidad].[Documento Entidad], dbo.[Tipo de Documento].[Tipo de Documento] + N' ' + dbo.[Evaluación Entidad].[Documento Entidad] AS Identificacion, dbo.[Evaluación Entidad].[Edad Entidad Evaluación Entidad], 
                         dbo.[Evaluación Entidad].[Acompañante Evaluación Entidad], dbo.[Evaluación Entidad].[Id Parentesco], dbo.[Evaluación Entidad].[Teléfono Acompañante], dbo.[Evaluación Entidad].[Diagnóstico General Evaluación Entidad], 
                         dbo.[Evaluación Entidad].[Diagnóstico Específico Evaluación Entidad], dbo.[Evaluación Entidad].[Manejo de Medicamentos], dbo.[Evaluación Entidad].[Dirección Domicilio], dbo.[Evaluación Entidad].[Id Ciudad], 
                         dbo.[Evaluación Entidad].[Teléfono Domicilio], dbo.[Evaluación Entidad].[Fecha Nacimiento], dbo.[Evaluación Entidad].[Id Unidad de Medida Edad], dbo.[Evaluación Entidad].[Id Sexo], dbo.[Evaluación Entidad].[Id Estado], 
                         dbo.[Evaluación Entidad].[Id Estado Civil], dbo.[Evaluación Entidad].[Id Ocupación], dbo.[Evaluación Entidad].[Documento Aseguradora], dbo.[Evaluación Entidad].[Id Tipo de Afiliado], 
                         dbo.[Evaluación Entidad].[Responsable Evaluación Entidad], dbo.[Evaluación Entidad].[Id Parentesco Responsable], dbo.[Evaluación Entidad].[Teléfono Responsable], dbo.[Evaluación Entidad].[Documento Usuario], 
                         dbo.[Evaluación Entidad].[Documento Empresa], dbo.[Evaluación Entidad].[Id Terminal], dbo.[Evaluación Entidad].[Documento Profesional], dbo.[Evaluación Entidad].[Id Estado Web], dbo.[Evaluación Entidad].[Con Orden], 
                         dbo.[Evaluación Entidad].[Firma Evaluación Entidad], dbo.[Evaluación Entidad].Sincronizado, dbo.[Evaluación Entidad].PreguntarControl, dbo.[Evaluación Entidad].NombreFormatoAux
FROM            dbo.[Evaluación Entidad] INNER JOIN
                         dbo.Entidad ON dbo.[Evaluación Entidad].[Documento Entidad] = dbo.Entidad.[Documento Entidad] INNER JOIN
                         dbo.[Tipo de Documento] ON dbo.Entidad.[Id Tipo de Documento] = dbo.[Tipo de Documento].[Id Tipo de Documento] INNER JOIN
                         dbo.[Tipo de Evaluación] ON dbo.[Evaluación Entidad].[Id Tipo de Evaluación] = dbo.[Tipo de Evaluación].[Id Tipo de Evaluación]






---- Lista para selecionar paciente con hc sin rips segun fecha y usuario
CREATE VIEW [dbo].[Cnsta Relacionador Usuarios HC]
AS
SELECT        dbo.[Evaluación Entidad].[Fecha Evaluación Entidad] AS FechaEvaluacion, dbo.[Evaluación Entidad].[Documento Entidad] AS DocumentoPaciente, dbo.Entidad.[Nombre Completo Entidad] AS NombreCompletoPaciente, 
                         dbo.[Evaluación Entidad].[Documento Usuario] AS DocumentoUsuario, dbo.[Evaluación Entidad Rips].[Id Evaluación Entidad Rips]
FROM            dbo.[Evaluación Entidad] INNER JOIN
                         dbo.Entidad ON dbo.[Evaluación Entidad].[Documento Entidad] = dbo.Entidad.[Documento Entidad] LEFT OUTER JOIN
                         dbo.[Evaluación Entidad Rips] ON dbo.[Evaluación Entidad].[Id Evaluación Entidad] = dbo.[Evaluación Entidad Rips].[Id Evaluación Entidad]
WHERE        (dbo.[Evaluación Entidad Rips].[Id Evaluación Entidad Rips] IS NULL)
GO












                         