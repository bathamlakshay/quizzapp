const start = document.getElementById("start-btn");
const categoryEl = document.getElementById("category");
const difficultyEl = document.getElementById("difficulty");
const questionsEl = document.getElementById("amount");

let questions = [];
let currentIndex = 0;

let score = 0;
let timer 
let timeLeft = 15

start.addEventListener("click", function () {
  const category = categoryEl.value;
  const difficulty = difficultyEl.value;
  const amount = questionsEl.value;

// for save the data
  localStorage.setItem('category', category)
  localStorage.setItem('difficulty', difficulty)
  localStorage.setItem('amount', amount)
// 

  const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`;

  console.log(url);

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      questions = data.results;
      currentIndex = 0;
      console.log(questions);
      showquestions();
    });
});


function startTimer(){
  timeLeft = 15
  document.getElementById("timer").textContent = `${timeLeft}s` 

  timer = setInterval(() => {
    timeLeft--
    document.getElementById('timer').textContent = `${timeLeft}s`

    if (timeLeft === 0) {
      clearInterval(timer)
      document.querySelectorAll('.option-btn').forEach(b => b.disabled = true)
      setTimeout(() => {
                currentIndex++
                if(currentIndex < questions.length) {
                    showquestions()
                } else {
                    showResult()
                }
            }, 1000)
    }
  },1000)
}


function showquestions() {
  const q = questions[currentIndex];
  console.log(q.question);
  console.log(q.correct_answer);
  console.log(q.incorrect_answers);

  

  document.getElementById("start-screen").style.display = "none";
  document.getElementById("question-screen").style.display = "block";

  document.getElementById("question-count").textContent =
    `Question ${currentIndex + 1} of ${questions.length}`;

  document.getElementById("question-text").innerHTML = q.question;

  const all0pt = [...q.incorrect_answers, q.correct_answer];
  all0pt.sort(() => Math.random() - 0.5);

  const container = document.getElementById("options-container");
  container.innerHTML = "";
  
  

  all0pt.forEach((option) => {
    const btn = document.createElement("button");
    btn.innerHTML = option;
    btn.classList.add("option-btn");
    container.appendChild(btn);

    btn.addEventListener("click", () => {
      clearInterval(timer)
      const correct = q.correct_answer;

      if (option === correct) {
        btn.style.background = "#E1F5EE";
        btn.style.borderColor = "#1D9E75";
        btn.style.color = "#085041";
        score++
      } else {
        btn.style.background = "#FCEBEB";
        btn.style.borderColor = "#E24B4A";
        btn.style.color = "#791F1F";
      }

      document
        .querySelectorAll(".option-btn")
        .forEach((b) => (b.disabled = true));

      setTimeout(() => {
        currentIndex++;
        if (currentIndex < questions.length) {
          showquestions();
        } else {
          showResult()
        }
      }, 1500);
    });
  });
  startTimer()
  
}





function showResult(){
  document.getElementById('question-screen').style.display = 'none'
  document.getElementById('result-screen').style.display = 'block'

  const total = questions.length
  const wrong = total - score
  const percentage = Math.round((score / total) * 100)

  document.getElementById("score-num").textContent = score
  document.getElementById("score-den").textContent = `out of ${total}`
  document.getElementById("correct-count").textContent = score
  document.getElementById("wrong-count").textContent = wrong
  document.getElementById("result-sub").textContent = `You scored ${percentage}%`

  if(percentage >= 80) {
        document.getElementById('result-msg').textContent = 'Excellent!'
    } else if(percentage >= 50) {
        document.getElementById('result-msg').textContent = 'Good job!'
    } else {
        document.getElementById('result-msg').textContent = 'Keep practicing!'
    }
  

    document.getElementById('restart-btn').addEventListener('click', () => {
        score = 0
        currentIndex = 0
        document.getElementById('result-screen').style.display = 'none'
        document.getElementById('start-screen').style.display = 'block'
    })

    
}

// restore saved preferences on page load
window.addEventListener('load', () => {
    if(localStorage.getItem('category')) {
        categoryEl.value = localStorage.getItem('category')
    }
    if(localStorage.getItem('difficulty')) {
        difficultyEl.value = localStorage.getItem('difficulty')
    }
    if(localStorage.getItem('amount')) {
        questionsEl.value = localStorage.getItem('amount')
    }
})


