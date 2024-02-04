/* Variables globales */
let verPresupuesto = false;

class Transaccion {
    constructor() {
        this.id = null;
        this.nombre = null;
        this.valor = null;
        this.tipo = null;
    }
}

class GestorTransacciones {
    constructor() {
        this.ingresos = [];
        this.ahorros = [];
        this.gastos = [];
        this.presupuesto = 0;
        this.contadorId = 1;
    }

    /* Mapeo (1 => Ingreso, 2 => Gasto, 3 => Ahorro) */
    devolverTipoTransaccion(numeroTipoTransaccion) {
        const tipos = ["Tipo no válido", "Ingreso", "Gasto", "Ahorro"];
        return tipos[numeroTipoTransaccion] || tipos[0];
    }

    /* Metodo auxiliar utilizado por el metodo agregarTransaccion(tipo) */
    agregarTransaccionAListaPorTipo(transaccion) {
        const tipo = transaccion.tipo.toLowerCase();
        if (["ingreso", "gasto", "ahorro"].includes(tipo)) {
            this[tipo + "s"].push(transaccion);
        } else {
            alert("Error, el tipo de transacción a agregar no es admitido");
            return;
        }
    }

    /* Agrega una transaccion al sistema segun su tipo */
    agregarTransaccion(tipo) {
        const nombreTransaccion = prompt(`Introduzca el nombre de su ${tipo.toLowerCase()}`);
        const valorTransaccion = parseFloat(prompt(`Introduzca el valor para el ${tipo.toLowerCase()} que desea agregar`));

        if (!isNaN(valorTransaccion) && valorTransaccion >= 0 && nombreTransaccion) {
            this.agregarTransaccionAListaPorTipo({
                id: this.contadorId++,
                nombre: nombreTransaccion,
                valor: valorTransaccion,
                tipo: tipo
            });

            verPresupuesto = true;

            let agregarTransaccionesAdicionales = prompt(`¿Desea agregar ${tipo.toLowerCase()}s adicionales? (S/N)`);

            if (agregarTransaccionesAdicionales.toUpperCase() === "S") {
                let numTransaccionesAdicionales = parseInt(prompt(`¿Cuántos ${tipo.toLowerCase()}s adicionales desea agregar?`));

                for (let i = 1; i <= numTransaccionesAdicionales; i++) {
                    let nombreTransaccionAdicional;
                    let valorTransaccionAdicional;
                    do {
                        nombreTransaccionAdicional = prompt(`Introduzca el nombre de su ${tipo.toLowerCase()} adicional #${i}`);
                        valorTransaccionAdicional = parseFloat(prompt(`Introduzca el valor de su ${tipo.toLowerCase()} adicional '${nombreTransaccionAdicional}' #${i}`));
                    } while (isNaN(valorTransaccionAdicional) || valorTransaccionAdicional < 0 || !nombreTransaccionAdicional);

                    this.agregarTransaccionAListaPorTipo({
                        id: this.contadorId++,
                        nombre: nombreTransaccionAdicional,
                        valor: valorTransaccionAdicional,
                        tipo: tipo
                    });
                }
            } else if (agregarTransaccionesAdicionales.toUpperCase() === "N") {
                alert(`Ok, no se agregarán ${tipo.toLowerCase()}s adicionales`);
            } else {
                alert("Opción inválida");
            }
            verPresupuesto = true;
            alert(`La suma total de ${tipo.toLowerCase()}s es: ${this.calcularTotalPorTipo(tipo)}`);
        } else {
            alert("Por favor, ingrese un valor válido");
        }
    }

    /* Elimina una transaccion segun el nombre y el tipo especificado */
    eliminarTransaccion(nombreTransaccion, tipo) {
        const lista = this[tipo.toLowerCase() + "s"];
        const posicion = lista.findIndex(t => t.nombre === nombreTransaccion);

        if (posicion !== -1) {
            lista.splice(posicion, 1);
            alert(`La transacción "${nombreTransaccion}" ha sido eliminada exitosamente.`);
        } else {
            alert(`La transacción con nombre "${nombreTransaccion}" que desea eliminar no existe.`);
        }
    }

    /* Suma los valores de los arrays segun el tipo */
    calcularTotalPorTipo(tipo) {
        let arrayTransacciones;
        switch (tipo) {
            case "Ingreso":
                arrayTransacciones = this.ingresos;
                break;
            case "Gasto":
                arrayTransacciones = this.gastos;
                break;
            case "Ahorro":
                arrayTransacciones = this.ahorros;
                break;
            default:
                alert("Error, tipo de transacción no admitido");
                return 0;
        }

        return arrayTransacciones.reduce((total, transaccion) => (transaccion && transaccion.valor) ? total + transaccion.valor : total, 0);
    }

