const level2Win = document.getElementById("level2Win");
const level2Lose = document.getElementById("level2Lose");

// Экспорт в EXCEL
function getAllGameRows() {
    const table = document.getElementById("gameResult");
    if (!table) return [];

    const rows = [];
    let currentSection = "";

    // Проходим по всем строкам в таблице (включая thead и tbody)
    const allRows = table.querySelectorAll("tr");

    allRows.forEach((row) => {
        // Проверяем, есть ли заголовок (th)
        const headerCell = row.querySelector("th");
        if (headerCell) {
            currentSection = headerCell.textContent.trim();
            rows.push({
                type: "header",
                text: currentSection,
            });
            return;
        }

        // Получаем все ячейки в строке
        const tdCells = row.querySelectorAll("td");

        // Если в строке 2 ячейки: [картинка] [описание]
        if (tdCells.length >= 2) {
            const img = tdCells[0].querySelector("img");
            const description = tdCells[1].textContent.trim();

            if (img) {
                rows.push({
                    type: "item",
                    section: currentSection,
                    img: img.src,
                    description: description,
                });
            }
        }
    });

    console.log("📊 Собрано строк для экспорта:", rows.length);
    return rows;
}

async function exportTableWithImagesToExcel() {
    const table = document.getElementById("gameResult");
    if (!table) {
        alert("Таблица не найдена!");
        return;
    }

    // Собираем все строки
    const gameRows = getAllGameRows();
    console.log("📊 Данных для экспорта:", gameRows.length);

    if (gameRows.length === 0) {
        alert("Нет данных для экспорта. Сначала пройдите игру!");
        return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Результаты");

    worksheet.getColumn(1).width = 30;
    worksheet.getColumn(2).width = 60;

    let currentRow = 1;

    for (const item of gameRows) {
        if (item.type === "header") {
            // Заголовок
            worksheet.getCell(currentRow, 1).value = item.text;
            worksheet.getCell(currentRow, 1).font = {bold: true, size: 14};
            worksheet.mergeCells(currentRow, 1, currentRow, 2);
            currentRow++;
            continue;
        }

        if (item.type === "item") {
            // Если есть картинка — загружаем
            if (item.img) {
                try {
                    const response = await fetch(item.img);
                    const buffer = await response.arrayBuffer();
                    const imageId = workbook.addImage({
                        buffer: buffer,
                        extension: "png",
                    });
                    worksheet.addImage(imageId, {
                        tl: {col: 0, row: currentRow - 1},
                        ext: {width: 220, height: 100},
                    });
                    worksheet.getRow(currentRow).height = 140;
                } catch (err) {
                    console.warn("❌ Не удалось загрузить картинку:", item.img);
                    worksheet.getCell(currentRow, 1).value = item.img;
                }
            }

            // Описание
            if (item.description) {
                const descCell = worksheet.getCell(currentRow, 2);
                descCell.value = item.description;
                descCell.alignment = {wrapText: true, vertical: "top"};
            }

            currentRow++;
        }
    }

    console.log("✅ Всего строк в Excel:", currentRow - 1);

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "game_results.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    console.log("✅ Excel-файл сохранён");
}

function tableFulling(item, check, description) {
    // Создаём одну строку
    const tr = document.createElement("tr");
    tr.className = "goodsPictures";

    // Ячейка с картинкой
    const tdImg = document.createElement("td");
    tdImg.style.width = "100px";
    tdImg.style.textAlign = "center";

    const img = document.createElement("img");
    img.src = item;
    img.alt = item;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    tdImg.appendChild(img);
    tr.appendChild(tdImg);

    // Ячейка с описанием
    const tdDesc = document.createElement("td");
    tdDesc.textContent = description || "";
    tdDesc.style.padding = "10px";
    tr.appendChild(tdDesc);

    // Добавляем строку в нужную таблицу
    if (check == true) {
        level2Win.appendChild(tr);
    } else {
        level2Lose.appendChild(tr);
    }
}
