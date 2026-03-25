const start = document.getElementById("start-btn");
const categoryEl = document.getElementById("category");
const difficultyEl = document.getElementById("difficulty");
const questionsEl = document.getElementById("amount");

let questions = [];
let currentIndex = 0;

let timer;
let timeLeft = 15;

start.addEventListener("click", function () {
  const category = categoryEl.value;
  const difficulty = difficultyEl.value;
  const amount = questionsEl.value;

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
      const correct = q.correct_answer;

      if (option === correct) {
        btn.style.background = "#E1F5EE";
        btn.style.borderColor = "#1D9E75";
        btn.style.color = "#085041";
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
          console.log("Quiz finished");
        }
      }, 1500);
    });
  });

}
