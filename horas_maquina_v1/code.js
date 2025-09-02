document.getElementById('filtro').addEventListener('change', updateItems);
document.getElementById('item').addEventListener('change', updateSite);
document.getElementById('ficha').addEventListener('click', function() {
	const filtro = document.getElementById('filtro').value;
	const itemValue = document.getElementById('item').value;
	const filtered = data.filter(d => d[filtro.toLowerCase()] === itemValue);
	const infoSection = document.querySelector('.proyectos__list');
	const selectedText = infoSection.querySelector('div[style*="font-weight: bold"]')?.textContent;
	const selected = filtered.find(d => `${d.municipio} - ${d.cauce}: ${d.sitio}` === selectedText);
	if (selected && selected.ficha) {
		window.open(selected.ficha, '_blank');
	}
});
document.getElementById('reset').addEventListener('click', function(e) {
    const ficha = document.getElementById('ficha');
    const item = document.getElementById('item');
	const mapa = document.getElementById('mapa-satelital');
	const leyenda = document.querySelector('.leyenda');
	const dependencias = document.querySelector('.dependencias');
    const infoSection = document.querySelector('.proyectos__list');
	infoSection.innerHTML = '';
	leyenda.style.display = 'block';
	dependencias.style.display = 'block';
	mapa.src = 'https://www.google.com/maps/d/embed?mid=1jmOK4dzh7iQGKLCEw0-IG9uw7vCCmp0&ehbc=2E312F&noprof=1';
    item.innerHTML = '<option value="">Selecciona una opción</option>';
	updateSite();
	detalle.classList.remove('detalle--visible');
	cb.checked = false;
	ficha.style.display = 'none';
});
    
document.querySelector('.proyectos__list').addEventListener('click', function(e) {
	if (e.target && e.target.nodeName === 'DIV') {
		// Quitar negrita de todos los elementos
		document.querySelectorAll('.proyectos__list div').forEach(div => {
			div.style.fontWeight = 'normal';
		});
		// Poner negrita al seleccionado
		e.target.style.fontWeight = 'bold';

		const text = e.target.textContent;
		const leyenda = document.querySelector('.leyenda');
		const dependencias = document.querySelector('.dependencias');
		const filtro = document.getElementById('filtro').value;
		const itemValue = document.getElementById('item').value;
		const filtered = data.filter(d => d[filtro.toLowerCase()] === itemValue);
		const ficha = document.getElementById('ficha');
		const selected = filtered.find(d => `${d.municipio} - ${d.cauce}: ${d.sitio}` === text);
		if (selected) {
			// Actualizar mapa
			if (selected.maps) {
				document.getElementById('mapa-satelital').src = selected.maps;
				leyenda.style.display = 'none';
				dependencias.style.display = 'none';
			}
			// Actualizar detalle
			Object.keys(selected).forEach(key => {
				const input = document.getElementById(key);
				if (input) {
					input.value = selected[key];
				}
			});
			ficha.style.display = 'block';
		}
	}
});

function updateItems() {
    const filtro = document.getElementById('filtro').value;
    const item = document.getElementById('item');
    item.innerHTML = '<option value="">Selecciona una opción</option>';
    if (filtro) {
        const uniqueValues = [...new Set(data.map(item => item[filtro.toLowerCase()]))];
        uniqueValues.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            item.appendChild(option);
        });
    }
}

function updateSite() {
    const filtro = document.getElementById('filtro').value;
    const itemValue = document.getElementById('item').value;
    const infoSection = document.querySelector('.proyectos__list');
    infoSection.innerHTML = '';
	if (filtro && itemValue) {
		const filtered = data.filter(d => d[filtro.toLowerCase()] === itemValue);
		filtered.forEach(d => {
			const div = document.createElement('div');
			div.textContent = `${d.municipio} - ${d.cauce}: ${d.sitio}`;
			infoSection.appendChild(div);
		});
	} else {
		// Vacía los inputs dentro de .detalle
		const inputs = document.querySelectorAll('.detalle input');
		inputs.forEach(input => input.value = '');
	}
}

const cb = document.getElementById('adicional_cb');
const detalle = document.querySelector('.detalle');
function toggleDetalle() {
	if (cb.checked) {
		detalle.classList.add('detalle--visible');
	} else {
		detalle.classList.remove('detalle--visible');
	}
}
cb.addEventListener('change', toggleDetalle);
// Inicializa el estado al cargar
toggleDetalle();

let data = [];

window.addEventListener('DOMContentLoaded', () => {
	fetch('./asset/csv/planificacion.csv')
		.then(response => response.text())
		.then(csvText => {
			data = csvToArray(csvText);
			updateItems();
			updateSite();
		});
});

// Simple CSV to array of objects parser (assumes first row is header, comma separated)
function csvToArray(csv) {
	const lines = csv.trim().split('\n');
	const headers = lines[0].split(',');
	return lines.slice(1).map(line => {
		const values = line.split(',');
		const obj = {};
		headers.forEach((header, i) => {
			obj[header.trim()] = values[i] ? values[i].trim() : '';
		});
		return obj;
	});
}
