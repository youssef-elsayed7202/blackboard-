const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const penBtn = document.getElementById("penBtn");
const eraserBtn = document.getElementById("eraserBtn");

const colorPicker = document.getElementById("colorPicker");
const sizePicker = document.getElementById("sizePicker");
const sizeValue = document.getElementById("sizeValue");

const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");
const clearBtn = document.getElementById("clearBtn");
const saveBtn = document.getElementById("saveBtn");

let drawing = false;
let tool = "pen";

let undoStack = [];
let redoStack = [];


// =========================
// تجهيز حجم السبورة
// =========================

function resizeCanvas() {

  const oldCanvas = document.createElement("canvas");
  oldCanvas.width = canvas.width;
  oldCanvas.height = canvas.height;

  const oldCtx = oldCanvas.getContext("2d");

  if (canvas.width > 0 && canvas.height > 0) {
    oldCtx.drawImage(canvas, 0, 0);
  }

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (oldCanvas.width > 0 && oldCanvas.height > 0) {
    ctx.drawImage(
      oldCanvas,
      0,
      0,
      oldCanvas.width,
      oldCanvas.height,
      0,
      0,
      canvas.width,
      canvas.height
    );
  }
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);


// =========================
// حفظ حالة السبورة
// =========================

function saveState() {

  undoStack.push(canvas.toDataURL());

  if (undoStack.length > 30) {
    undoStack.shift();
  }

  redoStack = [];
}


// =========================
// استرجاع صورة
// =========================

function restoreState(data) {

  const image = new Image();

  image.onload = function () {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      image,
      0,
      0,
      canvas.width,
      canvas.height
    );
  };

  image.src = data;
}


// =========================
// تحديد مكان القلم
// =========================

function getPosition(event) {

  const rect = canvas.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}


// =========================
// بداية الرسم
// =========================

function startDrawing(event) {

  drawing = true;

  const position = getPosition(event);

  ctx.beginPath();

  ctx.moveTo(position.x, position.y);

  canvas.setPointerCapture(event.pointerId);
}


// =========================
// الرسم
// =========================

function draw(event) {

  if (!drawing) {
    return;
  }

  const position = getPosition(event);

  ctx.lineWidth = Number(sizePicker.value);

  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (tool === "eraser") {

    ctx.strokeStyle = "#000";

  } else {

    ctx.strokeStyle = colorPicker.value;
  }

  ctx.lineTo(position.x, position.y);

  ctx.stroke();
}


// =========================
// نهاية الرسم
// =========================

function stopDrawing(event) {

  if (!drawing) {
    return;
  }

  drawing = false;

  ctx.closePath();

  if (event.pointerId !== undefined) {

    try {
      canvas.releasePointerCapture(event.pointerId);
    } catch (error) {
      // لا يوجد شيء مطلوب هنا
    }
  }
}


// =========================
// زر القلم
// =========================

penBtn.addEventListener("click", function () {

  tool = "pen";

  penBtn.classList.add("active");
  eraserBtn.classList.remove("active");

  canvas.style.cursor = "crosshair";
});


// =========================
// زر الممحاة
// =========================

eraserBtn.addEventListener("click", function () {

  tool = "eraser";

  eraserBtn.classList.add("active");
  penBtn.classList.remove("active");

  canvas.style.cursor = "cell";
});


// =========================
// تغيير حجم القلم
// =========================

sizePicker.addEventListener("input", function () {

  sizeValue.textContent = sizePicker.value;
});


// =========================
// التراجع
// =========================

undoBtn.addEventListener("click", function () {

  if (undoStack.length === 0) {
    return;
  }

  redoStack.push(canvas.toDataURL());

  const previousState = undoStack.pop();

  restoreState(previousState);
});


// =========================
// إعادة
// =========================

redoBtn.addEventListener("click", function () {

  if (redoStack.length === 0) {
    return;
  }

  undoStack.push(canvas.toDataURL());

  const nextState = redoStack.pop();

  restoreState(nextState);
});


// =========================
// مسح السبورة
// =========================

clearBtn.addEventListener("click", function () {

  saveState();

  ctx.fillStyle = "#000";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );
});


// =========================
// حفظ السبورة كصورة
// =================
