// type Parameter = {
//     name: string;
//     type: number | string;
// }

// TODO: Porcentual. Dejar elegir desde el 00.00% hasta el 100% por defecto. Pero dejar subir mas allá supongo
// TODO: Unidad tiene que ser opcional
// TODO: Quizas cambiar el nombre de "valores normales" a "valores de referencia"

/**
 * Este seria para un parametro donde se espera que el resultado sea absoluto basado en texto.
 * Podria ser un parametro que solo necesita una observacion de lo que se hayó o vió. No tengo un ejemplo
 * especifico de un parametro que cumpla esto, pero seria buena idea tenerlo y ya.
 * Podria ser, por ejemplo (un ejemplo inventado claro): PARAMETRO: Poco conteo. Donde `PARAMETRO` es el nombre
 * del parametro, y "Poco conteo", es lo que se se añadió arbitrariamente cuando se lleno el exámen.
 * Luego, en otro exámen, seria PARAMETRO: Mucho conteo. Donde nuevamente, `PARAMETRO` es el nombre del parametro
 * y `Mucho conteo` es el valor que se añadió arbitrariamente segun lo que el bionalista decidió.
 */
export const basicTextParameter = {
	name: 'parametro',
	type: 'text',
	unit: 'ml/g',
	input: {
		type: 'fixed',
		// value representa el "normal values" de este parametro
		value: null // This can be a string or just null (no normal values needed)
	}
};

/**
 * Este seria para un parametro donde queremos que el resultado solo pueda contener un rango de elementos EN TEXTO.
 * Digamos, un prueba de embarazo. Tendria como opciones, Positivo y Negativo. Por supuesto tendria la opcion de agregar
 * mas opciones en caso de ser necesario
 */
export const selectTextParameter = {
	name: 'parametro',
	type: 'text',
	input: {
		type: 'select',
		// This array will be modificable. We could change the position of the
		value: [
			{
				id: 101, // Unique ID. Maybe can be generated with UUID V5
				position: 0, // Use position to organize, reorganize and delete options
				text: 'Option1'
			},
			{
				id: 102,
				position: 1,
				text: 'Option2'
			},
			{
				id: 103,
				position: 2,
				text: 'Option3'
			}
			// ... more
		]
	}
};

// /**
//  * Similar con el texto, sencillamente dejar meter un numero arbitrario
//  */
export const basicNumberParameter = {
	name: 'parametro',
	type: 'number',
	unit: 'ml/g',
	input: {
		type: 'fixed',
		value: null
	}
};

export const numberParemeterWithRefValues = {
	name: 'Glicemia Basal',
	type: 'number', // allow up to two (2) decimals
	unit: 'mg/dl',
	referenceValues: [70.0, 110.0] // Al final se deberia ver 70.0 - 110.0 mg/dl
};
