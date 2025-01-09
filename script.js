let questions = [];
let currentIndex = 0;

document.getElementById("processImage").addEventListener("click", () => {
  const imageInput = document.getElementById("imageInput").files[0];
  if (!imageInput) {
    alert("Please upload an image.");
    return;
  }

  // Use Tesseract.js for OCR
  Tesseract.recognize(imageInput, "eng")
    .then(({ data: { text } }) => {
      questions = parseQuestions(text);
      if (questions.length > 0) {
        document.getElementById("questionContainer").style.display = "block";
        document.getElementById("nextQuestion").disabled = false;
        showQuestion();
      } else {
        alert("No questions found in the image.");
      }
    })
    .catch((err) => {
      console.error("OCR Error:", err);
      alert("Failed to extract text. Please try again.");
    });
});

document.getElementById("nextQuestion").addEventListener("click", () => {
  currentIndex++;
  if (currentIndex < questions.length) {
    showQuestion();
  } else {
    alert("You have reached the end of the questions.");
    document.getElementById("nextQuestion").disabled = true;
  }
});

function parseQuestions(text) {
  const lines = text.split("\n").map((line) => line.trim());
  const questionsArray = [];
  let currentQuestion = null;

  lines.forEach((line) => {
    if (/^\d+\./.test(line)) {
      // Start of a new question
      if (currentQuestion) {
        questionsArray.push(currentQuestion);
      }
      currentQuestion = { question: line, options: [] };
    } else if (/^[a-dA-D]\./.test(line)) {
      // Option line
      if (currentQuestion) {
        currentQuestion.options.push(line);
      }
    }
  });

  // Add the last question
  if (currentQuestion) {
    questionsArray.push(currentQuestion);
  }

  return questionsArray;
}

function showQuestion() {
  const currentQuestion = questions[currentIndex];
  document.getElementById("question").innerText = currentQuestion.question;
  const optionsList = document.getElementById("options");
  optionsList.innerHTML = "";
  currentQuestion.options.forEach((option) => {
    const li = document.createElement("li");
    li.innerText = option;
    optionsList.appendChild(li);
  });
}
