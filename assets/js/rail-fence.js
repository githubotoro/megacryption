'use strict';

const railFenceWindow = document.querySelector('.algo-container');
const encryptRadioButton = document.querySelector('#encrypt');
const decryptRadioButton = document.querySelector('#decrypt');
const inputLabel = document.querySelector('#inputLabel');
const inputText = document.querySelector('#inputText');
const railFence = document.querySelector('#runButton');
const inputBlock = document.querySelector('.input');
const outputBlock = document.querySelector('.output');
const visualizeBlock = document.querySelector('.visualization');
const key = document.querySelector('#key');
const offset = document.querySelector('#offset');
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

let matrix = [];

encryptRadioButton.addEventListener('click', function () {
  inputLabel.textContent = 'Enter the Original Text: ';
  railFence.textContent = 'Encrypt';
});

decryptRadioButton.addEventListener('click', function () {
  inputLabel.textContent = 'Enter the Ciphered Text: ';
  railFence.textContent = 'Decrypt';
});

function placeholderChange() {
  const keyValue = (key.value);
  if(keyValue === '') {
    offset.placeholder = `Value of Key ?`;
  } else {
    offset.placeholder = `0 <= offset <= ${2*(keyValue-1)-1}`;
  }
}


function encrypt(originalText, key, offset) {
  matrix.splice(0, matrix.length);
  let cipherText = '';
  let rowCurrentIndex, rowPreviousIndex;
  for(let i = 1; i <= key; ++i) {
    matrix.push([]);
  }
  for(let i = 0; i < originalText.length; ++i) {
    if(offset >= 0 && offset < key-1) {
      if(i === 0) {
        rowPreviousIndex = offset;
        rowCurrentIndex = offset;
        matrix[rowCurrentIndex].push([originalText[i],i]);
        continue;
      }
      if(rowCurrentIndex === key-1) {
        rowPreviousIndex = key-1;
        rowCurrentIndex -= 1;
      }
      else if(rowCurrentIndex === 0) {
        rowPreviousIndex = 0;
        rowCurrentIndex += 1;
      }
      else if(rowPreviousIndex === rowCurrentIndex) {
        rowCurrentIndex += 1;
      }
      else if(rowPreviousIndex < rowCurrentIndex) {
        rowPreviousIndex = rowCurrentIndex;
        rowCurrentIndex = rowCurrentIndex === key-1? rowCurrentIndex-1 : rowCurrentIndex+1;
      }
      else if(rowPreviousIndex > rowCurrentIndex) {
        rowPreviousIndex = rowCurrentIndex;
        rowCurrentIndex = rowCurrentIndex === 0? rowCurrentIndex+1 : rowCurrentIndex-1;
      }
      matrix[rowCurrentIndex].push([originalText[i],i]);
    } else {
      if(i === 0) {
        rowPreviousIndex = 2*(key-1)-offset;
        rowCurrentIndex = 2*(key-1)-offset;
        matrix[rowCurrentIndex].push([originalText[i],i]);
        continue;
      }
      if(rowCurrentIndex === key-1) {
        rowPreviousIndex = key-1;
        rowCurrentIndex -= 1;
      }
      else if(rowCurrentIndex === 0) {
        rowPreviousIndex = 0;
        rowCurrentIndex += 1;
      }
      else if(rowPreviousIndex === rowCurrentIndex) {
        rowCurrentIndex -= 1;
      }
      else if(rowPreviousIndex < rowCurrentIndex) {
        rowPreviousIndex = rowCurrentIndex;
        rowCurrentIndex = rowCurrentIndex === key-1? rowCurrentIndex-1 : rowCurrentIndex+1;
      }
      else if(rowPreviousIndex > rowCurrentIndex) {
        rowPreviousIndex = rowCurrentIndex;
        rowCurrentIndex = rowCurrentIndex === 0? rowCurrentIndex+1 : rowCurrentIndex-1;
      }
      matrix[rowCurrentIndex].push([originalText[i],i]);
    }
  }
  for(let i = 0; i < matrix.length; ++i) {
    for(let j = 0; j < matrix[i].length; ++j) {
      cipherText += matrix[i][j][0];
    }
  }
  return cipherText;
}

