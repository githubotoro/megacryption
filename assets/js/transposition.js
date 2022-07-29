'use strict';

const transpositionWindow = document.querySelector('.algo-container');
const encryptRadioButton = document.querySelector('#encrypt');
const decryptRadioButton = document.querySelector('#decrypt');
const inputLabel = document.querySelector('#inputLabel');
const inputText = document.querySelector('#inputText');
const transposition = document.querySelector('#runButton');
const inputBlock = document.querySelector('.input');
const outputBlock = document.querySelector('.output');
const visualizeBlock = document.querySelector('.visualization');
const key = document.querySelector('#key');
const close = document.querySelector('.close');
const copyAnswer = document.querySelector('.copyAnswer');
const copyVisualization = document.querySelector('.copyVisualization');
const programOutputBlock = document.querySelector('.programOutput');
const programVisualizeBlock = document.querySelector('.programVisualize');
const visualizeTitle = document.querySelector('.visualizeTitle');
const overlay = document.querySelector('.overlay');
const scrollTo = document.querySelector('.scrollTo');
const implementation = document.querySelector('#implementation');

let sortedAsciiOfKeyArray = [];
let visualizeText = '';
let matrix = [];

encryptRadioButton.addEventListener('click', function () {
  inputLabel.textContent = 'Enter the Original Text: ';
  transposition.textContent = 'Encrypt';
});

decryptRadioButton.addEventListener('click', function () {
  inputLabel.textContent = 'Enter the Ciphered Text: ';
  transposition.textContent = 'Decrypt';
});


function encrypt(originalText, key) {
  let keyArray = [];
  let asciiOfKeyArray = [];
  let cipherText = '';
  for(const [i,j] of key.split('').entries()) {
    keyArray.push(j);
    asciiOfKeyArray.push([key.charCodeAt(i),i]);
  }
  matrix.splice(0, matrix.length);
  for(let i = 0; i < key.length; ++i) {
    matrix.push([]);
  }
  const sortedAsciiOfKeyArray = asciiOfKeyArray.sort((a,b) => a[0]-b[0]);
  let i = 0;
  for(let loops = 0; loops < Math.ceil(originalText.length / keyArray.length); ++loops) {
    for(let j = 0; j < matrix.length; ++j) {
      if(i >= originalText.length) {
        break;
      }
      matrix[j].push(originalText[i]);
      ++i;
    }
  }
  for(const i of sortedAsciiOfKeyArray) {
    for(const j of matrix[i[1]]) {
      cipherText += j;
    }
  }
  return [cipherText, sortedAsciiOfKeyArray];
}

function decrypt(cipherText, key) {
  let keyArray = [];
  let asciiOfKeyArray = [];
  let originalText = '';
  for(const [i,j] of key.split('').entries()) {
    keyArray.push(j);
    asciiOfKeyArray.push([key.charCodeAt(i),i]);
  }
  matrix.splice(0, matrix.length);
  for(let i = 0; i < key.length; ++i) {
    matrix.push([]);
  }
  const sortedAsciiOfKeyArray = asciiOfKeyArray.sort((a,b) => a[0]-b[0]);
  let i = 0;
  for(let j = 0; j < matrix.length; ++j) {
    for(let loops = 0; loops < Math.ceil(cipherText.length / keyArray.length); ++loops) {
      if(sortedAsciiOfKeyArray[j][1]+1+loops*keyArray.length > cipherText.length) {
        break;
      }
      matrix[sortedAsciiOfKeyArray[j][1]].push(cipherText[i]);
      ++i;
    }
  }
  for(let loops = 0; loops < Math.ceil(cipherText.length / keyArray.length); ++loops) {
    for(const j of matrix) {
      if(loops >= j.length) {
        break;
      }
      originalText += j[loops];
    }
  }
  return [originalText, sortedAsciiOfKeyArray];
}

function visualizeTextCreation(originalText, key, sortedAsciiOfKeyArray) {
  let visualizeText = '1-Indexed\n\n';
  for(const [i,j] of key.split('').entries()) {
    visualizeText += `Key Character ${i+1}: '${j}' -> ASCII Value: ${j.charCodeAt(0)}\n`;
  }
  for(let i = 0; i < 45; ++i) {
    visualizeText += '-'
  }
  visualizeText += '\nAscending Order of Characters of Key by there ASCII values:-\n\t[';
  for(const i of sortedAsciiOfKeyArray) {
    visualizeText += i !== sortedAsciiOfKeyArray[sortedAsciiOfKeyArray.length-1] ? `${i[1]+1}, ` : `${i[1]+1}`;
  }
  visualizeText += ']\n\n';
  visualizeText += 'KEY:-  ';
  for(const i of key.split('')) {
    visualizeText += i !== key[key.length-1] ? `'${i}' ` : `'${i}'`;
  }
  visualizeText += '\n       ';
  for(let i = 0; i < key.length; ++i) {
    visualizeText += i === key.length-1 ? '---' : '----';
  }
  visualizeText += '\n';
  for(let loops = 0; loops < Math.ceil(originalText.length / key.length); ++loops) {
    visualizeText += '       ';
    for(const j of matrix) {
      if(loops >= j.length) {
        break;
      }
      visualizeText += j === matrix[0] ? '' : ' ';
      visualizeText += `'${j[loops]}'`;
    }
    visualizeText += loops !== Math.ceil(originalText.length / key.length)-1 ? '\n' : '';
  }

  return visualizeText;
}

