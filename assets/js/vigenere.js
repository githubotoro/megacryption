'use strict';

const vigenereWindow = document.querySelector('.algo-container');
const encryptRadioButton = document.querySelector('#encrypt');
const decryptRadioButton = document.querySelector('#decrypt');
const inputLabel = document.querySelector('#inputLabel');
const inputText = document.querySelector('#inputText');
const vigenere = document.querySelector('#runButton');
const inputBlock = document.querySelector('.input');
const outputBlock = document.querySelector('.output');
const visualizeBlock = document.querySelector('.visualization');
const keyword = document.querySelector('#keyword');
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
  vigenere.textContent = 'Encrypt';
});

decryptRadioButton.addEventListener('click', function () {
  inputLabel.textContent = 'Enter the Ciphered Text: ';
  vigenere.textContent = 'Decrypt';
});

let validCharacters = [];

for (let i = 'A'.charCodeAt(0); i <= 'Z'.charCodeAt(0); ++i) {
  validCharacters.push(String.fromCharCode(i));
}
for (let i = 'a'.charCodeAt(0); i <= 'z'.charCodeAt(0); ++i) {
  validCharacters.push(String.fromCharCode(i));
}
for (let i = '0'.charCodeAt(0); i <= '9'.charCodeAt(0); ++i) {
  validCharacters.push(String.fromCharCode(i));
}

function createKey(text, keyword) {
  const keywordWithoutSpaces = keyword.split(' ').join('');
  const textWithoutSpaces = text.split(' ').join('');
  const tmp1 = Math.floor(textWithoutSpaces.length / keywordWithoutSpaces.length);
  const tmp2 = textWithoutSpaces.length % keywordWithoutSpaces.length;
  let key = '';

  for(let i = 0; i < tmp1; ++i) {
    key += keywordWithoutSpaces;
  }
  for(let i = 0; i < tmp2; ++i) {
    key += keywordWithoutSpaces[i];
  }
  return key;
}

function encrypt(originalText, key) {
  let cipherText = '';
  let error;
  let j = 0;
  for(let i = 0; i < originalText.length; ++i) {
    if(originalText[i] === ' ' && validCharacters.includes(key[j])) {
      cipherText += ' ';
      error = false;
      continue;
    }
    if(!validCharacters.includes(originalText[i])) {
      cipherText = `Invalid character ${originalText[i]} found in original text`;
      error = true;
      return [error, cipherText];
    }
    if(!validCharacters.includes(key[j])) {
      cipherText = `Invalid character ${key[j]} found in keyword`;
      error = true;
      return [error, cipherText];
    }
    else {
      let encryptedCharacterIndex = (validCharacters.indexOf(originalText[i]) + validCharacters.indexOf(key[j])) % validCharacters.length;
      if(encryptedCharacterIndex < 0) {
        encryptedCharacterIndex = validCharacters.length + encryptedCharacterIndex;
      }
      cipherText += validCharacters[encryptedCharacterIndex];
      error = false;
      ++j;
    }
  }
  return [error, cipherText];
}

function decrypt(cipherText, key) {
  let originalText = '';
  let error;
  let j = 0;
  for(let i = 0; i < cipherText.length; ++i) {
    if(cipherText[i] === ' ' && validCharacters.includes(key[j])) {
      originalText += ' ';
      error = false;
      continue;
    }
    if(!validCharacters.includes(cipherText[i])) {
      originalText = `Invalid character ${cipherText[i]} found in cipher text`;
      error = true;
      return [error, originalText];
    }
    if(!validCharacters.includes(key[j])) {
      originalText = `Invalid character ${key[j]} found in keyword`;
      error = true;
      return [error, originalText];
    }
    else {
      let decryptedCharacterIndex = (validCharacters.indexOf(cipherText[i]) - validCharacters.indexOf(key[j])) % validCharacters.length;
      if(decryptedCharacterIndex < 0) {
        decryptedCharacterIndex = validCharacters.length + decryptedCharacterIndex;
      }
      originalText += validCharacters[decryptedCharacterIndex];
      error = false;
      ++j;
    }
  }
  return [error, originalText];
}