function decrypt(cipherText, key, offset) {
  matrix.splice(0, matrix.length);
  for(let i = 1; i <= key; ++i) {
    matrix.push([]);
  }
  let originalText = '';
  let rowCurrentIndex, rowPreviousIndex, columnCurrentIndex, firstElementRowIndex, firstElementColumnIndex;
  let columnWiseArray = [];
  let columnsIndexesFilled = [];
  let isPlus;

  for(let i = 0; i < cipherText.length; ++i) {
    if(offset >= 0 && offset < key-1) {
      if(i === 0) {
        rowCurrentIndex = offset;
        rowPreviousIndex = offset;
        firstElementRowIndex = offset;
        firstElementColumnIndex = i;
        continue;
      }
      if(rowCurrentIndex === key-1) {
        rowPreviousIndex = key-1;
        rowCurrentIndex -= 1;
      }
      else if(rowCurrentIndex === 0) {
        rowPreviousIndex = 0;
        rowCurrentIndex += 1;
      }
      else if(rowPreviousIndex === rowCurrentIndex) {
        rowCurrentIndex += 1;
      }
      else if(rowPreviousIndex < rowCurrentIndex) {
        rowPreviousIndex = rowCurrentIndex;
        rowCurrentIndex = rowCurrentIndex === key-1? rowCurrentIndex-1 : rowCurrentIndex+1;
      }
      else if(rowPreviousIndex > rowCurrentIndex) {
        rowPreviousIndex = rowCurrentIndex;
        rowCurrentIndex = rowCurrentIndex === 0? rowCurrentIndex+1 : rowCurrentIndex-1;
      }
    } else {
      if(i === 0) {
        rowCurrentIndex = 2*(key-1)-offset;
        rowPreviousIndex = 2*(key-1)-offset;
        firstElementRowIndex = 2*(key-1)-offset;
        firstElementColumnIndex = i;
        continue;
      }
      if(rowCurrentIndex === key-1) {
        rowPreviousIndex = key-1;
        rowCurrentIndex -= 1;
      }
      else if(rowCurrentIndex === 0) {
        rowPreviousIndex = 0;
        rowCurrentIndex += 1;
      }
      else if(rowPreviousIndex === rowCurrentIndex) {
        rowCurrentIndex -= 1;
      }
      else if(rowPreviousIndex < rowCurrentIndex) {
        rowPreviousIndex = rowCurrentIndex;
        rowCurrentIndex = rowCurrentIndex === key-1? rowCurrentIndex-1 : rowCurrentIndex+1;
      }
      else if(rowPreviousIndex > rowCurrentIndex) {
        rowPreviousIndex = rowCurrentIndex;
        rowCurrentIndex = rowCurrentIndex === 0? rowCurrentIndex+1 : rowCurrentIndex-1;
      }
    }
    if(rowCurrentIndex < firstElementRowIndex) {
      firstElementRowIndex = rowCurrentIndex;
      firstElementColumnIndex = i;
    }
  }
  rowCurrentIndex = firstElementRowIndex;
  columnCurrentIndex = firstElementColumnIndex;

  for(let i = 0; i < cipherText.length; ++i) {
    if(offset >= 0 && offset < key-1) {
      if(i === 0) {
        matrix[rowCurrentIndex].push([cipherText[i],columnCurrentIndex]);
        columnsIndexesFilled.push(columnCurrentIndex);
        isPlus = true;
        continue;
      }
      if((!isPlus && rowCurrentIndex !== 0) || (rowCurrentIndex === key-1)) {
        columnCurrentIndex = columnCurrentIndex + 2 * rowCurrentIndex;
        if(columnCurrentIndex < cipherText.length) {
          matrix[rowCurrentIndex].push([cipherText[i],columnCurrentIndex]);
          isPlus = !isPlus;
        } else {
          if(rowCurrentIndex === offset-1) {
            columnCurrentIndex = 0;
            rowCurrentIndex += 1;
            isPlus = true;
            matrix[rowCurrentIndex].push([cipherText[i],columnCurrentIndex]);
          }
          else if(matrix[rowCurrentIndex][0][1] === 0) {
            if(!columnsIndexesFilled.includes(matrix[rowCurrentIndex][0][1]+1)) {
              columnCurrentIndex = matrix[rowCurrentIndex][0][1] + 1;
              rowCurrentIndex += 1;
              isPlus = true;
            } else {
              columnCurrentIndex = matrix[rowCurrentIndex][1][1] + 1;
              rowCurrentIndex += 1;
              isPlus = true;
            }
            matrix[rowCurrentIndex].push([cipherText[i],columnCurrentIndex]);
          } else if(!columnsIndexesFilled.includes(matrix[rowCurrentIndex][0][1]-1) && matrix[rowCurrentIndex][0][1]-1 >= 0) {
            columnCurrentIndex = matrix[rowCurrentIndex][0][1] - 1;
            rowCurrentIndex += 1;
            isPlus = false;
            matrix[rowCurrentIndex].push([cipherText[i],columnCurrentIndex]);
          } else if(!columnsIndexesFilled.includes(matrix[rowCurrentIndex][0][1]+1) && matrix[rowCurrentIndex][0][1]-1 >= 0) {
            columnCurrentIndex = matrix[rowCurrentIndex][0][1] + 1;
            rowCurrentIndex += 1;
            isPlus = true;
            matrix[rowCurrentIndex].push([cipherText[i],columnCurrentIndex]);
          }
        }
        columnsIndexesFilled.push(columnCurrentIndex);
      }
      else if((isPlus && rowCurrentIndex !== key-1) || (rowCurrentIndex === 0)) {
        columnCurrentIndex = columnCurrentIndex + 2 * (key-1-rowCurrentIndex);
        if(columnCurrentIndex < cipherText.length) {
          matrix[rowCurrentIndex].push([cipherText[i],columnCurrentIndex]);
          isPlus = !isPlus;
        } else {
          if(rowCurrentIndex === offset-1) {
            columnCurrentIndex = 0;
            rowCurrentIndex += 1;
            isPlus = true;
            matrix[rowCurrentIndex].push([cipherText[i],columnCurrentIndex]);
          }
          else if(matrix[rowCurrentIndex][0][1] === 0) {
            if(!columnsIndexesFilled.includes(matrix[rowCurrentIndex][0][1]+1)) {
              columnCurrentIndex = matrix[rowCurrentIndex][0][1] + 1;
              rowCurrentIndex += 1;
              isPlus = true;
            } else {
              columnCurrentIndex = matrix[rowCurrentIndex][1][1] + 1;
              rowCurrentIndex += 1;
              isPlus = true;
            }
            matrix[rowCurrentIndex].push([cipherText[i],columnCurrentIndex]);
          } else if(!columnsIndexesFilled.includes(matrix[rowCurrentIndex][0][1]-1) && matrix[rowCurrentIndex][0][1]-1 >= 0) {
            columnCurrentIndex = matrix[rowCurrentIndex][0][1] - 1;
            rowCurrentIndex += 1;
            isPlus = false;
            matrix[rowCurrentIndex].push([cipherText[i],columnCurrentIndex]);
          } else if(!columnsIndexesFilled.includes(matrix[rowCurrentIndex][0][1]+1) && matrix[rowCurrentIndex][0][1]-1 >= 0) {
            columnCurrentIndex = matrix[rowCurrentIndex][0][1] + 1;
            rowCurrentIndex += 1;
            isPlus = true;
            matrix[rowCurrentIndex].push([cipherText[i],columnCurrentIndex]);
          }
        }
        columnsIndexesFilled.push(columnCurrentIndex);
      }
    } else {
      if(i === 0) {
        matrix[rowCurrentIndex].push([cipherText[i],columnCurrentIndex]);
        columnsIndexesFilled.push(columnCurrentIndex);
        isPlus = true;
        continue;
      }
      if((!isPlus && rowCurrentIndex !== 0) || (rowCurrentIndex === key-1)) {
        columnCurrentIndex = columnCurrentIndex + 2 * rowCurrentIndex;
        if(columnCurrentIndex < cipherText.length) {
          matrix[rowCurrentIndex].push([cipherText[i],columnCurrentIndex]);
          isPlus = !isPlus;
        } else {
          if(rowCurrentIndex === offset-1) {
            columnCurrentIndex = 0;
            rowCurrentIndex += 1;
            isPlus = true;
            matrix[rowCurrentIndex].push([cipherText[i],columnCurrentIndex]);
          }
          else if(matrix[rowCurrentIndex][0][1] === 0) {
            if(!columnsIndexesFilled.includes(matrix[rowCurrentIndex][0][1]+1)) {
              columnCurrentIndex = matrix[rowCurrentIndex][0][1] + 1;
              rowCurrentIndex += 1;
              isPlus = true;
            } else {
              columnCurrentIndex = matrix[rowCurrentIndex][1][1] + 1;
              rowCurrentIndex += 1;
              isPlus = true;
            }
            matrix[rowCurrentIndex].push([cipherText[i],columnCurrentIndex]);
          } else if(!columnsIndexesFilled.includes(matrix[rowCurrentIndex][0][1]-1) && matrix[rowCurrentIndex][0][1]-1 >= 0) {
            columnCurrentIndex = matrix[rowCurrentIndex][0][1] - 1;
            rowCurrentIndex += 1;
            isPlus = false;
            matrix[rowCurrentIndex].push([cipherText[i],columnCurrentIndex]);
          } else if(!columnsIndexesFilled.includes(matrix[rowCurrentIndex][0][1]+1) && matrix[rowCurrentIndex][0][1]-1 >= 0) {
            columnCurrentIndex = matrix[rowCurrentIndex][0][1] + 1;
            rowCurrentIndex += 1;
            isPlus = true;
            matrix[rowCurrentIndex].push([cipherText[i],columnCurrentIndex]);
          }
        }
        columnsIndexesFilled.push(columnCurrentIndex);
      }
      else if((isPlus && rowCurrentIndex !== key-1) || (rowCurrentIndex === 0)) {
        columnCurrentIndex = columnCurrentIndex + 2 * (key-1-rowCurrentIndex);
        if(columnCurrentIndex < cipherText.length) {
          matrix[rowCurrentIndex].push([cipherText[i],columnCurrentIndex]);
          isPlus = !isPlus;
        } else {
          if(rowCurrentIndex === offset-1) {
            columnCurrentIndex = 0;
            rowCurrentIndex += 1;
            isPlus = true;
            matrix[rowCurrentIndex].push([cipherText[i],columnCurrentIndex]);
          }
          else if(matrix[rowCurrentIndex][0][1] === 0) {
            if(!columnsIndexesFilled.includes(matrix[rowCurrentIndex][0][1]+1)) {
              columnCurrentIndex = matrix[rowCurrentIndex][0][1] + 1;
              rowCurrentIndex += 1;
              isPlus = true;
            } else {
              columnCurrentIndex = matrix[rowCurrentIndex][1][1] + 1;
              rowCurrentIndex += 1;
              isPlus = true;
            }
            matrix[rowCurrentIndex].push([cipherText[i],columnCurrentIndex]);
          } else if(!columnsIndexesFilled.includes(matrix[rowCurrentIndex][0][1]-1) && matrix[rowCurrentIndex][0][1]-1 >= 0) {
            columnCurrentIndex = matrix[rowCurrentIndex][0][1] - 1;
            rowCurrentIndex += 1;
            isPlus = false;
            matrix[rowCurrentIndex].push([cipherText[i],columnCurrentIndex]);
          } else if(!columnsIndexesFilled.includes(matrix[rowCurrentIndex][0][1]+1) && matrix[rowCurrentIndex][0][1]-1 >= 0) {
            columnCurrentIndex = matrix[rowCurrentIndex][0][1] + 1;
            rowCurrentIndex += 1;
            isPlus = true;
            matrix[rowCurrentIndex].push([cipherText[i],columnCurrentIndex]);
          }
        }
        columnsIndexesFilled.push(columnCurrentIndex);
      }
    }
  }
  for(let i = 0; i < matrix.length; ++i) {
    for(let j = 0; j < matrix[i].length; ++j) {
      columnWiseArray.push([matrix[i][j][0], matrix[i][j][1]]);
    }
  }
  originalText = columnWiseArray.sort((a,b) => a[1] - b[1]).reduce((acc,i) => acc+i[0], '');


  return originalText;
}

