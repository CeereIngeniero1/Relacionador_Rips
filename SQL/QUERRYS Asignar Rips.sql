


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
WHERE        (dbo.[Evaluación Entidad Rips].[Id Evaluación Entidad Rips] IS NULL) AND (dbo.[Evaluación Entidad].[Id Tipo de Evaluación] <> 2)
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
SELECT        FORMAT(dbo.[Evaluación Entidad].[Fecha Evaluación Entidad], 'dd/MM/yyyy') AS FechaEvaluacionTexto, dbo.[Evaluación Entidad].[Documento Entidad] AS DocumentoPaciente, 
                         dbo.[Evaluación Entidad].[Id Tipo de Evaluación] AS IdTipodeEvaluacion, dbo.[Tipo de Evaluación].[Descripción Tipo de Evaluación] AS DescripcionTipodeEvaluación, 
                         CASE WHEN dbo.[Evaluación Entidad].[Id Tipo de Evaluación] = 4 THEN SUBSTRING(CAST(dbo.[Evaluación Entidad].[Diagnóstico General Evaluación Entidad] AS nvarchar(MAX)), CHARINDEX('\', 
                         CAST(dbo.[Evaluación Entidad].[Diagnóstico General Evaluación Entidad] AS nvarchar(MAX)), CHARINDEX('\', CAST(dbo.[Evaluación Entidad].[Diagnóstico General Evaluación Entidad] AS nvarchar(MAX))) + 1) + 1, 
                         LEN(CAST(dbo.[Evaluación Entidad].[Diagnóstico General Evaluación Entidad] AS nvarchar(MAX)))) ELSE CAST(dbo.[Evaluación Entidad].[Diagnóstico General Evaluación Entidad] AS nvarchar(MAX)) END AS Formato_Diagnostico,
                          dbo.[Evaluación Entidad].[Diagnóstico Específico Evaluación Entidad] AS DiagnósticoEspecíficoEvaluacionEntidad, dbo.[Evaluación Entidad].[Documento Usuario] AS DocumentoUsuario, 
                         dbo.[Evaluación Entidad].[Id Evaluación Entidad] AS IdEvaluaciónEntidad, RIGHT(CONVERT(VARCHAR(20), dbo.[Evaluación Entidad].[Fecha Evaluación Entidad], 100), 7) AS HoraEvaluacion, 
                         dbo.[Evaluación Entidad].[Fecha Evaluación Entidad] AS FechaEvaluacion
FROM            dbo.[Evaluación Entidad] LEFT OUTER JOIN
                         dbo.[Evaluación Entidad Rips] ON dbo.[Evaluación Entidad].[Id Evaluación Entidad] = dbo.[Evaluación Entidad Rips].[Id Evaluación Entidad] INNER JOIN
                         dbo.[Tipo de Evaluación] ON dbo.[Evaluación Entidad].[Id Tipo de Evaluación] = dbo.[Tipo de Evaluación].[Id Tipo de Evaluación]
WHERE        (dbo.[Evaluación Entidad Rips].[Id Evaluación Entidad Rips] IS NULL) AND (dbo.[Evaluación Entidad].[Id Tipo de Evaluación] <> 2)

--lista de Tipo rips Activos estdo = 7

CREATE VIEW [dbo].[Cnsta Relacionador Tipo Rips]
AS
SELECT        [Id Tipo Rips] AS IdTipoRips, [Código Tipo Rips] AS CódigoTipoRips, [Tipo Rips] AS TipoRips, [Descripción Tipo Rips] AS DescripcionTipoRips, [Id Estado] AS IdEstado
FROM            dbo.[Tipo Rips]
WHERE        ([Id Estado] = 7)
GO


-- para que los tipo rips no se dañen :P
Update [Tipo Rips] set [Código Tipo Rips] = 17 where  [Tipo Rips] = 'Particulares'
Update [Tipo Rips] set [Código Tipo Rips] = 24 where  [Tipo Rips] = 'Entidad Prepago'
Update [Tipo Rips] set [Código Tipo Rips] = 23 where  [Tipo Rips] = 'Entidad Prepago'


---- ENTIDADES TIPO RIPS
CREATE VIEW [dbo].[Cnsta Relacionador Entidades Rips]
AS
SELECT        dbo.Entidad.[Nombre Completo Entidad] AS NombreCompletoPaciente, dbo.[Función Por Entidad].[Id Función], dbo.Función.Función, dbo.Entidad.[Documento Entidad] AS DocumentoEntidad
FROM            dbo.Entidad INNER JOIN
                         dbo.[Función Por Entidad] ON dbo.Entidad.[Documento Entidad] = dbo.[Función Por Entidad].[Documento Entidad] INNER JOIN
                         dbo.Función ON dbo.[Función Por Entidad].[Id Función] = dbo.Función.[Id Función]
WHERE        (dbo.[Función Por Entidad].[Id Función] = 17) OR
                         (dbo.[Función Por Entidad].[Id Función] = 24) OR
                         (dbo.[Función Por Entidad].[Id Función] = 23)
GO

----Modalidad atencion

CREATE VIEW [dbo].[Cnsta Relacionador Modalidad Atencion]
AS
SELECT        [Id Modalidad Atencion] AS IdModalidadAtencion, Codigo, [Nombre Modalidad Atencion] AS NombreModalidadAtencion, [Descripción Modalidad Atencion] AS DescripcionModalidadAtencion, 
                         [Orden Modalidad Atencion] AS OrdenModalidadAtencion, [Id Estado]
FROM            dbo.[RIPS Modalidad Atención]
WHERE        ([Id Estado] = 7)



--Estos updates son para que se pueda relacion grupo servicios con servicios
Update  [RIPS Grupo Servicios] set [Descripción Grupo Servicios] = 'CONSULTA EXTERNA'
WHERE Codigo = '01'

Update  [RIPS Grupo Servicios] set [Descripción Grupo Servicios] = 'APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA'
WHERE Codigo = '02'

Update  [RIPS Grupo Servicios] set [Descripción Grupo Servicios] = 'INTERNACION'
WHERE Codigo = '03'

Update  [RIPS Grupo Servicios] set [Descripción Grupo Servicios] = 'QUIRURGICOS'
WHERE Codigo = '04'

Update  [RIPS Grupo Servicios] set [Descripción Grupo Servicios] = 'ATENCION INMEDIATA'
WHERE Codigo = '05'

-- -- cnsta grupo servicios
    CREATE VIEW [dbo].[Cnsta Relacionador ModalidadGrupoServicioTecSal]
AS
SELECT        [Id Grupo Servicios] AS IdGrupoServicios, Codigo, [Nombre Grupo Servicios] AS NombreGrupoServicios, [Descripción Grupo Servicios] AS DescripcionGrupoServicios, [Orden Grupo Servicios], [Id Estado]
FROM            dbo.[RIPS Grupo Servicios]
WHERE        ([Id Estado] = 7)
GO


--cnsta servicios

CREATE VIEW [dbo].[Cnsta Relacionador Servicios]
AS
SELECT        [Id Servicios], [Código Servicios], [Nombre Servicios], [Descripción Servicios], [Id Estado]
FROM            dbo.[RIPS Servicios]
WHERE        ([Id Estado] = 7)
GO

-- cnsta finalidad V2
CREATE VIEW [dbo].[Cnsta Relacionador Finalidad]
AS
SELECT        [Id Finalidad Consulta] AS IdFinalidadConsulta, Codigo, [Nombre RIPS Finalidad Consulta Version2] AS NombreRIPSFinalidadConsultaVersion2, 
                         [Descripción RIPS Finalidad Consulta Version2] AS DescripcionRIPSFinalidadConsultaVersion2, [Orden RIPS Finalidad Consulta Version2] AS RIPSFinalidadConsultaVersion2, AC, AP, [Id Estado]
FROM            dbo.[RIPS Finalidad Consulta Version2]
GO

--CNsta causa externa V2
CREATE VIEW [dbo].[Cnsta Relacionador Causa Externa]
AS
SELECT        [Id RIPS Causa Externa Version2], Codigo, [Nombre RIPS Causa Externa Version2] AS NombreRIPSCausaExternaVersion2, [Descripción RIPS Causa Externa Version2] AS DescripcionRIPSCausaExternaVersion2, 
                         [Orden RIPS Causa Externa Version2] AS RIPSCausaExternaVersion2, [Id Estado]
FROM            dbo.[RIPS Causa Externa Version2]
WHERE        ([Id Estado] = 7)


-- Cnosta DX PRINCIPAL

CREATE VIEW [dbo].[Cnsta Relacionador Tipo Diagnostico Principal]
AS
SELECT        [Id Tipo de Diagnóstico Principal] AS IdTipodeDiagnósticoPrincipal, [Código Tipo de Diagnóstico Principal] AS CódigoTipodeDiagnósticoPrincipal, [Tipo de Diagnóstico Principal] AS TipodeDiagnósticoPrincipal, 
                         [Descripción Tipo de Diagnóstico Principal] AS DescripcionTipodeDiagnósticoPrincipal, [Orden Tipo de Diagnóstico Principal] AS ordenTipodeDiagnósticoPrincipal, [Id Estado]
FROM            dbo.[Tipo de Diagnóstico Principal]
WHERE        ([Id Estado] = 7)


----Consta Via ingreso Usuario
CREATE VIEW [dbo].[Cnsta Relacionador Via Ingreso Usuario]
AS
SELECT        [Id Via Ingreso Usuario] AS IdViaIngresoUsuario, Codigo, [Nombre Via Ingreso Usuario] AS NombreViaIngresoUsuario, [Descripción Via Ingreso Usuario] AS DescripcionViaIngresoUsuario, 
                         [Orden Via Ingreso Usuario] AS OrdenViaIngresoUsuario, [Id Estado]
FROM            dbo.[RIPS Via Ingreso Usuario]
WHERE        ([Id Estado] = 7)



--TABLA Rips
CREATE TABLE [Rips Cie10] (
    Tabla VARCHAR(50),
    Codigo VARCHAR(10),
    Nombre VARCHAR(255),
    Descripcion VARCHAR(255),
    AplicaASexo INT,
    EdadMinima INT,
    EdadMaxima INT,
    GrupoMortalidad INT,
    Extra_V VARCHAR(255),
    Extra_VI_Capitulo VARCHAR(10),
    SubGrupo VARCHAR(10),
    Sexo CHAR(1)
);
--tabla Cups
--Si esta tabla existe ELIMINELA Por uqe no sirve pa un joropo
CREATE TABLE [Rips Cups] (
    Tabla VARCHAR(50),
    Codigo VARCHAR(10),
    Nombre VARCHAR(255),
    Descripcion VARCHAR(255),
    Tipo VARCHAR(50)
);

--¡¡¡¡ OJO !!!!recuerde que en otro script llamado Datos de las tablas de rips y cups se encuentran los datos de estas tablas 


--cie
CREATE VIEW [dbo].[Cnsta Relacionador Cie10]
AS
SELECT        Codigo, Nombre, Descripcion, AplicaASexo, EdadMinima, EdadMaxima, GrupoMortalidad, Extra_V, Extra_VI_Capitulo, SubGrupo, Sexo
FROM            dbo.[Rips Cie10]
GO

--cups
CREATE VIEW [dbo].[Cnsta Relacionador Cups]
AS
SELECT        Codigo, Descripcion, Nombre, Tipo
FROM            dbo.[Rips Cups]
GO



ALTER TABLE [RIPS Servicios] 
ADD [Codigo Grupo Servicios] nvarchar(50);


UPDATE [RIPS Servicios] SET [Codigo Grupo Servicios] = '01'
WHERE [Descripción Servicios] = 'CONSULTA EXTERNA'


UPDATE [RIPS Servicios] SET [Codigo Grupo Servicios] = '02'
WHERE [Descripción Servicios] = 'APOYO DIAGNOSTICO Y COMPLEMENTACION TERAPEUTICA'


UPDATE [RIPS Servicios] SET [Codigo Grupo Servicios] = '03'
WHERE [Descripción Servicios] = 'INTERNACION'



UPDATE [RIPS Servicios] SET [Codigo Grupo Servicios] = '04'
WHERE [Descripción Servicios] = 'QUIRURGICOS'


UPDATE [RIPS Servicios] SET [Codigo Grupo Servicios] = '05'
WHERE [Descripción Servicios] = 'ATENCION INMEDIATA'


ALTER VIEW [dbo].[Cnsta Relacionador Servicios]
AS
SELECT        dbo.[RIPS Servicios].[Id Servicios], dbo.[RIPS Servicios].[Código Servicios], dbo.[RIPS Servicios].[Nombre Servicios], dbo.[RIPS Servicios].[Descripción Servicios], dbo.[RIPS Servicios].[Id Estado], 
                         dbo.[RIPS Servicios].[Codigo Grupo Servicios], dbo.[RIPS Grupo Servicios].[Id Grupo Servicios]
FROM            dbo.[RIPS Servicios] INNER JOIN
                         dbo.[RIPS Grupo Servicios] ON dbo.[RIPS Servicios].[Codigo Grupo Servicios] = dbo.[RIPS Grupo Servicios].Codigo
WHERE        (dbo.[RIPS Servicios].[Id Estado] = 7)
GO






