const app = new PIXI.Application();
const zvuk_odnoy_kapli = new Audio("./sounds/zvuk-odnoy-kapli.mp3");

// ============================================
// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
// ============================================
let isGameFinished = false; // флаг окончания игры

// arrProductSTM.map((el) => {
//     console.log("imgShow - ", el.imgShow);
// });

// ============================================
// УПРАВЛЕНИЕ КАРТИНКАМИ СТМ (без повторений)
// ============================================

// Хранилище использованных картинок
const usedImages = new Set();

// Перемешанный массив картинок (создаётся один раз)
let shuffledProducts = null;

// Переменная для отслеживания текущего спрайта
let currentSprite = null;
let currentCollisionChecker = null;

// Функция перемешивания массива (алгоритм Фишера-Йетса)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Функция получения случайного товара (без повторений)
function getRandomProduct() {
    if (!arrProductSTM || arrProductSTM.length === 0) {
        console.error("❌ Массив arrProductSTM пуст или не существует");
        return null;
    }

    if (usedImages.size >= arrProductSTM.length) {
        console.log("🏁 Картинки закончились!");
        return null;
    }

    if (!shuffledProducts) {
        shuffledProducts = shuffleArray(arrProductSTM);
        console.log("🔄 Массив картинок перемешан");
    }

    for (const product of shuffledProducts) {
        if (!usedImages.has(product.imgShow)) {
            return product;
        }
    }

    console.log("⚠️ Не найдено неиспользованных картинок");
    return null;
}

// Функция сброса состояния
function resetUsedImages() {
    usedImages.clear();
    shuffledProducts = null;
    currentSprite = null;
    currentCollisionChecker = null;
    isGameFinished = false;
    console.log("🔄 Список использованных картинок сброшен");
}

// Функция получения количества оставшихся картинок
function getRemainingImagesCount() {
    if (!arrProductSTM) return 0;
    return arrProductSTM.length - usedImages.size;
}

// ============================================
// ОТОБРАЖЕНИЕ КАРТИНКИ
// ============================================

async function showRandomSTM(x, y, duration = 5000) {
    // Получаем случайный товар
    const randomProduct = getRandomProduct();

    if (!randomProduct || !randomProduct.imgShow) {
        console.log("🏁 Картинки закончились! Новая не будет показана");

        // ✅ Показываем финальную картинку только один раз
        if (!isGameFinished) {
            isGameFinished = true;

            try {
                const finishTexture = await PIXI.Assets.load("./img/finish.png");
                const finishSprite = new PIXI.Sprite(finishTexture);

                finishSprite.anchor.set(0.5, 0.5);
                finishSprite.position.set(400, 300);
                finishSprite.scale.set(0.6, 0.6);
                finishSprite.alpha = 0;

                app.stage.addChild(finishSprite);
                console.log("🎉 Финальная картинка загружена!");

                // Плавное появление
                let fadeProgress = 0;
                const fadeTicker = app.ticker.add(() => {
                    fadeProgress += 0.02;
                    finishSprite.alpha = Math.min(fadeProgress, 1);
                    if (fadeProgress >= 1) {
                        app.ticker.remove(fadeTicker);
                    }
                });
            } catch (err) {
                console.error("❌ Не удалось загрузить финальную картинку:", err);
            }
        }

        return null;
    }

    try {
        const imagePath = randomProduct;

        // Сразу отмечаем картинку как использованную (при любом исходе)
        usedImages.add(imagePath.imgShow);
        const remaining = getRemainingImagesCount();
        console.log(`📌 Использовано: ${usedImages.size} из ${arrProductSTM.length}. Осталось: ${remaining}`);

        // Загружаем картинку
        const texture = await PIXI.Assets.load(imagePath.imgShow);
        const sprite = new PIXI.Sprite(texture);

        sprite.position.set(x || 400, y || 300);
        sprite.anchor.set(0.5, 0.5);
        sprite.scale.set(0.3);
        app.stage.addChild(sprite);

        console.log("✅ Картинка на месте!", sprite.position.x, sprite.position.y);
        console.log("✅ spaceShip position: ", spaceShip.position.x, spaceShip.position.y);

        // Функция проверки столкновения
        const collisionChecker = () => {
            if (!sprite || !sprite.position || !spaceShip) {
                return;
            }

            const dx = sprite.position.x - spaceShip.position.x;
            const dy = sprite.position.y - spaceShip.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const blaster1 = new Audio("./sounds/blaster1.mp3");

            if (distance < 80) {
                blaster1.play();
                console.log(`🎯 Поймал ${imagePath.imgShow}!`);
                tableFulling(imagePath.imgShow, true, imagePath.description);
                currentScore += 1;
                const score = document.getElementById("score");
                score.innerText = currentScore;

                // Удаляем ticker
                app.ticker.remove(collisionChecker);

                // Удаляем спрайт
                if (sprite.parent) {
                    app.stage.removeChild(sprite);
                    sprite.destroy();
                }

                // Очищаем ссылки
                if (currentSprite === sprite) {
                    currentSprite = null;
                }
                if (currentCollisionChecker === collisionChecker) {
                    currentCollisionChecker = null;
                }
            }
        };

        // Сохраняем ссылки на текущие объекты
        currentSprite = sprite;
        currentCollisionChecker = collisionChecker;

        // Добавляем проверку в ticker
        app.ticker.add(collisionChecker);

        // Автоудаление через duration
        const timeoutId = setTimeout(() => {
            if (sprite.parent) {
                tableFulling(imagePath.imgShow, false, imagePath.description);
                app.stage.removeChild(sprite);
                zvuk_odnoy_kapli.play();
                sprite.destroy();
                app.ticker.remove(collisionChecker);
                console.log(`🗑️ Спрайт удалён через ${duration / 1000} секунд`);

                // Очищаем ссылки
                if (currentSprite === sprite) {
                    currentSprite = null;
                }
                if (currentCollisionChecker === collisionChecker) {
                    currentCollisionChecker = null;
                }
            }
        }, duration);

        return sprite;
    } catch (err) {
        console.error("❌ Ошибка загрузки картинки:", err);
        return null;
    }
}

