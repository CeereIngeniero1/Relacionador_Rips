const servidor = "HPRED241";

function VerificarLogin() {
    const TokenLogin = localStorage.getItem('token');
    const contenido = document.getElementById('Contenido'); // Contenedor principal de la página

    if (!TokenLogin) {
        console.warn("Token no encontrado, redirigiendo al inicio de sesión...");
        
        // Ocultar el contenido de la página
        if (contenido) {
            contenido.style.display = 'none';
        } else {
            document.body.classList.add('hidden'); // Fallback si no hay un contenedor específico
        }

        Swal.fire({
            allowOutsideClick: false,
            allowEscapeKey: false,
            icon: 'warning',
            // text: 'Primero debes iniciar sesión para acceder a esta página',
            html: `
                <h4 style="color: #FFFFFF">Primero debes iniciar sesión para acceder a esta página</h4>
            `,
            showConfirmButton: false // Deshabilitar botón para forzar la espera
        });

        setTimeout(() => {
            window.location.href = "index.html"; // Redirigir después del tiempo
        }, 5000);
    }
}

// Llamar a la función al cargar la página
VerificarLogin();

// const ejecutar = async () => {
//     try {
//         const abc = await fetch(`http://${servidor}:3000/api/pruebahc`);
        
//         if (!abc.ok) {
//             // Captura un error en caso de que la respuesta no sea 'ok'
//             throw new Error(`Error en la solicitud: ${abc.status} ${abc.statusText}`);
//         }

//         const Datos = await abc.json();
//         console.log('Pacientes:', Datos);
        
//     } catch (error) {
//         // Manejo de errores de red o de la API
//         console.error('Ocurrió un error al realizar la solicitud:', error.message);
//     }
// };
// ejecutar();


const BotonConsultar = document.getElementById('BotonConsultar');
const ModalConsultar = document.getElementById('ModalConsultar');

function Consultar() {
    // var myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
    // myModal.show();

    var myModal = new bootstrap.Modal(document.getElementById('exampleModal'), {
        backdrop: 'static', // Evita el cierre al hacer clic fuera del modal
        keyboard: false // Impide el cierre con la tecla Escape
    });
    myModal.show();
}

BotonConsultar.addEventListener('click', function (e) {
    Consultar();
})

async function Cargar() {
    // Recuperar la variable
    const documentoUsuarioLogeado = sessionStorage.getItem('documentousuariologeado');

    // // Imprimir en la consola
    // console.log(documentoUsuarioLogeado);

    let FechaInicioConsulta = document.getElementById('FechaInicioConsulta').value;
    let FechaFinConsulta = document.getElementById('FechaFinConsulta').value;

    let CamposSinLlenar = [];

    if (FechaInicioConsulta === "") CamposSinLlenar.push("Fecha inicio");
    if (FechaFinConsulta === "") CamposSinLlenar.push("Fecha fin");

    if (CamposSinLlenar.length > 0) {
        Swal.fire({
            allowOutsideClick: false,
            allowEscapeKey: false,
            icon: 'info',
            text: '',
            html: `
                <h4 style="color: #ffffff"><b> Los siguientes campos son obligatorios: </b></h4>
                <br>
                <ul style="text-align: left;">
                ${CamposSinLlenar
                .map((campo) => `<li style="color: #ffffff"> ${campo}</li>`)
                .join("")}
                </ul>
            `,
        })

        return;
    }

    if (FechaInicioConsulta > FechaFinConsulta) {
        Swal.fire({
            allowOutsideClick: false,
            allowEscapeKey: false,
            icon: 'info',
            text: '',
            html: `
                <h4 style="color: #ffffff"><b>La fecha de inicio debe ser menor o igual a la fecha de fin.</b></h4>
            `,
        })

        return;
    }


    try {
        const PacienteConHCSinRIPS = await fetch(`http://${servidor}:3000/api/UsuariosHC/${documentoUsuarioLogeado}/${FechaInicioConsulta}/${FechaFinConsulta}`);
        if (!PacienteConHCSinRIPS.ok) {
            throw new Error(`Error al obtener los datos de Pacientes con HC sin RIPS: ${PacienteConHCSinRIPS.statusText}`);
        }
        const PacientesConHCSinRIPS = await PacienteConHCSinRIPS.json();
        // console.log('Datos: ', PacientesConHCSinRIPS);

        Swal.fire({
            allowOutsideClick: false,
            allowEscapeKey: false,
            icon: 'success',
            html: `
                <h4 style="color: #ffffff"> <b>Pacientes cargados correctamente</b> </h4>
            `
        }).then(function (response) {
            // Cerrar el modal
            const BotonCerarModal = document.getElementById('BotonCerarModal');
            BotonCerarModal.click();

            if (response.isConfirmed) {

                const SelectPacientesConHCSinRIPS = document.getElementById('listaHC');
                SelectPacientesConHCSinRIPS.innerHTML = '';
                
                // Agrega una opción por defecto
                const defaultOption = document.createElement('option');
                defaultOption.textContent = 'Seleccione un paciente';
                defaultOption.value = '';
                SelectPacientesConHCSinRIPS.appendChild(defaultOption);

                // Ordenar el array por el nombre completo del paciente
                PacientesConHCSinRIPS.sort((a, b) => {
                    if (a.NombreCompletoPaciente < b.NombreCompletoPaciente) return -1;
                    if (a.NombreCompletoPaciente > b.NombreCompletoPaciente) return 1;
                    return 0;
                });

                for (let i = 0; i < PacientesConHCSinRIPS.length; i+=1) {
                    const option = document.createElement('option');
                    option.value = PacientesConHCSinRIPS[i].DocumentoPaciente;
                    option.textContent = PacientesConHCSinRIPS[i].NombreCompletoPaciente;
                    SelectPacientesConHCSinRIPS.appendChild(option);
                }
            }
        })
    } catch (error) {
        console.error(error);
    }
}

const BotonCargarPacientesConHCSinRIPS = document.getElementById('CargarPacientesConHCSinRIPS');

BotonCargarPacientesConHCSinRIPS.addEventListener('click', function (e) {
    Cargar();
})

async function LlenarSelectDeHistoriasClinicas() {
      // Funcionalidad para el llenado del select de las historias/evoluciones sin RIPS
      const RangoInicio = document.getElementById('FechaInicioConsulta').value;
      const RangoFin = document.getElementById('FechaFinConsulta').value;
      const documentoUsuarioLogeado = sessionStorage.getItem('documentousuariologeado');
      const documentopaciente = document.getElementById('listaHC').value;
      const SelectHistoriasSinRIPS = document.getElementById('HistoriasSinRIPS');

      const HCsinRIPS = await fetch(`http://${servidor}:3000/api/DatosdeHC/${documentopaciente}/${documentoUsuarioLogeado}/${RangoInicio}/${RangoFin}`);
      if (!HCsinRIPS.ok) {
          throw new Error(`Error al obtener las historias/evoluciones sin RIPS: ${HCsinRIPS.statusText}`);
      }
      const HistoriasEvolucionesSinRIPS = await HCsinRIPS.json();
    //   console.log('Historias/Evoluciones sin RIPS: ', HistoriasEvolucionesSinRIPS);

    //   console.log('Rango: ' + RangoInicio + ' ' + RangoFin)

      
      SelectHistoriasSinRIPS.innerHTML = '';
      // Opción por defecto
      const defaultOption = document.createElement('option');
      defaultOption.textContent = 'Seleccione una historia/evolución';
      defaultOption.value = '';
      SelectHistoriasSinRIPS.appendChild(defaultOption);
      for (let i = 0; i < HistoriasEvolucionesSinRIPS.length; i+=1) {
          const option = document.createElement('option');
          option.value = HistoriasEvolucionesSinRIPS[i].IdEvaluaciónEntidad;
          option.textContent = HistoriasEvolucionesSinRIPS[i].DescripcionTipodeEvaluación + " [ " +  HistoriasEvolucionesSinRIPS[i].Formato_Diagnostico + " - " + HistoriasEvolucionesSinRIPS[i].FechaEvaluacionTexto + " " + HistoriasEvolucionesSinRIPS[i].HoraEvaluacion + " ]";
          SelectHistoriasSinRIPS.appendChild(option);
      }
}
const SelectPacientes = document.getElementById('listaHC');
SelectPacientes.addEventListener('change', async function (e) {
    // console.log(this.value);

    const NombrePaciente = document.getElementById('NombrePaciente');
    const DcoumentoPaciente = document.getElementById('DocumentoPaciente');
    const EdadPaciente = document.getElementById('EdadPaciente');
    const SexoPaciente = document.getElementById('SexoPaciente');
    const DireccionPaciente = document.getElementById('DireccionPaciente');
    const TelefonoPaciente = document.getElementById('TelefonoPaciente');
    const SelectHistoriasSinRIPS = document.getElementById('HistoriasSinRIPS');


    if (this.value !== "") {
        try {
            const DatosPaciente = await fetch(`http://${servidor}:3000/api/DatosdeUsuarioHC/${this.value}`);
            if (!DatosPaciente.ok) {
                throw new Error(`Error al obtener los datos de Pacientes con HC sin RIPS: ${DatosPaciente.statusText}`);
            }
            const CargarDatosPaciente = await DatosPaciente.json();
            // console.log('Datos: ', CargarDatosPaciente); 

            NombrePaciente.value = CargarDatosPaciente[0].NombreCompletoPaciente;
            DcoumentoPaciente.value = CargarDatosPaciente[0].DocumentoPaciente;
            EdadPaciente.value = CargarDatosPaciente[0].Edad;
            SexoPaciente.value = CargarDatosPaciente[0].Sexo;
            DireccionPaciente.value = CargarDatosPaciente[0].Direccion;
            TelefonoPaciente.value = CargarDatosPaciente[0].Tel;

            LlenarSelectDeHistoriasClinicas();

            // // Funcionalidad para el llenado del select de las historias/evoluciones sin RIPS
            // const RangoInicio = document.getElementById('FechaInicioConsulta').value;
            // const RangoFin = document.getElementById('FechaFinConsulta').value;
            // const documentoUsuarioLogeado = sessionStorage.getItem('documentousuariologeado');
            // const HCsinRIPS = await fetch(`http://${servidor}:3000/api/DatosdeHC/${this.value}/${documentoUsuarioLogeado}/${RangoInicio}/${RangoFin}`);
            // if (!HCsinRIPS.ok) {
            //     throw new Error(`Error al obtener las historias/evoluciones sin RIPS: ${HCsinRIPS.statusText}`);
            // }
            // const HistoriasEvolucionesSinRIPS = await HCsinRIPS.json();
            // console.log('Historias/Evoluciones sin RIPS: ', HistoriasEvolucionesSinRIPS);

            // console.log('Rango: ' + RangoInicio + ' ' + RangoFin)

            
            // SelectHistoriasSinRIPS.innerHTML = '';
            // // Opción por defecto
            // const defaultOption = document.createElement('option');
            // defaultOption.textContent = 'Seleccione una historia/evolución';
            // defaultOption.value = '';
            // SelectHistoriasSinRIPS.appendChild(defaultOption);
            // for (let i = 0; i < HistoriasEvolucionesSinRIPS.length; i+=1) {
            //     const option = document.createElement('option');
            //     option.value = HistoriasEvolucionesSinRIPS[i].IdEvaluaciónEntidad;
            //     option.textContent = HistoriasEvolucionesSinRIPS[i].DescripcionTipodeEvaluación + " [ " +  HistoriasEvolucionesSinRIPS[i].Formato_Diagnostico + " - " + HistoriasEvolucionesSinRIPS[i].FechaEvaluacionTexto + " " + HistoriasEvolucionesSinRIPS[i].HoraEvaluacion + " ]";
            //     SelectHistoriasSinRIPS.appendChild(option);
            // }
        } catch (error) {
            console.error(error);
        }
    } else {
        // Limpiar los campos si no hay selección
        NombrePaciente.value = '';
        DcoumentoPaciente.value = '';
        EdadPaciente.value = '';
        SexoPaciente.value = '';
        DireccionPaciente.value = '';
        TelefonoPaciente.value = '';
        SelectHistoriasSinRIPS.innerHTML = '';
    }    
});




const radioAC = document.getElementById('AC');
const radioAP = document.getElementById('AP');
const procedimientoRIPS = document.getElementById('procedimientoRIPS');
const causaViaIngreso = document.getElementById('causaViaIngreso');
const listaCausa = document.getElementById('listaCausa');
const listaViaIngreso = document.getElementById('listaViaIngreso');
const codDiagnosticoRelacionado = document.getElementById('codDiagnosticoRelacionado');
const codDiagnosticoRelacionado2 = document.getElementById('codDiagnosticoRelacionado2');
const codDiagnosticoRelacionado3 = document.querySelector('.codDiagnosticoRelacionado3')
const tipoDiagnosticoPrincipal = document.querySelector('.tipoDiagnosticoPrincipal')

const ContenedorTipoAC = document.getElementById('TipoAC');
const ContenedorTipoAP = document.getElementById('TipoAP');

ContenedorTipoAC.style.display = 'none';
ContenedorTipoAP.style.display = 'none';