    /* Calcula balance del presupuesto (Ahorros + Ingresos - Gastos) */
    calcularPresupuesto() {
        const ingresosTotales = this.calcularTotalPorTipo("Ingreso");
        const gastosTotales = this.calcularTotalPorTipo("Gasto");
        const ahorrosTotales = this.calcularTotalPorTipo("Ahorro");;

        if (ingresosTotales >= 0 && gastosTotales >= 0 && ahorrosTotales >= 0 && verPresupuesto) {
            this.presupuesto = ingresosTotales + ahorrosTotales - gastosTotales;
            alert(`El presupuesto actual es: ${this.presupuesto}`);
        } else {
            alert("No hay suficiente información para calcular el presupuesto");
        }
    }
    /* Devuelve true o false segun si encuentra transacciones del tipo especificado */
    hayTransacciones(tipo) {
        return this[tipo.toLowerCase() + "s"].length > 0;
    }

    /* Busca transacciones por el nombre entre todos los tipos de transaccion */
    buscarTransaccion(nombre) {
        const transaccionesEncontradas = this.ingresos.concat(this.gastos, this.ahorros)
            .filter(transaccion => transaccion.nombre.toLowerCase().includes(nombre.toLowerCase()));
        return transaccionesEncontradas;
    }

    /* Filtra transacciones segun el tipo entre dos valores */
    filtrarTransacciones(tipo, valorMinimo, valorMaximo) {
        const transaccionesFiltradas = this[tipo.toLowerCase() + "s"].filter(transaccion => {
            return (!isNaN(valorMinimo) && transaccion.valor >= valorMinimo) && (!isNaN(valorMaximo) && transaccion.valor <= valorMaximo);
        });
        return transaccionesFiltradas;
    }
}

/*********************/
/* Funcion principal */
/*********************/
function principal() {
    let nombreUsuario = prompt("Ingrese su nombre");
    while (!nombreUsuario) {
        nombreUsuario = prompt("Por favor, ingrese su nombre");
    }
    alert(`Bienvenido/a ${nombreUsuario}`);
    let gestorTransacciones = new GestorTransacciones();
    let opcion = "";
    do {
        opcion = prompt("Gestión de transacciones (ingresos/gastos/ahorros)\nIngrese una opción del 1 al 6\n\n1. Agregar o eliminar transacciones \n2. Buscar transacción\n3. Filtrar transacciones\n4. Ver transacciones\n5. Calcular presupuesto\n6. Salir");

        switch (opcion) {
            case "1":
                gestionarTransaccionesSubMenu(gestorTransacciones);
                break;
            case "2":
                buscarTransaccionSubMenu(gestorTransacciones);
                break;
            case "3":
                filtrarTransaccionesSubMenu(gestorTransacciones);
                break;
            case "4":
                verTransaccionesSubMenu(gestorTransacciones);
                break;
            case "5":
                gestorTransacciones.calcularPresupuesto();
                break;
            case "6":
                salirSubMenu();
                break;
            default:
                alert("Opción inválida");
                break;
        }
    } while (opcion != "6");
}

/* Submenu para agregar/eliminar transacciones */
function gestionarTransaccionesSubMenu(gestorTransacciones) {
    let subOpcion = "";
    do {
        subOpcion = prompt("Seleccione una opción:\n\n1. Agregar transacción\n2. Eliminar transacción\n3. Volver al menú principal");

        switch (subOpcion) {
            case "1":
                let tipoTransaccion = prompt("Seleccione el tipo de transacción\n1. Ingreso\n2. Gasto \n3. Ahorro\n4. Volver al menú anterior");
                switch (tipoTransaccion) {
                    case "1":
                        gestorTransacciones.agregarTransaccion("Ingreso");
                        break;
                    case "2":
                        gestorTransacciones.agregarTransaccion("Gasto");
                        break;
                    case "3":
                        gestorTransacciones.agregarTransaccion("Ahorro");
                        break;
                    default:
                        alert("Opción inválida");
                        break;
                }
                break;
            case "2":
                eliminarTransaccionSubMenu(gestorTransacciones);
                break;
        }
    } while (subOpcion != "3");
}

