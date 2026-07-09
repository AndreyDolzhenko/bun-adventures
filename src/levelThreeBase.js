const appLevelThree = new PIXI.Application();
const gun_fire = new Audio("./sounds/gun_fire.mp3");
const swamp_sound = new Audio("./sounds/swamp.mp3");

const fireLine = async () => {
    // Толстая красная линия
    const thickLine = new PIXI.Graphics();
    thickLine.moveTo(-50, 0);
    thickLine.lineTo(-20, -20);
    thickLine.stroke({width: 3, color: 0xff0000});
    return thickLine;
};

const BaseFunctionOfLevelThree = async () => {
    await appLevelThree.init({
        width: 800,
        height: 600,
        backgroundColor: 0x1099bb,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
    });

    const backgroundPicture = await PIXI.Assets.load("../img/jungleBack.jpg");
    const spriteBackground = new PIXI.Sprite(backgroundPicture);

    swamp_sound.loop = true;
    swamp_sound.play();

    const scale = Math.min(800 / spriteBackground.width, 600 / spriteBackground.height);
    spriteBackground.scale.set(scale);
    appLevelThree.stage.addChildAt(spriteBackground, 0);
    const bunContainer = new PIXI.Container();

    // ak 47

    const ak47 = await PIXI.Assets.load("../img/ak471.png");
    const spriteAk47 = new PIXI.Sprite(ak47);
    const ak47Scale = Math.min(200 / spriteAk47.width, 200 / spriteAk47.height);
    spriteAk47.scale.set(ak47Scale);
    spriteAk47.position.x = 50;
    spriteAk47.position.y = 490;
    bunContainer.addChild(spriteAk47);

    // Bun building

    const bunThree = new PIXI.Graphics();
    bunThree.beginFill("gold");
    bunThree.drawCircle(100, 560, 50);
    bunThree.endFill();
    bunContainer.addChild(bunThree);

    // Глаз (большой голубой круг)
    const eyeWhite = new PIXI.Graphics();
    eyeWhite.circle(120, 550, 10);
    eyeWhite.fill(0x4aeded);
    bunContainer.addChild(eyeWhite);

    // Зрачок (чёрный круг)
    const pupil = new PIXI.Graphics();
    pupil.circle(120, 550, 3);
    pupil.fill(0x000000);
    bunContainer.addChild(pupil);

    // Улыбка (дуга)
    const smile = new PIXI.Graphics();
    smile.arc(130, 560, 40, Math.PI / 2, Math.PI);
    smile.stroke({width: 5, color: 0x000000});
    bunContainer.addChild(smile);

    // blue beret

    const blueBeret = await PIXI.Assets.load("../img/blueBarett.png");
    const spriteBlueBeret = new PIXI.Sprite(blueBeret);
    const beretScale = Math.min(100 / spriteBlueBeret.width, 100 / spriteBlueBeret.height);
    spriteBlueBeret.scale.set(beretScale);
    spriteBlueBeret.position.x = 50;
    spriteBlueBeret.position.y = 490;
    bunContainer.addChild(spriteBlueBeret);

    // driving sprite
    document.addEventListener("keydown", async (event) => {
        switch (event.key) {
            case "ArrowLeft":
                // console.log(
                //     "bunContainer.position.x - ",
                //     bunContainer.position.x,
                //     "bunContainer.position.y - ",
                //     bunContainer.position.y
                // );
                bunContainer.position.x -= 10;
                break;
            case "ArrowRight":
                // console.log(
                //     "bunContainer.position.x - ",
                //     bunContainer.position.x,
                //     "bunContainer.position.y - ",
                //     bunContainer.position.y
                // );
                bunContainer.position.x += 10;
                break;
            case " ":
                gun_fire.play();

                let tickerCount = 0;
                let x_fire = 300;
                let y_fire = 495;
                // Сохраняем ID таймаута
                let timeoutId = null;

                const shootTicker = appLevelThree.ticker.add(async (delta) => {
                    const linePosition = await fireLine();

                    if (tickerCount % 60 === 0 && tickerCount < 300) {
                        linePosition.position.set(bunContainer.position.x + x_fire, bunContainer.position.y + y_fire);
                        appLevelThree.stage.addChild(linePosition);
                        console.log("linePosition X - ", linePosition.position.x, " : ", "linePosition y - ", linePosition.position.y)

                        timeoutId = setTimeout(() => {
                            linePosition.destroy();
                            timeoutId = null;
                        }, 500);

                        x_fire += 100;
                        y_fire -= 100;
                    } else {
                        linePosition.destroy();
                        timeoutId = null;
                        appLevelThree.ticker.remove(shootTicker);
                    }

                    tickerCount += 1;
                });

                break;

            case "ArrowDown":
                console.log(
                    "spaceShip.position.x - ",
                    spaceShip.position.x,
                    "spaceShip.position.y - ",
                    spaceShip.position.y
                );
                spaceShip.position.y += 10;
                break;
        }
    });

    appLevelThree.stage.addChild(bunContainer);
    return appLevelThree.view;
};

function removeGoodsPicturesRows() {
    // Находим все строки с классом goodsPictures
    const rows = document.querySelectorAll(".goodsPictures");

    // Удаляем каждую строку
    rows.forEach((row) => {
        row.remove(); // Удаляет строку вместе со всем содержимым
    });

    console.log(`🗑️ Удалено ${rows.length} строк с классом goodsPictures`);
}

// ✅ Правильное создание для PixiJS v8
// try {
//     // Проверяем, создан ли уже
//     if (!window.appLevelThree) {
//         window.appLevelThree = new PIXI.Application();

//         // ВАЖНО: await для инициализации!
//         await window.appLevelThree.init({
//             width: 800,
//             height: 600,
//             backgroundColor: 0x1099bb,
//             resolution: window.devicePixelRatio || 1,
//             autoDensity: true,
//         });
//         console.log("✅ appLevelThree создан и инициализирован");
//     }

//     // Теперь view доступен!
//     console.log("view:", window.appLevelThree.view);

//     // Добавляем в DOM
//     if (!level3.contains(window.appLevelThree.view)) {
//         level3.appendChild(window.appLevelThree.view);
//         console.log("✅ Холст добавлен в DOM");
//     }

//     // Добавляем тестовый текст
//     const testText = new PIXI.Text({
//         text: "УРОВЕНЬ 3",
//         style: {
//             fontSize: 64,
//             fill: 0xffd700,
//             fontWeight: "bold",
//             stroke: {color: 0x000000, width: 4},
//         },
//     });
//     testText.anchor.set(0.5, 0.5);
//     testText.position.set(400, 300);
//     window.appLevelThree.stage.addChild(testText);
//     console.log("✅ Тестовый текст добавлен");
// } catch (err) {
//     console.error("❌ Ошибка создания уровня 3:", err);
// }
