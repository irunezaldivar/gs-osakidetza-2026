let allQuestions = [];
let questions = [];

let ramaSeleccionada = "";
let temarioSeleccionado = "";

let idx = 0;
let correctCount = 0;
let answered = false;

let questions = [];
let idx = 0, correctCount = 0, answered = false;

async function load() {
	
	const response = await fetch('questions.json');
	allQuestions = await response.json();
}

function shuffle(arr) {
	
	for (let i = arr.length - 1; i > 0; i--) {
		
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
}

function render() {
	
	if (questions.length === 0) {

		document.getElementById('question').textContent = 'No hay preguntas para esta selección';
		return;
	}
	
	answered = false;
	const q = questions[idx];
	
	const progress = ((idx + 1) / questions.length) * 100;
	document.getElementById("progress-bar").style.width = `${progress}%`;
	
	document.getElementById('score').textContent = `Puntuación: ${correctCount}/${idx}`;
	document.getElementById('info').textContent = `${ramaSeleccionada} - ${temarioSeleccionado} | Pregunta ${idx + 1} de ${questions.length}`;
	document.getElementById('question').textContent = q.text;
	
	const optionsDiv = document.getElementById('options');
	optionsDiv.innerHTML = '';
	const letters = ['A','B','C','D'];
	const opts = q.options.map((t,i)=>({ key: letters[i], text: t }));
	
	// Opcional: aleatorizar opciones
	// shuffle(opts);
	
	opts.forEach(o => {
		const btn = document.createElement('button');
		
		btn.className = 'w-full text-left p-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 transition';
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
		
		btn.classList.add('bg-red-100', 'border-red-600');
		
		// marca también la correcta
		buttons.forEach(b => {
			
			if (b.textContent.startsWith(correct + '.')) b.classList.add('correct');
		});
	}
	document.getElementById('explanation').textContent = explanation || '';
	document.getElementById('score').textContent = `Puntuación: ${correctCount}/${idx+1}`;
}

document.getElementById('next').onclick = () => 
{
	idx = (idx + 1) % questions.length;
	render();
};
document.getElementById('shuffle').onchange = load;

load();

function startTest() {

    questions = allQuestions.filter(q => {

        if (q.rama !== ramaSeleccionada) return false;
        if (temarioSeleccionado === "completo") return true;
        return q.temario === temarioSeleccionado;
    });

    shuffle(questions);

    idx = 0;
    correctCount = 0;

    document.getElementById('screen-temario').style.display = 'none';
    document.getElementById('screen-test').style.display = 'block';

    render();
}

document.getElementById('btn-informatica').onclick = () => {

    ramaSeleccionada = "informatica";

    document.getElementById('screen-rama').style.display = 'none';
    document.getElementById('screen-temario').style.display = 'block';
};

document.getElementById('btn-trabajosocial').onclick = () => {

    ramaSeleccionada = "trabajosocial";

    document.getElementById('screen-rama').style.display = 'none';
    document.getElementById('screen-temario').style.display = 'block';
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