/* Submenu para eliminar transaccion segun su tipo */
function eliminarTransaccionSubMenu(gestorTransacciones) {
    let seleccionCategoria;

    do {
        seleccionCategoria = prompt("Seleccione el tipo de transacción a eliminar \n\n1. Ingreso\n2. Gasto\n3. Ahorro");
    } while (seleccionCategoria !== "1" && seleccionCategoria !== "2" && seleccionCategoria !== "3");

    let tipoTransaccion = gestorTransacciones.devolverTipoTransaccion(seleccionCategoria);

    let nombreTransaccion = prompt("Ingrese el nombre de la transacción que desea eliminar");

    gestorTransacciones.eliminarTransaccion(nombreTransaccion, tipoTransaccion);

}

/* Submenu para buscar transaccion segun su nombre */
function buscarTransaccionSubMenu(gestorTransacciones) {
    let nombreABuscar = prompt("Ingrese el nombre de la transacción que desea buscar");
    const transaccionesEncontradas = gestorTransacciones.buscarTransaccion(nombreABuscar);

    if (transaccionesEncontradas.length > 0) {
        const detallesTransacciones = transaccionesEncontradas.map(transaccion => {
            return `${transaccion.tipo}: ${transaccion.nombre} - Valor: ${transaccion.valor}`;
        }).join("\n");

        alert("Transacciones encontradas:\n" + detallesTransacciones);
    } else {
        alert("No se encontraron transacciones con el nombre '" + nombreABuscar + "'");
    }
}

/* Submenu para filtrar transaccion segun su tipo */
function filtrarTransaccionesSubMenu(gestorTransacciones) {
    let seleccionCategoria;

    do {
        seleccionCategoria = prompt("Ingrese el tipo de transacción a filtrar\n\n1. Ingreso\n2. Gasto\n3. Ahorro");
    } while (seleccionCategoria !== "1" && seleccionCategoria !== "2" && seleccionCategoria !== "3");

    let tipoAFiltrar = gestorTransacciones.devolverTipoTransaccion(seleccionCategoria);

    let valorMinimoAFiltrar = parseFloat(prompt("Ingrese el valor mínimo a filtrar"));
    let valorMaximoAFiltrar = parseFloat(prompt("Ingrese el valor máximo a filtrar"));

    const transaccionesFiltradas = gestorTransacciones.filtrarTransacciones(tipoAFiltrar, valorMinimoAFiltrar, valorMaximoAFiltrar);

    if (transaccionesFiltradas.length > 0) {
        alert("Transacciones filtradas:\n" + transaccionesFiltradas.map(transaccion => `${transaccion.nombre}: ${transaccion.valor}`).join("\n"));
    } else {
        alert("No se encontraron transacciones que cumplan con los criterios de filtrado");
    }
}

/* Submenu para visualizar las transacciones ingresadas en el sistema segun su tipo */
function verTransaccionesSubMenu(gestorTransacciones) {
    let seleccionCategoria;

    do {
        seleccionCategoria = prompt("Seleccione el tipo de transacción a ver \n\n1. Ingreso\n2. Gasto\n3. Ahorro");
    } while (seleccionCategoria !== "1" && seleccionCategoria !== "2" && seleccionCategoria !== "3");

    let tipoTransaccion = gestorTransacciones.devolverTipoTransaccion(seleccionCategoria);

    if (gestorTransacciones.hayTransacciones(tipoTransaccion)) {
        const transacciones = gestorTransacciones[tipoTransaccion.toLowerCase() + "s"];
        const transaccionesTexto = transacciones.map(transaccion => `${transaccion.nombre}: ${transaccion.valor}`).join("\n");

        const total = gestorTransacciones.calcularTotalPorTipo(tipoTransaccion);
        alert(`Todos los ${tipoTransaccion.toLowerCase()}s:\n${transaccionesTexto}\n\nTotal: ${total}`);
    } else {
        alert(`No hay ningún ${tipoTransaccion.toLowerCase()} registrado en el sistema.`);
    }
}

/* Submenu para salir del sistema */
function salirSubMenu() {
    let salir = "";
    do {
        salir = prompt("¿Está seguro/a que desea salir? (S/N)");
        if (salir.toUpperCase() == "N") {
            opcion = "";
        } else if (salir.toUpperCase() == "S") {
            alert("¡Muchas gracias por haber usado Presupuesto360!");
        } else {
            alert("Opción inválida. Por favor, ingrese S o N.");
        }
    } while (salir.toUpperCase() != "S" && salir.toUpperCase() != "N");
}

document.addEventListener('DOMContentLoaded', function () {

    var comenzarBtn = document.querySelector('.btn-info');

    comenzarBtn.addEventListener('click', function () {
        principal();
    });
});

/* Invocacion a la funcion principal del sistema */
principal();
