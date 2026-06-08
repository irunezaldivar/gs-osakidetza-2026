let allQuestions = [];
let questions = [];
let wrongQuestions = [];

let ramaSeleccionada = "";
let temarioSeleccionado = "";

let idx = 0;
let correctCount = 0;
let wrongCount = 0;
let answered = false;

const screens = ['screen-rama', 'screen-temario', 'screen-test'];

function mostrarPantalla(nombre) {

    screens.forEach(id => {
        document.getElementById(id).style.display = 'none';
    });

    if (nombre === 'screen-test') {
        document.getElementById(nombre).style.display = 'block';
    }
	else {
        document.getElementById(nombre).style.display = 'flex';
    }
}

async function load() {

    try {
        const response = await fetch('questions.json');

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`);
		}

		allQuestions = await response.json();
        document.getElementById('loading').style.display = 'none';
        mostrarPantalla('screen-rama');
    }
	catch(error) {
        console.error(error);
        document.getElementById('loading').innerHTML = '<h2>Error cargando questions.json</h2>';
    }
}

function shuffle(arr) {
	
	for (let i = arr.length - 1; i > 0; i--) {
		
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
}

function render() {
	
	answered = false;
	const q = questions[idx];
	
	const progress = ((idx + 1) / questions.length) * 100;
	document.getElementById("progress-bar").style.width = `${progress}%`;
	document.getElementById('score').textContent = `Puntuación: ${correctCount}/${idx + 1}`;
	
	const ramaTexto =
		ramaSeleccionada === "informatica"
			? "TÉCNICO/A ESPECIALISTA INFORMÁTICA"
			: ramaSeleccionada === "trabajosocial"
				? "TRABAJADOR/A SOCIAL"
				: ramaSeleccionada === "cocina"
					? "COCINERO/A"
					: "TÉCNICO/A SUPERIOR NORMALIZACIÓN DE EUSKERA";

	const temarioTexto =
		temarioSeleccionado === "general"
			? "GENERAL"
			: temarioSeleccionado === "especifico"
				? "ESPECÍFICO"
				: "COMPLETO";

	document.getElementById('info').textContent = `${ramaTexto} · ${temarioTexto} · Pregunta ${idx + 1} de ${questions.length}`;
	document.getElementById('question').textContent = q.text;
	
	const optionsDiv = document.getElementById('options');
	optionsDiv.innerHTML = '';
	const letters = ['A','B','C','D'];
	const opts = q.options.map((t,i)=>({ key: letters[i], text: t }));
	
	opts.forEach(o => {

		const btn = document.createElement('button');
		
		btn.className = 'option w-full text-left p-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 transition';
		btn.textContent = `${o.key}. ${o.text}`;
		btn.onclick = () => select(o.key, q.correct, q.explanation, btn);
		
		optionsDiv.appendChild(btn);
	});
	
	document.getElementById('explanation').textContent = '';
}

function select(choice, correct, explanation, btn) {
	
	if (answered) return;
	answered = true;
	
	const buttons = document.querySelectorAll('.option');
	buttons.forEach(b => b.disabled = true);
	
	if (choice === correct) {

		btn.classList.add('bg-green-100', 'border-green-600');
		correctCount++;
	} 
	else {
		wrongCount++;
		wrongQuestions.push(q.id);

		btn.classList.add('bg-red-100', 'border-red-600');
		
		// marca también la correcta
		buttons.forEach(b => {

			if (b.textContent.startsWith(correct + '.'))
				b.classList.add('bg-green-100', 'border-green-600');
		});
	}

	document.getElementById('explanation').textContent = explanation || '';
	document.getElementById('score').textContent = `✔️ ${correctCount} · ❌ ${wrongCount}`;
}

document.getElementById('next').onclick = () => {

	if (!answered) {
        alert("Debes responder primero");
        return;
    }

    if (idx >= questions.length - 1) {
        alert(`Test finalizado\n\nAciertos: ${correctCount}/${questions.length}`);
        return;
    }

    idx++;
    render();
};

load();

function startTest() {

    questions = allQuestions.filter(q => {

        if (!q.rama.includes(ramaSeleccionada))
			return false;

        if (temarioSeleccionado === "completo")
			return true;

        return q.temario === temarioSeleccionado;
    });

	console.log(`Preguntas cargadas: ${questions.length}`);
    shuffle(questions);

    idx = 0;
    correctCount = 0;
	wrongCount = 0;

	if (questions.length === 0) {
        alert("No hay preguntas para esta selección");
        return;
    }

    mostrarPantalla('screen-test');
    render();
}

document.getElementById('btn-normalizacion').onclick = () => {
    ramaSeleccionada = "normalizacion";
    mostrarPantalla('screen-temario');
};

document.getElementById('btn-trabajosocial').onclick = () => {
    ramaSeleccionada = "trabajosocial";
    mostrarPantalla('screen-temario');
};

document.getElementById('btn-cocina').onclick = () => {
    ramaSeleccionada = "cocina";
    mostrarPantalla('screen-temario');
};

document.getElementById('btn-informatica').onclick = () => {
    ramaSeleccionada = "informatica";
    mostrarPantalla('screen-temario');
};

document.getElementById('btn-general').onclick = () => {
    temarioSeleccionado = "general";
    startTest();
};

document.getElementById('btn-especifico').onclick = () => {
    temarioSeleccionado = "especifico";
    startTest();
};

document.getElementById('btn-completo').onclick = () => {
    temarioSeleccionado = "completo";
    startTest();
};

document.getElementById('btn-volver-rama').onclick = () => {
    mostrarPantalla('screen-rama');
};

document.getElementById('btn-volver-menu').onclick = () => {

    if (confirm("¿Quieres abandonar el test actual?")) {

		questions = [];
		idx = 0;
		correctCount = 0;

		document.getElementById('options').innerHTML = '';
		document.getElementById('question').textContent = '';
		document.getElementById('score').textContent = '';
		document.getElementById('info').textContent = '';
		document.getElementById('explanation').textContent = '';

		mostrarPantalla('screen-rama');
	}
};

document.getElementById('btn-falladas').onclick = () => {

    questions = allQuestions.filter(q =>
        wrongQuestions.includes(q.id)
    );

    if (questions.length === 0) {
        alert("Todavía no tienes preguntas falladas");
        return;
    }

    shuffle(questions);

    idx = 0;
    correctCount = 0;
    wrongCount = 0;

    mostrarPantalla('screen-test');
    render();
};