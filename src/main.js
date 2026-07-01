const drawCanvas = document.getElementById("drawing-canvas");
const drawForest = drawCanvas.getContext("2d");

drawForest.fillStyle = "#94c7f5"; // цвет заливки
drawForest.fillRect(0, 0, 800, 600); // (x, y, ширина, высота)

drawForest.beginPath();
drawForest.fillStyle = "#8d7464";
drawForest.fillRect(0, 400, 800, 300);

let curentStart = 150;
let toggle = 0;

drawForest.fillStyle = "#94c7f5"; // цвет заливки
drawForest.fillRect(0, 0, 800, 600); // (x, y, ширина, высота)

// 7. Солнце
// drawForest.beginPath();
// drawForest.arc(650, 100, 50, 0, Math.PI * 2);
// drawForest.fillStyle = '#FFD700';
// drawForest.fill();

Sun();

drawForest.beginPath();
drawForest.fillStyle = "#8d7464";
drawForest.fillRect(0, 400, 800, 300);

forest(curentStart, 150, 800, homeMooving, startText);
Bun(380);

// const section = document.querySelector("section");
// console.log("sprite - ", sprite);
// section.innerHTML += `<img src="${arrProductSTM[0].imgShow}" alt="STM">`;