$(document).ready(function() {

    const ElementosSelectConTextoLargo = [
        '#SelectConsultaRIPSAC1',
        '#SelectConsultaRIPSAC2',
        '#SelectDiagnosticoRIPSAC1',
        '#SelectDiagnosticoRIPSAC2',
        '#SelectProcedimientoRIPSAP1',
        '#SelectProcedimientoRIPSAP2',
        '#SelectDiagnosticoRIPSAP1',
        '#SelectDiagnosticoRIPSAP2',
        '#SelectPorDefectoConsultaRIPS1AC',
        '#SelectPorDefectoConsultaRIPS2AC',
        '#SelectPorDefectoDiagnosticoRIPSAC1',
        '#SelectPorDefectoDiagnosticoRIPSAC2',
        '#SelectPorDefectoProcedimientoRIPSAP1',
        '#SelectPorDefectoProcedimientoRIPSAP2',
        '#SelectPorDefectoDiagnosticoRIPSAP1',
        '#SelectPorDefectoDiagnosticoRIPSAP2'
    ]

    for (let i = 0; i < ElementosSelectConTextoLargo.length; i+=1) {
        if (
            ElementosSelectConTextoLargo[i] === '#SelectPorDefectoConsultaRIPS1AC' ||
            ElementosSelectConTextoLargo[i] === '#SelectPorDefectoConsultaRIPS2AC' ||
            ElementosSelectConTextoLargo[i] === '#SelectPorDefectoDiagnosticoRIPSAC1' ||
            ElementosSelectConTextoLargo[i] === '#SelectPorDefectoDiagnosticoRIPSAC2' ||
            ElementosSelectConTextoLargo[i] === '#SelectPorDefectoProcedimientoRIPSAP1' ||
            ElementosSelectConTextoLargo[i] === '#SelectPorDefectoProcedimientoRIPSAP2' || 
            ElementosSelectConTextoLargo[i] === '#SelectPorDefectoDiagnosticoRIPSAP1' ||
            ElementosSelectConTextoLargo[i] === '#SelectPorDefectoDiagnosticoRIPSAP2'
            ) {
            $(ElementosSelectConTextoLargo[i]).select2({
                width: '100%', // Ajusta el ancho al contenedor
                dropdownAutoWidth: true, // Ajusta automáticamente el ancho del menú
                // placeholder: "Buscar",
                dropdownParent: $('#ModalRIPSPorDefecto'), // Reemplaza '#miModal' con el ID de tu modal
                templateSelection: function (data) {
                    // Truncar el texto a 50 caracteres y añadir puntos suspensivos
                    var truncatedText = data.text.length > 50 ? data.text.substring(0, 50) + '...' : data.text;
                    return $('<span>' + truncatedText + '</span>');
                }
            });
        } else {
            $(ElementosSelectConTextoLargo[i]).select2({
                width: '100%', // Ajusta el ancho al contenedor
                dropdownAutoWidth: true, // Ajusta automáticamente el ancho del menú
                // placeholder: "Buscar",
                templateSelection: function (data) {
                    // Truncar el texto a 50 caracteres y añadir puntos suspensivos
                    var truncatedText = data.text.length > 50 ? data.text.substring(0, 50) + '...' : data.text;
                    return $('<span>' + truncatedText + '</span>');
                }
            });
        }

    }
});
  

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Event listener para el radio button AC
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
radioAC.addEventListener('change', async function (e) {

    ContenedorTipoAC.style.display = 'block';
    ContenedorTipoAP.style.display = 'none';

    const SelectTipoUsuarioRIPS = document.getElementById('SelectTipoUsuarioRIPS');
    const HistoriasSinRIPS = document.getElementById('HistoriasSinRIPS').value;
    const SelectModalidadGrupoServicioTecnologiaSalud =  document.getElementById('SelectModalidadGrupoServicioTecnologiaSalud');
    const SelectGrupoServiciosAC = document.getElementById('SelectGrupoServiciosAC');
    const SelectFinalidadTecnologiaSaludAC = document.getElementById('SelectFinalidadTecnologiaSaludAC');
    const SelectCausaMotivoAtencion = document.getElementById('SelectCausaMotivoAtencion');
    const SelectTipoDiagnosticoPrincipalAC = document.getElementById('SelectTipoDiagnosticoPrincipalAC');
    const SelectConsultaRIPSAC1 = document.getElementById('SelectConsultaRIPSAC1');
    const SelectConsultaRIPSAC2 = document.getElementById('SelectConsultaRIPSAC2');
    const SelectDiagnosticoRIPSAC1 = document.getElementById('SelectDiagnosticoRIPSAC1');
    const SelectDiagnosticoRIPSAC2 = document.getElementById('SelectDiagnosticoRIPSAC2');

    // Desarrollo || y producción &&
    if (HistoriasSinRIPS !== "" || HistoriasSinRIPS !== "Sin Seleccionar") {
        try {
            // Funcionalidad para el llenado del select de tipo de rips
            const TipoDeUsuarioRIPS = await fetch(`http://${servidor}:3000/api/TipodeRips`)
            if (!TipoDeUsuarioRIPS) {
                throw new Error(`Error al obtener los tipos de usuario RIPS: ${TipoDeUsuarioRIPS.statusText}`);
            }
            const CargarTipoDeUsuarioRIPS = await TipoDeUsuarioRIPS.json();
            // console.log('Tipos de Usuario RIPS: ', CargarTipoDeUsuarioRIPS);
            SelectTipoUsuarioRIPS.innerHTML = '';
            // Opción por defecto
            const defaultOption = document.createElement('option');
            defaultOption.textContent = 'Seleccione un tipo de RIPS';
            defaultOption.value = '';
            SelectTipoUsuarioRIPS.appendChild(defaultOption);
            for (let i = 0; i < CargarTipoDeUsuarioRIPS.length; i+=1) {
                const option = document.createElement('option');
                option.value = CargarTipoDeUsuarioRIPS[i].IdTipoRips;
                option.textContent = CargarTipoDeUsuarioRIPS[i].TipoRips;
                SelectTipoUsuarioRIPS.appendChild(option);
            }

            // Funcionalidad para el llenado del select de ModalidadGrupoServicioTecnologíaSalud
            const ModalidadGrupoServicioTecnologiaSalud = await fetch(`http://${servidor}:3000/api/ModalidadAtencion`);
            if (!ModalidadGrupoServicioTecnologiaSalud) {
                throw new Error(`Error al obtener las modalidades de grupo servicio tecnología salud: ${ModalidadGrupoServicioTecnologiaSalud.statusText}`);
            }
            const CargarModalidadGrupoServicioTecnologiaSalud = await ModalidadGrupoServicioTecnologiaSalud.json();
            // console.log('Modalidades de Grupo Servicio Tecnología Salud: ', CargarModalidadGrupoServicioTecnologiaSalud);

            SelectModalidadGrupoServicioTecnologiaSalud.innerHTML = '';
            // Opción por defecto
            const defaultOption2 = document.createElement('option');
            defaultOption2.textContent = 'Seleccione una modalidad';
            defaultOption2.value = '';
            SelectModalidadGrupoServicioTecnologiaSalud.appendChild(defaultOption2);

            // Ordenar el array por el nombre completo del paciente
            CargarModalidadGrupoServicioTecnologiaSalud.sort((a, b) => {
                if (a.NombreModalidadAtencion < b.NombreModalidadAtencion) return -1;
                if (a.NombreModalidadAtencion > b.NombreModalidadAtencion) return 1;
                return 0;
            });

            for (let i = 0; i < CargarModalidadGrupoServicioTecnologiaSalud.length; i+=1) {
                const option = document.createElement('option');
                option.value = CargarModalidadGrupoServicioTecnologiaSalud[i].Codigo;
                option.textContent = CargarModalidadGrupoServicioTecnologiaSalud[i].NombreModalidadAtencion;
                SelectModalidadGrupoServicioTecnologiaSalud.appendChild(option);
            }

            // Funcionalidad para el llenado del select de GrupoServiciosAC
            const GrupoServiciosAC = await fetch(`http://${servidor}:3000/api/GrupoServicios`);
            if (!GrupoServiciosAC) {
                throw new Error(`Error al obtener los grupos de servicios AC: ${GrupoServiciosAC.statusText}`);
            }
            const CargarGrupoServiciosAC = await GrupoServiciosAC.json();
            // console.log('Grupos de Servicios AC: ', CargarGrupoServiciosAC);
            SelectGrupoServiciosAC.innerHTML = '';
            // Opción por defecto
            const defaultOption3 = document.createElement('option');
            defaultOption3.textContent = 'Seleccione un grupo';
            defaultOption3.value = '';
            SelectGrupoServiciosAC.appendChild(defaultOption3);
            // Ordenar el array por el nombre del grupo
            CargarGrupoServiciosAC.sort((a, b) => {
                if (a.NombreGrupoServicios < b.NombreGrupoServicios) return -1;
                if (a.NombreGrupoServicios > b.NombreGrupoServicios) return 1;
                return 0;
            });

            // Agregar las opciones al select de GrupoServiciosAC
            for (let i = 0; i < CargarGrupoServiciosAC.length; i+=1) {
                const option = document.createElement('option');
                option.value = CargarGrupoServiciosAC[i].Codigo;
                option.textContent = CargarGrupoServiciosAC[i].NombreGrupoServicios;
                SelectGrupoServiciosAC.appendChild(option);
            }
    
            // Funcionalidad para el llenado del select de FinalidadTecnologiaSalud
            const FinalidadParaAC = "AC";
            const FinalidadTecnologiaSaludAC = await fetch(`http://${servidor}:3000/api/FinalidadV2/${FinalidadParaAC}`);
            if (!FinalidadTecnologiaSaludAC) {
                throw new Error(`Error al obtener las finalidades para el tipo AC: ${FinalidadTecnologiaSaludAC.statusText}`);
            }
            const CargarFinalidadTecnologiaSaludAC = await FinalidadTecnologiaSaludAC.json();
            // console.log('Finalidades para el tipo AC: ', CargarFinalidadTecnologiaSaludAC);
            SelectFinalidadTecnologiaSaludAC.innerHTML = '';
            // Opción por defecto
            const defaultOption4 = document.createElement('option');
            defaultOption4.textContent = 'Seleccione una finalidad';
            defaultOption4.value = '';
            SelectFinalidadTecnologiaSaludAC.appendChild(defaultOption4);
            // Ordenar el array por el nombre del grupo
            CargarFinalidadTecnologiaSaludAC.sort((a, b) => {
                if (a.NombreRIPSFinalidadConsultaVersion2 < b.NombreRIPSFinalidadConsultaVersion2) return -1;
                if (a.NombreRIPSFinalidadConsultaVersion2 > b.NombreRIPSFinalidadConsultaVersion2) return 1;
                return 0;
            });
            // Agregar las opciones al select de FinalidadTecnologiaSalud
            for (let i = 0; i < CargarFinalidadTecnologiaSaludAC.length; i+=1) {
                const option = document.createElement('option');
                option.value = CargarFinalidadTecnologiaSaludAC[i].Codigo;
                option.textContent = CargarFinalidadTecnologiaSaludAC[i].NombreRIPSFinalidadConsultaVersion2;
                SelectFinalidadTecnologiaSaludAC.appendChild(option);
            }

            // Funcionalidad para el llenado del select CausaMotivoAtención
            const CausaMotivoAtencion = await fetch(`http://${servidor}:3000/api/CausaExterna`);
            if (!CausaMotivoAtencion) {
                throw new Error(`Error al obtener las causas externas: ${CausaMotivoAtencion.statusText}`);
            }
            const CargarCausaMotivoAtencion = await CausaMotivoAtencion.json();
            // console.log('Causas externas: ', CargarCausaMotivoAtencion);
            SelectCausaMotivoAtencion.innerHTML = '';
            // Opción por defecto
            const defaultOption5 = document.createElement('option');
            defaultOption5.textContent = 'Seleccione una causa externa';
            defaultOption5.value = '';
            SelectCausaMotivoAtencion.appendChild(defaultOption5);
            // Ordenar el array por el nombre del grupo
            CargarCausaMotivoAtencion.sort((a, b) => {
                if (a.NombreRIPSCausaExternaVersion2 < b.NombreRIPSCausaExternaVersion2) return -1;
                if (a.NombreRIPSCausaExternaVersion2 > b.NombreRIPSCausaExternaVersion2) return 1;
                return 0;
            });
            // Agregar las opciones al select de CausaMotivoAtencion
            for (let i = 0; i < CargarCausaMotivoAtencion.length; i+=1) {
                const option = document.createElement('option');
                option.value = CargarCausaMotivoAtencion[i].Codigo;
                option.textContent = CargarCausaMotivoAtencion[i].NombreRIPSCausaExternaVersion2;
                SelectCausaMotivoAtencion.appendChild(option);
            }

            // Funcionalidad para el llenado del select de TipoDiagnósticoPrincipal
            const TipoDiagnosticoPrincipal = await fetch(`http://${servidor}:3000/api/DXPrincipal`);
            if (!TipoDiagnosticoPrincipal) {
                throw new Error(`Error al obtener los tipos de diagnósticos principales: ${TipoDiagnosticoPrincipal.statusText}`);
            }
            const CargarTipoDiagnosticoPrincipal = await TipoDiagnosticoPrincipal.json();
            // console.log('Tipos de diagnósticos principales: ', CargarTipoDiagnosticoPrincipal);
            SelectTipoDiagnosticoPrincipalAC.innerHTML = '';
            // Opción por defecto
            const defaultOption6 = document.createElement('option');
            defaultOption6.textContent = 'Seleccione un diagnóstico principal';
            defaultOption6.value = '';
            SelectTipoDiagnosticoPrincipalAC.appendChild(defaultOption6);
            // Ordenar el array por el nombre del grupo
            CargarTipoDiagnosticoPrincipal.sort((a, b) => {
                if (a.DescripcionTipodeDiagnósticoPrincipal < b.DescripcionTipodeDiagnósticoPrincipal) return -1;
                if (a.DescripcionTipodeDiagnósticoPrincipal > b.DescripcionTipodeDiagnósticoPrincipal) return 1;
                return 0;
            });
            // Agregar las opciones al select de TipoDiagnosticoPrincipal
            for (let i = 0; i < CargarTipoDiagnosticoPrincipal.length; i+=1) {
                const option = document.createElement('option');
                option.value = CargarTipoDiagnosticoPrincipal[i].CódigoTipodeDiagnósticoPrincipal;
                option.textContent = CargarTipoDiagnosticoPrincipal[i].DescripcionTipodeDiagnósticoPrincipal;
                SelectTipoDiagnosticoPrincipalAC.appendChild(option);
            }

            // Funcionalidad para el llenado del select de Consulta RIPS
            const TipoConsulta1 = "AC";
            const ConsultaRIPS1 = await fetch(`http://${servidor}:3000/api/Cups/${TipoConsulta1}`);
            if (!ConsultaRIPS1) {
                throw new Error(`Error al obtener las consultas RIPS: ${ConsultaRIPS1.statusText}`);
            }
            const CargarConsultaRIPS1 = await ConsultaRIPS1.json();
            // console.log('Consultas RIPS: ', CargarConsultaRIPS1);
            SelectConsultaRIPSAC1.innerHTML = '';
            // Opción por defecto
            const defaultOption7 = document.createElement('option');
            defaultOption7.textContent = 'Seleccione una consulta RIPS 1';
            defaultOption7.value = '';
            SelectConsultaRIPSAC1.appendChild(defaultOption7);
            // Ordenar el array por el nombre del grupo
            CargarConsultaRIPS1.sort((a, b) => {
                if (a.Nombre < b.Nombre) return -1;
                if (a.Nombre > b.Nombre) return 1;
                return 0;
            });
            // Agregar las opciones al select de ConsultaRIPS
            for (let i = 0; i < CargarConsultaRIPS1.length; i+=1) {
                const option = document.createElement('option');
                option.value = CargarConsultaRIPS1[i].Codigo;
                option.textContent = CargarConsultaRIPS1[i].Codigo + ' - ' + CargarConsultaRIPS1[i].Nombre;
                SelectConsultaRIPSAC1.appendChild(option);
            }

            // Funcionalidad para el llenado del select de Consulta RIPS 2
            const TipoConsulta2 = "AC";
            const ConsultaRIPS2 = await fetch(`http://${servidor}:3000/api/Cups/${TipoConsulta2}`);
            if (!ConsultaRIPS2) {
                throw new Error(`Error al obtener las consultas RIPS: ${ConsultaRIPS2.statusText}`);
            }
            const CargarConsultaRIPS2 = await ConsultaRIPS2.json();
            // console.log('Consultas RIPS: ', CargarConsultaRIPS2);
            SelectConsultaRIPSAC2.innerHTML = '';
            // Opción por defecto
            const defaultOption8 = document.createElement('option');
            defaultOption8.textContent = 'Seleccione una consulta RIPS 2';
            defaultOption8.value = '';
            SelectConsultaRIPSAC2.appendChild(defaultOption8);
            // Ordenar el array por el nombre del grupo
            CargarConsultaRIPS2.sort((a, b) => {
                if (a.Nombre < b.Nombre) return -1;
                if (a.Nombre > b.Nombre) return 1;
                return 0;
            });
            // Agregar las opciones al select de ConsultaRIPS 2
            for (let i = 0; i < CargarConsultaRIPS2.length; i+=1) {
                const option = document.createElement('option');
                option.value = CargarConsultaRIPS2[i].Codigo;
                option.textContent = CargarConsultaRIPS2[i].Codigo + ' - ' + CargarConsultaRIPS2[i].Nombre;
                SelectConsultaRIPSAC2.appendChild(option);
            }


            // Funcinalidad para el llenado del select Diagnósitoco RIPS AC 1
            const DiasnosticoRIPSAC1 = await fetch(`http://${servidor}:3000/api/Cie`);
            if (!DiasnosticoRIPSAC1) {
                throw new Error(`Error al obtener los diagnósticos RIPS: ${DiasnosticoRIPSAC1.statusText}`);
            }
            const CargarDiagnosticoRIPSAC1 = await DiasnosticoRIPSAC1.json();
            // console.log('Diagnósticos RIPS AC 1: ', CargarDiagnosticoRIPSAC1);
            SelectDiagnosticoRIPSAC1.innerHTML = '';
            // Opción por defecto
            const defaultOption9 = document.createElement('option');
            defaultOption9.textContent = 'Seleccione un diagnóstico RIPS AC 1';
            defaultOption9.value = '';
            SelectDiagnosticoRIPSAC1.appendChild(defaultOption9);
            // Ordenar el array por el nombre del grupo
            CargarDiagnosticoRIPSAC1.sort((a, b) => {
                if (a.Nombre < b.Nombre) return -1;
                if (a.Nombre > b.Nombre) return 1;
                return 0;
            });
            // Agregar las opciones al select Diagnósitoco RIPS AC 1
            for (let i = 0; i < CargarDiagnosticoRIPSAC1.length; i+=1) {
                const option = document.createElement('option');
                option.value = CargarDiagnosticoRIPSAC1[i].Codigo;
                option.textContent = CargarDiagnosticoRIPSAC1[i].Codigo + ' - ' + CargarDiagnosticoRIPSAC1[i].Nombre;
                SelectDiagnosticoRIPSAC1.appendChild(option);
            }


            // Funcinalidad para el llenado del select Diagnósitoco RIPS AC 2
            const DiasnosticoRIPSAC2 = await fetch(`http://${servidor}:3000/api/Cie`);
            if (!DiasnosticoRIPSAC2) {
                throw new Error(`Error al obtener los diagnósticos RIPS: ${DiasnosticoRIPSAC2.statusText}`);
            }
            const CargarDiagnosticoRIPSAC2 = await DiasnosticoRIPSAC2.json();
            // console.log('Diagnósticos RIPS AC 1: ', CargarDiagnosticoRIPSAC2);
            SelectDiagnosticoRIPSAC2.innerHTML = '';
            // Opción por defecto
            const defaultOption10 = document.createElement('option');
            defaultOption10.textContent = 'Seleccione un diagnóstico RIPS AC 2';
            defaultOption10.value = '';
            SelectDiagnosticoRIPSAC2.appendChild(defaultOption10);
            // Ordenar el array por el nombre del grupo
            CargarDiagnosticoRIPSAC2.sort((a, b) => {
                if (a.Nombre < b.Nombre) return -1;
                if (a.Nombre > b.Nombre) return 1;
                return 0;
            });
            // Agregar las opciones al select Diagnósitoco RIPS AC 1
            for (let i = 0; i < CargarDiagnosticoRIPSAC2.length; i+=1) {
                const option = document.createElement('option');
                option.value = CargarDiagnosticoRIPSAC2[i].Codigo;
                option.textContent = CargarDiagnosticoRIPSAC2[i].Codigo + ' - ' + CargarDiagnosticoRIPSAC2[i].Nombre;
                SelectDiagnosticoRIPSAC2.appendChild(option);
            }


        } catch (error) {
            console.error(error);
        }
    }


    // if (radioAC.checked) {
    //     procedimientoRIPS.textContent = 'codConsulta'; // Limpiar el valor si es necesario
    //     causaViaIngreso.textContent = 'causaMotivoAtencion';
    //     listaCausa.style.display = 'block'
    //     listaViaIngreso.style.display = 'none'
    //     codDiagnosticoRelacionado.textContent = 'codDiagnosticoRelacionado1'
    //     codDiagnosticoRelacionado2.textContent = 'codDiagnosticoRelacionado2'
    //     codDiagnosticoRelacionado3.style.display = 'flex'
    //     tipoDiagnosticoPrincipal.style.display = 'grid'

    //     ejecutarConsultasAC();
    // }
});


const SelectTipoDeUsuarioRIPS = document.getElementById('SelectTipoUsuarioRIPS');
const SelectEntidadResponsable = document.getElementById('SelectEntidad');
SelectTipoDeUsuarioRIPS.addEventListener('change', async function (e) {

    try {
        if (this.value !== "") {
            const ValorSelectTipoUsuarioRIPS = this.value;
            // Funcionalidad para el llenado del select de entidad
            const EntidadResponsable = await fetch(`http://${servidor}:3000/api/Entidad/${ValorSelectTipoUsuarioRIPS}`);
            if (!EntidadResponsable) {
                throw new Error(`Error al obtener las entidades responsables: ${EntidadResponsable.statusText}`);
            }
            const CargarEntidadResponsable = await EntidadResponsable.json();
            // console.log('Entidades Responsables: ', CargarEntidadResponsable);
    
            SelectEntidadResponsable.innerHTML = '';
            // Opción por defecto
            const defaultOption = document.createElement('option');
            defaultOption.textContent = 'Seleccione una entidad';
            defaultOption.value = '';
            SelectEntidadResponsable.appendChild(defaultOption);

            // Ordenar el array por el nombre completo del paciente
            CargarEntidadResponsable.sort((a, b) => {
                if (a.NombreCompletoPaciente < b.NombreCompletoPaciente) return -1;
                if (a.NombreCompletoPaciente > b.NombreCompletoPaciente) return 1;
                return 0;
            });

            for (let i = 0; i < CargarEntidadResponsable.length; i++) {
                const option = document.createElement('option');
                option.value = CargarEntidadResponsable[i].DocumentoEntidad;
                option.textContent = CargarEntidadResponsable[i].NombreCompletoPaciente;
                SelectEntidadResponsable.appendChild(option);
            }
        } else {
            SelectEntidadResponsable.innerHTML = '';
            // Opción por defecto
            const defaultOption = document.createElement('option');
            defaultOption.textContent = 'Seleccione una entidad';
            defaultOption.value = '';
            SelectEntidadResponsable.appendChild(defaultOption);
        }

    } catch (error) {
        console.error(error);
    }

})

