const questions = [
  {
    question: "日本の首都はどこですか？",
    options: ["ソウル", "東京", "北京", "京都"],
    answer: "東京"
  },
  {
    question: "ひらがなを使う言語はどれですか？",
    options: ["中国語", "韓国語", "日本語", "タイ語"],
    answer: "日本語"
  },
  {
    question: "HTMLは何の略ですか？",
    options: ["ハイパーテキスト・マークアップ・ランゲージ", "ハイテキスト・マシン・ランゲージ", "ハイパーループ・マシン・ランゲージ", "なし"],
    answer: "ハイパーテキスト・マークアップ・ランゲージ"
  },
  {
    question: "JavaScriptを記述するためのタグはどれですか？",
    options: ["<js>", "<script>", "<javascript>", "<code>"],
    answer: "<script>"
  },
  {
    question: "JavaScriptで 2 + '2' の結果は？",
    options: ["4", "22", "NaN", "エラー"],
    answer: "22"
  },
  {
    question: "CSSで文字の色を変更するプロパティは？",
    options: ["font-color", "text-style", "color", "background"],
    answer: "color"
  },
  {
    question: "配列に要素を追加するメソッドは？",
    options: ["push()", "add()", "insert()", "append()"],
    answer: "push()"
  },
  {
    question: "DOMは何の略ですか？",
    options: ["ドキュメント・オブジェクト・モデル", "データ・アウトプット・メソッド", "デジタル・オーダー・マップ", "なし"],
    answer: "ドキュメント・オブジェクト・モデル"
  },
  {
    question: "JavaScriptでコメントを書くための記号は？",
    options: ["//", "/*", "#", "--"],
    answer: "//"
  },
  {
    question: "変数を宣言するためのキーワードは？",
    options: ["var", "int", "define", "dim"],
    answer: "var"
  }
];

let shuffled = [];
let currentIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;

const startBtn = document.getElementById("startBtn");
const quizBox = document.getElementById("quizBox");
const questionContainer = document.getElementById("questionContainer");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const resultDiv = document.getElementById("result");
const resultText = document.getElementById("resultText");
const retryBtn = document.getElementById("retryBtn");
const leaderboard = document.getElementById("leaderboard");
const timeDisplay = document.getElementById("time");
const progressBar = document.getElementById("progressBar");

function playSound(type) {
  const sounds = {
    correct: "audio/correct.mp3",
    wrong: "audio/wrong.mp3",
    win: "audio/win.mp3"
  };
  const audio = new Audio(sounds[type]);
  audio.play();
}

startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  quizBox.style.display = "block";
  shuffled = questions.sort(() => Math.random() - 0.5);
  currentIndex = 0;
  score = 0;
  showQuestion();
  startTimer();
  updateProgressBar();
});

nextBtn.addEventListener("click", () => {
  checkAnswer();
  currentIndex++;
  if (currentIndex < shuffled.length) {
    showQuestion();
    resetTimer();
    updateProgressBar();
  } else {
    endQuiz();
  }
});

submitBtn.addEventListener("click", () => {
  checkAnswer();
  endQuiz();
});

retryBtn.addEventListener("click", () => {
  resultDiv.classList.remove("show");
  resultDiv.classList.add("hidden");
  resultText.textContent = "";
  leaderboard.innerHTML = "";
  startBtn.style.display = "inline-block";
});

function showQuestion() {
  questionContainer.innerHTML = "";
  const q = shuffled[currentIndex];

  const questionText = document.createElement("p");
  questionText.textContent = `${currentIndex + 1}. ${q.question}`;
  questionContainer.appendChild(questionText);

  const optionsDiv = document.createElement("div");
  optionsDiv.classList.add("options");

  q.options.forEach(opt => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "option";
    input.value = opt;
    label.appendChild(input);
    label.appendChild(document.createTextNode(opt));
    optionsDiv.appendChild(label);
  });

  questionContainer.appendChild(optionsDiv);

  nextBtn.style.display = currentIndex < shuffled.length - 1 ? "inline-block" : "none";
  submitBtn.style.display = currentIndex === shuffled.length - 1 ? "inline-block" : "none";
}

function checkAnswer() {
  const selected = document.querySelector('input[name="option"]:checked');
  if (selected && selected.value === shuffled[currentIndex].answer) {
    score++;
    playSound("correct");
  } else {
    playSound("wrong");
  }
}

function startTimer() {
  timeLeft = 15;
  timeDisplay.textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      playSound("wrong");
      nextBtn.click();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  startTimer();
}

function updateProgressBar() {
  const progress = ((currentIndex + 1) / shuffled.length) * 100;
  progressBar.style.width = `${progress}%`;
}

function endQuiz() {
  clearInterval(timer);
  quizBox.style.display = "none";
  const percentage = Math.round((score / shuffled.length) * 100);
  resultText.textContent = `あなたのスコアは ${percentage}% — ${percentage >= 80 ? "✅ 合格" : "❌ 不合格"}`;
  resultDiv.classList.add("show");
  resultDiv.classList.remove("hidden");
  localStorage.setItem("lastScore", percentage);
  saveToLeaderboard(percentage);
  showLeaderboard();
  playSound("win");
}

function saveToLeaderboard(score) {
  let scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
  scores.push(score);
  scores.sort((a, b) => b - a);
  scores = scores.slice(0, 5);
  localStorage.setItem("leaderboard", JSON.stringify(scores));
}

function showLeaderboard() {
  const scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.innerHTML = "<h2>🏆 ランキング</h2><ol>" + scores.map(s => `<li>${s}%</li>`).join("") + "</ol>";
}