function visualizeTextCreation() {
  const totalNumberOfElements = matrix.reduce((acc, row) => acc + row.length, 0);
  let visualizeTextArray = [];
  let visualizeText = "";
  for(let i = 0; i < matrix.length; ++i) {
    visualizeTextArray.push([]);
    for(let j = 0; j < totalNumberOfElements; ++j) {
      visualizeTextArray[i].push('   ');
    }
  }
  for(let i = 0; i < matrix.length; ++i) {
    for(let j = 0; j < matrix[i].length; ++j) {
      visualizeTextArray[i][matrix[i][j][1]] = `'${matrix[i][j][0]}'`;
    }
  }
  for(let i = 0; i < matrix.length; ++i) {
    for(let j = 0; j < totalNumberOfElements; ++j) {
      visualizeText += visualizeTextArray[i][j];
    }
    if(i !== matrix.length - 1) {
      visualizeText += '\n';
    }
  }
  return visualizeText;
}

function calculate() {
  if(document.getElementById('decrypt').checked) {
    const originalText = decrypt(inputText.value, Number(key.value), Number(offset.value));
    visualizeText = visualizeTextCreation();
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
  if(document.getElementById('encrypt').checked){
    const cipherText = encrypt(inputText.value, Number(key.value), Number(offset.value));
    visualizeText = visualizeTextCreation();
    outputBlock.style.display = 'block';
    // inputBlock.style.borderBottom = '3px solid black';
    outputBlock.innerHTML = `<span class="outputLabel">Cipher Text is: </span><span class="quote-answer">'</span><span class="answer">${cipherText}</span><span class="quote-answer">'</span>`;
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

const closeWindow = function (modalWindow) {
  modalWindow.style.display = 'none';
  outputBlock.style.display = 'none';
  inputText.value = '';
  key.value = '';
  offset.value = '';
  programVisualizeBlock.style.display = 'none';
  programOutputBlock.style.display = 'none';
  inputBlock.style.borderBottom = 'none';
  overlay.style.display = 'none';
}

close.addEventListener('click', function () {
  closeWindow(railFenceWindow);
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
  railFenceWindow.style.display = 'block';
  overlay.style.display = 'block';
  overlay.style.height = `${document.documentElement.getBoundingClientRect().height}px`;
  overlay.style.width = `${document.documentElement.getBoundingClientRect().width}px`;
}

scrollTo.addEventListener('click', function(e) {
  implementation.scrollIntoView({
    behavior: 'smooth'
  });
});