// Funcionalidad para el llenado del select Servicios (CodServicio)
const SelectGrupoServiciosAC = document.getElementById('SelectGrupoServiciosAC');
const SelectServiciosAC = document.getElementById('SelectServiciosAC');
SelectGrupoServiciosAC.addEventListener('change', async function (e) {
    try {
        // console.log(this.value);
        const CargarServicios = await fetch(`http://${servidor}:3000/api/Servicios/${this.value}`);
        if (!CargarServicios.ok) {
            throw new Error(`Error al obtener los servicios: ${CargarServicios.statusText}`);
        }
        const CargarServiciosAC = await CargarServicios.json();
        // console.log('Servicios: ', CargarServiciosAC);

        SelectServiciosAC.innerHTML = '';
        // Opción por defecto
        const defaultOption = document.createElement('option');
        defaultOption.textContent = 'Seleccione un servicio';
        defaultOption.value = '';
        SelectServiciosAC.appendChild(defaultOption);
        // Ordenar el array por el nombre del servicio
        CargarServiciosAC.sort((a, b) => {
            if (a['Nombre Servicios'] < b['Nombre Servicios']) return -1;
            if (a['Nombre Servicios'] > b['Nombre Servicios']) return 1;
            return 0;
        });

        for (let i = 0; i < CargarServiciosAC.length; i++) {
            const option = document.createElement('option');
            option.value = CargarServiciosAC[i]['Id Servicios'];
            option.textContent = CargarServiciosAC[i]['Nombre Servicios'];
            SelectServiciosAC.appendChild(option);
        }
    } catch (error) {
        console.error(error);
    }
})
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>



// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Event listener para el radio button AP
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
radioAP.addEventListener('change', async function (e) {

    ContenedorTipoAP.style.display = 'block';
    ContenedorTipoAC.style.display = 'none';

    const HistoriasSinRIPS = document.getElementById('HistoriasSinRIPS').value;
    const SelectTipoUsurioRIPSAP = document.getElementById('SelectTipoUsurioRIPSAP');
    const SelectViaIngresoServicioSaludAP = document.getElementById('SelectViaIngresoServicioSaludAP');
    const SelectModalidadGrupoServicioTecSalAP = document.getElementById('SelectModalidadGrupoServicioTecSalAP');
    const SelectGrupoServiciosAP = document.getElementById('SelectGrupoServiciosAP');
    const SelectFinalidadTecnologiaSaludAP = document.getElementById('SelectFinalidadTecnologiaSaludAP');
    const SelectProcedimientoRIPSAP1 = document.getElementById('SelectProcedimientoRIPSAP1');
    const SelectProcedimientoRIPSAP2 = document.getElementById('SelectProcedimientoRIPSAP2');
    const SelectDiagnosticoRIPSAP1 = document.getElementById('SelectDiagnosticoRIPSAP1');
    const SelectDiagnosticoRIPSAP2 = document.getElementById('SelectDiagnosticoRIPSAP2');


    if (HistoriasSinRIPS !== "" || HistoriasSinRIPS !== "Sin Seleccionar") {
        // Funcionalidad para el llenado del select tipo usuario ap
        const TipoUsuarioRIPSAP = await fetch(`http://${servidor}:3000/api/TipodeRips`);
        if (!TipoUsuarioRIPSAP) {
            throw new Error(`Error al obtener los tipos de usuario RIPS: ${TipoUsuarioRIPSAP.statusText}`);
        }
        const CargarTipoUsuarioRIPSAP = await TipoUsuarioRIPSAP.json();
        // console.log('Tipos de Usuario RIPS AP: ', CargarTipoUsuarioRIPSAP);
        SelectTipoUsurioRIPSAP.innerHTML = '';
        // Opción por defecto
        const defaultOption = document.createElement('option');
        defaultOption.textContent = 'Seleccione un tipo de RIPS';
        defaultOption.value = '';
        SelectTipoUsurioRIPSAP.appendChild(defaultOption);
        // Ordenar el array por el nombre del tipo de usuario
        CargarTipoUsuarioRIPSAP.sort((a, b) => {
            if (a['TipoRips'] < b['TipoRips']) return -1;
            if (a['TipoRips'] > b['TipoRips']) return 1;
            return 0;
        });
        for (let i = 0; i < CargarTipoUsuarioRIPSAP.length; i++) {
            const option = document.createElement('option');
            option.value = CargarTipoUsuarioRIPSAP[i]['IdTipoRips'];
            option.textContent = CargarTipoUsuarioRIPSAP[i]['TipoRips'];
            SelectTipoUsurioRIPSAP.appendChild(option);
        }

        // Funcionalidad para el llendao del select ViaIngresoServicioSalud
        const ViaIngresoServicioSaludAP = await fetch(`http://${servidor}:3000/api/ViaIngresoUsuario`);
        if (!ViaIngresoServicioSaludAP) {
            throw new Error(`Error al obtener las vías de ingreso de usuario RIPS: ${ViaIngresoServicioSaludAP.statusText}`);
        }
        const CargarViaIngresoServicioSaludAP = await ViaIngresoServicioSaludAP.json();
        // console.log('Vias de Ingreso de Usuario RIPS AP: ', CargarViaIngresoServicioSaludAP);
        SelectViaIngresoServicioSaludAP.innerHTML = '';
        // Opción por defecto
        const defaultOption2 = document.createElement('option');
        defaultOption2.textContent = 'Seleccione una via de ingreso';
        defaultOption2.value = '';
        SelectViaIngresoServicioSaludAP.appendChild(defaultOption2);
        // Ordenar el array por el nombre de la via de ingreso
        CargarViaIngresoServicioSaludAP.sort((a, b) => {
            if (a['NombreViaIngresoUsuario'] < b['NombreViaIngresoUsuario']) return -1;
            if (a['NombreViaIngresoUsuario'] > b['NombreViaIngresoUsuario']) return 1;
            return 0;
        });
        for (let i = 0; i < CargarViaIngresoServicioSaludAP.length; i++) {
            const option = document.createElement('option');
            option.value = CargarViaIngresoServicioSaludAP[i]['Codigo'];
            option.textContent = CargarViaIngresoServicioSaludAP[i]['NombreViaIngresoUsuario'];
            SelectViaIngresoServicioSaludAP.appendChild(option);
        }

        // Funcionalidad para el llenado del select ModalidadGrupoServicioTecSalAP
        const ModalidadGrupoServicioTecSalAP = await fetch(`http://${servidor}:3000/api/ModalidadAtencion`);
        if (!ModalidadGrupoServicioTecSalAP) {
            throw new Error(`Error al obtener las modalidades de grupo de servicios técnicos RIPS: ${ModalidadGrupoServicioTecSalAP.statusText}`);
        }
        const CargarModalidadGrupoServicioTecSalAP = await ModalidadGrupoServicioTecSalAP.json();
        // console.log('Modalidades de Grupo de Servicios Técnicos RIPS AP: ', CargarModalidadGrupoServicioTecSalAP);
        SelectModalidadGrupoServicioTecSalAP.innerHTML = '';
        // Opción por defecto
        const defaultOption3 = document.createElement('option');
        defaultOption3.textContent = 'Seleccione una modalidad de grupo de servicios técnicos';
        defaultOption3.value = '';
        SelectModalidadGrupoServicioTecSalAP.appendChild(defaultOption3);
        // Ordenar el array por el nombre de la modalidad de grupo de servicios técnicos
        CargarModalidadGrupoServicioTecSalAP.sort((a, b) => {
            if (a['NombreModalidadAtencion'] < b['NombreModalidadAtencion']) return -1;
            if (a['NombreModalidadAtencion'] > b['NombreModalidadAtencion']) return 1;
            return 0;
        });
        for (let i = 0; i < CargarModalidadGrupoServicioTecSalAP.length; i++) {
            const option = document.createElement('option');
            option.value = CargarModalidadGrupoServicioTecSalAP[i]['Codigo'];
            option.textContent = CargarModalidadGrupoServicioTecSalAP[i]['NombreModalidadAtencion'];
            SelectModalidadGrupoServicioTecSalAP.appendChild(option);
        }

        //Funcionalidad para el llenado del select GrupoServiciosAP
        const GrupoServiciosAP = await fetch(`http://${servidor}:3000/api/GrupoServicios`);
        if (!GrupoServiciosAP) {
            throw new Error(`Error al obtener los grupos de servicios RIPS: ${GrupoServiciosAP.statusText}`);
        }
        const CargarGrupoServiciosAP = await GrupoServiciosAP.json();
        // console.log('Grupos de Servicios RIPS AP: ', CargarGrupoServiciosAP);
        SelectGrupoServiciosAP.innerHTML = '';
        // Opción por defecto
        const defaultOption4 = document.createElement('option');
        defaultOption4.textContent = 'Seleccione un grupo de servicios';
        defaultOption4.value = '';
        SelectGrupoServiciosAP.appendChild(defaultOption4);
        // Ordenar el array por el nombre del grupo de servicios
        CargarGrupoServiciosAP.sort((a, b) => {
            if (a['NombreGrupoServicios'] < b['NombreGrupoServicios']) return -1;
            if (a['NombreGrupoServicios'] > b['NombreGrupoServicios']) return 1;
            return 0;
        });
        for (let i = 0; i < CargarGrupoServiciosAP.length; i++) {
            const option = document.createElement('option');
            option.value = CargarGrupoServiciosAP[i]['Codigo'];
            option.textContent = CargarGrupoServiciosAP[i]['NombreGrupoServicios'];
            SelectGrupoServiciosAP.appendChild(option);
        }

        // Funcionalidad para el llenado del select FinalidadTecnologiaSaludAP
        const FinalidadRIPSAP = "AP";
        const FinalidadTecnologiaSaludAP = await fetch(`http://${servidor}:3000/api/FinalidadV2/${FinalidadRIPSAP}`);
        if (!FinalidadTecnologiaSaludAP) {
            throw new Error(`Error al obtener las finalidades técnicas de salud RIPS: ${FinalidadTecnologiaSaludAP.statusText}`);
        }
        const CargarFinalidadTecnologiaSaludAP = await FinalidadTecnologiaSaludAP.json();
        // console.log('Finalidades Técnicas de Salud RIPS AP: ', CargarFinalidadTecnologiaSaludAP);
        SelectFinalidadTecnologiaSaludAP.innerHTML = '';
        // Opción por defecto
        const defaultOption5 = document.createElement('option');
        defaultOption5.textContent = 'Seleccione una finalidad técnica de salud';
        defaultOption5.value = '';
        SelectFinalidadTecnologiaSaludAP.appendChild(defaultOption5);
        // Ordenar el array por el nombre de la finalidad técnica de salud
        CargarFinalidadTecnologiaSaludAP.sort((a, b) => {
            if (a['NombreRIPSFinalidadConsultaVersion2'] < b['NombreRIPSFinalidadConsultaVersion2']) return -1;
            if (a['NombreRIPSFinalidadConsultaVersion2'] > b['NombreRIPSFinalidadConsultaVersion2']) return 1;
            return 0;
        });
        for (let i = 0; i < CargarFinalidadTecnologiaSaludAP.length; i++) {
            const option = document.createElement('option');
            option.value = CargarFinalidadTecnologiaSaludAP[i]['Codigo'];
            option.textContent = CargarFinalidadTecnologiaSaludAP[i]['NombreRIPSFinalidadConsultaVersion2'];
            SelectFinalidadTecnologiaSaludAP.appendChild(option);
        }

        // Funcionalidad para el llenado del select Procedimiento AP 1
        const TipoProcedimientoAP1 = "AP";
        const ProcedimientoAP1 = await fetch(`http://${servidor}:3000/api/Cups/${TipoProcedimientoAP1}`);
        if (!ProcedimientoAP1) {
            throw new Error(`Error al obtener los procedimientos AP 1: ${ProcedimientoAP1.statusText}`);
        }
        const CargarProcedimientoAP1 = await ProcedimientoAP1.json();
        // console.log('Procedimientos AP 1: ', CargarProcedimientoAP1);
        SelectProcedimientoRIPSAP1.innerHTML = '';
        // Opción por defecto
        const defaultOption6 = document.createElement('option');
        defaultOption6.textContent = 'Seleccione un procedimiento AP 1';
        defaultOption6.value = '';
        SelectProcedimientoRIPSAP1.appendChild(defaultOption6);
        // Ordenar el array por el nombre del procedimiento
        CargarProcedimientoAP1.sort((a, b) => {
            if (a['Nombre'] < b['Nombre']) return -1;
            if (a['Nombre'] > b['Nombre']) return 1;
            return 0;
        });
        for (let i = 0; i < CargarProcedimientoAP1.length; i++) {
            const option = document.createElement('option');
            option.value = CargarProcedimientoAP1[i].Codigo;
            option.textContent = CargarProcedimientoAP1[i].Codigo + ' - ' + CargarProcedimientoAP1[i].Nombre;
            SelectProcedimientoRIPSAP1.appendChild(option);
        }

        // Funcionalidad para el llenado del select Procedimiento AP 2
        const TipoProcedimientoAP2 = "AP";
        const ProcedimientoAP2 = await fetch(`http://${servidor}:3000/api/Cups/${TipoProcedimientoAP2}`);
        if (!ProcedimientoAP2) {
            throw new Error(`Error al obtener los procedimientos AP 2: ${ProcedimientoAP2.statusText}`);
        }
        const CargarProcedimientoAP2 = await ProcedimientoAP2.json();
        // console.log('Procedimientos AP 2: ', CargarProcedimientoAP2);
        SelectProcedimientoRIPSAP2.innerHTML = '';
        // Opción por defecto
        const defaultOption7 = document.createElement('option');
        defaultOption7.textContent = 'Seleccione un procedimiento AP 2';
        defaultOption7.value = '';
        SelectProcedimientoRIPSAP2.appendChild(defaultOption7);
        // Ordenar el array por el nombre del procedimiento
        CargarProcedimientoAP2.sort((a, b) => {
            if (a['Nombre'] < b['Nombre']) return -1;
            if (a['Nombre'] > b['Nombre']) return 1;
            return 0;
        });
        for (let i = 0; i < CargarProcedimientoAP2.length; i++) {
            const option = document.createElement('option');
            option.value = CargarProcedimientoAP2[i].Codigo;
            option.textContent = CargarProcedimientoAP2[i].Codigo + ' - ' + CargarProcedimientoAP2[i].Nombre;
            SelectProcedimientoRIPSAP2.appendChild(option);
        }

        // Funcionalidad para el llenado del Select Diagnostico AP 1
        const DiagnosticoAP1 = await fetch(`http://${servidor}:3000/api/Cie`);
        if (!DiagnosticoAP1) {
            throw new Error(`Error al obtener los diagnósticos AP 1: ${DiagnosticoAP1.statusText}`);
        }
        const CargarDiagnosticoAP1 = await DiagnosticoAP1.json();
        // console.log('Diagnósticos AP 1: ', CargarDiagnosticoAP1);
        SelectDiagnosticoRIPSAP1.innerHTML = '';
        // Opción por defecto
        const defaultOption8 = document.createElement('option');
        defaultOption8.textContent = 'Seleccione un diagnóstico AP 1';
        defaultOption8.value = '';
        SelectDiagnosticoRIPSAP1.appendChild(defaultOption8);
        // Ordenar el array por el nombre del diagnóstico
        CargarDiagnosticoAP1.sort((a, b) => {
            if (a['Nombre'] < b['Nombre']) return -1;
            if (a['Nombre'] > b['Nombre']) return 1;
            return 0;
        });
        for (let i = 0; i < CargarDiagnosticoAP1.length; i++) {
            const option = document.createElement('option');
            option.value = CargarDiagnosticoAP1[i].Codigo;
            option.textContent = CargarDiagnosticoAP1[i].Codigo + ' - ' + CargarDiagnosticoAP1[i].Nombre;
            SelectDiagnosticoRIPSAP1.appendChild(option);
        }

        // Funcionalidad para el llenado del Select Diagnostico AP 2
        const DiagnosticoAP2 = await fetch(`http://${servidor}:3000/api/Cie`);
        if (!DiagnosticoAP2) {
            throw new Error(`Error al obtener los diagnósticos AP 1: ${DiagnosticoAP2.statusText}`);
        }
        const CargarDiagnosticoAP2 = await DiagnosticoAP2.json();
        // console.log('Diagnósticos AP 1: ', CargarDiagnosticoAP2);
        SelectDiagnosticoRIPSAP2.innerHTML = '';
        // Opción por defecto
        const defaultOption9 = document.createElement('option');
        defaultOption9.textContent = 'Seleccione un diagnóstico AP 2';
        defaultOption9.value = '';
        SelectDiagnosticoRIPSAP2.appendChild(defaultOption9);
        // Ordenar el array por el nombre del diagnóstico
        CargarDiagnosticoAP2.sort((a, b) => {
            if (a['Nombre'] < b['Nombre']) return -1;
            if (a['Nombre'] > b['Nombre']) return 1;
            return 0;
        });
        for (let i = 0; i < CargarDiagnosticoAP2.length; i++) {
            const option = document.createElement('option');
            option.value = CargarDiagnosticoAP2[i].Codigo;
            option.textContent = CargarDiagnosticoAP2[i].Codigo + ' - ' + CargarDiagnosticoAP2[i].Nombre;
            SelectDiagnosticoRIPSAP2.appendChild(option);
        }
    }
    // if (radioAP.checked) {

    //     procedimientoRIPS.textContent = 'codProcedimiento'; // Asignar el valor deseado
    //     causaViaIngreso.textContent = 'viaIngresoServicioSalud';
    //     listaCausa.style.display = 'none'
    //     listaViaIngreso.style.display = 'block'
    //     codDiagnosticoRelacionado.textContent = 'codDiagnosticoRelacionado'
    //     codDiagnosticoRelacionado2.textContent = 'codComplicación'
    //     codDiagnosticoRelacionado3.style.display = 'none'
    //     tipoDiagnosticoPrincipal.style.display = 'none'

    //     ejecutarConsultasAP();
    // }
});

const SelectEntidadAP = document.getElementById('SelectEntidadAP');
const TipoUsuarioRIPSAP = document.getElementById('SelectTipoUsurioRIPSAP');

TipoUsuarioRIPSAP.addEventListener('change', async function (e) {
    // Funcionalidad para el llenado del select entidad de rips ap
    const EntidadesAP = await fetch(`http://${servidor}:3000/api/Entidad/${this.value}`);
    if (!EntidadesAP) {
        throw new Error(`Error al obtener las entidades de RIPS: ${EntidadesAP.statusText}`);
    }
    const CargarEntidadesAP = await EntidadesAP.json();
    // console.log('Entidades de RIPS AP: ', CargarEntidadesAP);
    SelectEntidadAP.innerHTML = '';
    // Opción por defecto
    const defaultOption = document.createElement('option');
    defaultOption.textContent = 'Seleccione una entidad';
    defaultOption.value = '';
    SelectEntidadAP.appendChild(defaultOption);
    // Ordenar el array por el nombre de la entidad
    CargarEntidadesAP.sort((a, b) => {
        if (a['NombreCompletoPaciente'] < b['NombreCompletoPaciente']) return -1;
        if (a['NombreCompletoPaciente'] > b['NombreCompletoPaciente']) return 1;
        return 0;
    });
    for (let i = 0; i < CargarEntidadesAP.length; i++) {
        const option = document.createElement('option');
        option.value = CargarEntidadesAP[i]['DocumentoEntidad'];
        option.textContent = CargarEntidadesAP[i]['NombreCompletoPaciente'];
        SelectEntidadAP.appendChild(option);
    }
})

