let questions = [];
    let idx = 0, correctCount = 0, answered = false;

    async function load() {
	  const response = await fetch('questions.json');
	  questions = await response.json();

	  if (document.getElementById('shuffle').checked) {
		shuffle(questions);
	  }

	  render();
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
      document.getElementById('score').textContent = `Puntuación: ${correctCount}/${idx}`;
      document.getElementById('question').textContent = q.text;
      const optionsDiv = document.getElementById('options');
      optionsDiv.innerHTML = '';
      const letters = ['A','B','C','D'];
      const opts = q.options.map((t,i)=>({ key: letters[i], text: t }));
      // Opcional: aleatorizar opciones
      // shuffle(opts);
      opts.forEach(o=>{
        const btn = document.createElement('button');
        btn.className = 'option';
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
        btn.classList.add('correct');
        correctCount++;
      } else {
        btn.classList.add('wrong');
        // marca también la correcta
        buttons.forEach(b => {
          if (b.textContent.startsWith(correct + '.')) b.classList.add('correct');
        });
      }
      document.getElementById('explanation').textContent = explanation || '';
      document.getElementById('score').textContent = `Puntuación: ${correctCount}/${idx+1}`;
    }

    document.getElementById('next').onclick = () => {
      idx = (idx + 1) % questions.length;
      render();
    };
    document.getElementById('shuffle').onchange = load;

    load();