const bun = createBun(50, 450); // позиция колобка

const spaceShip = new PIXI.Container();

const goToLevelTwo = () => {    
    grace_by_home.play();
    level = 2;
    const score = document.getElementById("score");
    currentScore = 0;
    score.innerText = currentScore;
    console.log("level - ", level);
    // Блокировка на уровне 2 (или если игра закончена)
    if (level === 2) {
        console.log("Уровень 2 — управление заблокировано");
        return;
    }
};

let timeChecker = 0;

const goToRight = () => {
    app.ticker.add(() => {
        startPositionChecker++;
        timeChecker % 10 == 0 ? (bun.position.x += 5) : false;
        bun.position.x += 5;
    });
};

// Глобальные переменные для управления
const keys = {
    left: false,
    right: false,
    up: false,
    down: false,
};

// Единый обработчик клавиш
document.addEventListener("keydown", (event) => {
    // Обработка для уровня 1 (старое управление)
    if (level === 1) {
        switch (event.key) {
            case "ArrowRight":
                console.log("level - ", level);
                clearInterval(currentInterval);
                CalmMooving();
                break;
            case "ArrowLeft":
                console.log("level - ", level);
                location.reload();
                break;
            case "ArrowUp":
                console.log("level - ", level);
                clearInterval(currentInterval);
                JumpMooving();
                break;
            case "ArrowDown":
                console.log("level - ", level);
                clearInterval(currentInterval);
                currentInterval = null;
                break;
        }
    }

    // Обработка для уровня 2 (плавное движение)
    if (level === 2) {
        switch (event.key) {
            case "ArrowLeft":
                console.log("bun.position.x - ", bun.position.x, "bun.position.y - ", bun.position.y);
                bun.position.x -= 10;
                break;
            case "ArrowRight":
                console.log("bun.position.x - ", bun.position.x, "bun.position.y - ", bun.position.y);
                bun.position.x += 10;
                break;
            case "ArrowUp":
                console.log("bun.position.x - ", bun.position.x, "bun.position.y - ", bun.position.y);
                bun.position.y -= 10;
                break;
            case "ArrowDown":
                console.log("bun.position.x - ", bun.position.x, "bun.position.y - ", bun.position.y);
                bun.position.y += 10;
                break;
        }
    }

    // Обработка для уровня 3 (плавное движение)
    if (level === "rocketMoove") {
        switch (event.key) {
            case "ArrowLeft":
                console.log(
                    "spaceShip.position.x - ",
                    spaceShip.position.x,
                    "spaceShip.position.y - ",
                    spaceShip.position.y
                );
                spaceShip.position.x -= 10;
                break;
            case "ArrowRight":
                console.log(
                    "spaceShip.position.x - ",
                    spaceShip.position.x,
                    "spaceShip.position.y - ",
                    spaceShip.position.y
                );
                spaceShip.position.x += 10;
                break;
            case "ArrowUp":
                console.log(
                    "spaceShip.position.x - ",
                    spaceShip.position.x,
                    "spaceShip.position.y - ",
                    spaceShip.position.y
                );
                spaceShip.position.y -= 10;
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
    }
});

// Отслеживаем отпускание клавиш
document.addEventListener("keyup", (event) => {
    switch (event.key) {
        case "ArrowLeft":
            keys.left = false;
            break;
        case "ArrowRight":
            keys.right = false;
            break;
        case "ArrowUp":
            keys.up = false;
            break;
        case "ArrowDown":
            keys.down = false;
            break;
    }
});

// Звёзды !!!
function createColorfulStars(count = 120) {
    const stars = new PIXI.Container();

    // Цвета звёзд (от белого до голубого/желтоватого)
    const colors = [0xffffff, 0xaaccff, 0xffeedd, 0xccddff, 0xffddbb];

    for (let i = 0; i < count; i++) {
        const star = new PIXI.Graphics();
        const size = 0.5 + Math.random() * 2;
        const x = Math.random() * 800;
        const y = Math.random() * 600;
        const color = colors[Math.floor(Math.random() * colors.length)];

        star.circle(0, 0, size);
        star.fill(color);
        star.alpha = 0.4 + Math.random() * 0.6;
        star.position.set(x, y);

        stars.addChild(star);
    }

    return stars;
}

// Мерцающие звёзды
function createTwinklingStars(count = 150) {
    const stars = new PIXI.Container();
    const starData = [];

    for (let i = 0; i < count; i++) {
        const star = new PIXI.Graphics();
        const size = 0.5 + Math.random() * 2.5;
        const x = Math.random() * 800;
        const y = Math.random() * 600;
        const speed = 0.5 + Math.random() * 2;
        const phase = Math.random() * Math.PI * 2;

        star.circle(0, 0, size);
        star.fill(0xffffff);
        star.alpha = 0.3 + Math.random() * 0.7;
        star.position.set(x, y);

        stars.addChild(star);

        // Сохраняем данные для анимации
        starData.push({
            star: star,
            speed: speed,
            phase: phase,
            minAlpha: 0.2 + Math.random() * 0.3,
            maxAlpha: 0.7 + Math.random() * 0.3,
        });
    }

    // Добавляем анимацию мерцания
    app.ticker.add(() => {
        const time = Date.now() / 1000;
        starData.forEach((data) => {
            const {star, speed, phase, minAlpha, maxAlpha} = data;
            star.alpha = minAlpha + (maxAlpha - minAlpha) * (0.5 + 0.5 * Math.sin(time * speed + phase));
        });
    });

    return stars;
}

// Создаём текст по-старому (как в твоём коде с PIXI.Graphics())
const myText = new PIXI.Text("ОФИСМАГ", {
    fill: "#ed2121",
    fontSize: 18,
    fontFamily: "Arial",
});

myText.position.set(0, -30);

// Колобок
function createBun(x, y) {
    const bun = new PIXI.Container();
    bun.position.set(x, y);

    // Тело колобка (жёлтый круг)
    const body = new PIXI.Graphics();
    body.circle(0, 0, 50);
    body.fill(0xf0e00b);
    bun.addChild(body);

    // Глаз (большой голубой круг)
    const eyeWhite = new PIXI.Graphics();
    eyeWhite.circle(20, -20, 10);
    eyeWhite.fill(0x4aeded);
    bun.addChild(eyeWhite);

    // Зрачок (чёрный круг)
    const pupil = new PIXI.Graphics();
    pupil.circle(20, -20, 3);
    pupil.fill(0x000000);
    bun.addChild(pupil);

    // Улыбка (дуга)
    const smile = new PIXI.Graphics();
    smile.arc(30, 0, 40, Math.PI / 2, Math.PI);
    smile.stroke({width: 5, color: 0x000000});
    bun.addChild(smile);

    return bun;
}

const flame = (start) => {
    const line = new PIXI.Graphics();
    line.moveTo(start, 165);
    line.lineTo(start, 200);
    line.stroke({width: 3, color: "#FF8C00"});

    let flameScale = 0;
    let scaleOfFlame = [1, 1];

    let frameCounter = 0;

    app.ticker.add(() => {
        frameCounter++;

        // console.log("startPosition - ", startPosition);

        if (frameCounter % 30 > 0 && frameCounter % 30 < 15) {
            line.scale.set(1, 1.06);
        } else {
            line.scale.set(1, 1);
        }

        flameScale++;
    });

    return line;
};

const paramsOfPicture = {
    width: 800,
    height: 600,
    backgroundColor: "#483D8B",
    shipPositionX: 350,
    shipPositionY: 300,
    moonGroundY: 400,
    bunPositionX: 0,
    bunPositionY: 300,
};

let scoreOfShip = 5;

async function Init() {
    await app.init(paramsOfPicture);

    document.querySelector("main").appendChild(app.canvas);

    const texture = await PIXI.Assets.load("./img/moonGround.png");
    const moonGround = new PIXI.Sprite(texture);

    moonGround.width = 800;
    moonGround.height = 200;
    moonGround.position.set(0, paramsOfPicture.moonGroundY);

    spaceShip.position.set(paramsOfPicture.shipPositionX, paramsOfPicture.shipPositionY);

    const bodyOfShip = new PIXI.Graphics();
    bodyOfShip.rect(0, 0, 100, 150);
    bodyOfShip.fill(0xffffff);
    bodyOfShip.stroke({width: 2, color: 0x333333});

    const leftEngine = new PIXI.Graphics();
    leftEngine.poly([0, 100, -40, 160, 40, 160]);
    leftEngine.fill(0xffffff);
    leftEngine.stroke({width: 2, color: 0x333333});

    const rightEngine = new PIXI.Graphics();
    rightEngine.poly([100, 100, 60, 160, 140, 160]);
    rightEngine.fill(0xffffff);
    rightEngine.stroke({width: 2, color: 0x333333});

    spaceShip.addChild(bodyOfShip);
    spaceShip.addChild(leftEngine);
    spaceShip.addChild(rightEngine);

    let start = -20;
    for (let index = 0; index < 3; index++) {
        spaceShip.addChild(flame(start));
        start += 20;
    }

    start = 80;
    for (let index = 0; index < 3; index++) {
        spaceShip.addChild(flame(start));
        start += 20;
    }

    const headOfShip = new PIXI.Graphics();
    headOfShip.poly([-30, 0, 50, -100, 130, 0]);
    headOfShip.fill(0xffffff);
    headOfShip.stroke({width: 2, color: 0x333333});

    headOfShip.addChild(myText);
    spaceShip.addChild(headOfShip);

    const windowOfShip = new PIXI.Graphics();
    windowOfShip.circle(50, 50, 30);
    windowOfShip.fill(0xffffff);
    windowOfShip.stroke({width: 2, color: 0x333333});
    spaceShip.addChild(windowOfShip);

    // Создаём звёзды (400 штук с мерцанием)
    const stars = createTwinklingStars(400);
    app.stage.addChild(stars);

    app.stage.addChild(moonGround);
    app.stage.addChild(spaceShip);

    // Инициализация
    let stmDistance = 0;

    app.ticker.add(async () => {
        stmDistance++;

        if (stmDistance % 120 === 0 && level === "rocketMoove") {
            // ✅ Если игра завершена — выходим
            if (isGameFinished) {
                return;
            }

            console.log("🔄 Показываем новую картинку");

            // Проверяем, остались ли ещё картинки
            if (getRemainingImagesCount() === 0) {
                console.log("🏁 Картинки закончились!");
                // Показываем финальную картинку через showRandomSTM
                await showRandomSTM(400, 300, 3000);
                return;
            }

            // Показываем случайную картинку в случайной позиции
            const x = 100 + Math.random() * 600;
            const y = 100 + Math.random() * 500;

            await showRandomSTM(x, y, 3000);
        }
    });

    bun.scale.set(0.8);
    app.stage.addChild(bun);

    let scaleOfShip = [1, 1];
    let intervalId = null;
    let startPositionChecker = 0;

    app.ticker.add(() => {
        startPositionChecker++;

        if (bun.position.x == 400 && bun.position.y == 350) {
            console.log("I'm in the rocket!");

            level = "rocketMoove";

            app.stage.removeChild(bun);
            spaceShip.addChild(bun);
            bun.position.set(50, 50);           

            intervalId = setInterval(() => {
                if (scoreOfShip != 0) {
                    spaceShip.scale.set(scaleOfShip[0], scaleOfShip[1]);
                    moonGround.scale.set(scaleOfShip[0], scaleOfShip[1]);
                    scaleOfShip[0] *= 0.8;
                    scaleOfShip[1] *= 0.8;
                    moonGround.position.set(paramsOfPicture.width * 0.4, (paramsOfPicture.moonGroundY *= 1.03));
                    scoreOfShip--;
                } else {
                    clearInterval(intervalId);
                    intervalId = null;
                }
            }, 1000);
        }
    });
}

Init();