const GrupoServicioAP = document.getElementById('SelectGrupoServiciosAP');
const SelectServicioAP = document.getElementById('SelectServicioAP');
GrupoServicioAP.addEventListener('change', async function (e) {
    // Funcionalidad para el llenado del select servicio de rips ap
    const ServiciosAP = await fetch(`http://${servidor}:3000/api/Servicios/${this.value}`);
    if (!ServiciosAP) {
        throw new Error(`Error al obtener los servicios de RIPS: ${ServiciosAP.statusText}`);
    }
    const CargarServiciosAP = await ServiciosAP.json();
    // console.log('Servicios de RIPS AP: ', CargarServiciosAP);
    SelectServicioAP.innerHTML = '';
    // Opción por defecto
    const defaultOption2 = document.createElement('option');
    defaultOption2.textContent = 'Seleccione un servicio';
    defaultOption2.value = '';
    SelectServicioAP.appendChild(defaultOption2);
    // Ordenar el array por el nombre del servicio
    CargarServiciosAP.sort((a, b) => {
        if (a['Nombre Servicios'] < b['Nombre Servicios']) return -1;
        if (a['Nombre Servicios'] > b['Nombre Servicios']) return 1;
        return 0;
    });
    for (let i = 0; i < CargarServiciosAP.length; i++) {
        const option2 = document.createElement('option');
        option2.value = CargarServiciosAP[i]['Id Servicios'];
        option2.textContent = CargarServiciosAP[i]['Nombre Servicios'];
        SelectServicioAP.appendChild(option2);
    }
})
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const btnRegistrarRIPS = document.getElementById('btnRegistrarRIPS');
const selectHistoriaClinica = document.getElementById('listaHC');
const listaTipoUsuario = document.getElementById('listaTipoUsuario');
const listaEntidad = document.getElementById('listaEntidad');
const listaCodConsulta = document.getElementById('listaCodConsulta');
const listamodalidadAtencion = document.getElementById('listamodalidadAtencion');
const listaGrupoServicios = document.getElementById('listaGrupoServicios');
const listaServicios = document.getElementById('listaServicios');
const listaFinalidad = document.getElementById('listaFinalidad');
const listaTipoDiagnostico = document.getElementById('listaTipoDiagnostico');
// LISTA VIA INGRESO Y LISTA CAUSA YA ESTAN DEFINIDAS ARRIBA POR ESO NO APARECEN ACÁ

// const pruebaAlert = async () => {
//     const swalWithBootstrapButtons = Swal.mixin({
//         customClass: {
//             cancelButton: "btn btn-danger",
//             confirmButton: "btn btn-success"

//         },
//         buttonsStyling: false
//     });
//     swalWithBootstrapButtons.fire({
//         title: "¿Esta seguro de querer asignar el RIPS a la paciente?",
//         text: "You won't be able to revert this!",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonText: "Yes, delete it!",
//         cancelButtonText: "No, cancel!",
//         reverseButtons: true
//     }).then((result) => {
//         if (result.isConfirmed) {
//             swalWithBootstrapButtons.fire({
//                 title: "Deleted!",
//                 text: "Your file has been deleted.",
//                 icon: "success"
//             });
//         } else if (
//             /* Read more about handling dismissals below */
//             result.dismiss === Swal.DismissReason.cancel
//         ) {
//             swalWithBootstrapButtons.fire({
//                 title: "Cancelled",
//                 text: "Your imaginary file is safe :)",
//                 icon: "error"
//             });
//         }
//     });
// }

const pruebaAlert = async () => {
    const selectHistoriaClinica = document.querySelector('#listaHC');
    const opcionSeleccionada = selectHistoriaClinica.options[selectHistoriaClinica.selectedIndex].text;

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            cancelButton: "btn btn-danger",
            confirmButton: "btn btn-success"
        },
        buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
        title: "¿Está seguro de querer asignar el RIPS a la paciente?",
        text: `Está a punto de asignar el RIPS a la paciente: ${opcionSeleccionada}. ¿Desea continuar?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, asignarlo",
        cancelButtonText: "No, cancelar",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // Lógica si el usuario confirma
            RegistrarRIPS().then(() => {
                swalWithBootstrapButtons.fire({
                    title: "Asignado",
                    text: `El RIPS ha sido asignado a la paciente: ${opcionSeleccionada}`,
                    icon: "success"
                });
            }).catch(error => {
                // Manejar cualquier error que ocurra durante la ejecución de RegistrarRIPS()
                swalWithBootstrapButtons.fire({
                    title: "Error",
                    text: "Ha ocurrido un error al asignar el RIPS.",
                    icon: "error"
                });
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            // Lógica si el usuario cancela
            swalWithBootstrapButtons.fire({
                title: "Cancelado",
                text: "La asignación del RIPS ha sido cancelada",
                icon: "error"
            });
        }
    });
};

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//  FUNCIÓN PARA ASIGNAR RIPS A LAS HISTORIAS
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const AsignarRIPS = async () => {

    const HistoriasSinRIPS = document.getElementById('HistoriasSinRIPS');

    // Validar si hay una historia seleccionada correctamente
    const historiaValida = HistoriasSinRIPS.value !== "" && HistoriasSinRIPS.value !== "Sin Seleccionar";

    // Validar qué radio está seleccionado
    if (historiaValida && radioAP.checked) {
        // console.log("PREPARANDO PARA RIPS AP");
        console.log('%cAsignando RIPS de tipo AP...', 'color: blue; font-size: 16px;');
        // Lógica para realizar la petición al API para asignar el RIPS AP
        const IdEvaluacionRIPSAP = document.getElementById("HistoriasSinRIPS").value;
        const TipoUsuarioRIPSAP = document.getElementById("SelectTipoUsurioRIPSAP").value;
        const EntidadRIPSAP = document.getElementById("SelectEntidadAP").value;
        const ViaIngresoServicioSaludRIPSAP = document.getElementById("SelectViaIngresoServicioSaludAP").value;
        const ModalidadGrupoServicioTecSalRIPSAP = document.getElementById("SelectModalidadGrupoServicioTecSalAP").value;
        const GrupoServiciosRIPSAP = document.getElementById("SelectGrupoServiciosAP").value;
        const CodServicioRIPSAP = document.getElementById("SelectServicioAP").value;
        const FinalidadTecnologiaSaludRIPSAP = document.getElementById("SelectFinalidadTecnologiaSaludAP").value;
        const CausaMotivoAtencionRIPSAP = "0"; // VACÍO PARA RIPS AP
        const TipoDiagnosticoPrincipalRIPSAP = "0"; // VACÍO PARA RIPS AP
        const Cups1RIPSAP = document.getElementById("SelectProcedimientoRIPSAP1").value;
        let Cups2RIPSAP = document.getElementById("SelectProcedimientoRIPSAP2").value;
        const Cie1RIPSAP = document.getElementById("SelectDiagnosticoRIPSAP1").value;
        let Cie2RIPSAP = document.getElementById("SelectDiagnosticoRIPSAP2").value;
        const TipoRipsRIPSAP = "AP";

        // Logica para campos vacíos
        let RIPSAPCAMPOSVACIOS = [];
        if (!TipoUsuarioRIPSAP) RIPSAPCAMPOSVACIOS.push("Tipo de usuario.");
        if (!EntidadRIPSAP || EntidadRIPSAP === "" || EntidadRIPSAP === "Sin Seleccionar") RIPSAPCAMPOSVACIOS.push("Entidad.");
        if (!ViaIngresoServicioSaludRIPSAP) RIPSAPCAMPOSVACIOS.push("Vía de ingreso al servicio de salud.");
        if (!ModalidadGrupoServicioTecSalRIPSAP) RIPSAPCAMPOSVACIOS.push("Modalidad de grupo de servicios técnico salud.");
        if (!GrupoServiciosRIPSAP) RIPSAPCAMPOSVACIOS.push("Grupo servicios.");
        if (!CodServicioRIPSAP || CodServicioRIPSAP === "" || CodServicioRIPSAP === "Sin Seleccionar") RIPSAPCAMPOSVACIOS.push("Código de servicio.");
        if (!FinalidadTecnologiaSaludRIPSAP) RIPSAPCAMPOSVACIOS.push("Finalidad técnica de salud.");
        if (!Cups1RIPSAP) RIPSAPCAMPOSVACIOS.push("Procedimiento RIPS");
        if (!Cie1RIPSAP) RIPSAPCAMPOSVACIOS.push("Diagnóstico RIPS");

        if (RIPSAPCAMPOSVACIOS.length > 0) {
            Swal.fire({
                icon: 'warning',
                html: `
                <h4 style="color: #ffffff"><b> Los siguientes campos son obligatorios: </b></h4>
                <br>
                <ul style="text-align: left;">
                ${RIPSAPCAMPOSVACIOS
                .map((campo) => `<li style="color: #ffffff"> ${campo}</li>`)
                .join("")}
                </ul>
            `,
            allowOutsideClick: false,
            allowEscapeKey: false,
            })

            return;
        }else {
            // Vamossfsdf
            let InformacionParaRIPSAP = {
                "Id de historia clinica": IdEvaluacionRIPSAP,
                "Tipo de usuario": TipoUsuarioRIPSAP,
                "Entidad": EntidadRIPSAP,
                "Modalidad de grupo de servicios técnico salud": ModalidadGrupoServicioTecSalRIPSAP,
                "Grupo servicios": GrupoServiciosRIPSAP,
                "Código de servicio": CodServicioRIPSAP,
                "Finalidad tecnología salud": FinalidadTecnologiaSaludRIPSAP,
                "Causa motivo atención": CausaMotivoAtencionRIPSAP,
                "Tipo diagnóstico principal": TipoDiagnosticoPrincipalRIPSAP,
                "Via ingreso servicio salud": ViaIngresoServicioSaludRIPSAP,
                "Procedimiento1 RIPS": Cups1RIPSAP,
                "Procedimiento2 RIPS": Cups2RIPSAP,
                "Diagnóstico1 RIPS": Cie1RIPSAP,
                "Diagnóstico2 RIPS": Cie2RIPSAP,
                "Tipo de RIPS": TipoRipsRIPSAP,
            }

            // console.log(InformacionParaRIPSAP);
            if (Cups2RIPSAP === "") {
                Cups2RIPSAP = "0";
            }
            if (Cie2RIPSAP === "" ) {
                Cie2RIPSAP = "0";
            }


            const AsignarRIPSAP = await fetch(`http://${servidor}:3000/api/RegistrarRips/${IdEvaluacionRIPSAP}/${TipoUsuarioRIPSAP}/${EntidadRIPSAP}/${ModalidadGrupoServicioTecSalRIPSAP}/${GrupoServiciosRIPSAP}/
                ${CodServicioRIPSAP}/${FinalidadTecnologiaSaludRIPSAP}/${CausaMotivoAtencionRIPSAP}/${TipoDiagnosticoPrincipalRIPSAP}/${ViaIngresoServicioSaludRIPSAP}/${Cups1RIPSAP}/${Cups2RIPSAP}/${Cie1RIPSAP}/
                ${Cie2RIPSAP}/${TipoRipsRIPSAP}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            if (!AsignarRIPSAP) {
                throw new Error(`Error al obtener las entidades de RIPS: ${AsignarRIPSAP.statusText}`);
            }
            const CargarAsignarRIPSAP = await AsignarRIPSAP.json();
            // console.log('Entidades de RIPS AP: ', CargarAsignarRIPSAP);
            console.log(`%cRIPS AP asignado correctamente!`, 'color: green; font-size: 16px;');
            Swal.fire({
                icon: 'success',
                html: `
                    <span style="color: #FFFFFF;">El RIPS ha sido asignado correctamente a la historia clínica con ID: ${IdEvaluacionRIPSAP}</span>
                `,
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(
                function(respuesta) {
                    LlenarSelectDeHistoriasClinicas();
                }
            )
        }
    } else if (historiaValida && radioAC.checked) {
        // console.log("PREPARANDO PARA RIPS AC");
        console.log('%cAsignando RIPS de tipo AC...', 'color: blue; font-size: 16px;');
        const IdEvaluacionRIPSAC = document.getElementById("HistoriasSinRIPS").value; // Select que tiene las historias clinicas del paciente sin RIPS
        const SelectTipoUsuarioRIPSAC = document.getElementById("SelectTipoUsuarioRIPS").value; 
        const SelectEntidadAC = document.getElementById("SelectEntidad").value;
        const SelectModalidadGrupoServicioTecnologiaSaludAC = document.getElementById("SelectModalidadGrupoServicioTecnologiaSalud").value;
        const SelectGrupoServiciosAC = document.getElementById("SelectGrupoServiciosAC").value;
        const SelectServiciosAC = document.getElementById("SelectServiciosAC").value;
        const SelectFinalidadTecnologiaSaludAC = document.getElementById("SelectFinalidadTecnologiaSaludAC").value;
        const SelectCausaMotivoAtencion = document.getElementById("SelectCausaMotivoAtencion").value;
        const SelectTipoDiagnosticoPrincipalAC = document.getElementById("SelectTipoDiagnosticoPrincipalAC").value;
        const SelectConsultaRIPSAC1 = document.getElementById("SelectConsultaRIPSAC1").value;
        let SelectConsultaRIPSAC2 = document.getElementById("SelectConsultaRIPSAC2").value;
        const SelectDiagnosticoRIPSAC1 = document.getElementById("SelectDiagnosticoRIPSAC1").value;
        let SelectDiagnosticoRIPSAC2 = document.getElementById("SelectDiagnosticoRIPSAC2").value;
        const TipoRipsRIPSAC = "AC";
        const ViaIngresoAC = "0";

        let ValoresCapturados = {
            "Id de historia clinica": IdEvaluacionRIPSAC,
            "Tipo de usuario": SelectTipoUsuarioRIPSAC,
            "Entidad": SelectEntidadAC,
            "Modalidad de grupo de servicios técnico salud": SelectModalidadGrupoServicioTecnologiaSaludAC,
            "Grupo servicios": SelectGrupoServiciosAC,
            "Servicio": SelectServiciosAC,
            "Finalidad técnica de salud": SelectFinalidadTecnologiaSaludAC,
            "Causa motivo atención": SelectCausaMotivoAtencion,
            "Tipo diagnóstico principal": SelectTipoDiagnosticoPrincipalAC,
            "Consulta1 RIPS": SelectConsultaRIPSAC1,
            "Consulta2 RIPS": SelectConsultaRIPSAC2,
            "Diagnóstico1 RIPS": SelectDiagnosticoRIPSAC1,
            "Diagnóstico2 RIPS": SelectDiagnosticoRIPSAC2,
        }

        let CamposSinLlenar = [];
        if (!SelectTipoUsuarioRIPSAC) CamposSinLlenar.push("Tipo de usuario.");
        if (!SelectEntidadAC || SelectEntidadAC === "" || SelectEntidadAC === "Sin Seleccionar") CamposSinLlenar.push("Entidad.");
        if (!SelectModalidadGrupoServicioTecnologiaSaludAC) CamposSinLlenar.push("Modalidad de grupo servicio de salud.");
        if (!SelectGrupoServiciosAC) CamposSinLlenar.push("Grupo servicios.");
        if (!SelectServiciosAC || SelectServiciosAC === "" || SelectServiciosAC === "Sin Seleccionar") CamposSinLlenar.push("Servicio.");
        if (!SelectFinalidadTecnologiaSaludAC) CamposSinLlenar.push("Finalidad técnica de salud.");
        if (!SelectCausaMotivoAtencion) CamposSinLlenar.push("Causa motivo de atención.");
        if (!SelectTipoDiagnosticoPrincipalAC) CamposSinLlenar.push("Tipo diagnostico principal");
        if (!SelectConsultaRIPSAC1) CamposSinLlenar.push("Consulta RIPS.");
        if (!SelectDiagnosticoRIPSAC1) CamposSinLlenar.push("Diagnóstico RIPS.");

        if (CamposSinLlenar.length > 0) {
            Swal.fire({
                icon: 'warning',
                html: `
                    <h4 style="color: #ffffff"><b> Los siguientes campos son obligatorios: </b></h4>
                    <br>
                    <ul style="text-align: left;">
                    ${CamposSinLlenar
                    .map((campo) => `<li style="color: #ffffff"> ${campo}</li>`)
                    .join("")}
                    </ul>
                `,
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
            return;
        } else {
            // console.log(ValoresCapturados);
            if (!SelectConsultaRIPSAC2) {
                SelectConsultaRIPSAC2 = "0";
            }
            if (!SelectDiagnosticoRIPSAC2) {
                SelectDiagnosticoRIPSAC2 = "0";
            }
            const AsignarRIPSAC = await fetch(`http://${servidor}:3000/api/RegistrarRips/${IdEvaluacionRIPSAC}/${SelectTipoUsuarioRIPSAC}/${SelectEntidadAC}/${SelectModalidadGrupoServicioTecnologiaSaludAC}/
                ${SelectGrupoServiciosAC}/${SelectServiciosAC}/${SelectFinalidadTecnologiaSaludAC}/${SelectCausaMotivoAtencion}/${SelectTipoDiagnosticoPrincipalAC}/${ViaIngresoAC}/${SelectConsultaRIPSAC1}/${SelectConsultaRIPSAC2}/
                ${SelectDiagnosticoRIPSAC1}/${SelectDiagnosticoRIPSAC2}/${TipoRipsRIPSAC}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!AsignarRIPSAC) {
                throw new Error(`Error al obtener las entidades de RIPS: ${AsignarRIPSAC.statusText}`);
            }
            const CargarAsignarRIPSAC = await AsignarRIPSAC.json();
            // console.log('Entidades de RIPS AC: ', CargarAsignarRIPSAC);
            console.log(`%cRIPS AC asignado correctamente!`, 'color: green; font-size: 16px;');
            
            Swal.fire({
                icon: 'success',
                html: `
                    <span style="color: #FFFFFF;">El RIPS ha sido asignado correctamente a la historia clínica con ID: ${IdEvaluacionRIPSAC}</span>
                `,
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(
                function(respuesta) {
                    LlenarSelectDeHistoriasClinicas();
                }
            )
        }
    } else {
        Swal.fire({
            icon: 'warning',
            html: `
                <span style="color: #FFFFFF;">Debes seleccionar una historia clínica y el tipo de RIPS [ AC ó AP ], para poder asignar el RIPS correctamente.</span>
            `,
            allowOutsideClick: false,
            allowEscapeKey: false,
        });
        return;
    }
}

btnRegistrarRIPS.addEventListener('click', async () => {
    // pruebaAlert();
    AsignarRIPS();

});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


// FUNCIONALIDAD PARA LAS HISTORIAS QUE SE ALMACENAN SIN RIPS
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
async function NoAsignarRIPS() {

    const HistoriasSinRIPS = document.getElementById('HistoriasSinRIPS');
    const TextoOpcionSeleccionada = HistoriasSinRIPS.options[HistoriasSinRIPS.selectedIndex].textContent;
    const NombreDelPaciente = document.getElementById('NombrePaciente');

    if (HistoriasSinRIPS.value === "" || HistoriasSinRIPS.value === "Sin Seleccionar") {
        Swal.fire({
            icon: 'info',
            html: `
                <span style="color: #fff">Primero debes seleccionar una historia</span>
            `,
            allowOutsideClick: false,
            allowEscapeKey: false,
        })
    }else {
        Swal.fire({
            icon: 'question',
            html: `
                <span style="color: #fff">¿Realmente deseas guardar esta historia sin asginarle ningún RIPS?</span>
                <br><br>
                <ul style="text-align: left;">
                    <li style="color: #ffffff">Nombre Paciente: ${NombreDelPaciente.value}</li>
                    <br>
                    <li style="color: #ffffff">Historia: ${TextoOpcionSeleccionada}</li>
                    <br>
                    <li style="color: #ffffff">Id Historia: ${HistoriasSinRIPS.value}</li>
                </ul>
            `,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCancelButton: true,
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar",            
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",            
        }).then(async function(Respuesta) {
            if (Respuesta.isConfirmed) {
                console.log("Se confirmó");
                const GuardarSinRIPS = await fetch(`http://${servidor}:3000/api/TieneRips/${HistoriasSinRIPS.value}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log(HistoriasSinRIPS.value);
                if (!GuardarSinRIPS.ok) {
                    throw new Error(`Error al obtener los datos de evaluaciones: ${GuardarSinRIPS.statusText}`);
                }

                const datosEvaluaciones = await GuardarSinRIPS.json();
                console.log('Datos de evaluaciones: ', datosEvaluaciones);

                Swal.fire({
                    icon: "success",
                    html: `
                        <span style="color: #fff;">Historia sin RIPS guardada correctamente</span>
                    `,
                    showConfirmButton: false,
                    timer: 2000
                }).then(function() {
                    LlenarSelectDeHistoriasClinicas();
                })
            }
        })
    }
}