function visualizeTextCreation(initialText, finalText, eORd, key) {
  let visualizeText = '0-Indexed\n\n';
  let j = 0;
  visualizeText += eORd === 'e' ? 'Original Text: ' : 'Cipher Text:   ';
  for(let i = 0; i < initialText.length; ++i) {
    visualizeText += `'${initialText[i]}'`;
  }
  visualizeText += '\nKey:           ';
  for(let i = 0; i < initialText.length; ++i) {
    if(initialText[i] === ' ') {
      visualizeText += '   ';
    } else {
      visualizeText += `'${key[j]}'`;
      ++j;
    }
  }
  visualizeText += '\n               ';
  for(let i = 0; i < initialText.length; ++i) {
    visualizeText += '---';
  }
  visualizeText += eORd === 'e' ? '\nCipher Text:   ' : '\nOriginal Text: ';
  for(let i = 0; i < initialText.length; ++i) {
    visualizeText += `'${finalText[i]}'`;
  }

  if(eORd === 'e') {
    visualizeText += `\n\nvalidCharacters(vC) = ['A',...,'Z','a',...,'z','0',...,'9']\n(Index of non-space character of original text in vC + Index of non-space character of key in vC)%(length of vC) = index of its encrypted character in vC\n\n`;
  } else {
    visualizeText += `\n\nvalidCharacters(vC) = ['A',...,'Z','a',...,'z','0',...,'9']\n(Index of non-space character of cipher text in vC - Index of non-space character of key in vC)%(length of vC) = index of its decrypted character in vC\n\n`;
  }
  j = 0;
  for(let i = 0; i < initialText.length; ++i) {
    if(eORd === 'e') {
      if(initialText[i] === ' ') {
        visualizeText += `' ' -> ' '`
      } else {
        if((validCharacters.indexOf(initialText[i]) + validCharacters.indexOf(key[j])) % validCharacters.length < 0) {
          visualizeText += `'${initialText[i]}' -> (${validCharacters.indexOf(initialText[i])} + ${validCharacters.indexOf(key[j])}) % ${validCharacters.length} = ${validCharacters.indexOf(initialText[i]) + validCharacters.indexOf(key[j])} % ${validCharacters.length} = ${(validCharacters.indexOf(initialText[i]) + validCharacters.indexOf(key[j])) % validCharacters.length} -> ${(validCharacters.indexOf(initialText[i]) + validCharacters.indexOf(key[j])) % validCharacters.length} + ${validCharacters.length} -> ${(validCharacters.indexOf(initialText[i]) + validCharacters.indexOf(key[j])) % validCharacters.length + validCharacters.length} -> '${finalText[i]}'`;
        } else {
          visualizeText += `'${initialText[i]}' -> (${validCharacters.indexOf(initialText[i])} + ${validCharacters.indexOf(key[j])}) % ${validCharacters.length} = ${validCharacters.indexOf(initialText[i]) + validCharacters.indexOf(key[j])} % ${validCharacters.length} = ${(validCharacters.indexOf(initialText[i]) + validCharacters.indexOf(key[j])) % validCharacters.length} -> '${finalText[i]}'`;
        }
        ++j;
      }
    }
    if(eORd === 'd') {
      if(initialText[i] === ' ') {
        visualizeText += `' ' -> ' '`
      } else {
        if((validCharacters.indexOf(initialText[i]) - validCharacters.indexOf(key[j])) % validCharacters.length < 0) {
          visualizeText += `'${initialText[i]}' -> (${validCharacters.indexOf(initialText[i])} - ${validCharacters.indexOf(key[j])}) % ${validCharacters.length} = ${validCharacters.indexOf(initialText[i]) - validCharacters.indexOf(key[j])} % ${validCharacters.length} = ${(validCharacters.indexOf(initialText[i]) - validCharacters.indexOf(key[j])) % validCharacters.length} -> ${(validCharacters.indexOf(initialText[i]) - validCharacters.indexOf(key[j])) % validCharacters.length} + ${validCharacters.length} -> ${(validCharacters.indexOf(initialText[i]) - validCharacters.indexOf(key[j])) % validCharacters.length + validCharacters.length} -> '${finalText[i]}'`;
        } else{
          visualizeText += `'${initialText[i]}' -> (${validCharacters.indexOf(initialText[i])} - ${validCharacters.indexOf(key[j])}) % ${validCharacters.length} = ${validCharacters.indexOf(initialText[i]) - validCharacters.indexOf(key[j])} % ${validCharacters.length} = ${(validCharacters.indexOf(initialText[i]) - validCharacters.indexOf(key[j])) % validCharacters.length} -> '${finalText[i]}'`;
        }
        ++j;
      }
    }
    if(i !== initialText.length-1) {
      visualizeText += '\n';
    }
  }
  return visualizeText;
}

function calculate() {
  if(document.getElementById('decrypt').checked) {
    const key = createKey(inputText.value, keyword.value);
    const [error, originalText] = decrypt(inputText.value, key);
    if(error) {
      outputBlock.style.display = 'none';
      inputText.value = '';
      keyword.value = '';
      programVisualizeBlock.style.display = 'none';
      programOutputBlock.style.display = 'none';
      inputBlock.style.borderBottom = 'none';
      alert(originalText);
    } else {
      visualizeText = visualizeTextCreation(inputText.value, originalText, 'd', key);
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
  if(document.getElementById('encrypt').checked){
    const key = createKey(inputText.value, keyword.value);
    const [error, cipherText] = encrypt(inputText.value, key);
    if(error) {
      outputBlock.style.display = 'none';
      inputText.value = '';
      keyword.value = '';
      programVisualizeBlock.style.display = 'none';
      programOutputBlock.style.display = 'none';
      inputBlock.style.borderBottom = 'none';
      alert(cipherText);
    } else {
      visualizeText = visualizeTextCreation(inputText.value, cipherText, 'e', key);
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

const closeWindow = function (modalWindow) {
  modalWindow.style.display = 'none';
  outputBlock.style.display = 'none';
  inputText.value = '';
  keyword.value = '';
  programVisualizeBlock.style.display = 'none';
  programOutputBlock.style.display = 'none';
  inputBlock.style.borderBottom = 'none';
  overlay.style.display = 'none';
}

close.addEventListener('click', function () {
  closeWindow(vigenereWindow);
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
  vigenereWindow.style.display = 'block';
  overlay.style.display = 'block';
  overlay.style.height = `${document.documentElement.getBoundingClientRect().height}px`;
  overlay.style.width = `${document.documentElement.getBoundingClientRect().width}px`;
}

scrollTo.addEventListener('click', function(e) {
  implementation.scrollIntoView({
    behavior: 'smooth'
  });
});

