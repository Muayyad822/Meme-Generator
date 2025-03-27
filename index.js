// Cache DOM elements
const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
const elements = {
  imageInput: document.getElementById('imageInput'),
  topTextInput: document.getElementById('topText'),
  bottomTextInput: document.getElementById('bottomText'),
  generateButton: document.getElementById('generate'),
  downloadButton: document.getElementById('download'),
  resetButton: document.getElementById('reset'),
  fontSizeInput: document.getElementById('fontSize'),
  fontFamilyInput: document.getElementById('fontFamily'),
  textColorInput: document.getElementById('textColor'),
  strokeColorInput: document.getElementById('strokeColor'),
};

// Default values
const DEFAULTS = {
  fontSize: 30,
  fontFamily: 'Impact',
  textColor: '#ffffff',
  strokeColor: '#000000',
  canvasWidth: 580,
  canvasHeight: 450,
};

let uploadedImage = null;

// Load the image onto the canvas
elements.imageInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.src = e.target.result;
    img.onload = () => {
      uploadedImage = img;
      resizeCanvasToImage();
      drawImage();
    };
  };
  reader.readAsDataURL(file);
});

// Resize canvas to fit the uploaded image while maintaining aspect ratio
function resizeCanvasToImage() {
  if (!uploadedImage) return;

  const { canvasWidth, canvasHeight } = DEFAULTS;
  const aspectRatio = uploadedImage.width / uploadedImage.height;

  if (uploadedImage.width > canvasWidth || uploadedImage.height > canvasHeight) {
    if (aspectRatio > 1) {
      canvas.width = canvasWidth;
      canvas.height = canvasWidth / aspectRatio;
    } else {
      canvas.height = canvasHeight;
      canvas.width = canvasHeight * aspectRatio;
    }
  } else {
    canvas.width = uploadedImage.width;
    canvas.height = uploadedImage.height;
  }
}

// Draw image and text on canvas
function drawImage() {
  if (!uploadedImage) {
    alert('Please upload an image first!');
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);

  const topText = elements.topTextInput.value;
  const bottomText = elements.bottomTextInput.value;
  const fontSize = parseInt(elements.fontSizeInput.value) || DEFAULTS.fontSize;
  const fontFamily = elements.fontFamilyInput.value || DEFAULTS.fontFamily;
  const textColor = elements.textColorInput.value || DEFAULTS.textColor;
  const strokeColor = elements.strokeColorInput.value || DEFAULTS.strokeColor;

  // Set text styles
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = textColor;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2;
  ctx.textAlign = 'center';

  // Draw top text
  if (topText) {
    drawText(topText, canvas.width / 2, fontSize + 10);
  }

  // Draw bottom text
  if (bottomText) {
    drawText(bottomText, canvas.width / 2, canvas.height - 10);
  }
}

// Helper function to draw text
function drawText(text, x, y) {
  ctx.fillText(text, x, y);
  ctx.strokeText(text, x, y);
}

// Generate meme by drawing text on the uploaded image
elements.generateButton.addEventListener('click', drawImage);

// Download the meme as an image
elements.downloadButton.addEventListener('click', () => {
  if (!uploadedImage) {
    alert('Please upload an image and generate a meme first!');
    return;
  }

  const link = document.createElement('a');
  link.download = 'meme.png';
  link.href = canvas.toDataURL();
  link.click();
  alert('Meme downloaded successfully!');
});

// Reset the canvas and inputs
elements.resetButton.addEventListener('click', resetCanvas);

function resetCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  uploadedImage = null;

  // Reset inputs to default values
  elements.imageInput.value = '';
  elements.topTextInput.value = '';
  elements.bottomTextInput.value = '';
  elements.fontSizeInput.value = DEFAULTS.fontSize;
  elements.fontFamilyInput.value = DEFAULTS.fontFamily;
  elements.textColorInput.value = DEFAULTS.textColor;
  elements.strokeColorInput.value = DEFAULTS.strokeColor;

  // Reset canvas size
  canvas.width = DEFAULTS.canvasWidth;
  canvas.height = DEFAULTS.canvasHeight;

  alert('Canvas and inputs have been reset!');
}

// Add real-time preview for text and style changes
['input', 'change'].forEach((eventType) => {
  elements.topTextInput.addEventListener(eventType, drawImage);
  elements.bottomTextInput.addEventListener(eventType, drawImage);
  elements.fontSizeInput.addEventListener(eventType, drawImage);
  elements.fontFamilyInput.addEventListener(eventType, drawImage);
  elements.textColorInput.addEventListener(eventType, drawImage);
  elements.strokeColorInput.addEventListener(eventType, drawImage);
});