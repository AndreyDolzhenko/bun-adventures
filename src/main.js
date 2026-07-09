const drawCanvas = document.getElementById("drawing-canvas");
const drawForest = drawCanvas.getContext("2d");
const grace_by_home = new Audio("./sounds/grace_by_home.mp3");
const level3 = document.getElementById("level3");

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

const choseLevel = document.getElementById("choseLevel");

choseLevel.addEventListener("click", async (event) => {
    console.log("choseLevel - ", choseLevel.value);

    switch (choseLevel.value) {
        case "firstLevel":
            location.reload();

            break;

        case "secondLevel":
            drawCanvas.style.display = "none";
            level3.style.display = "none";
            level = 2;
            mainBlock.style.display = "block";

            // Init();
            goToLevelTwo();

            break;

        case "thirdLevel":
            drawCanvas.style.display = "none";
            mainBlock.style.display = "none";
            level3.style.display = "block";
            level = 3;
            grace_by_home.pause();
            grace_by_home.currentTime = 0; // Сбрасываем в начало
            removeGoodsPicturesRows();            

            const basePlaceThree = await BaseFunctionOfLevelThree();

            level3.appendChild(basePlaceThree);
            break;

        default:
            break;
    }
});

// Добавь где-нибудь в начале
console.log("📦 Версия PixiJS:", PIXI.VERSION);

// level = 4;
// // ❌ Остановка и сброс
// grace_by_home.pause();
// grace_by_home.currentTime = 0;  // Сбрасываем в начало