const BtnNoRegistrarRIPS = document.getElementById('BtnNoRegistrarRIPS');
BtnNoRegistrarRIPS.addEventListener('click', async () => {
    NoAsignarRIPS();
})
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const RegistrarRIPS = async () => {
    
    if (selectHistoriaClinica.value === 'Sin Seleccionar') {
        const mensaje = `<span style="color: #fff">Seleccione una historia clinica por favor</span>`
        Swal.fire({
            title: "Campo faltante",
            html: mensaje,
            icon: "question"
        });
        return
    } else {
        if (radioAC.checked) {


            if (listaTipoUsuario.value == 'Sin Seleccionar' || listaEntidad.value == 'Sin Seleccionar' || listaCodConsulta.value == 'Sin Seleccionar' || listamodalidadAtencion.value == 'Sin Seleccionar' || listaGrupoServicios.value == 'Sin Seleccionar' || listaServicios.value == 'Sin Seleccionar' || listaFinalidad.value == 'Sin Seleccionar' || listaCausa.value == 'Sin Seleccionar' || listaTipoDiagnostico.value == 'Sin Seleccionar') {
                // Array para almacenar los nombres de los campos que faltan
                let camposFaltantes = [];

                // Verificar cada campo y agregarlo al array si falta por llenar
                if (listaTipoUsuario.value == 'Sin Seleccionar') {
                    camposFaltantes.push('Tipo de Usuario');
                    listaTipoUsuario.classList.add('campo-faltante');

                }
                if (listaEntidad.value == 'Sin Seleccionar') {
                    camposFaltantes.push('Entidad');
                    listaEntidad.classList.add('campo-faltante');

                }
                if (listaCodConsulta.value == 'Sin Seleccionar') {
                    camposFaltantes.push('Código de Consulta');
                    listaCodConsulta.classList.add('campo-faltante');

                }
                if (listamodalidadAtencion.value == 'Sin Seleccionar') {
                    camposFaltantes.push('Modalidad de Atención');
                    listamodalidadAtencion.classList.add('campo-faltante');

                }
                if (listaGrupoServicios.value == 'Sin Seleccionar') {
                    camposFaltantes.push('Grupo de Servicios');
                    listaGrupoServicios.classList.add('campo-faltante');

                }
                if (listaServicios.value == 'Sin Seleccionar') {
                    camposFaltantes.push('Servicios');
                    listaServicios.classList.add('campo-faltante');

                }
                if (listaFinalidad.value == 'Sin Seleccionar') {
                    camposFaltantes.push('Finalidad');
                    listaFinalidad.classList.add('campo-faltante');

                }
                if (listaCausa.value == 'Sin Seleccionar') {
                    camposFaltantes.push('Causa');
                    listaCausa.classList.add('campo-faltante');

                }
                if (listaTipoDiagnostico.value == 'Sin Seleccionar') {
                    camposFaltantes.push('Tipo de Diagnóstico');
                    listaTipoDiagnostico.classList.add('campo-faltante');

                }

                // Construir el mensaje del alert
                let mensaje = `<span style="color: #fff">Seleccione los siguientes campos obligatorios: <br></span><br>`;
                camposFaltantes.forEach(campo => {
                    mensaje += `<span style="color: #fff;">- ${campo}</span><br>`;
                });

                Swal.fire({
                    icon: "error",
                    title: "Faltan campos obligatorios por seleccionar",
                    html: mensaje,
                });
                return;
            } else {
                insertarRIPSHC('AC');
            }
        }


        if (radioAP.checked) {

            if (listaTipoUsuario.value == 'Sin Seleccionar' || listaEntidad.value == 'Sin Seleccionar' || listaCodConsulta.value == 'Sin Seleccionar' || listamodalidadAtencion.value == 'Sin Seleccionar' || listaGrupoServicios.value == 'Sin Seleccionar' || listaServicios.value == 'Sin Seleccionar' || listaFinalidad.value == 'Sin Seleccionar' || listaViaIngreso.value == 'Sin Seleccionar') {
                camposVaciosAP = []

                if (listaTipoUsuario.value == 'Sin Seleccionar') {
                    camposVaciosAP.push('Tipo Usuario')
                    listamodalidadAtencion.classList.add('campo-faltante');

                }

                if (listaEntidad.value == 'Sin Seleccionar') {
                    camposVaciosAP.push('Tipo Entidad')
                    listamodalidadAtencion.classList.add('campo-faltante');

                }

                if (listaCodConsulta.value == 'Sin Seleccionar') {
                    camposVaciosAP.push('Tipo Usuario')
                    listamodalidadAtencion.classList.add('campo-faltante');

                }

                if (listamodalidadAtencion.value == 'Sin Seleccionar') {
                    camposVaciosAP.push('Modalidad de atención')
                    listamodalidadAtencion.classList.add('campo-faltante');

                }

                if (listaGrupoServicios.value == 'Sin Seleccionar') {
                    camposVaciosAP.push('Grupo Servicios')
                    listamodalidadAtencion.classList.add('campo-faltante');
                }

                if (listaServicios.value == 'Sin Seleccionar') {
                    camposVaciosAP.push('Cod Servicios')
                    listamodalidadAtencion.classList.add('campo-faltante');
                }

                if (listaFinalidad.value == 'Sin Seleccionar') {
                    camposVaciosAP.push('Lista Finalidad')
                    listamodalidadAtencion.classList.add('campo-faltante');
                }

                if (listaViaIngreso.value == 'Sin Seleccionar') {
                    camposVaciosAP.push('Via ingreso')
                }

                // Construir el mensaje del alert
                let mensajeAP = `<span style="color: #fff">Seleccione los siguientes campos obligatorios: <br></span><br>`;
                camposFaltantes.forEach(campo => {
                    mensajeAP += `<span style="color: #fff;">- ${campo}</span><br>`;
                });

                Swal.fire({
                    icon: "error",
                    title: "Faltan campos obligatorios por seleccionar",
                    html: mensajeAP,
                });

            } else {
                insertarRIPSHC('AP');
            }


        }
    }
}

// 
// listaTipoUsuario.addEventListener('change', quitarBordeRojo);
// listaEntidad.addEventListener('change', quitarBordeRojo);
// listaCodConsulta.addEventListener('change', quitarBordeRojo);
// listamodalidadAtencion.addEventListener('change', quitarBordeRojo);
// listaGrupoServicios.addEventListener('change', quitarBordeRojo);
// listaServicios.addEventListener('change', quitarBordeRojo);
// listaFinalidad.addEventListener('change', quitarBordeRojo);
// listaCausa.addEventListener('change', quitarBordeRojo);
// listaViaIngreso.addEventListener('change', quitarBordeRojo);


// Función para quitar el borde rojo
function quitarBordeRojo(event) {
    event.target.classList.remove('campo-faltante');
}


