// referances
const canvas = document.querySelector("canvas"),
    toolBtns = document.querySelectorAll(".tool"),
    filler = document.querySelector("#filler"),
    rangeWidth = document.querySelector("#size-slider"),
    colorBtn = document.querySelectorAll(".colors .option"),
    colorPicker = document.querySelector("#color-picker"),
    deleteBtn = document.querySelector(".clear-canvas"),
    saveBtn = document.querySelector(".save-image");

// veriable
let ctx = canvas.getContext("2d"),
    isDrawing = false,
    brushWith = 5,
    selectedTool = "brush",
    selectedColor = "#000",
    prevMouseX,
    prevMouseY,
    snapShot;

const setBgColor = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
};

// cnavas width and height
window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setBgColor();
});

// drawing
const startDraw = (e) => {
    isDrawing = true;

    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;

    ctx.beginPath();
    ctx.lineWidth = brushWith;

    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;

    snapShot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

// rectangle
const drawRectangle = (e) => {
    filler.checked
        ? ctx.fillRect(
              e.offsetX,
              e.offsetY,
              prevMouseX - e.offsetX,
              prevMouseY - e.offsetY
          )
        : ctx.strokeRect(
              e.offsetX,
              e.offsetY,
              prevMouseX - e.offsetX,
              prevMouseY - e.offsetY
          );
};

//  Circle
const drawCircle = (e) => {
    ctx.beginPath();
    const radius =
        Math.sqrt(Math.pow(prevMouseX - e.offsetX, 2)) +
        Math.pow(prevMouseY - e.offsetY, 2);
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);

    filler.checked ? ctx.fill() : ctx.stroke();
};

//  draw triangle
const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    ctx.stroke();
    filler.checked ? ctx.fill() : ctx.stroke();
};

//  draw line
const drawLine = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
};

// tools control
const drawing = (e) => {
    if (!isDrawing) return;
    ctx.putImageData(snapShot, 0, 0);

    if (selectedTool == "brush" || selectedTool == "eraser") {
        ctx.strokeStyle = selectedTool == "eraser" ? "#fff" : selectedColor;
    }

    switch (selectedTool) {
        case "brush":
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            break;

        case "rectangle":
            drawRectangle(e);
            break;

        case "circle":
            drawCircle(e);
            break;

        case "triangle":
            drawTriangle(e);
            break;

        case "line":
            drawLine(e);
            break;

        case "eraser":
            ctx.style = "#fff";
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            break;
    }
};

// tools btns
toolBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
});

// chnage range width
rangeWidth.addEventListener("change", () => {
    brushWith = rangeWidth.value;
});

// pick color
colorBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        document
            .querySelector(".options .selected")
            .classList.remove("selected");
        btn.classList.add("selected");
        const bgColor = window
            .getComputedStyle(btn)
            .getPropertyValue("background-color");
        selectedColor = bgColor;
    });
});

// set color
colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

//  delete Btn
deleteBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setBgColor();
});

// save Btn
saveBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `arr-${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
});

// stop drawing
const stopDraw = () => {
    isDrawing = false;
};

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", stopDraw);
