function login() {
  let name = document.getElementById("name").value;
  document.getElementById("studentName").innerText = name;

  document.getElementById("loginPage").style.display = "none";
  document.getElementById("mainPage").style.display = "block";
}

function loadImage(event) {
  let img = document.getElementById("preview");
  img.src = URL.createObjectURL(event.target.files[0]);
}

// ADD SUBJECT
function addSubject(name="", total="", credit="") {
  let table = document.getElementById("subjectTable");

  let row = table.insertRow();

  row.insertCell(0).innerHTML = `<input value="${name}">`;
  row.insertCell(1).innerHTML = `<input class="total" value="${total}">`;
  row.insertCell(2).innerHTML = `<input class="credits" value="${credit}">`;
}

// 🤖 AUTO FILL FROM IMAGE
function autoFill() {
  let img = document.getElementById("preview");

  if (!img.src) {
    alert("Upload image first");
    return;
  }

  alert("Reading image... please wait");

  Tesseract.recognize(img.src, 'eng')
    .then(({ data: { text } }) => {

      console.log(text);

      let lines = text.split("\n");

      for (let line of lines) {

        // simple detection (marks)
        let numbers = line.match(/\d+/g);

        if (numbers && numbers.length >= 2) {
          let total = numbers[numbers.length - 2]; // approx
          let credit = 4; // default

          addSubject("Subject", total, credit);
        }
      }

      alert("Auto-fill completed (check data)");
    });
}

// GRADE
function getGP(m) {
  if (m >= 90) return 10;
  if (m >= 80) return 9;
  if (m >= 70) return 8;
  if (m >= 60) return 7;
  if (m >= 50) return 6;
  return 0;
}

// SGPA
function calculateSGPA() {
  let totals = document.getElementsByClassName("total");
  let credits = document.getElementsByClassName("credits");

  let tp = 0, tc = 0;

  for (let i = 0; i < totals.length; i++) {
    let t = Number(totals[i].value);
    let c = Number(credits[i].value);

    if (!t || !c) continue;

    tp += getGP(t) * c;
    tc += c;
  }

  let sgpa = (tp / tc).toFixed(2);
  document.getElementById("sgpaResult").innerText = "SGPA: " + sgpa;
}

// CGPA
function calculateCGPA() {
  let prev = Number(document.getElementById("prevCgpa").value);
  let sem = Number(document.getElementById("prevSem").value);

  let sgpa = Number(document.getElementById("sgpaResult").innerText.replace("SGPA: ",""));

  let cgpa = ((prev * sem) + sgpa) / (sem + 1);

  document.getElementById("cgpaResult").innerText = "CGPA: " + cgpa.toFixed(2);
}
