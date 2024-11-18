


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

---- Info de Usuarios Segun documento seleccionado
CREATE VIEW [dbo].[Cnsta Relacionador Usuarios Info]
AS
SELECT        dbo.Entidad.[Documento Entidad] AS DocumentoPaciente, dbo.Entidad.[Primer Apellido Entidad] AS PrimerApellidoPaciente, dbo.Entidad.[Segundo Apellido Entidad] AS SegundoApellidoPaciente, 
                         dbo.Entidad.[Primer Nombre Entidad] AS PrimerNombrePaciente, dbo.Entidad.[Segundo Nombre Entidad] AS SegundoNombrePaciente, dbo.Entidad.[Nombre Completo Entidad] AS NombreCompletoPaciente, 
                         dbo.Sexo.[Descripción Sexo] AS Sexo, dbo.EntidadIII.[Edad EntidadIII] AS Edad, dbo.EntidadII.[Dirección EntidadII] AS Direccion, dbo.EntidadII.[Teléfono Celular EntidadII] AS Tel, 
                         dbo.[Tipo de Documento].[Tipo de Documento] + N' ' + dbo.Entidad.[Documento Entidad] AS DocumentoTipoDOC
FROM            dbo.Entidad INNER JOIN
                         dbo.EntidadII ON dbo.Entidad.[Documento Entidad] = dbo.EntidadII.[Documento Entidad] INNER JOIN
                         dbo.EntidadIII ON dbo.Entidad.[Documento Entidad] = dbo.EntidadIII.[Documento Entidad] INNER JOIN
                         dbo.Sexo ON dbo.EntidadIII.[Id Sexo] = dbo.Sexo.[Id Sexo] INNER JOIN
                         dbo.[Tipo de Documento] ON dbo.Entidad.[Id Tipo de Documento] = dbo.[Tipo de Documento].[Id Tipo de Documento]


----- Info de hc segun usuario y segun paciente
CREATE VIEW [dbo].[Cnsta Relacionador Info Historias]
AS
SELECT        dbo.[Evaluación Entidad].[Fecha Evaluación Entidad] AS FechaEvaluacion, dbo.[Evaluación Entidad].[Documento Entidad] AS DocumentoPaciente, dbo.[Evaluación Entidad].[Id Tipo de Evaluación] AS IdTipodeEvaluacion, 
                         dbo.[Tipo de Evaluación].[Descripción Tipo de Evaluación] AS DescripcionTipodeEvaluación, 
                         CASE WHEN dbo.[Evaluación Entidad].[Id Tipo de Evaluación] = 4 THEN SUBSTRING(CAST(dbo.[Evaluación Entidad].[Diagnóstico General Evaluación Entidad] AS nvarchar(MAX)), CHARINDEX('\', 
                         CAST(dbo.[Evaluación Entidad].[Diagnóstico General Evaluación Entidad] AS nvarchar(MAX)), CHARINDEX('\', CAST(dbo.[Evaluación Entidad].[Diagnóstico General Evaluación Entidad] AS nvarchar(MAX))) + 1) + 1, 
                         LEN(CAST(dbo.[Evaluación Entidad].[Diagnóstico General Evaluación Entidad] AS nvarchar(MAX)))) ELSE CAST(dbo.[Evaluación Entidad].[Diagnóstico General Evaluación Entidad] AS nvarchar(MAX)) END AS Formato_Diagnostico,
                          dbo.[Evaluación Entidad].[Diagnóstico Específico Evaluación Entidad] AS DiagnósticoEspecíficoEvaluacionEntidad, dbo.[Evaluación Entidad].[Documento Usuario] AS DocumentoUsuario, 
                         dbo.[Evaluación Entidad].[Id Evaluación Entidad] AS IdEvaluaciónEntidad
FROM            dbo.[Evaluación Entidad] LEFT OUTER JOIN
                         dbo.[Evaluación Entidad Rips] ON dbo.[Evaluación Entidad].[Id Evaluación Entidad] = dbo.[Evaluación Entidad Rips].[Id Evaluación Entidad] INNER JOIN
                         dbo.[Tipo de Evaluación] ON dbo.[Evaluación Entidad].[Id Tipo de Evaluación] = dbo.[Tipo de Evaluación].[Id Tipo de Evaluación]
WHERE        (dbo.[Evaluación Entidad Rips].[Id Evaluación Entidad Rips] IS NULL)









                         