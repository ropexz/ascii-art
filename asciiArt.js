const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");

const asciiConvert = async (imagePath, saveAs, scale) => {
  const scaleSize = +scale;

  // Loading the image
  const image = await loadImage(imagePath);
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext("2d");

  // Drawing image onto canvas
  context.drawImage(image, 0, 0, image.width, image.height);

  // Making the image smaller cause too many details
  const downscaledCanvas = createCanvas(
    image.width / scaleSize,
    image.height / scaleSize
  );
  const downscaledContext = downscaledCanvas.getContext("2d");
  downscaledContext.drawImage(
    canvas,
    0,
    0,
    image.width,
    image.height,
    0,
    0,
    downscaledCanvas.width,
    downscaledCanvas.height
  );

  // Getting image pixel data, each pixel is represented by 4 rgba values
  const pixelData = downscaledContext.getImageData(
    0,
    0,
    downscaledCanvas.width,
    downscaledCanvas.height
  ).data;

  // ASCII characterd for different brightness levels
  const char = [" ", "'", "(", "/", "+", "*", "&", "%", "@"];

  let asciiArt = "";

  for (let i = 0; i < pixelData.length; i += 4) {
    const brightness = (pixelData[i] + pixelData[i + 1] + pixelData[i + 2]) / 3;

    // Mapping brightness to ASCII
    const index = Math.floor((brightness / 255) * (char.length - 1));
    asciiArt += char[index];

    // New line after every row
    if ((i / 4) % downscaledCanvas.width === downscaledCanvas.width - 1) {
      asciiArt += "\n";
    }
  }

  // Write to txt file
  fs.writeFileSync(saveAs, asciiArt);
};

asciiConvert("future.jpg", "future.txt", 5);
