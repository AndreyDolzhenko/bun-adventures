const infoBlock = document.getElementById("infoBlock");
const score = document.getElementById("score");

const drawingCanvas = document.getElementById("drawing-canvas");
const mainBlock = document.querySelector("main");

let level = 1;

function PortalInSpice() {
    let portalPosition = startPosition;
    const img = new Image();
    img.src = "./img/portal.png";
    img.onload = () => {
        drawForest.drawImage(img, startPosition, 100); // (изображение, x, y, ширина, высота)
    };

    if (portalPosition < 0) {
        goToLevelTwo();
        drawingCanvas.style.display = "none";
        mainBlock.style.display = "block";
        clearInterval(currentInterval);
    }
}

function owl(startPosition) {
    const img = new Image();
    img.src = "./img/angry_owl.png";
    img.onload = () => {
        drawForest.drawImage(img, startPosition, 100, 200, 150); // (изображение, x, y, ширина, высота)
    };
}

function hare(harePosition) {
    const img = new Image();
    img.src = "./img/hare.png";
    img.onload = () => {
        drawForest.drawImage(img, harePosition, 300, 200, 150); // (изображение, x, y, ширина, высота)
    };
}

let currentScore = 0;

score.innerText = currentScore;

function Stump(start) {
    // Залитый
    drawForest.fillStyle = "#82471f";
    drawForest.fillRect(start, 330, 50, 100); // (x, y, ширина, высота)

    // // Контур
    // drawForest.strokeStyle = "#0000ff";
    // drawForest.lineWidth = 3;
    // drawForest.strokeRect(100, 100, 150, 80);
}

// Линии
function drawLine(a, b, c, d, color, width) {
    drawForest.beginPath();
    drawForest.moveTo(a, b);
    drawForest.lineTo(c, d);
    drawForest.strokeStyle = color;
    drawForest.lineWidth = width;
    drawForest.stroke();
}

// Солнце
function Sun() {
    drawForest.beginPath();
    drawForest.arc(700, 50, 50, 0, Math.PI * 2); // от 0° до 180°
    drawForest.fillStyle = "#f0e00b";
    drawForest.fill();

    let a = 20;
    let b = 500;
    let c = 50;
    let d = 700;

    for (let index = 0; index < 10; index++) {
        drawLine(d, 20, b, c, "#f0e00b", 5);

        a += 30;
        b += 20;
        c += 50;
        d += 4;
    }
}

// Колобок
function Bun(top) {
    drawForest.beginPath();
    drawForest.arc(100, top, 50, 0, Math.PI * 2); // от 0° до 180°
    drawForest.fillStyle = "#f0e00b";
    drawForest.fill();

    drawForest.beginPath();
    drawForest.arc(120, top - 20, 10, 0, Math.PI * 2); // от 0° до 180°
    drawForest.fillStyle = "#4aeded";
    drawForest.fill();

    drawForest.beginPath();
    drawForest.arc(120, top - 20, 3, 0, Math.PI * 2); // от 0° до 180°
    drawForest.fillStyle = "black";
    drawForest.fill();

    // Улыбка (дуга)
    drawForest.beginPath();
    drawForest.arc(130, top, 40, Math.PI / 2, Math.PI);
    drawForest.strokeStyle = "#000000";
    drawForest.lineWidth = 5;
    drawForest.stroke();
}

// drawForest.beginPath();
// drawForest.moveTo(100, 400);
// drawForest.lineTo(100, 200);
// drawForest.lineWidth = 5;
// drawForest.stroke();

// drawLine(101, 400, 100, 200, "black", 5);

// a - start x
// b - start y
// c - finish x
// d - finish y

// Ветки ёлки
function drawBranch(a, b, c, d, color, width) {
    for (let index = 0; index < 5; index++) {
        drawForest.beginPath();
        drawForest.moveTo(a, b);
        drawForest.lineTo(c, d);
        drawForest.strokeStyle = color;
        drawForest.lineWidth = width;
        drawForest.stroke();
        b += 30;
        d += 30;
    }
}

// Ёлки
function drawTree(start) {
    drawLine(start, 400, start, 200, "black", 5);
    drawBranch(start, 200, start - 50, 250, "#1f7e26", 5);
    drawBranch(start, 200, start + 50, 250, "#1f7e26", 5);
}

// Лес
function forest(startPoint, interval, stumpMooving, homeMooving, startText, startPosition, harePosition, currentScore) {
    let between = startPoint + interval;

    Home(homeMooving, startText);

    for (let index = 0; index < 100; index++) {
        drawTree(between);
        between += interval;
    }

    Stump(stumpMooving);
    owl(startPosition);
    hare(harePosition);

    currentScore > 50 ? PortalInSpice() : false;
}

let currentInterval = null;
let stumpMooving = 800;
let homeMooving = 80;
let startText = 100;
let startPosition = 1100;
let harePosition = 1000;

