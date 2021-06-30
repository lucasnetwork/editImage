const canvas = document.querySelector("#canvas");
const canvasContainer = document.querySelector(".canvas_container");
const saveButton = document.querySelector("button");
const menuButton = document.querySelector(".menu-button");
const menuOpen = document.querySelector(".menu-open");
const ctx = canvas.getContext("2d");
const buttons = document.querySelectorAll(".type");
const ranges = document.querySelectorAll(".range");
canvas.width = canvasContainer.clientWidth;
canvas.height = canvasContainer.clientHeight;

const image = new Image();

image.src = "image.jpg";

class Effects {
  constructor(image, newImage) {
    this.image = image;
    this.scannedData = image.data;
    this.imageReset = newImage;
  }

  gray() {
    const newScannedValues = this.scannedData;
    for (let i = 0; i < newScannedValues.length; i += 4) {
      const total =
        newScannedValues[i] + newScannedValues[i + 1] + newScannedValues[i + 2];
      const averageColorValue = total / 3;
      newScannedValues[i] = averageColorValue;
      newScannedValues[i + 1] = averageColorValue;
      newScannedValues[i + 2] = averageColorValue;
    }
    const newImage = new ImageData(newScannedValues, canvas.width);
    return newImage;
  }

  updateImage(image, newImage) {
    this.image = image;
    this.scannedData = image.data;
    this.imageReset = newImage;
  }

  reset() {
    const canvasTemp = document.createElement("canvas");
    canvasTemp.width = canvasContainer.clientWidth;
    canvasTemp.height = canvasContainer.clientHeight;

    const ctxTemp = canvasTemp.getContext("2d");
    const newImage = new Image();
    newImage.src = "image.jpg";
    ctxTemp.drawImage(newImage, 0, 0, canvas.width, canvas.height);
    const scannedImage = ctxTemp.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    this.scannedData = scannedImage.data;
    this.image = scannedImage;

    const newImageData = new ImageData(scannedImage.data, canvas.width);
    return newImageData;
  }

  color(red = 0, green = 0, blue = 0) {
    const newScannedValues = this.scannedData;
    for (var i = 0; i < newScannedValues.length; i += 4) {
      newScannedValues[i] = newScannedValues[i] + red;
      newScannedValues[i + 1] = newScannedValues[i + 1] + green;
      newScannedValues[i + 2] = newScannedValues[i + 2] + blue;
    }
    const newImage = new ImageData(newScannedValues, canvas.width);
    return newImage;
  }

  saturate() {
    const newScannedValues = this.scannedData;
    for (var i = 0; i < newScannedValues.length; i += 4) {
      var r = newScannedValues[i];
      var g = newScannedValues[i + 1];
      var b = newScannedValues[i + 2];
      var gray = 0.2989 * r + 0.587 * g + 0.114 * b;
      newScannedValues[i] =  newScannedValues[i]*0.3 +newScannedValues[i];
      newScannedValues[i + 1] =  newScannedValues[i + 1]*0.3 +newScannedValues[i + 1];
      newScannedValues[i + 2] =  newScannedValues[i + 2]*0.3 +newScannedValues[i + 2];
    }
    const newImage = new ImageData(newScannedValues, canvas.width);
    return newImage;
  }
}

function createBlockImage(type) {
  const scannedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const effects = new Effects(scannedImage);
  const imageData = effects[type]();

  const canvasTemp = document.createElement("canvas");
  canvasTemp.width = canvasContainer.clientWidth;
  canvasTemp.height = canvasContainer.clientHeight;

  const ctxTemp = canvasTemp.getContext("2d");
  ctxTemp.putImageData(imageData, 0, 0);
  const newImage = new Image();
  newImage.src = canvasTemp.toDataURL("image/png");
  return newImage;
}

window.addEventListener("resize", (e) => {
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
});

const effects = new Effects({ data: null }, image.src);

image.addEventListener("load", (e) => {
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const scannedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
  effects.updateImage(scannedImage, image.src);

  buttons.forEach((button) => {
    const newImage = createBlockImage(button.getAttribute("type"));

    button.appendChild(newImage);
    button.addEventListener("click", () => {
      const type = button.getAttribute("type");
      const newImage = effects[type]();
      if (type == "reset") {
        return;
      }
      ctx.putImageData(newImage, 0, 0);
    });
  });
});

menuButton.addEventListener("click", () => {
  menuOpen.classList.toggle("active");
});

ranges.forEach((range) => {
  range.addEventListener("change", (e) => {
    const colors = {
      red: 0,
      blue: 0,
      green:0,
    };
    colors[e.target.id] = e.target.value;
    e.target.value = 0
    
    const p = e.target.nextElementSibling
    p.textContent =0
    console.log(colors)
    const newImage = effects.color(colors.red, colors.green, colors.blue);
    ctx.putImageData(newImage, 0, 0);
  });
  range.addEventListener("input", (e) => {
    const p = e.target.nextElementSibling
    p.textContent = e.target.value

  });
});
