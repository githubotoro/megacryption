'use strict';

const playfairWindow = document.querySelector('.algo-container');
const encryptRadioButton = document.querySelector('#encrypt');
const decryptRadioButton = document.querySelector('#decrypt');
const inputLabel = document.querySelector('#inputLabel');
const inputText = document.querySelector('#inputText');
const playfair = document.querySelector('#runButton');
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

let visualizeText = '';

encryptRadioButton.addEventListener('click', function () {
  inputLabel.textContent = 'Enter the Original Text: ';
  playfair.textContent = 'Encrypt';
});

decryptRadioButton.addEventListener('click', function () {
  inputLabel.textContent = 'Enter the Ciphered Text: ';
  playfair.textContent = 'Decrypt';
});

let validCharacters = [];

for (let i = 'A'.charCodeAt(0); i <= 'Z'.charCodeAt(0); ++i) {
  validCharacters.push(String.fromCharCode(i));
}
for (let i = '0'.charCodeAt(0); i <= '9'.charCodeAt(0); ++i) {
  validCharacters.push(String.fromCharCode(i));
}
let validCharactersCopy = [...validCharacters];

let matrix = [];

let matrixRowColumnOfEachCharacter = [];

function fillMatrix(key) {
  for(let i = 0; i < matrix.length; ++i) {
    matrix[i].splice(0, matrix[i].length);
  }
  for(let i = 0; i < 6; ++i) {
    matrix.push([]);
  }
  matrixRowColumnOfEachCharacter.splice(0, matrixRowColumnOfEachCharacter.length);
  let i = 0;
  let filledValues = [];
  while (true) {
    if(i < key.length && !filledValues.includes(key[i])) {
      if(!validCharacters.includes(key[i])) {
        return `Invalid character ${key[i]} found in key`;
      }
      filledValues.push(key[i]);
      validCharactersCopy.splice(validCharactersCopy.indexOf(key[i]),1);
    }
    else if(i >= key.length) {
      filledValues.push(validCharactersCopy[0]);
      validCharactersCopy.splice(0,1);
    }
    if(validCharactersCopy.length === 0) {
      break;
    }
    ++i;
  }
  i = 0;
  for(let j = 0; j < 6; ++j) {
    for(let k = 0; k < 6; ++k) {
      matrix[j].push(filledValues[i]);
      matrixRowColumnOfEachCharacter.push([matrix[j][k], j, k]);
      ++i;
    }
  }
  return null;
}

function updateTheText(text) {
  let textArray = text.split('');
  let updatedText = '';
  for(const j of text) {
    if(!validCharacters.includes(j)) {
      return [true, `Invalid character ${j} found in text`];
    }
  }
  let i = 0;
  while(true) {
    if(i !== textArray.length-1 && i%2 === 0) {
      if(textArray[i] !== textArray[i+1]) {
        ++i;
      }
      else if(textArray[i] === textArray[i+1]) {
        if(textArray[i] === 'X') {
          textArray = [...textArray.slice(0,i+1),'Y',...textArray.slice(i+1, textArray.length)];
        } else {
          textArray = [...textArray.slice(0,i+1),'X',...textArray.slice(i+1, textArray.length)];
        }
        ++i;
      }
      continue;
    }
    if(i !== textArray.length-1 && i%2 === 1) {
      ++i;
      continue;
    }
    if(i === textArray.length-1 && i%2 === 0) {
      if(textArray[i] === 'X') {
        textArray.push('Y');
      } else {
        textArray.push('X');
      }
      break;
    }
    if(i === textArray.length-1 && i%2 === 1) {
      break;
    }
  }
  updatedText = textArray.join('');
  return [false, updatedText];
}