const insertarRIPSHC = async (tipoInsertar) => {

    const listaTipoUsuario = document.getElementById('listaTipoUsuario')
    const listaEntidad = document.getElementById('listaEntidad')
    const listaCodConsulta = document.getElementById('listaCodConsulta')
    const listamodalidadAtencion = document.getElementById('listamodalidadAtencion')
    const listaGrupoServicios = document.getElementById('listaGrupoServicios')
    const listaServicios = document.getElementById('listaServicios')
    const listaFinalidad = document.getElementById('listaFinalidad')
    const listaCausa = document.getElementById('listaCausa')
    const listaViaIngreso = document.getElementById('listaViaIngreso')
    const listaDiagPrincipal = document.getElementById('listaDiagPrincipal')
    const listaDiagPrincipal1 = document.getElementById('listaDiagPrincipal1')
    const listaDiagPrincipal2 = document.getElementById('listaDiagPrincipal2')
    const listaDiagPrincipal3 = document.getElementById('listaDiagPrincipal3')
    const listaTipoDiagnostico = document.getElementById('listaTipoDiagnostico')

    const opcionListaHC = selectHistoriaClinica.value;
    const opcionListaTipoUsuario = listaTipoUsuario.value;
    const opcionDocumentoEntidad = listaEntidad.value;
    const opcionListaCodConsulta = listaCodConsulta.value;
    const opcionlistamodalidadAtencion = listamodalidadAtencion.value;
    const opcionListaGrupoServicios = listaGrupoServicios.value;
    const opcionListaServicios = listaServicios.value;
    const opcionListaFinalidad = listaFinalidad.value;
    const opcionListaCausa = listaCausa.value;
    const opcionListaViaIngreso = listaViaIngreso.value;
    const opcionListaDiagPrincipal = listaDiagPrincipal.value;
    const opcionListaDiagPrincipal1 = listaDiagPrincipal1.value;
    const opcionListaDiagPrincipal2 = listaDiagPrincipal2.value;
    const opcionListaDiagPrincipal3 = listaDiagPrincipal3.value;
    const opcionListaTipoDiagnostico = listaTipoDiagnostico.value;

    try {
        const response = await fetch(`http://${servidor}:3000/api/insertarRIPS/${tipoInsertar}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ opcionListaHC, opcionListaCodConsulta, opcionListaTipoUsuario, opcionDocumentoEntidad, opcionlistamodalidadAtencion, opcionListaGrupoServicios, opcionListaServicios, opcionListaFinalidad, opcionListaCausa, opcionListaDiagPrincipal, opcionListaDiagPrincipal1, opcionListaDiagPrincipal2, opcionListaDiagPrincipal3, opcionListaTipoDiagnostico, opcionListaViaIngreso })
        });

        if (!response.ok) {
            throw new Error('Error en el insert');
            alert('Error al insertar')
        }

        const data = await response.text();
        alert(data); // Mensaje del servidor
    } catch (error) {
        console.error(error);
        alert('Error en el insert');
    }
}

async function ejecutarConsultasAC() {
    try {
        await getTipoUsuario();
        await getCodConsulta();
        await getmodalidadAtencion();
        await getGrupoServicios();
        await getServicios();
        await getFinalidadConsulta('Consulta');
        await getCausaExterna();
        await getCodDiganostico();
        await getTipoDiagnostico();
    } catch (error) {
        console.log('Error en la consulta que trae los AC');
        console.error(error);
    }
}

async function ejecutarConsultasAP() {
    try {
        await getTipoUsuario();
        await getCodConsulta();
        await getmodalidadAtencion();
        await getGrupoServicios();
        await getServicios();
        await getFinalidadConsulta('del Procedimiento');
        await getViaIngresoUsuario()
        await getCodDiganostico();

    } catch (error) {
        console.log('Error consulta que trae los AP');
        console.error(error);
    }
}

const updateEvaluacionesTablet = (evaluaciones) => {
    const selectHistoriaClinica = document.querySelector('#listaHC');
    selectHistoriaClinica.innerHTML = ""; // Limpiar opciones antiguas

    // Agregar opción "Sin Seleccionar" al principio
    const optionSinSeleccionar = document.createElement("option");
    optionSinSeleccionar.value = "Sin Seleccionar";
    optionSinSeleccionar.text = "Sin Seleccionar";
    selectHistoriaClinica.appendChild(optionSinSeleccionar);

    // Agregar opciones al select
    evaluaciones.forEach((evaluacion) => {
        const option = document.createElement("option");
        option.value = evaluacion.idEvaluacion;
        const fechaFormateada = new Date(evaluacion.fechaEvaluacion).toISOString().replace(/T/, ' ').replace(/\..+/, '');

        option.text = `${evaluacion.nombreUsuario} - documento: ${evaluacion.documentoUsuario} - Fecha: ${fechaFormateada} - ${evaluacion.nombreTipoEvaluacion}`;
        selectHistoriaClinica.appendChild(option);
    });
};

const getEvaluaciones = async (fechaInicio, fechaFin) => {
    try {
        const response = await fetch(`http://${servidor}:3000/api/evaluacionesRIPS/${fechaInicio}/${fechaFin}`);
        if (!response.ok) {
            throw new Error(`Error al obtener los datos de evaluaciones: ${response.statusText}`);
        }
        console.log(response);
        const evaluaciones = await response.json();

        updateEvaluacionesTablet(evaluaciones); // Llama a la función para actualizar la tabla

    } catch (ex) {
        Swal.fire({
            icon: "error",
            title: "Error",
            html: `
                <p><strong>Mensaje:</strong> ${ex.message}</p>
                <p><strong>Nombre:</strong> ${ex.name}</p>
                <p><strong>Pila:</strong> <pre>${ex.stack}</pre></p>
            `
        });
        console.error(ex);
        alert(`Error: ${ex.message}`);
    }
};

const updateTipoUsuario = (tipoUsuarios) => {
    const selectTipoUsuarios = document.querySelector('#listaTipoUsuario');
    selectTipoUsuarios.innerHTML = ""; // Limpiar opciones antiguas

    // Agregar opción "Sin Seleccionar" al principio
    const optionSinSeleccionar = document.createElement("option");
    optionSinSeleccionar.value = "Sin Seleccionar";
    optionSinSeleccionar.text = "Sin Seleccionar";
    selectTipoUsuarios.appendChild(optionSinSeleccionar);

    // Agregar opciones al select
    tipoUsuarios.forEach((tipoUsuario) => {
        const option = document.createElement("option");
        option.value = tipoUsuario.idTipoRips;
        option.text = `${tipoUsuario.descripcionTipoRips}`;
        selectTipoUsuarios.appendChild(option);
    });
};

const getTipoUsuario = async () => {
    try {
        const response = await fetch(`http://${servidor}:3000/api/tipoUsuario`);
        if (!response.ok) {
            throw new Error(`Error al obtener los datos de Tipo de Usuario: ${response.statusText}`);
        }

        const tipoUsuario = await response.json();
        updateTipoUsuario(tipoUsuario);
    } catch (ex) {
        console.error(ex);
        alert(`Error: ${ex.message}`);
    }
};

const selectTipoUsuario = document.getElementById('listaTipoUsuario');

// selectTipoUsuario.addEventListener('change', async () => {
//     const usuarioSeleecionado = selectTipoUsuario.options[selectTipoUsuario.selectedIndex].text;
//     await getTipoEntidad(usuarioSeleecionado)
//     console.log(usuarioSeleecionado);
// })

const updateTipoEntidad = (tipoEntidades) => {
    const selectTipoEntidad = document.querySelector('#listaEntidad');
    selectTipoEntidad.innerHTML = ""; // Limpiar opciones antiguas

    // Agregar opción "Sin Seleccionar" al principio
    const optionSinSeleccionar = document.createElement("option");
    optionSinSeleccionar.value = "Sin Seleccionar";
    optionSinSeleccionar.text = "Sin Seleccionar";
    selectTipoEntidad.appendChild(optionSinSeleccionar);

    // Agregar opciones al select
    tipoEntidades.forEach((tipoEntidad) => {
        const option = document.createElement("option");
        option.value = tipoEntidad.idEntidad;
        option.text = `${tipoEntidad.descripcionEntidad}`;
        selectTipoEntidad.appendChild(option);
    });
};

const getTipoEntidad = async (descripcionTipoRips) => {
    try {
        const response = await fetch(`http://${servidor}:3000/api/tipoEntidad/${descripcionTipoRips}`);
        if (!response.ok) {
            throw new Error(`Error al obtener los datos de Tipo de Entidad: ${response.statusText}`);
        }

        const tipoEntidad = await response.json();
        updateTipoEntidad(tipoEntidad);
    } catch (ex) {
        console.error(ex);
        alert(`Error: ${ex.message}`);
    }
};

const updateCodConsultaSelect = (codConsultas) => {
    const selectCodConsulta = document.querySelector('#listaCodConsulta');

    // Limpiar opciones antiguas
    selectCodConsulta.innerHTML = "";

    // Agregar opción "Sin Seleccionar" al principio
    const optionSinSeleccionar = document.createElement("option");
    optionSinSeleccionar.value = "Sin Seleccionar";
    optionSinSeleccionar.text = "Sin Seleccionar";
    selectCodConsulta.appendChild(optionSinSeleccionar);

    // Agregar opciones al select
    codConsultas.forEach((codConsulta) => {
        const option = document.createElement("option");
        option.value = codConsulta.codigoObjeto;
        option.text = `${codConsulta.codigoObjeto} - ${codConsulta.descripcionObjeto} `;
        selectCodConsulta.appendChild(option);
    });
};

const getCodConsulta = async () => {
    try {
        const response = await fetch(`http://${servidor}:3000/api/codConsulta`);
        if (!response.ok) {
            throw new Error(`Error al obtener los datos de codConsulta: ${response.statusText}`);
        }

        const codConsulta = await response.json();
        updateCodConsultaSelect(codConsulta);
    } catch (ex) {
        console.error(ex);
        alert(`Error: ${ex.message}`);
    }
};

// DESDE ACÁ COMIENZA EL CÓDIGO PARA ESCRIBIR EN EL INPUT EL CODIGO Y APAREZCA EN LA LISTA

// Crear un objeto que contenga la información de los selectores
var selectores = {
    "inputCodConsulta": "listaCodConsulta",
    "inputDiagPrincipal": "listaDiagPrincipal",
    "inputDiagPrincipal1": "listaDiagPrincipal1",
    "inputDiagPrincipal2": "listaDiagPrincipal2",
    "inputDiagPrincipal3": "listaDiagPrincipal3"
};

// Asociar el evento input a todos los input de búsqueda
for (var inputId in selectores) {
    if (selectores.hasOwnProperty(inputId)) {
        // document.getElementById(inputId).addEventListener("input", function () {
        //     buscarElementoPorInput(this.id);
        // });
    }
}

// Función genérica para buscar un elemento por el valor de un input
function buscarElementoPorInput(inputId) {
    var inputValue = document.getElementById(inputId).value;
    var selectId = selectores[inputId];
    var select = document.getElementById(selectId);

    // Iterar sobre las opciones del select y seleccionar la que coincide con el valor del input
    for (var i = 0; i < select.options.length; i++) {
        var elementoValue = select.options[i].value;

        if (elementoValue === inputValue) {
            select.selectedIndex = i; // Seleccionar la opción si coincide
            return; // Salir de la función, ya que se encontró una coincidencia
        }
    }
}

// ACÁ TERMINA EL CÓDIGO PARA ESCRIBIR EN EL INPUT EL CODIGO Y APAREZCA EN LA LISTA

const updateModalidadAtencion = (modalidadAtenciones) => {
    const selectmodalidadAtencion = document.querySelector('#listamodalidadAtencion');
    selectmodalidadAtencion.innerHTML = ""; // Limpiar opciones antiguas

    // Agregar opción "Sin Seleccionar" al principio
    const optionSinSeleccionar = document.createElement("option");
    optionSinSeleccionar.value = "Sin Seleccionar";
    optionSinSeleccionar.text = "Sin Seleccionar";
    selectmodalidadAtencion.appendChild(optionSinSeleccionar);

    // Agregar opciones al select
    modalidadAtenciones.forEach((modalidadAtencion) => {
        const option = document.createElement("option");
        option.value = modalidadAtencion.codigoModalidad;
        option.text = `${modalidadAtencion.nombreModalidad}`;
        selectmodalidadAtencion.appendChild(option);
    });
};

const getmodalidadAtencion = async () => {
    try {
        const response = await fetch(`http://${servidor}:3000/api/modalidadAtencion`);
        if (!response.ok) {
            throw new Error(`Error al obtener los datos de Modalidad Atención: ${response.statusText}`);
        }

        const modalidadAtencion = await response.json();
        updateModalidadAtencion(modalidadAtencion);
    } catch (ex) {
        console.error(ex);
        alert(`Error: ${ex.message}`);
    }
};

const updateGrupoServicios = (grupoServicios) => {
    const selectGrupoServicios = document.querySelector('#listaGrupoServicios');
    selectGrupoServicios.innerHTML = ""; // Limpiar opciones antiguas

    // Agregar opción "Sin Seleccionar" al principio
    const optionSinSeleccionar = document.createElement("option");
    optionSinSeleccionar.value = "Sin Seleccionar";
    optionSinSeleccionar.text = "Sin Seleccionar";
    selectGrupoServicios.appendChild(optionSinSeleccionar);

    // Agregar opciones al select
    grupoServicios.forEach((grupoServicio) => {
        const option = document.createElement("option");
        option.value = grupoServicio.codigoServicios;
        option.text = `${grupoServicio.nombreServicios}`;
        selectGrupoServicios.appendChild(option);
    });
};

const getGrupoServicios = async () => {
    try {
        const response = await fetch(`http://${servidor}:3000/api/grupoServicios`);
        if (!response.ok) {
            throw new Error(`Error al obtener los datos de Grupo Servicios: ${response.statusText}`);
        }

        const grupoServicio = await response.json();
        updateGrupoServicios(grupoServicio);
    } catch (ex) {
        console.error(ex);
        alert(`Error: ${ex.message}`);
    }
};

const updateServicios = (Servicios) => {
    const selectServicios = document.querySelector('#listaServicios');
    selectServicios.innerHTML = ""; // Limpiar opciones antiguas

    // Agregar opción "Sin Seleccionar" al principio
    const optionSinSeleccionar = document.createElement("option");
    optionSinSeleccionar.value = "Sin Seleccionar";
    optionSinSeleccionar.text = "Sin Seleccionar";
    selectServicios.appendChild(optionSinSeleccionar);

    // Agregar opciones al select
    Servicios.forEach((Servicio) => {
        const option = document.createElement("option");
        option.value = Servicio.codigoServicios;
        option.text = `${Servicio.nombreServicios}`;
        selectServicios.appendChild(option);
    });
};

const getServicios = async () => {
    try {
        const response = await fetch(`http://${servidor}:3000/api/Servicios`);
        if (!response.ok) {
            throw new Error(`Error al obtener los datos de Servicios: ${response.statusText}`);
        }

        const Servicio = await response.json();
        updateServicios(Servicio);
    } catch (ex) {
        console.error(ex);
        alert(`Error: ${ex.message}`);
    }
};

const updateFinalidadConsulta = (finalidadConsulta) => {
    const selectFinalidadConsulta = document.querySelector('#listaFinalidad');
    selectFinalidadConsulta.innerHTML = ""; // Limpiar opciones antiguas

    // Agregar opción "Sin Seleccionar" al principio
    const optionSinSeleccionar = document.createElement("option");
    optionSinSeleccionar.value = "Sin Seleccionar";
    optionSinSeleccionar.text = "Sin Seleccionar";
    selectFinalidadConsulta.appendChild(optionSinSeleccionar);

    // Agregar opciones al select
    finalidadConsulta.forEach((Finalidad) => {
        const option = document.createElement("option");
        option.value = Finalidad.codigoFinalidad;
        option.text = `${Finalidad.nombreFinalidad}`;
        selectFinalidadConsulta.appendChild(option);
    });
};

const getFinalidadConsulta = async (tipoConsulta) => {
    try {
        const response = await fetch(`http://${servidor}:3000/api/finalidadConsulta/${tipoConsulta}`);
        if (!response.ok) {
            throw new Error(`Error al obtener los datos de Finalidad Consulta: ${response.statusText}`);

            console.log(tipoConsulta);
        }

        const finalidad = await response.json();
        updateFinalidadConsulta(finalidad);
    } catch (ex) {
        console.error(ex);
        alert(`Error: ${ex.message}`);
    }
};

const updateCausaExterna = (causaExterna) => {
    const selectCausaExterna = document.querySelector('#listaCausa');
    selectCausaExterna.innerHTML = ""; // Limpiar opciones antiguas

    // Agregar opción "Sin Seleccionar" al principio
    const optionSinSeleccionar = document.createElement("option");
    optionSinSeleccionar.value = "Sin Seleccionar";
    optionSinSeleccionar.text = "Sin Seleccionar";
    selectCausaExterna.appendChild(optionSinSeleccionar);

    // Agregar opciones al select
    causaExterna.forEach((Causa) => {
        const option = document.createElement("option");
        option.value = Causa.codigoCausa;
        option.text = `${Causa.nombreCausa}`;
        selectCausaExterna.appendChild(option);
    });
};

const getCausaExterna = async () => {
    try {
        const response = await fetch(`http://${servidor}:3000/api/causaExterna`);
        if (!response.ok) {
            throw new Error(`Error al obtener los datos de Causa Externa: ${response.statusText}`);
        }

        const Causa = await response.json();
        updateCausaExterna(Causa);
    } catch (ex) {
        console.error(ex);
        alert(`Error: ${ex.message}`);
    }
};

const updateCodDiagnostico = (codDiagnosticos) => {
    const selects = document.querySelectorAll('.listaDiagPrincipal'); // Selecciona todos los select con la clase listaDiagPrincipal
    selects.forEach((select) => {
        select.innerHTML = ""; // Limpiar opciones antiguas

        // Agregar opción "Sin Seleccionar" al principio
        const optionSinSeleccionar = document.createElement("option");
        optionSinSeleccionar.value = "";
        optionSinSeleccionar.text = "No Aplica";
        select.appendChild(optionSinSeleccionar);

        // Agregar opciones al select
        codDiagnosticos.forEach((codDiagnostico) => {
            const option = document.createElement("option");
            option.value = codDiagnostico.codigoObjeto;
            option.text = `${codDiagnostico.codigoObjeto} - ${codDiagnostico.descripcionObjeto} `;
            select.appendChild(option);
        });
    });
};

const getCodDiganostico = async () => {
    try {
        const response = await fetch(`http://${servidor}:3000/api/codDiagnostico`);
        if (!response.ok) {
            throw new Error(`Error al obtener los datos de Código Diagnóstico: ${response.statusText}`);
        }

        const codDiagnostico = await response.json();
        updateCodDiagnostico(codDiagnostico);
    } catch (ex) {
        console.error(ex);
        alert(`Error: ${ex.message}`);
    }
};

const updateTipoDiagnostico = (tipoDiagnosticos) => {
    const selectTipoDiagnostico = document.querySelector('#listaTipoDiagnostico');
    selectTipoDiagnostico.innerHTML = "";


    // Agregar opción "Sin Seleccionar" al principio
    const optionSinSeleccionar = document.createElement("option");
    optionSinSeleccionar.value = "Sin Seleccionar";
    optionSinSeleccionar.text = "Sin Seleccionar";
    selectTipoDiagnostico.appendChild(optionSinSeleccionar);

    // Agregar opciones al select
    tipoDiagnosticos.forEach((tipoDiagnostico) => {
        const option = document.createElement("option");
        option.value = tipoDiagnostico.codigoObjeto;
        option.text = `${tipoDiagnostico.descripcionObjeto} `;
        selectTipoDiagnostico.appendChild(option);
    });

};

const getTipoDiagnostico = async () => {
    try {
        const response = await fetch(`http://${servidor}:3000/api/tipoDiagnostico`);
        if (!response.ok) {
            throw new Error(`Error al obtener los datos de Tipo Diagnóstico Principal: ${response.statusText}`);
        }

        const tipoDiagnostico = await response.json();
        updateTipoDiagnostico(tipoDiagnostico);
    } catch (ex) {
        console.error(ex);
        alert(`Error: ${ex.message}`);
    }
};

const updateViaIngresoUsuario = (viaIngresoUsuarios) => {
    const selectViaIngresoUsuario = document.querySelector('#listaViaIngreso');
    selectViaIngresoUsuario.innerHTML = "";


    // Agregar opción "Sin Seleccionar" al principio
    const optionSinSeleccionar = document.createElement("option");
    optionSinSeleccionar.value = "Sin Seleccionar";
    optionSinSeleccionar.text = "Sin Seleccionar";
    selectViaIngresoUsuario.appendChild(optionSinSeleccionar);

    // Agregar opciones al select
    viaIngresoUsuarios.forEach((viaIngresoUsuario) => {
        const option = document.createElement("option");
        option.value = viaIngresoUsuario.codigoObjeto;
        option.text = `${viaIngresoUsuario.descripcionObjeto} `;
        selectViaIngresoUsuario.appendChild(option);
    });

};

const getViaIngresoUsuario = async () => {
    try {
        const response = await fetch(`http://${servidor}:3000/api/viaIngresoUsuario`);
        if (!response.ok) {
            throw new Error(`Error al obtener los datos de Via Ingreso usuario: ${response.statusText}`);
        }

        const viaIngresoUsuario = await response.json();
        updateViaIngresoUsuario(viaIngresoUsuario);
    } catch (ex) {
        console.error(ex);
        alert(`Error: ${ex.message}`);
    }
};

let fechaInicio;
let fechaFin;

const alerta = async () => {
    // Obtener las fechas almacenadas en localStorage
    const storedFechaInicio = localStorage.getItem("fechaInicio");
    const storedFechaFin = localStorage.getItem("fechaFin");

    const { value: formValues } = await Swal.fire({
        title: "Seleccione el rango de fecha para cargar los historias clinicas",
        html: `
            <label style="color: white;">FECHA INICIO</label>
            <input type="date" id="swal-input1" class="swal2-input" value="${storedFechaInicio || ''}">

            <label style="color: white;">FECHA FIN</label>
            <input type="date" id="swal-input2" class="swal2-input" value="${storedFechaFin || ''}">
        `,
        focusConfirm: false,
        preConfirm: () => {
            fechaInicio = document.getElementById("swal-input1").value;
            fechaFin = document.getElementById("swal-input2").value;

            // Validar que se hayan seleccionado ambas fechas
            if (fechaInicio && fechaFin) {
                // Almacenar las fechas en localStorage
                localStorage.setItem("fechaInicio", fechaInicio);
                localStorage.setItem("fechaFin", fechaFin);

                // Llamar a la función getPacientes con el rango de fechas seleccionado
                getEvaluaciones(fechaInicio, fechaFin);
            } else {
                // Mostrar un mensaje si falta alguna de las fechas
                Swal.showValidationMessage("Por favor, seleccione ambas fechas");
            }
        },
        allowOutsideClick: false // Evitar que se cierre al hacer clic fuera del SweetAlert

    });

    if (formValues) {
        Swal.fire("Pacientes Cargados correctamente");
    }
};

window.addEventListener('load', async () => {
    // alerta();
    // ejecutar();
});

const BotonRegresar = document.getElementById('RegresarAPrincipal');
BotonRegresar.addEventListener('click', (e) => {
    window.location.href = "RIPS.html";
})


// ASIGNAR RIPS POR DEFECTO
const SelectTipoRIPSPorDefecto = document.getElementById('SelectTipoRIPSPorDefecto');
const ACPorDefecto = document.getElementById('ACPorDefecto');
const APPorDefecto = document.getElementById('APPorDefecto');
SelectTipoRIPSPorDefecto.addEventListener('change', function(e) {

    // Quitar la clase antes de aplicar estilos
    ACPorDefecto.classList.remove('d-none');
    APPorDefecto.classList.remove('d-none');
    switch (this.value) {
        case '1':
            ACPorDefecto.style.display = 'block';
            APPorDefecto.style.display = 'none';
            TraerInfoParaRIPSACPorDefecto();
        break;
        
        case '2':
            ACPorDefecto.style.display = 'none';
            APPorDefecto.style.display = 'block';
            TraerInfoParaRIPSACPPorDefecto();
        break;

        case '':
            ACPorDefecto.style.display = 'none';
            APPorDefecto.style.display = 'none';
        break;

        default:
            console.error("Opción no válida");
        break;
    }
})


// FUNCIONALIDAD PARA EL LLENADO DE LOS CAMPOS QUE ASINGNAN LOS RIPS AC POR DEFECTO / PREESTABLECIDOS
const SelectPorDefectoTipoUsuarioRIPS = document.getElementById('SelectPorDefectoTipoUsuarioRIPS');
const SelectPorDefectoEntidadAC = document.getElementById('SelectPorDefectoEntidadAC');
const SelectPorDefectoModalidadGrupoServicioTecSalAC = document.getElementById('SelectPorDefectoModalidadGrupoServicioTecSalAC');
const SelectPoDefectoGrupoServiciosAC = document.getElementById('SelectPoDefectoGrupoServiciosAC');
const SelectPorDefectoCodigoServicioAC = document.getElementById('SelectPorDefectoCodigoServicioAC');
const SelectPorDefectoFinalidadTecnologiaSaludAC = document.getElementById('SelectPorDefectoFinalidadTecnologiaSaludAC');
const SelectPorDefectoCausaMotivoAtencionAC = document.getElementById('SelectPorDefectoCausaMotivoAtencionAC');
const SelectPorDefectoTipoDiagnosticoPrincipalAC = document.getElementById('SelectPorDefectoTipoDiagnosticoPrincipalAC');
const SelectPorDefectoConsultaRIPS1AC = document.getElementById('SelectPorDefectoConsultaRIPS1AC');
const SelectPorDefectoConsultaRIPS2AC = document.getElementById('SelectPorDefectoConsultaRIPS2AC');
const SelectPorDefectoDiagnosticoRIPSAC1 = document.getElementById('SelectPorDefectoDiagnosticoRIPSAC1');
const SelectPorDefectoDiagnosticoRIPSAC2 = document.getElementById('SelectPorDefectoDiagnosticoRIPSAC2');

const TraerInfoParaRIPSACPorDefecto = async function() {

    // Funcionalidad para el llenado del select de tipo de rips
    const TipoDeUsuarioRIPS = await fetch(`http://${servidor}:3000/api/TipodeRips`)
    if (!TipoDeUsuarioRIPS) {
        throw new Error(`Error al obtener los tipos de usuario RIPS: ${TipoDeUsuarioRIPS.statusText}`);
    }
    const CargarTipoDeUsuarioRIPS = await TipoDeUsuarioRIPS.json();
    // console.log('Tipos de Usuario RIPS: ', CargarTipoDeUsuarioRIPS);
    SelectPorDefectoTipoUsuarioRIPS.innerHTML = '';
    // Opción por defecto
    const defaultOption = document.createElement('option');
    defaultOption.textContent = 'Seleccione un tipo de RIPS';
    defaultOption.value = '';
    SelectPorDefectoTipoUsuarioRIPS.appendChild(defaultOption);
    for (let i = 0; i < CargarTipoDeUsuarioRIPS.length; i+=1) {
        const option = document.createElement('option');
        option.value = CargarTipoDeUsuarioRIPS[i].IdTipoRips;
        option.textContent = CargarTipoDeUsuarioRIPS[i].TipoRips;
        SelectPorDefectoTipoUsuarioRIPS.appendChild(option);
    }

    // Funcionalidad para el llenado del select de ModalidadGrupoServicioTecnologíaSalud
    const ModalidadGrupoServicioTecnologiaSalud = await fetch(`http://${servidor}:3000/api/ModalidadAtencion`);
    if (!ModalidadGrupoServicioTecnologiaSalud) {
        throw new Error(`Error al obtener las modalidades de grupo servicio tecnología salud: ${ModalidadGrupoServicioTecnologiaSalud.statusText}`);
    }
    const CargarModalidadGrupoServicioTecnologiaSalud = await ModalidadGrupoServicioTecnologiaSalud.json();
    // console.log('Modalidades de Grupo Servicio Tecnología Salud: ', CargarModalidadGrupoServicioTecnologiaSalud);

    SelectPorDefectoModalidadGrupoServicioTecSalAC.innerHTML = '';
    // Opción por defecto
    const defaultOption2 = document.createElement('option');
    defaultOption2.textContent = 'Seleccione una modalidad';
    defaultOption2.value = '';
    SelectPorDefectoModalidadGrupoServicioTecSalAC.appendChild(defaultOption2);

    // Ordenar el array por el nombre completo del paciente
    CargarModalidadGrupoServicioTecnologiaSalud.sort((a, b) => {
        if (a.NombreModalidadAtencion < b.NombreModalidadAtencion) return -1;
        if (a.NombreModalidadAtencion > b.NombreModalidadAtencion) return 1;
        return 0;
    });

    for (let i = 0; i < CargarModalidadGrupoServicioTecnologiaSalud.length; i+=1) {
        const option = document.createElement('option');
        option.value = CargarModalidadGrupoServicioTecnologiaSalud[i].Codigo;
        option.textContent = CargarModalidadGrupoServicioTecnologiaSalud[i].NombreModalidadAtencion;
        SelectPorDefectoModalidadGrupoServicioTecSalAC.appendChild(option);
    }


    // Funcionalidad para el llenado del select de GrupoServiciosAC
    const GrupoServiciosAC = await fetch(`http://${servidor}:3000/api/GrupoServicios`);
    if (!GrupoServiciosAC) {
        throw new Error(`Error al obtener los grupos de servicios AC: ${GrupoServiciosAC.statusText}`);
    }
    const CargarGrupoServiciosAC = await GrupoServiciosAC.json();
    // console.log('Grupos de Servicios AC: ', CargarGrupoServiciosAC);
    SelectPoDefectoGrupoServiciosAC.innerHTML = '';
    // Opción por defecto
    const defaultOption3 = document.createElement('option');
    defaultOption3.textContent = 'Seleccione un grupo';
    defaultOption3.value = '';
    SelectPoDefectoGrupoServiciosAC.appendChild(defaultOption3);
    // Ordenar el array por el nombre del grupo
    CargarGrupoServiciosAC.sort((a, b) => {
        if (a.NombreGrupoServicios < b.NombreGrupoServicios) return -1;
        if (a.NombreGrupoServicios > b.NombreGrupoServicios) return 1;
        return 0;
    });

    // Agregar las opciones al select de GrupoServiciosAC
    for (let i = 0; i < CargarGrupoServiciosAC.length; i+=1) {
        const option = document.createElement('option');
        option.value = CargarGrupoServiciosAC[i].Codigo;
        option.textContent = CargarGrupoServiciosAC[i].NombreGrupoServicios;
        SelectPoDefectoGrupoServiciosAC.appendChild(option);
    }

     // Funcionalidad para el llenado del select de FinalidadTecnologiaSalud
     const FinalidadParaAC = "AC";
     const FinalidadTecnologiaSaludAC = await fetch(`http://${servidor}:3000/api/FinalidadV2/${FinalidadParaAC}`);
     if (!FinalidadTecnologiaSaludAC) {
         throw new Error(`Error al obtener las finalidades para el tipo AC: ${FinalidadTecnologiaSaludAC.statusText}`);
     }
     const CargarFinalidadTecnologiaSaludAC = await FinalidadTecnologiaSaludAC.json();
     // console.log('Finalidades para el tipo AC: ', CargarFinalidadTecnologiaSaludAC);
     SelectPorDefectoFinalidadTecnologiaSaludAC.innerHTML = '';
     // Opción por defecto
     const defaultOption4 = document.createElement('option');
     defaultOption4.textContent = 'Seleccione una finalidad';
     defaultOption4.value = '';
     SelectPorDefectoFinalidadTecnologiaSaludAC.appendChild(defaultOption4);
     // Ordenar el array por el nombre del grupo
     CargarFinalidadTecnologiaSaludAC.sort((a, b) => {
         if (a.NombreRIPSFinalidadConsultaVersion2 < b.NombreRIPSFinalidadConsultaVersion2) return -1;
         if (a.NombreRIPSFinalidadConsultaVersion2 > b.NombreRIPSFinalidadConsultaVersion2) return 1;
         return 0;
     });
     // Agregar las opciones al select de FinalidadTecnologiaSalud
     for (let i = 0; i < CargarFinalidadTecnologiaSaludAC.length; i+=1) {
         const option = document.createElement('option');
         option.value = CargarFinalidadTecnologiaSaludAC[i].Codigo;
         option.textContent = CargarFinalidadTecnologiaSaludAC[i].NombreRIPSFinalidadConsultaVersion2;
         SelectPorDefectoFinalidadTecnologiaSaludAC.appendChild(option);
     }


    // Funcionalidad para el llenado del select CausaMotivoAtención
    const CausaMotivoAtencion = await fetch(`http://${servidor}:3000/api/CausaExterna`);
    if (!CausaMotivoAtencion) {
        throw new Error(`Error al obtener las causas externas: ${CausaMotivoAtencion.statusText}`);
    }
    const CargarCausaMotivoAtencion = await CausaMotivoAtencion.json();
    // console.log('Causas externas: ', CargarCausaMotivoAtencion);
    SelectPorDefectoCausaMotivoAtencionAC.innerHTML = '';
    // Opción por defecto
    const defaultOption5 = document.createElement('option');
    defaultOption5.textContent = 'Seleccione una causa externa';
    defaultOption5.value = '';
    SelectPorDefectoCausaMotivoAtencionAC.appendChild(defaultOption5);
    // Ordenar el array por el nombre del grupo
    CargarCausaMotivoAtencion.sort((a, b) => {
        if (a.NombreRIPSCausaExternaVersion2 < b.NombreRIPSCausaExternaVersion2) return -1;
        if (a.NombreRIPSCausaExternaVersion2 > b.NombreRIPSCausaExternaVersion2) return 1;
        return 0;
    });
    // Agregar las opciones al select de CausaMotivoAtencion
    for (let i = 0; i < CargarCausaMotivoAtencion.length; i+=1) {
        const option = document.createElement('option');
        option.value = CargarCausaMotivoAtencion[i].Codigo;
        option.textContent = CargarCausaMotivoAtencion[i].NombreRIPSCausaExternaVersion2;
        SelectPorDefectoCausaMotivoAtencionAC.appendChild(option);
    }


    // Funcionalidad para el llenado del select de TipoDiagnósticoPrincipal
    const TipoDiagnosticoPrincipal = await fetch(`http://${servidor}:3000/api/DXPrincipal`);
    if (!TipoDiagnosticoPrincipal) {
        throw new Error(`Error al obtener los tipos de diagnósticos principales: ${TipoDiagnosticoPrincipal.statusText}`);
    }
    const CargarTipoDiagnosticoPrincipal = await TipoDiagnosticoPrincipal.json();
    // console.log('Tipos de diagnósticos principales: ', CargarTipoDiagnosticoPrincipal);
    SelectPorDefectoTipoDiagnosticoPrincipalAC.innerHTML = '';
    // Opción por defecto
    const defaultOption6 = document.createElement('option');
    defaultOption6.textContent = 'Seleccione un diagnóstico principal';
    defaultOption6.value = '';
    SelectPorDefectoTipoDiagnosticoPrincipalAC.appendChild(defaultOption6);
    // Ordenar el array por el nombre del grupo
    CargarTipoDiagnosticoPrincipal.sort((a, b) => {
        if (a.DescripcionTipodeDiagnósticoPrincipal < b.DescripcionTipodeDiagnósticoPrincipal) return -1;
        if (a.DescripcionTipodeDiagnósticoPrincipal > b.DescripcionTipodeDiagnósticoPrincipal) return 1;
        return 0;
    });
    // Agregar las opciones al select de TipoDiagnosticoPrincipal
    for (let i = 0; i < CargarTipoDiagnosticoPrincipal.length; i+=1) {
        const option = document.createElement('option');
        option.value = CargarTipoDiagnosticoPrincipal[i].CódigoTipodeDiagnósticoPrincipal;
        option.textContent = CargarTipoDiagnosticoPrincipal[i].DescripcionTipodeDiagnósticoPrincipal;
        SelectPorDefectoTipoDiagnosticoPrincipalAC.appendChild(option);
    }


    // Funcionalidad para el llenado del select de Consulta RIPS
    const TipoConsulta1 = "AC";
    const ConsultaRIPS1 = await fetch(`http://${servidor}:3000/api/Cups/${TipoConsulta1}`);
    if (!ConsultaRIPS1) {
        throw new Error(`Error al obtener las consultas RIPS: ${ConsultaRIPS1.statusText}`);
    }
    const CargarConsultaRIPS1 = await ConsultaRIPS1.json();
    // console.log('Consultas RIPS: ', CargarConsultaRIPS1);
    SelectPorDefectoConsultaRIPS1AC.innerHTML = '';
    // Opción por defecto
    const defaultOption7 = document.createElement('option');
    defaultOption7.textContent = 'Seleccione una consulta RIPS 1';
    defaultOption7.value = '';
    SelectPorDefectoConsultaRIPS1AC.appendChild(defaultOption7);
    // Ordenar el array por el nombre del grupo
    CargarConsultaRIPS1.sort((a, b) => {
        if (a.Nombre < b.Nombre) return -1;
        if (a.Nombre > b.Nombre) return 1;
        return 0;
    });
    // Agregar las opciones al select de ConsultaRIPS
    for (let i = 0; i < CargarConsultaRIPS1.length; i+=1) {
        const option = document.createElement('option');
        option.value = CargarConsultaRIPS1[i].Codigo;
        option.textContent = CargarConsultaRIPS1[i].Codigo + ' - ' + CargarConsultaRIPS1[i].Nombre;
        SelectPorDefectoConsultaRIPS1AC.appendChild(option);
    }


    // Funcionalidad para el llenado del select de Consulta RIPS 2
    const TipoConsulta2 = "AC";
    const ConsultaRIPS2 = await fetch(`http://${servidor}:3000/api/Cups/${TipoConsulta2}`);
    if (!ConsultaRIPS2) {
        throw new Error(`Error al obtener las consultas RIPS: ${ConsultaRIPS2.statusText}`);
    }
    const CargarConsultaRIPS2 = await ConsultaRIPS2.json();
    // console.log('Consultas RIPS: ', CargarConsultaRIPS2);
    SelectPorDefectoConsultaRIPS2AC.innerHTML = '';
    // Opción por defecto
    const defaultOption8 = document.createElement('option');
    defaultOption8.textContent = 'Seleccione una consulta RIPS 2';
    defaultOption8.value = '';
    SelectPorDefectoConsultaRIPS2AC.appendChild(defaultOption8);
    // Ordenar el array por el nombre del grupo
    CargarConsultaRIPS2.sort((a, b) => {
        if (a.Nombre < b.Nombre) return -1;
        if (a.Nombre > b.Nombre) return 1;
        return 0;
    });
    // Agregar las opciones al select de ConsultaRIPS 2
    for (let i = 0; i < CargarConsultaRIPS2.length; i+=1) {
        const option = document.createElement('option');
        option.value = CargarConsultaRIPS2[i].Codigo;
        option.textContent = CargarConsultaRIPS2[i].Codigo + ' - ' + CargarConsultaRIPS2[i].Nombre;
        SelectPorDefectoConsultaRIPS2AC.appendChild(option);
    }


     // Funcinalidad para el llenado del select Diagnósitoco RIPS AC 1
     const DiasnosticoRIPSAC1 = await fetch(`http://${servidor}:3000/api/Cie`);
     if (!DiasnosticoRIPSAC1) {
         throw new Error(`Error al obtener los diagnósticos RIPS: ${DiasnosticoRIPSAC1.statusText}`);
     }
     const CargarDiagnosticoRIPSAC1 = await DiasnosticoRIPSAC1.json();
     // console.log('Diagnósticos RIPS AC 1: ', CargarDiagnosticoRIPSAC1);
     SelectPorDefectoDiagnosticoRIPSAC1.innerHTML = '';
     // Opción por defecto
     const defaultOption9 = document.createElement('option');
     defaultOption9.textContent = 'Seleccione un diagnóstico RIPS AC 1';
     defaultOption9.value = '';
     SelectPorDefectoDiagnosticoRIPSAC1.appendChild(defaultOption9);
     // Ordenar el array por el nombre del grupo
     CargarDiagnosticoRIPSAC1.sort((a, b) => {
         if (a.Nombre < b.Nombre) return -1;
         if (a.Nombre > b.Nombre) return 1;
         return 0;
     });
     // Agregar las opciones al select Diagnósitoco RIPS AC 1
     for (let i = 0; i < CargarDiagnosticoRIPSAC1.length; i+=1) {
         const option = document.createElement('option');
         option.value = CargarDiagnosticoRIPSAC1[i].Codigo;
         option.textContent = CargarDiagnosticoRIPSAC1[i].Codigo + ' - ' + CargarDiagnosticoRIPSAC1[i].Nombre;
         SelectPorDefectoDiagnosticoRIPSAC1.appendChild(option);
     }


     // Funcinalidad para el llenado del select Diagnósitoco RIPS AC 2
     const DiasnosticoRIPSAC2 = await fetch(`http://${servidor}:3000/api/Cie`);
     if (!DiasnosticoRIPSAC2) {
         throw new Error(`Error al obtener los diagnósticos RIPS: ${DiasnosticoRIPSAC2.statusText}`);
     }
     const CargarDiagnosticoRIPSAC2 = await DiasnosticoRIPSAC2.json();
     // console.log('Diagnósticos RIPS AC 1: ', CargarDiagnosticoRIPSAC2);
     SelectPorDefectoDiagnosticoRIPSAC2.innerHTML = '';
     // Opción por defecto
     const defaultOption10 = document.createElement('option');
     defaultOption10.textContent = 'Seleccione un diagnóstico RIPS AC 2';
     defaultOption10.value = '';
     SelectPorDefectoDiagnosticoRIPSAC2.appendChild(defaultOption10);
     // Ordenar el array por el nombre del grupo
     CargarDiagnosticoRIPSAC2.sort((a, b) => {
         if (a.Nombre < b.Nombre) return -1;
         if (a.Nombre > b.Nombre) return 1;
         return 0;
     });
     // Agregar las opciones al select Diagnósitoco RIPS AC 1
     for (let i = 0; i < CargarDiagnosticoRIPSAC2.length; i+=1) {
         const option = document.createElement('option');
         option.value = CargarDiagnosticoRIPSAC2[i].Codigo;
         option.textContent = CargarDiagnosticoRIPSAC2[i].Codigo + ' - ' + CargarDiagnosticoRIPSAC2[i].Nombre;
         SelectPorDefectoDiagnosticoRIPSAC2.appendChild(option);
     }
}
SelectPorDefectoTipoUsuarioRIPS.addEventListener('change', async function (e) {

    try {
        if (this.value !== "") {
            const ValorSelectTipoUsuarioRIPS = this.value;
            // Funcionalidad para el llenado del select de entidad
            const EntidadResponsable = await fetch(`http://${servidor}:3000/api/Entidad/${ValorSelectTipoUsuarioRIPS}`);
            if (!EntidadResponsable) {
                throw new Error(`Error al obtener las entidades responsables: ${EntidadResponsable.statusText}`);
            }
            const CargarEntidadResponsable = await EntidadResponsable.json();
            // console.log('Entidades Responsables: ', CargarEntidadResponsable);
    
            SelectPorDefectoEntidadAC.innerHTML = '';
            // Opción por defecto
            const defaultOption = document.createElement('option');
            defaultOption.textContent = 'Seleccione una entidad';
            defaultOption.value = '';
            SelectPorDefectoEntidadAC.appendChild(defaultOption);

            // Ordenar el array por el nombre completo del paciente
            CargarEntidadResponsable.sort((a, b) => {
                if (a.NombreCompletoPaciente < b.NombreCompletoPaciente) return -1;
                if (a.NombreCompletoPaciente > b.NombreCompletoPaciente) return 1;
                return 0;
            });

            for (let i = 0; i < CargarEntidadResponsable.length; i++) {
                const option = document.createElement('option');
                option.value = CargarEntidadResponsable[i].DocumentoEntidad;
                option.textContent = CargarEntidadResponsable[i].NombreCompletoPaciente;
                SelectPorDefectoEntidadAC.appendChild(option);
            }
        } else {
            SelectPorDefectoEntidadAC.innerHTML = '';
            // Opción por defecto
            const defaultOption = document.createElement('option');
            defaultOption.textContent = 'Seleccione una entidad';
            defaultOption.value = '';
            SelectPorDefectoEntidadAC.appendChild(defaultOption);
        }

    } catch (error) {
        console.error(error);
    }

})
SelectPoDefectoGrupoServiciosAC.addEventListener('change', async function (e) {
    try {
        // console.log(this.value);
        const CargarServicios = await fetch(`http://${servidor}:3000/api/Servicios/${this.value}`);
        if (!CargarServicios.ok) {
            throw new Error(`Error al obtener los servicios: ${CargarServicios.statusText}`);
        }
        const CargarServiciosAC = await CargarServicios.json();
        // console.log('Servicios: ', CargarServiciosAC);

        SelectPorDefectoCodigoServicioAC.innerHTML = '';
        // Opción por defecto
        const defaultOption = document.createElement('option');
        defaultOption.textContent = 'Seleccione un servicio';
        defaultOption.value = '';
        SelectPorDefectoCodigoServicioAC.appendChild(defaultOption);
        // Ordenar el array por el nombre del servicio
        CargarServiciosAC.sort((a, b) => {
            if (a['Nombre Servicios'] < b['Nombre Servicios']) return -1;
            if (a['Nombre Servicios'] > b['Nombre Servicios']) return 1;
            return 0;
        });

        for (let i = 0; i < CargarServiciosAC.length; i++) {
            const option = document.createElement('option');
            option.value = CargarServiciosAC[i]['Id Servicios'];
            option.textContent = CargarServiciosAC[i]['Nombre Servicios'];
            SelectPorDefectoCodigoServicioAC.appendChild(option);
        }
    } catch (error) {
        console.error(error);
    }
})
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// FUNCIONALIDAD PARA EL LLENADO DE LOS CAMPOS QUE ASINGNAN LOS RIPS AP POR DEFECTO / PREESTABLECIDOS
const SelectPorDefectoTipoUsuarioRIPSAP = document.getElementById('SelectPorDefectoTipoUsuarioRIPSAP');
const SelectPorDefectoEntidadAP = document.getElementById('SelectPorDefectoEntidadAP');
const SelectPorDefectoViaIngresoServicioSaludAP = document.getElementById('SelectPorDefectoViaIngresoServicioSaludAP');
const SelectPorDefectoModalidadGrupoServicioTecSalAP = document.getElementById('SelectPorDefectoModalidadGrupoServicioTecSalAP');
const SelectPorDefectoGrupoServiciosAP = document.getElementById('SelectPorDefectoGrupoServiciosAP');
const SelectPorDefectoCodServicioAP = document.getElementById('SelectPorDefectoCodServicioAP');
const SelectPorDefectoFinalidadTecnologíaSaludAP = document.getElementById('SelectPorDefectoFinalidadTecnologíaSaludAP');
const SelectPorDefectoProcedimientoRIPSAP1 = document.getElementById('SelectPorDefectoProcedimientoRIPSAP1');
const SelectPorDefectoProcedimientoRIPSAP2 = document.getElementById('SelectPorDefectoProcedimientoRIPSAP2');
const SelectPorDefectoDiagnosticoRIPSAP1 = document.getElementById('SelectPorDefectoDiagnosticoRIPSAP1');
const SelectPorDefectoDiagnosticoRIPSAP2 = document.getElementById('SelectPorDefectoDiagnosticoRIPSAP2');

const TraerInfoParaRIPSACPPorDefecto = async function() {
    console.log("CONSULTADO INFORMACIÓN EN LA BASE DE DATOS PARA RIPS AP");
    // Funcionalidad para el llenado del select de tipo de rips
    const TipoDeUsuarioRIPS = await fetch(`http://${servidor}:3000/api/TipodeRips`)
    if (!TipoDeUsuarioRIPS) {
        throw new Error(`Error al obtener los tipos de usuario RIPS: ${TipoDeUsuarioRIPS.statusText}`);
    }
    const CargarTipoDeUsuarioRIPS = await TipoDeUsuarioRIPS.json();
    // console.log('Tipos de Usuario RIPS: ', CargarTipoDeUsuarioRIPS);
    SelectPorDefectoTipoUsuarioRIPSAP.innerHTML = '';
    // Opción por defecto
    const defaultOption = document.createElement('option');
    defaultOption.textContent = 'Seleccione un tipo de RIPS';
    defaultOption.value = '';
    SelectPorDefectoTipoUsuarioRIPSAP.appendChild(defaultOption);
    for (let i = 0; i < CargarTipoDeUsuarioRIPS.length; i+=1) {
        const option = document.createElement('option');
        option.value = CargarTipoDeUsuarioRIPS[i].IdTipoRips;
        option.textContent = CargarTipoDeUsuarioRIPS[i].TipoRips;
        SelectPorDefectoTipoUsuarioRIPSAP.appendChild(option);
    }


    // Funcionalidad para el llendao del select ViaIngresoServicioSalud
    const ViaIngresoServicioSaludAP = await fetch(`http://${servidor}:3000/api/ViaIngresoUsuario`);
    if (!ViaIngresoServicioSaludAP) {
        throw new Error(`Error al obtener las vías de ingreso de usuario RIPS: ${ViaIngresoServicioSaludAP.statusText}`);
    }
    const CargarViaIngresoServicioSaludAP = await ViaIngresoServicioSaludAP.json();
    // console.log('Vias de Ingreso de Usuario RIPS AP: ', CargarViaIngresoServicioSaludAP);
    SelectPorDefectoViaIngresoServicioSaludAP.innerHTML = '';
    // Opción por defecto
    const defaultOption2 = document.createElement('option');
    defaultOption2.textContent = 'Seleccione una via de ingreso';
    defaultOption2.value = '';
    SelectPorDefectoViaIngresoServicioSaludAP.appendChild(defaultOption2);
    // Ordenar el array por el nombre de la via de ingreso
    CargarViaIngresoServicioSaludAP.sort((a, b) => {
        if (a['NombreViaIngresoUsuario'] < b['NombreViaIngresoUsuario']) return -1;
        if (a['NombreViaIngresoUsuario'] > b['NombreViaIngresoUsuario']) return 1;
        return 0;
    });
    for (let i = 0; i < CargarViaIngresoServicioSaludAP.length; i++) {
        const option = document.createElement('option');
        option.value = CargarViaIngresoServicioSaludAP[i]['Codigo'];
        option.textContent = CargarViaIngresoServicioSaludAP[i]['NombreViaIngresoUsuario'];
        SelectPorDefectoViaIngresoServicioSaludAP.appendChild(option);
    }


    // Funcionalidad para el llenado del select ModalidadGrupoServicioTecSalAP
    const ModalidadGrupoServicioTecSalAP = await fetch(`http://${servidor}:3000/api/ModalidadAtencion`);
    if (!ModalidadGrupoServicioTecSalAP) {
        throw new Error(`Error al obtener las modalidades de grupo de servicios técnicos RIPS: ${ModalidadGrupoServicioTecSalAP.statusText}`);
    }
    const CargarModalidadGrupoServicioTecSalAP = await ModalidadGrupoServicioTecSalAP.json();
    // console.log('Modalidades de Grupo de Servicios Técnicos RIPS AP: ', CargarModalidadGrupoServicioTecSalAP);
    SelectPorDefectoModalidadGrupoServicioTecSalAP.innerHTML = '';
    // Opción por defecto
    const defaultOption3 = document.createElement('option');
    defaultOption3.textContent = 'Seleccione una modalidad de grupo de servicios técnicos';
    defaultOption3.value = '';
    SelectPorDefectoModalidadGrupoServicioTecSalAP.appendChild(defaultOption3);
    // Ordenar el array por el nombre de la modalidad de grupo de servicios técnicos
    CargarModalidadGrupoServicioTecSalAP.sort((a, b) => {
        if (a['NombreModalidadAtencion'] < b['NombreModalidadAtencion']) return -1;
        if (a['NombreModalidadAtencion'] > b['NombreModalidadAtencion']) return 1;
        return 0;
    });
    for (let i = 0; i < CargarModalidadGrupoServicioTecSalAP.length; i++) {
        const option = document.createElement('option');
        option.value = CargarModalidadGrupoServicioTecSalAP[i]['Codigo'];
        option.textContent = CargarModalidadGrupoServicioTecSalAP[i]['NombreModalidadAtencion'];
        SelectPorDefectoModalidadGrupoServicioTecSalAP.appendChild(option);
    }


    //Funcionalidad para el llenado del select GrupoServiciosAP
    const GrupoServiciosAP = await fetch(`http://${servidor}:3000/api/GrupoServicios`);
    if (!GrupoServiciosAP) {
        throw new Error(`Error al obtener los grupos de servicios RIPS: ${GrupoServiciosAP.statusText}`);
    }
    const CargarGrupoServiciosAP = await GrupoServiciosAP.json();
    // console.log('Grupos de Servicios RIPS AP: ', CargarGrupoServiciosAP);
    SelectPorDefectoGrupoServiciosAP.innerHTML = '';
    // Opción por defecto
    const defaultOption4 = document.createElement('option');
    defaultOption4.textContent = 'Seleccione un grupo de servicios';
    defaultOption4.value = '';
    SelectPorDefectoGrupoServiciosAP.appendChild(defaultOption4);
    // Ordenar el array por el nombre del grupo de servicios
    CargarGrupoServiciosAP.sort((a, b) => {
        if (a['NombreGrupoServicios'] < b['NombreGrupoServicios']) return -1;
        if (a['NombreGrupoServicios'] > b['NombreGrupoServicios']) return 1;
        return 0;
    });
    for (let i = 0; i < CargarGrupoServiciosAP.length; i++) {
        const option = document.createElement('option');
        option.value = CargarGrupoServiciosAP[i]['Codigo'];
        option.textContent = CargarGrupoServiciosAP[i]['NombreGrupoServicios'];
        SelectPorDefectoGrupoServiciosAP.appendChild(option);
    }


    // Funcionalidad para el llenado del select FinalidadTecnologiaSaludAP
    const FinalidadRIPSAP = "AP";
    const FinalidadTecnologiaSaludAP = await fetch(`http://${servidor}:3000/api/FinalidadV2/${FinalidadRIPSAP}`);
    if (!FinalidadTecnologiaSaludAP) {
        throw new Error(`Error al obtener las finalidades técnicas de salud RIPS: ${FinalidadTecnologiaSaludAP.statusText}`);
    }
    const CargarFinalidadTecnologiaSaludAP = await FinalidadTecnologiaSaludAP.json();
    // console.log('Finalidades Técnicas de Salud RIPS AP: ', CargarFinalidadTecnologiaSaludAP);
    SelectPorDefectoFinalidadTecnologíaSaludAP.innerHTML = '';
    // Opción por defecto
    const defaultOption5 = document.createElement('option');
    defaultOption5.textContent = 'Seleccione una finalidad técnica de salud';
    defaultOption5.value = '';
    SelectPorDefectoFinalidadTecnologíaSaludAP.appendChild(defaultOption5);
    // Ordenar el array por el nombre de la finalidad técnica de salud
    CargarFinalidadTecnologiaSaludAP.sort((a, b) => {
        if (a['NombreRIPSFinalidadConsultaVersion2'] < b['NombreRIPSFinalidadConsultaVersion2']) return -1;
        if (a['NombreRIPSFinalidadConsultaVersion2'] > b['NombreRIPSFinalidadConsultaVersion2']) return 1;
        return 0;
    });
    for (let i = 0; i < CargarFinalidadTecnologiaSaludAP.length; i++) {
        const option = document.createElement('option');
        option.value = CargarFinalidadTecnologiaSaludAP[i]['Codigo'];
        option.textContent = CargarFinalidadTecnologiaSaludAP[i]['NombreRIPSFinalidadConsultaVersion2'];
        SelectPorDefectoFinalidadTecnologíaSaludAP.appendChild(option);
    }


    // Funcionalidad para el llenado del select Procedimiento AP 1
    const TipoProcedimientoAP1 = "AP";
    const ProcedimientoAP1 = await fetch(`http://${servidor}:3000/api/Cups/${TipoProcedimientoAP1}`);
    if (!ProcedimientoAP1) {
        throw new Error(`Error al obtener los procedimientos AP 1: ${ProcedimientoAP1.statusText}`);
    }
    const CargarProcedimientoAP1 = await ProcedimientoAP1.json();
    // console.log('Procedimientos AP 1: ', CargarProcedimientoAP1);
    SelectPorDefectoProcedimientoRIPSAP1.innerHTML = '';
    // Opción por defecto
    const defaultOption6 = document.createElement('option');
    defaultOption6.textContent = 'Seleccione un procedimiento AP 1';
    defaultOption6.value = '';
    SelectPorDefectoProcedimientoRIPSAP1.appendChild(defaultOption6);
    // Ordenar el array por el nombre del procedimiento
    CargarProcedimientoAP1.sort((a, b) => {
        if (a['Nombre'] < b['Nombre']) return -1;
        if (a['Nombre'] > b['Nombre']) return 1;
        return 0;
    });
    for (let i = 0; i < CargarProcedimientoAP1.length; i++) {
        const option = document.createElement('option');
        option.value = CargarProcedimientoAP1[i].Codigo;
        option.textContent = CargarProcedimientoAP1[i].Codigo + ' - ' + CargarProcedimientoAP1[i].Nombre;
        SelectPorDefectoProcedimientoRIPSAP1.appendChild(option);
    }


    // Funcionalidad para el llenado del select Procedimiento AP 2
    const TipoProcedimientoAP2 = "AP";
    const ProcedimientoAP2 = await fetch(`http://${servidor}:3000/api/Cups/${TipoProcedimientoAP2}`);
    if (!ProcedimientoAP2) {
        throw new Error(`Error al obtener los procedimientos AP 2: ${ProcedimientoAP2.statusText}`);
    }
    const CargarProcedimientoAP2 = await ProcedimientoAP2.json();
    // console.log('Procedimientos AP 2: ', CargarProcedimientoAP2);
    SelectPorDefectoProcedimientoRIPSAP2.innerHTML = '';
    // Opción por defecto
    const defaultOption7 = document.createElement('option');
    defaultOption7.textContent = 'Seleccione un procedimiento AP 2';
    defaultOption7.value = '';
    SelectPorDefectoProcedimientoRIPSAP2.appendChild(defaultOption7);
    // Ordenar el array por el nombre del procedimiento
    CargarProcedimientoAP2.sort((a, b) => {
        if (a['Nombre'] < b['Nombre']) return -1;
        if (a['Nombre'] > b['Nombre']) return 1;
        return 0;
    });
    for (let i = 0; i < CargarProcedimientoAP2.length; i++) {
        const option = document.createElement('option');
        option.value = CargarProcedimientoAP2[i].Codigo;
        option.textContent = CargarProcedimientoAP2[i].Codigo + ' - ' + CargarProcedimientoAP2[i].Nombre;
        SelectPorDefectoProcedimientoRIPSAP2.appendChild(option);
    }


    // Funcionalidad para el llenado del Select Diagnostico AP 1
    const DiagnosticoAP1 = await fetch(`http://${servidor}:3000/api/Cie`);
    if (!DiagnosticoAP1) {
        throw new Error(`Error al obtener los diagnósticos AP 1: ${DiagnosticoAP1.statusText}`);
    }
    const CargarDiagnosticoAP1 = await DiagnosticoAP1.json();
    // console.log('Diagnósticos AP 1: ', CargarDiagnosticoAP1);
    SelectPorDefectoDiagnosticoRIPSAP1.innerHTML = '';
    // Opción por defecto
    const defaultOption8 = document.createElement('option');
    defaultOption8.textContent = 'Seleccione un diagnóstico AP 1';
    defaultOption8.value = '';
    SelectPorDefectoDiagnosticoRIPSAP1.appendChild(defaultOption8);
    // Ordenar el array por el nombre del diagnóstico
    CargarDiagnosticoAP1.sort((a, b) => {
        if (a['Nombre'] < b['Nombre']) return -1;
        if (a['Nombre'] > b['Nombre']) return 1;
        return 0;
    });
    for (let i = 0; i < CargarDiagnosticoAP1.length; i++) {
        const option = document.createElement('option');
        option.value = CargarDiagnosticoAP1[i].Codigo;
        option.textContent = CargarDiagnosticoAP1[i].Codigo + ' - ' + CargarDiagnosticoAP1[i].Nombre;
        SelectPorDefectoDiagnosticoRIPSAP1.appendChild(option);
    }

    // Funcionalidad para el llenado del Select Diagnostico AP 2
    const DiagnosticoAP2 = await fetch(`http://${servidor}:3000/api/Cie`);
    if (!DiagnosticoAP2) {
        throw new Error(`Error al obtener los diagnósticos AP 1: ${DiagnosticoAP2.statusText}`);
    }
    const CargarDiagnosticoAP2 = await DiagnosticoAP2.json();
    // console.log('Diagnósticos AP 1: ', CargarDiagnosticoAP2);
    SelectPorDefectoDiagnosticoRIPSAP2.innerHTML = '';
    // Opción por defecto
    const defaultOption9 = document.createElement('option');
    defaultOption9.textContent = 'Seleccione un diagnóstico AP 2';
    defaultOption9.value = '';
    SelectPorDefectoDiagnosticoRIPSAP2.appendChild(defaultOption9);
    // Ordenar el array por el nombre del diagnóstico
    CargarDiagnosticoAP2.sort((a, b) => {
        if (a['Nombre'] < b['Nombre']) return -1;
        if (a['Nombre'] > b['Nombre']) return 1;
        return 0;
    });
    for (let i = 0; i < CargarDiagnosticoAP2.length; i++) {
        const option = document.createElement('option');
        option.value = CargarDiagnosticoAP2[i].Codigo;
        option.textContent = CargarDiagnosticoAP2[i].Codigo + ' - ' + CargarDiagnosticoAP2[i].Nombre;
        SelectPorDefectoDiagnosticoRIPSAP2.appendChild(option);
    }
}
SelectPorDefectoTipoUsuarioRIPSAP.addEventListener('change', async function (e) {

    try {
        if (this.value !== "") {
            const ValorSelectTipoUsuarioRIPS = this.value;
            // Funcionalidad para el llenado del select de entidad
            const EntidadResponsable = await fetch(`http://${servidor}:3000/api/Entidad/${ValorSelectTipoUsuarioRIPS}`);
            if (!EntidadResponsable) {
                throw new Error(`Error al obtener las entidades responsables: ${EntidadResponsable.statusText}`);
            }
            const CargarEntidadResponsable = await EntidadResponsable.json();
            // console.log('Entidades Responsables: ', CargarEntidadResponsable);
    
            SelectPorDefectoEntidadAP.innerHTML = '';
            // Opción por defecto
            const defaultOption = document.createElement('option');
            defaultOption.textContent = 'Seleccione una entidad';
            defaultOption.value = '';
            SelectPorDefectoEntidadAP.appendChild(defaultOption);

            // Ordenar el array por el nombre completo del paciente
            CargarEntidadResponsable.sort((a, b) => {
                if (a.NombreCompletoPaciente < b.NombreCompletoPaciente) return -1;
                if (a.NombreCompletoPaciente > b.NombreCompletoPaciente) return 1;
                return 0;
            });

            for (let i = 0; i < CargarEntidadResponsable.length; i++) {
                const option = document.createElement('option');
                option.value = CargarEntidadResponsable[i].DocumentoEntidad;
                option.textContent = CargarEntidadResponsable[i].NombreCompletoPaciente;
                SelectPorDefectoEntidadAP.appendChild(option);
            }
        } else {
            SelectPorDefectoEntidadAP.innerHTML = '';
            // Opción por defecto
            const defaultOption = document.createElement('option');
            defaultOption.textContent = 'Seleccione una entidad';
            defaultOption.value = '';
            SelectPorDefectoEntidadAP.appendChild(defaultOption);
        }

    } catch (error) {
        console.error(error);
    }

})
SelectPorDefectoGrupoServiciosAP.addEventListener('change', async function (e) {
    try {
        // console.log(this.value);
        const CargarServicios = await fetch(`http://${servidor}:3000/api/Servicios/${this.value}`);
        if (!CargarServicios.ok) {
            throw new Error(`Error al obtener los servicios: ${CargarServicios.statusText}`);
        }
        const CargarServiciosAC = await CargarServicios.json();
        // console.log('Servicios: ', CargarServiciosAC);

        SelectPorDefectoCodServicioAP.innerHTML = '';
        // Opción por defecto
        const defaultOption = document.createElement('option');
        defaultOption.textContent = 'Seleccione un servicio';
        defaultOption.value = '';
        SelectPorDefectoCodServicioAP.appendChild(defaultOption);
        // Ordenar el array por el nombre del servicio
        CargarServiciosAC.sort((a, b) => {
            if (a['Nombre Servicios'] < b['Nombre Servicios']) return -1;
            if (a['Nombre Servicios'] > b['Nombre Servicios']) return 1;
            return 0;
        });

        for (let i = 0; i < CargarServiciosAC.length; i++) {
            const option = document.createElement('option');
            option.value = CargarServiciosAC[i]['Id Servicios'];
            option.textContent = CargarServiciosAC[i]['Nombre Servicios'];
            SelectPorDefectoCodServicioAP.appendChild(option);
        }
    } catch (error) {
        console.error(error);
    }
})
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>