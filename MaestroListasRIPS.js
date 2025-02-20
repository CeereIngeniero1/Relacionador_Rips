const servidor = "HPGRIS";
let TablaModalidadGrupoServicioTecnologiaSalud;


$(document).ready((e) => {
    let TablaModalidadGrupoServicioTecnologiaSalud; // Declarar la variable aquí

    // Dispara un evento change en el select al momento de cerrar el modal
    $('#ModalParaMaestro').on('hidden.bs.modal', function () {
        $('#SelectListarDatosRIPS').val('').trigger('change');
    });

    // Evento para mostrar toda la info de las tablas que se muestran en los select para asignación de RIPS
    $('#SelectListarDatosRIPS').on('change', (e) => {
        const selectedValue = e.target.value;    
        const tablas = {
            ModalidadGrupoServicioTecSal: {
                selector: '#TablaModalidadGrupoServicioTecnologiaSalud',
                columnas: [
                    { "data": "IdModalidadAtencion" },
                    { "data": "Codigo" },
                    { "data": "NombreModalidadAtencion" },
                    {
                        "data": "Estado",
                        "render": function (data, type, row) {
                            return `
                                <label>
                                    <input type="radio" name="estado-${row.IdModalidadAtencion}" value="7" ${data === 'Activado' ? 'checked' : ''}>
                                    Activado
                                </label>
                                <label>
                                    <input type="radio" name="estado-${row.IdModalidadAtencion}" value="8" ${data === 'Desactivado' ? 'checked' : ''}>
                                    Desactivado
                                </label>
                            `;
                        }
                    }
                ]
            },    
            GrupoServicios: {
                selector: '#TablaGrupoServicios',
                columnas: [
                    { "data": "IdGrupoServicio" },
                    { "data": "Codigo" },
                    { "data": "NombreGrupoServicio" },
                    {
                        "data": "Estado",
                        "render": function (data, type, row) {
                            return `
                                <label>
                                    <input type="radio" name="estado-${row.IdGrupoServicio}" value="7" ${data === 'Activado' ? 'checked' : ''}>
                                    Activado
                                </label>
                                <label>
                                    <input type="radio" name="estado-${row.IdGrupoServicio}" value="8" ${data === 'Desactivado' ? 'checked' : ''}>
                                    Desactivado
                                </label>
                            `;
                        }
                    }
                ]
            },
            CodServicio: {
                selector: '#TablaCodigoServicios',
                columnas: [
                    { "data": "IdServicios" },
                    { "data": "Codigo" },
                    { "data": "Descripcion" },
                    { "data": "Grupo" },
                    {
                        "data": "Estado",
                        "render": function (data, type, row) {
                            return `
                                <label>
                                    <input type="radio" name="estado-${row.IdServicios}" value="7" ${data === 'Activado' ? 'checked' : ''}>
                                    Activado
                                </label>
                                <label>
                                    <input type="radio" name="estado-${row.IdServicios}" value="8" ${data === 'Desactivado' ? 'checked' : ''}>
                                    Desactivado
                                </label>
                            `;
                        }
                    }
                ]
            },
            FinalidadTecnologiaSalud: {
                selector: '#TablaFinalidadTecnologiaSalud',
                columnas: [
                    { "data": "IdFinalidadConsulta" },
                    { "data": "Codigo" },
                    { "data": "NombreFinalidadConsulta" },
                    {
                        "data": "Estado",
                        "render": function (data, type, row) {
                            return `
                                <label>
                                    <input type="radio" name="estado-${row.IdFinalidadConsulta}" value="7" ${data === 'Activado' ? 'checked' : ''}>
                                    Activado
                                </label>
                                <label>
                                    <input type="radio" name="estado-${row.IdFinalidadConsulta}" value="8" ${data === 'Desactivado' ? 'checked' : ''}>
                                    Desactivado
                                </label>
                            `;
                        }
                    }
                ]
            },
            CausaMotivoAtencion: {
                selector: '#TablaCausaMotivoAtencion',
                columnas: [
                    { "data": "IdCausaMotivoAtencion" },
                    { "data": "Codigo" },
                    { "data": "NombreMotivoAtencion" },
                    {
                        "data": "Estado",
                        "render": function (data, type, row) {
                            return `
                                <label>
                                    <input type="radio" name="estado-${row.IdCausaMotivoAtencion}" value="7" ${data === 'Activado' ? 'checked' : ''}>
                                    Activado
                                </label>
                                <label>
                                    <input type="radio" name="estado-${row.IdCausaMotivoAtencion}" value="8" ${data === 'Desactivado' ? 'checked' : ''}>
                                    Desactivado
                                </label>
                            `;
                        }
                    }
                ]
            },
            ViaIngresoServicioSalud: {
                selector: '#TablaViaIngresoServicioSalud',
                columnas: [
                    { "data": "IdViaIngresoServicioSalud" },
                    { "data": "Codigo" },
                    { "data": "NombreViaIngresoServicioSalud" },
                    {
                        "data": "Estado",
                        "render": function (data, type, row) {
                            return `
                                <label>
                                    <input type="radio" name="estado-${row.IdViaIngresoServicioSalud}" value="7" ${data === 'Activado' ? 'checked' : ''}>
                                    Activado
                                </label>
                                <label>
                                    <input type="radio" name="estado-${row.IdViaIngresoServicioSalud}" value="8" ${data === 'Desactivado' ? 'checked' : ''}>
                                    Desactivado
                                </label>
                            `;
                        }
                    }
                ]
            }
        };        
    
        const tablaConfig = tablas[selectedValue] || null;
    
        // Ocultar y destruir todas las tablas antes de mostrar la nueva
        Object.values(tablas).forEach(config => {
            if ($.fn.DataTable.isDataTable(config.selector)) {
                $(config.selector).DataTable().destroy(); // 🔹 Destruir la tabla
                $(config.selector).hide(); // 🔹 Ocultar la tabla
            }
        });
    
        // Implementar la tabla si es una opción válida
        if (tablaConfig) {
            $(tablaConfig.selector).show(); // 🔹 Mostrar solo la tabla seleccionada
            const nuevaTabla = implementarTabla(tablaConfig.selector, tablaConfig.columnas);
            llenarTabla(nuevaTabla, selectedValue);
        } else {
            // console.log('Opción no válida');
        }
    });
    

    function implementarTabla(selector, columnas) {
        const tabla = $(selector).DataTable({
            responsive: true,
            "pageLength": 10,
            "lengthChange": false,
            "deferRender": true,
            "paging": true,
            "language": {
                "lengthMenu": "Mostrar _MENU_ registros por página.",
                "zeroRecords": "Lo siento - No se encontró ningún registro",
                "info": "Mostrando la página _PAGE_ de _PAGES_",
                "infoEmpty": "No hay registros disponibles",
                "infoFiltered": "(filtrado de _MAX_ registros totales)",
                "search": "Buscar:",
                "paginate": { "next": "Siguiente", "previous": "Anterior" }
            },
            "columns": columnas,
            scrollX: true,  // Activa el scroll horizontal en la tabla
            columnDefs: [
                {
                    targets: [2,3], // Columnas "Descripción" y "Grupo"
                    render: function (data, type, row) {
                        return `<div style="max-width: 300px; overflow-x: auto; white-space: nowrap; display: flex; align-items: center; margin: 0 auto; text-align: center;"><span>${data}</span></div>`;
                    }
                }
            ]
        });

        // // Asignar el evento change a los radio buttons después de que la tabla se haya renderizado
        $(selector).on('change', 'input[type="radio"]', function() {
            const estadoSeleccionado = $(this).val();
            const idModalidadAtencion = $(this).attr('name').split('-')[1];
            const tipoSeleccionado = $('#SelectListarDatosRIPS').val(); // Aquí corregimos el .val
        
            // console.log(`Estado => ${estadoSeleccionado}, Id => ${idModalidadAtencion}, Tipo => ${tipoSeleccionado}`);
        
            // Llamar a la función para actualizar el estado en la base de datos
            actualizarEstado(tipoSeleccionado, idModalidadAtencion, estadoSeleccionado);
        });

        return tabla;
    }


    function llenarTabla(tabla, selectedValue) {
        let currentPage = 1;

        fetch(`http://${servidor}:3000/api/listarMaestroRIPS?Tipo=${selectedValue}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.statusText);
            }
            let lastModified = response.headers.get('Last-Modified');

            if (tabla && tabla.lastModified === lastModified) {
                return;
            }

            currentPage = tabla.page.info().page;
            tabla.lastModified = lastModified;
            tabla.clear();
            return response.json();
        })
        .then(data => {
            tabla.rows.add(data).draw();
            tabla.page(currentPage).draw('page');
        })
        .catch(error => {
            console.log('Error en la solicitud fetch: ', error);
        });
    }

    function actualizarEstado(tabla, id, nuevoEstado) {
        fetch(`http://${servidor}:3000/api/ActualizarElemento`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Tabla: tabla,
                Id: id,
                Estado: nuevoEstado
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la actualización: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // console.log('Actualización exitosa:', data);
            // Opcional: mostrar un mensaje al usuario o actualizar la interfaz según sea necesario
        })
        .catch(error => {
            // console.error('Error al actualizar el estado:', error);
            // console.log(error);
            // Opcional: manejar el error, mostrar un mensaje al usuario, etc.
        });
    }
});