function encrypt(updatedOriginalText) {
  let cipherText = '';
  let rowColumnBeforeRowColumnAfter = [];
  for(let i = 0; i < updatedOriginalText.length; i += 2) {
    let _, rowOf1stCharacter, rowOf2ndCharacter, columnOf1stCharacter, columnOf2ndCharacter;
    [_, rowOf1stCharacter, columnOf1stCharacter] = matrixRowColumnOfEachCharacter.find(x => x[0] === updatedOriginalText[i]);
    [_, rowOf2ndCharacter, columnOf2ndCharacter] = matrixRowColumnOfEachCharacter.find(x => x[0] === updatedOriginalText[i+1]);
    if(columnOf2ndCharacter === columnOf1stCharacter) {
      cipherText += matrix[(rowOf1stCharacter+1)%6][columnOf1stCharacter];
      cipherText += matrix[(rowOf2ndCharacter+1)%6][columnOf1stCharacter];
      rowColumnBeforeRowColumnAfter.push([[rowOf1stCharacter, columnOf1stCharacter],[(rowOf1stCharacter+1)%6, columnOf1stCharacter]]);
      rowColumnBeforeRowColumnAfter.push([[rowOf2ndCharacter, columnOf2ndCharacter],[(rowOf2ndCharacter+1)%6, columnOf2ndCharacter]]);
    } else if(rowOf1stCharacter === rowOf2ndCharacter){
      cipherText += matrix[rowOf1stCharacter][(columnOf1stCharacter+1)%6];
      cipherText += matrix[rowOf1stCharacter][(columnOf2ndCharacter+1)%6];
      rowColumnBeforeRowColumnAfter.push([[rowOf1stCharacter, columnOf1stCharacter],[rowOf1stCharacter, (columnOf1stCharacter+1)%6]]);
      rowColumnBeforeRowColumnAfter.push([[rowOf2ndCharacter, columnOf2ndCharacter],[rowOf2ndCharacter, (columnOf2ndCharacter+1)%6]]);
    } else {
      cipherText += matrix[rowOf1stCharacter][columnOf2ndCharacter];
      cipherText += matrix[rowOf2ndCharacter][columnOf1stCharacter];
      rowColumnBeforeRowColumnAfter.push([[rowOf1stCharacter, columnOf1stCharacter],[rowOf1stCharacter, columnOf2ndCharacter]]);
      rowColumnBeforeRowColumnAfter.push([[rowOf2ndCharacter, columnOf2ndCharacter],[rowOf2ndCharacter, columnOf1stCharacter]]);
    }
  }
  return [cipherText, rowColumnBeforeRowColumnAfter];
}

function decrypt(updatedCipherText) {
  let originalText = '';
  let rowColumnBeforeRowColumnAfter = [];
  for(let i = 0; i < updatedCipherText.length; i += 2) {
    let _, rowOf1stCharacter, rowOf2ndCharacter, columnOf1stCharacter, columnOf2ndCharacter;
    [_, rowOf1stCharacter, columnOf1stCharacter] = matrixRowColumnOfEachCharacter.find(x => x[0] === updatedCipherText[i]);
    [_, rowOf2ndCharacter, columnOf2ndCharacter] = matrixRowColumnOfEachCharacter.find(x => x[0] === updatedCipherText[i+1]);
    if(columnOf2ndCharacter === columnOf1stCharacter) {
      originalText += matrix[(rowOf1stCharacter-1)%6 < 0 ? 5: (rowOf1stCharacter-1)%6][columnOf1stCharacter];
      originalText += matrix[(rowOf2ndCharacter-1)%6 < 0 ? 5: (rowOf2ndCharacter-1)%6][columnOf1stCharacter];
      rowColumnBeforeRowColumnAfter.push([[rowOf1stCharacter, columnOf1stCharacter],[(rowOf1stCharacter-1)%6 < 0 ? 5: (rowOf1stCharacter-1)%6, columnOf1stCharacter]]);
      rowColumnBeforeRowColumnAfter.push([[rowOf2ndCharacter, columnOf2ndCharacter],[(rowOf2ndCharacter-1)%6 < 0 ? 5: (rowOf2ndCharacter-1)%6, columnOf2ndCharacter]]);
    } else if(rowOf1stCharacter === rowOf2ndCharacter){
      originalText += matrix[rowOf1stCharacter][(columnOf1stCharacter-1)%6 < 0 ? 5: (columnOf1stCharacter-1)%6];
      originalText += matrix[rowOf1stCharacter][(columnOf2ndCharacter-1)%6 < 0 ? 5: (columnOf2ndCharacter-1)%6];
      rowColumnBeforeRowColumnAfter.push([[rowOf1stCharacter, columnOf1stCharacter],[rowOf1stCharacter, (columnOf1stCharacter-1)%6 < 0 ? 5: (columnOf1stCharacter-1)%6]]);
      rowColumnBeforeRowColumnAfter.push([[rowOf2ndCharacter, columnOf2ndCharacter],[rowOf2ndCharacter, (columnOf2ndCharacter-1)%6 < 0 ? 5: (columnOf2ndCharacter-1)%6]]);
    } else {
      originalText += matrix[rowOf1stCharacter][columnOf2ndCharacter];
      originalText += matrix[rowOf2ndCharacter][columnOf1stCharacter];
      rowColumnBeforeRowColumnAfter.push([[rowOf1stCharacter, columnOf1stCharacter],[rowOf1stCharacter, columnOf2ndCharacter]]);
      rowColumnBeforeRowColumnAfter.push([[rowOf2ndCharacter, columnOf2ndCharacter],[rowOf2ndCharacter, columnOf1stCharacter]]);
    }
  }
  return [originalText, rowColumnBeforeRowColumnAfter];
}

