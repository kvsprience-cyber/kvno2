/* RecycleRight - Interactive features */

(function () {
  'use strict';

  // --- Navigation ---
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
      });
    });
  }

  // --- Materials Tabs ---
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const targetId = btn.getAttribute('data-tab');
      tabBtns.forEach(function (b) { b.classList.remove('active'); });
      tabContents.forEach(function (c) {
        c.classList.remove('active');
        if (c.id === targetId) c.classList.add('active');
      });
      btn.classList.add('active');
    });
  });

  // --- Quiz ---
  const quizData = [
    { q: 'Can a rinsed plastic water bottle be recycled?', options: ['Yes', 'No'], correct: 0, explain: 'Clean plastic bottles are widely recyclable.' },
    { q: 'Can greasy pizza boxes go in the recycling bin?', options: ['Yes', 'No'], correct: 1, explain: 'Greasy parts contaminate paper. Recycle only clean parts.' },
    { q: 'Can plastic bags go in curbside recycling?', options: ['Yes', 'No'], correct: 1, explain: 'Bags jam machines. Return them to store drop-offs.' },
    { q: 'Can aluminum cans be recycled?', options: ['Yes', 'No'], correct: 0, explain: 'Aluminum is one of the most recyclable materials.' },
    { q: 'Can used tissues or napkins be recycled?', options: ['Yes', 'No'], correct: 1, explain: 'Contaminated paper products go in trash or compost.' },
    { q: 'Can glass bottles and jars be recycled?', options: ['Yes', 'No'], correct: 0, explain: 'Glass is recyclable; rinse and keep whole.' }
  ];

  const quizContainer = document.getElementById('quizContainer');
  const quizResults = document.getElementById('quizResults');
  const quizQuestion = document.getElementById('quizQuestion');
  const quizOptions = document.getElementById('quizOptions');
  const quizFeedback = document.getElementById('quizFeedback');
  const quizNext = document.getElementById('quizNext');
  const quizRestart = document.getElementById('quizRestart');
  const quizCounter = document.getElementById('quizCounter');
  const progressFill = document.getElementById('progressFill');
  const quizScoreEl = document.getElementById('quizScore');
  const quizMessageEl = document.getElementById('quizMessage');

  let quizIndex = 0;
  let quizCorrect = 0;

  function showQuizQuestion() {
    const item = quizData[quizIndex];
    quizQuestion.textContent = item.q;
    quizFeedback.textContent = '';
    quizFeedback.className = 'quiz-feedback';
    quizNext.style.display = 'none';

    quizOptions.innerHTML = '';
    item.options.forEach(function (opt, i) {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = opt;
      btn.addEventListener('click', function () {
        if (btn.disabled) return;
        quizOptions.querySelectorAll('.quiz-option').forEach(function (b) { b.disabled = true; });
        const isCorrect = i === item.correct;
        if (isCorrect) {
          quizCorrect++;
          btn.classList.add('correct');
          quizFeedback.textContent = 'Correct! ' + item.explain;
          quizFeedback.className = 'quiz-feedback correct';
        } else {
          btn.classList.add('wrong');
          quizOptions.children[item.correct].classList.add('correct');
          quizFeedback.textContent = 'Not quite. ' + item.explain;
          quizFeedback.className = 'quiz-feedback wrong';
        }
        quizNext.style.display = 'inline-block';
      });
      quizOptions.appendChild(btn);
    });

    quizCounter.textContent = 'Question ' + (quizIndex + 1) + ' of ' + quizData.length;
    progressFill.style.width = ((quizIndex + 1) / quizData.length * 100) + '%';
  }

  function showQuizResults() {
    quizContainer.style.display = 'none';
    quizResults.style.display = 'block';
    quizScoreEl.textContent = quizCorrect;
    if (quizCorrect >= 5) {
      quizMessageEl.textContent = 'Great job! You know your recycling basics.';
    } else if (quizCorrect >= 3) {
      quizMessageEl.textContent = 'Good effort! Check the Materials Guide to learn more.';
    } else {
      quizMessageEl.textContent = 'Keep learning—every bit helps. Browse the guide above!';
    }
  }

  if (quizNext) {
    quizNext.addEventListener('click', function () {
      quizIndex++;
      if (quizIndex < quizData.length) {
        showQuizQuestion();
      } else {
        showQuizResults();
      }
    });
  }

  if (quizRestart) {
    quizRestart.addEventListener('click', function () {
      quizIndex = 0;
      quizCorrect = 0;
      quizContainer.style.display = 'block';
      quizResults.style.display = 'none';
      progressFill.style.width = '0%';
      showQuizQuestion();
    });
  }

  showQuizQuestion();

  // --- Impact Calculator ---
  const plasticBottles = document.getElementById('plasticBottles');
  const aluminumCans = document.getElementById('aluminumCans');
  const paperItems = document.getElementById('paperItems');
  const glassJars = document.getElementById('glassJars');
  const calcBtn = document.getElementById('calcBtn');
  const energyValue = document.getElementById('energyValue');
  const treesValue = document.getElementById('treesValue');
  const waterValue = document.getElementById('waterValue');

  if (calcBtn) {
    calcBtn.addEventListener('click', function () {
      const plastic = Math.max(0, parseInt(plasticBottles.value, 10) || 0);
      const cans = Math.max(0, parseInt(aluminumCans.value, 10) || 0);
      const paper = Math.max(0, parseInt(paperItems.value, 10) || 0);
      const glass = Math.max(0, parseInt(glassJars.value, 10) || 0);

      // Approximate equivalents (educational estimates)
      const energyHours = (plastic * 3) + (cans * 3) + (paper * 2) + (glass * 4);
      const treesEq = Math.round((paper * 0.02 + plastic * 0.01 + cans * 0.01) * 10) / 10;
      const waterGallons = (plastic * 15) + (cans * 20) + (paper * 7) + (glass * 5);

      energyValue.textContent = energyHours > 0 ? energyHours + '+' : '—';
      treesValue.textContent = treesEq > 0 ? treesEq : '—';
      waterValue.textContent = waterGallons > 0 ? waterGallons + '+' : '—';

      if (plastic === 0 && cans === 0 && paper === 0 && glass === 0) {
        energyValue.textContent = '—';
        treesValue.textContent = '—';
        waterValue.textContent = '—';
      }
    });
  }
})();