const stepSound = new Audio("./sounds/bunStep1.mp3");
const jumpSound = new Audio("./sounds/bunJump1.mp3");
const bunBoom = new Audio("./sounds/boom.mp3");
const finish = new Audio("./sounds/finish.mp3");

function CalmMooving() {
    if (currentInterval) {
        clearInterval(currentInterval);
    }

    currentInterval = setInterval(() => {
        infoBlock.innerText = "Mooving";
        drawForest.fillStyle = "#94c7f5"; // цвет заливки
        drawForest.fillRect(0, 0, 800, 600); // (x, y, ширина, высота)

        stepSound.play();
        currentScore++;
        score.innerText = currentScore;

        Sun();

        drawForest.beginPath();
        drawForest.fillStyle = "#8d7464";
        drawForest.fillRect(0, 400, 800, 300);

        forest(curentStart, 150, stumpMooving, homeMooving, startText, startPosition, harePosition, currentScore);

        homeMooving -= 30;
        stumpMooving -= 50;
        startText -= 30;
        startPosition -= 50;
        harePosition -= 70;

        if ((stumpMooving <= 120 && stumpMooving > 90) || (harePosition <= 150 && harePosition > 100)) {
            bunBoom.play();
            infoBlock.innerText = "B O O M ! ! !";
            currentScore -= 50;
            score.innerText = currentScore;
            console.log("<BOOM!!!>", stumpMooving);
            if (currentScore < 0) {
                finish.play();
                infoBlock.innerText = "Y O U   L O S T ! ! !";
                clearInterval(currentInterval);
                currentInterval = null;
                setTimeout(() => {
                    location.reload();
                }, 2000);
            }
        }

        if (stumpMooving < -50) {
            stumpMooving = 850; // появляется справа
        }

        if (startPosition < -50) {
            startPosition = 970; // появляется справа
        }

        if (harePosition < -50) {
            harePosition = 1000; // появляется справа
        }

        toggle % 2 === 0 ? Bun(350) : Bun(380);

        curentStart -= 20;
        toggle++;

        // drawForest.clearRect(0, 0, 800, 600);
    }, 200);
}

function JumpMooving() {
    // Останавливаем текущий интервал, если есть
    if (currentInterval) {
        clearInterval(currentInterval);
    }
    currentInterval = setInterval(() => {
        infoBlock.innerText = "Mooving";
        drawForest.fillStyle = "#94c7f5"; // цвет заливки
        drawForest.fillRect(0, 0, 800, 600); // (x, y, ширина, высота)

        jumpSound.play();
        currentScore++;
        score.innerText = currentScore;

        Sun();

        drawForest.beginPath();
        drawForest.fillStyle = "#8d7464";
        drawForest.fillRect(0, 400, 800, 300);

        forest(curentStart, 150, stumpMooving, homeMooving, startText, startPosition, harePosition);

        homeMooving -= 30;
        stumpMooving -= 50;
        startText -= 30;
        startPosition -= 40;
        harePosition -= 70;
        // console.log("stumpMooving - ", stumpMooving);

        if (startPosition <= 130 && startPosition > 30) {
            bunBoom.play();
            infoBlock.innerText = "B O O M ! ! !";
            currentScore -= 50;
            score.innerText = currentScore;
            console.log("<BOOM!!!>", startPosition);
            if (currentScore < 0) {
                finish.play();
                infoBlock.innerText = "Y O U   L O S T ! ! !";
                clearInterval(currentInterval);
                currentInterval = null;
                setTimeout(() => {
                    location.reload();
                }, 2000);
            }
        }

        if (stumpMooving < -50) {
            stumpMooving = 850; // появляется справа
        }

        if (startPosition < -50) {
            startPosition = 920; // появляется справа
        }

        if (harePosition < -50) {
            harePosition = 1000; // появляется справа
        }

        Bun(200);

        curentStart -= 20;
        toggle++;

        // drawForest.clearRect(0, 0, 800, 600);
    }, 200);
}

function Home(starPosition, startText) {
    // 3. Стена дома
    drawForest.fillStyle = "#D2691E";
    drawForest.fillRect(starPosition, 200, 200, 200);

    // 4. Крыша (треугольник)
    drawForest.fillStyle = "#8B0000";
    drawForest.beginPath();
    drawForest.moveTo(starPosition - 20, 200);
    drawForest.lineTo(starPosition + 220, 200);
    drawForest.lineTo(starPosition + 100, 80);
    drawForest.fill();

    drawText("ОФИСМАГ", startText);

    // 5. Окно
    drawForest.fillStyle = "#FFFF00";
    drawForest.fillRect(starPosition + 60, 260, 80, 80);

    // 6. Дверь
    // drawForest.fillStyle = "#8B4513";
    // drawForest.fillRect(400, 420, 50, 80);
}

function drawText(text, startText) {
    drawForest.font = "30px Arial";
    drawForest.fillStyle = "white";
    drawForest.shadowColor = "black"; // тень для читаемости
    drawForest.shadowBlur = 2;
    drawForest.fillText(`${text}`, startText, 180);
    drawForest.shadowBlur = 0; // сброс тени
}