function visualizeTextCreation(keyValue, initialText, updatedInitialText, eORd, rowColumnBeforeRowColumnAfter, finalText) {
  let visualizeText = 'Separate duplicate letters and make the input text length even:-\n\tFirst Separator:- X\n\tSecond Separator:- Y\n\n';
  visualizeText += '0-Indexed:-\n\n';
  visualizeText += eORd === 'e' ? `Original Text Entered:- ${initialText}\nUpdated Original Text:- ` : `Cipher Text Entered:- ${initialText}\nUpdated Cipher Text:- `;
  for(let i = 0; i < updatedInitialText.length; i += 2) {
    visualizeText += i < updatedInitialText.length-2 ? `${updatedInitialText[i]}${updatedInitialText[i+1]} ` : `${updatedInitialText[i]}${updatedInitialText[i+1]}\n`;
  }
  visualizeText += eORd === 'e' ? '-'.repeat(23+3*updatedInitialText.length/2)+`\n          Cipher Text:- `: '-'.repeat(21+3*updatedInitialText.length/2)+`\n      Original Text:- `;
  for(let i = 0; i < finalText.length; i += 2) {
    visualizeText += i < finalText.length-2 ? `${finalText[i]}${finalText[i+1]} ` : `${finalText[i]}${finalText[i+1]}\n`;
  }
  visualizeText += eORd === 'e' ? `    Final Cipher Text:- ${finalText}\n\n` : `Final Original Text:- ${finalText}\n\n`;
  visualizeText += `(6 x 6) Matrix with Key:- ${keyValue}\n\n`;
  for(let i = 0; i < 6; ++i) {
    for(let j = 0; j < 6; ++j) {
      visualizeText += j < 5 ? `${matrix[i][j]} ` : `${matrix[i][j]}`;
    }
    visualizeText += i < 5 ? `\n` : `\n\n`;
  }
  for(let i = 0; i < rowColumnBeforeRowColumnAfter.length; i+=2) {
    let rowBeforeOf1stCharacter = rowColumnBeforeRowColumnAfter[i][0][0];
    let columnBeforeOf1stCharacter = rowColumnBeforeRowColumnAfter[i][0][1];
    let rowAfterOf1stCharacter = rowColumnBeforeRowColumnAfter[i][1][0];
    let columnAfterOf1stCharacter = rowColumnBeforeRowColumnAfter[i][1][1];

    let rowBeforeOf2ndCharacter = rowColumnBeforeRowColumnAfter[i+1][0][0];
    let columnBeforeOf2ndCharacter = rowColumnBeforeRowColumnAfter[i+1][0][1];
    let rowAfterOf2ndCharacter = rowColumnBeforeRowColumnAfter[i+1][1][0];
    let columnAfterOf2ndCharacter = rowColumnBeforeRowColumnAfter[i+1][1][1];

    if(rowBeforeOf1stCharacter === rowBeforeOf2ndCharacter) {
      visualizeText += `${matrix[rowBeforeOf1stCharacter][columnBeforeOf1stCharacter]} and ${matrix[rowBeforeOf2ndCharacter][columnBeforeOf2ndCharacter]} are in same ROW\n`;
      visualizeText += `\t${matrix[rowBeforeOf1stCharacter][columnBeforeOf1stCharacter]} (Row:- ${rowBeforeOf1stCharacter}, Column:- ${columnBeforeOf1stCharacter}) -> ${matrix[rowAfterOf1stCharacter][columnAfterOf1stCharacter]} (Row:- ${rowAfterOf1stCharacter}, Column:- ${columnAfterOf1stCharacter})\n\t`;
      visualizeText += `${matrix[rowBeforeOf2ndCharacter][columnBeforeOf2ndCharacter]} (Row:- ${rowBeforeOf2ndCharacter}, Column:- ${columnBeforeOf2ndCharacter}) -> ${matrix[rowAfterOf2ndCharacter][columnAfterOf2ndCharacter]} (Row:- ${rowAfterOf2ndCharacter}, Column:- ${columnAfterOf2ndCharacter})\n`;
    }
    else if(columnBeforeOf1stCharacter === columnBeforeOf2ndCharacter) {
      visualizeText += `${matrix[rowBeforeOf1stCharacter][columnBeforeOf1stCharacter]} and ${matrix[rowBeforeOf2ndCharacter][columnBeforeOf2ndCharacter]} are in same COLUMN\n`;
      visualizeText += `\t${matrix[rowBeforeOf1stCharacter][columnBeforeOf1stCharacter]} (Row:- ${rowBeforeOf1stCharacter}, Column:- ${columnBeforeOf1stCharacter}) -> ${matrix[rowAfterOf1stCharacter][columnAfterOf1stCharacter]} (Row:- ${rowAfterOf1stCharacter}, Column:- ${columnAfterOf1stCharacter})\n\t`;
      visualizeText += `${matrix[rowBeforeOf2ndCharacter][columnBeforeOf2ndCharacter]} (Row:- ${rowBeforeOf2ndCharacter}, Column:- ${columnBeforeOf2ndCharacter}) -> ${matrix[rowAfterOf2ndCharacter][columnAfterOf2ndCharacter]} (Row:- ${rowAfterOf2ndCharacter}, Column:- ${columnAfterOf2ndCharacter})\n`;
    }
    else {
      visualizeText += `${matrix[rowBeforeOf1stCharacter][columnBeforeOf1stCharacter]} and ${matrix[rowBeforeOf2ndCharacter][columnBeforeOf2ndCharacter]} are DIAGONAL to each other\n`;
      visualizeText += `\t${matrix[rowBeforeOf1stCharacter][columnBeforeOf1stCharacter]} (Row:- ${rowBeforeOf1stCharacter}, Column:- ${columnBeforeOf1stCharacter}) -> ${matrix[rowAfterOf1stCharacter][columnAfterOf1stCharacter]} (Row:- ${rowAfterOf1stCharacter}, Column:- ${columnAfterOf1stCharacter})\n\t`;
      visualizeText += `${matrix[rowBeforeOf2ndCharacter][columnBeforeOf2ndCharacter]} (Row:- ${rowBeforeOf2ndCharacter}, Column:- ${columnBeforeOf2ndCharacter}) -> ${matrix[rowAfterOf2ndCharacter][columnAfterOf2ndCharacter]} (Row:- ${rowAfterOf2ndCharacter}, Column:- ${columnAfterOf2ndCharacter})\n`;
    }
  }
  return visualizeText;
}

