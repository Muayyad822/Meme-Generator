const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
const imageInput = document.getElementById('imageInput');
const topTextInput = document.getElementById('topText');
const bottomTextInput = document.getElementById('bottomText');
const generateButton = document.getElementById('generate');
const downloadButton = document.getElementById('download');
const resetButton = document.getElementById('reset');
const fontSizeInput = document.getElementById('fontSize');
const fontFamilyInput = document.getElementById('fontFamily');
const textColorInput = document.getElementById('textColor');
const strokeColorInput = document.getElementById('strokeColor');

let uploadedImage = null;

// Load the image onto the canvas
imageInput.addEventListener('change', (event) => {
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

  const maxWidth = 580;
  const maxHeight = 450;
  const aspectRatio = uploadedImage.width / uploadedImage.height;

  if (uploadedImage.width > maxWidth || uploadedImage.height > maxHeight) {
    if (uploadedImage.width > uploadedImage.height) {
      canvas.width = maxWidth;
      canvas.height = maxWidth / aspectRatio;
    } else {
      canvas.height = maxHeight;
      canvas.width = maxHeight * aspectRatio;
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

  const topText = topTextInput.value;
  const bottomText = bottomTextInput.value;
  const fontSize = parseInt(fontSizeInput.value) || 30;
  const fontFamily = fontFamilyInput.value || 'Impact';
  const textColor = textColorInput.value || 'white';
  const strokeColor = strokeColorInput.value || 'black';

  // Set text styles
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = textColor;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2;
  ctx.textAlign = 'center';

  // Draw top text
  if (topText) {
    ctx.fillText(topText, canvas.width / 2, fontSize + 10);
    ctx.strokeText(topText, canvas.width / 2, fontSize + 10);
  }

  // Draw bottom text
  if (bottomText) {
    ctx.fillText(bottomText, canvas.width / 2, canvas.height - 10);
    ctx.strokeText(bottomText, canvas.width / 2, canvas.height - 10);
  }
}

// Generate meme by drawing text on the uploaded image
generateButton.addEventListener('click', () => {
  drawImage();
});

// Download the meme as an image
downloadButton.addEventListener('click', () => {
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
resetButton.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  uploadedImage = null;
  imageInput.value = '';
  topTextInput.value = '';
  bottomTextInput.value = '';
  fontSizeInput.value = '30';
  fontFamilyInput.value = 'Impact';
  textColorInput.value = '#ffffff';
  strokeColorInput.value = '#000000';
  canvas.width = 580;
  canvas.height = 450;
  alert('Canvas and inputs have been reset!');
});