function calculate() {
  if(document.getElementById('decrypt').checked) {
    let originalText;
    [originalText, sortedAsciiOfKeyArray] = decrypt(inputText.value, key.value);
    visualizeText = visualizeTextCreation(inputText.value, key.value, sortedAsciiOfKeyArray);
    outputBlock.style.display = 'block';
    // inputBlock.style.borderBottom = '3px solid black';
    outputBlock.innerHTML = `<span class="outputLabel">Original Text is: </span><span class="quote-answer">'</span><span class="answer">${originalText}</span><span class="quote-answer">'</span>`;
    copyAnswer.innerHTML = `<i class="far fa-copy copyIcon" onclick="copyAnswerText()"></i>`;
    copyAnswer.style.display = 'block';
    visualizeBlock.style.display = 'block';
    visualizeTitle.style.display = 'block';
    // programOutputBlock.style.borderBottom = '3px dashed black';
    visualizeTitle.innerHTML = `Visualization`;
    visualizeBlock.innerHTML = `<span class="visualizeText">${visualizeText}</span>`;
    copyVisualization.innerHTML = `<i class="far fa-copy copyIcon" onclick="copyVisualizeText()"></i>`;
    copyVisualization.style.display = 'block';
  }
  if(document.getElementById('encrypt').checked){
    let cipherText;
    [cipherText, sortedAsciiOfKeyArray] = encrypt(inputText.value, key.value);
    visualizeText = visualizeTextCreation(inputText.value, key.value, sortedAsciiOfKeyArray);
    outputBlock.style.display = 'block';
    // inputBlock.style.borderBottom = '3px solid black';
    outputBlock.innerHTML = `<span class="outputLabel">Cipher Text is: </span><span class="quote-answer">'</span><span class="answer">${cipherText}</span><span class="quote-answer">'</span>`;
    copyAnswer.innerHTML = `<i class="far fa-copy copyIcon" onclick="copyAnswerText()"></i>`;
    copyAnswer.style.display = 'block';
    visualizeBlock.style.display = 'block';
    visualizeTitle.style.display = 'block';
    // programOutputBlock.style.borderBottom = '3px dashed black';
    visualizeTitle.innerHTML = `Visualization`;
    visualizeBlock.innerHTML = `<span class="visualizeText">${visualizeText}</span>`;
    copyVisualization.innerHTML = `<i class="far fa-copy copyIcon" onclick="copyVisualizeText()"></i>`;
    copyVisualization.style.display = 'block';
  }
}

const closeWindow = function (modalWindow) {
  modalWindow.style.display = 'none';
  outputBlock.style.display = 'none';
  inputText.value = '';
  key.value = '';
  programVisualizeBlock.style.display = 'none';
  programOutputBlock.style.display = 'none';
  inputBlock.style.borderBottom = 'none';
  overlay.style.display = 'none';
}

close.addEventListener('click', function () {
  closeWindow(transpositionWindow);
});

function copyAnswerText() {
  let text = document.querySelector('.answer').textContent;
  const copyIcon = document.querySelector('.copyIcon');
  navigator.clipboard.writeText(text);
  copyIcon.style.display = 'none';
  copyAnswer.textContent = '👍';
  const timer = setTimeout(function (copy, copyIcon) {
    copyAnswer.textContent = '';
    copyAnswer.innerHTML = `<i class="far fa-copy copyIcon" onclick="copyAnswerText()"></i>`;
  }, 300, copyAnswer, copyIcon);
  setTimeout((timer)=> clearTimeout(timer), 300);
}

function copyVisualizeText() {
  let text = visualizeText;
  const copyIcon = document.querySelectorAll('.copyIcon')[1];
  navigator.clipboard.writeText(text);
  copyIcon.style.display = 'none';
  copyVisualization.textContent = '👍';
  const timer = setTimeout(function (copy, copyIcon) {
    copyVisualization.textContent = '';
    copyVisualization.innerHTML = `<i class="far fa-copy copyIcon" onclick="copyVisualizeText()"></i>`;
  }, 300, copyVisualization, copyIcon);
  setTimeout((timer)=> clearTimeout(timer), 300);
}

function openModal() {
  transpositionWindow.style.display = 'block';
  overlay.style.display = 'block';
  overlay.style.height = `${document.documentElement.getBoundingClientRect().height}px`;
  overlay.style.width = `${document.documentElement.getBoundingClientRect().width}px`;
}

scrollTo.addEventListener('click', function(e) {
  implementation.scrollIntoView({
    behavior: 'smooth'
  });
});