function calculate() {
  validCharactersCopy = [...validCharacters];
  if (document.getElementById('decrypt').checked) {
    const keyValue = key.value.toUpperCase().split(' ').join('');
    const cipherText = inputText.value.toUpperCase().split(' ').join('');
    const errorFillingMatrix = fillMatrix(keyValue);
    if (errorFillingMatrix) {
      outputBlock.style.display = 'none';
      inputText.value = '';
      key.value = '';
      programVisualizeBlock.style.display = 'none';
      programOutputBlock.style.display = 'none';
      inputBlock.style.borderBottom = 'none';
      alert(errorFillingMatrix);
    } else {
      let [error, updatedCipherText] = updateTheText(cipherText);
      if (error) {
        outputBlock.style.display = 'none';
        inputText.value = '';
        key.value = '';
        programVisualizeBlock.style.display = 'none';
        programOutputBlock.style.display = 'none';
        inputBlock.style.borderBottom = 'none';
        alert(updatedCipherText);
      } else {
        const [originalText, rowColumnBeforeRowColumnAfter]  = decrypt(updatedCipherText);
        visualizeText = visualizeTextCreation(keyValue, cipherText, updatedCipherText, 'd', rowColumnBeforeRowColumnAfter, originalText);
        outputBlock.style.display = 'block';
        // inputBlock.style.borderBottom = '3px solid black';
        outputBlock.innerHTML = `<span class="outputLabel">Original Text is: </span><span class="quote-answer">'</span><span class="answer">${originalText}</span><span class="quote-answer">'</span>`;
        copyAnswer.innerHTML = `<i class="far fa-copy copyIcon" onclick="copyAnswerText()"></i>`;
        copyAnswer.style.display = 'block';
        programVisualizeBlock.style.display = 'block';
        programOutputBlock.style.display = 'block';
        visualizeBlock.style.display = 'block';
        visualizeTitle.style.display = 'block';
        // programOutputBlock.style.borderBottom = '3px dashed black';
        visualizeTitle.innerHTML = `Visualization`;
        visualizeBlock.innerHTML = `<span class="visualizeText">${visualizeText}</span>`;
        copyVisualization.innerHTML = `<i class="far fa-copy copyIcon" onclick="copyVisualizeText()"></i>`;
        copyVisualization.style.display = 'block';
      }
    }
  }
  if (document.getElementById('encrypt').checked) {
    const keyValue = key.value.toUpperCase().split(' ').join('');
    const originalText = inputText.value.toUpperCase().split(' ').join('');
    const errorFillingMatrix = fillMatrix(keyValue);
    if (errorFillingMatrix) {
      outputBlock.style.display = 'none';
      inputText.value = '';
      key.value = '';
      programVisualizeBlock.style.display = 'none';
      programOutputBlock.style.display = 'none';
      inputBlock.style.borderBottom = 'none';
      alert(errorFillingMatrix);
    } else {
      let [error, updatedOriginalText] = updateTheText(originalText);
      if (error) {
        outputBlock.style.display = 'none';
        inputText.value = '';
        key.value = '';
        programVisualizeBlock.style.display = 'none';
        programOutputBlock.style.display = 'none';
        inputBlock.style.borderBottom = 'none';
        alert(updatedOriginalText);
      } else {
        const [cipherText, rowColumnBeforeRowColumnAfter] = encrypt(updatedOriginalText);
        visualizeText = visualizeTextCreation(keyValue, originalText, updatedOriginalText, 'e', rowColumnBeforeRowColumnAfter, cipherText);
        outputBlock.style.display = 'block';
        // inputBlock.style.borderBottom = '3px solid black';
        outputBlock.innerHTML = `<span class="outputLabel">Cipher Text is: </span><span class="quote-answer">'</span></span><span class="answer">${cipherText}</span><span class="quote-answer">'</span>`;
        copyAnswer.innerHTML = `<i class="far fa-copy copyIcon" onclick="copyAnswerText()"></i>`;
        copyAnswer.style.display = 'block';
        programVisualizeBlock.style.display = 'block';
        programOutputBlock.style.display = 'block';
        visualizeBlock.style.display = 'block';
        visualizeTitle.style.display = 'block';
        // programOutputBlock.style.borderBottom = '3px dashed black';
        visualizeTitle.innerHTML = `Visualization`;
        visualizeBlock.innerHTML = `<span class="visualizeText">${visualizeText}</span>`;
        copyVisualization.innerHTML = `<i class="far fa-copy copyIcon" onclick="copyVisualizeText()"></i>`;
        copyVisualization.style.display = 'block';
      }
    }
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
  closeWindow(playfairWindow);
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
  playfairWindow.style.display = 'block';
  overlay.style.display = 'block';
  overlay.style.height = `${document.documentElement.getBoundingClientRect().height}px`;
  overlay.style.width = `${document.documentElement.getBoundingClientRect().width}px`;
}

scrollTo.addEventListener('click', function(e) {
  implementation.scrollIntoView({
    behavior: 'smooth'
  });
});

