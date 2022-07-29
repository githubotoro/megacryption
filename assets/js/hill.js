'use strict';

const hillWindow = document.querySelector('.algo-container');
const encryptRadioButton = document.querySelector('#encrypt');
const decryptRadioButton = document.querySelector('#decrypt');
const inputLabel = document.querySelector('#inputLabel');
const inputText = document.querySelector('#inputText');
const hill = document.querySelector('#runButton');
const inputBlock = document.querySelector('.input');
const outputBlock = document.querySelector('.output');
const visualizeBlock = document.querySelector('.visualization');

const key11 = document.querySelector('#key11');
const key12 = document.querySelector('#key12');
const key13 = document.querySelector('#key13');
const key21 = document.querySelector('#key21');
const key22 = document.querySelector('#key22');
const key23 = document.querySelector('#key23');
const key31 = document.querySelector('#key31');
const key32 = document.querySelector('#key32');
const key33 = document.querySelector('#key33');

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
  hill.textContent = 'Encrypt';
});

decryptRadioButton.addEventListener('click', function () {
  inputLabel.textContent = 'Enter the Ciphered Text: ';
  hill.textContent = 'Decrypt';
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
let tmp = '!@#$%^&*()-+{}|:?,.[]';
for(let i = 0; i < tmp.length; ++i) {
  validCharacters.push(tmp[i]);
}


function buildingKeyMatrix(initialKeyMatrix) {
  let finalKeyMatrix = [];
  for(let i = 0; i < initialKeyMatrix.length; ++i) {
    finalKeyMatrix.push([]);
    for(let j = 0; j < initialKeyMatrix[i].length; ++j) {
      finalKeyMatrix[i].push(initialKeyMatrix[i][j] % validCharacters.length < 0 ? (initialKeyMatrix[i][j] % validCharacters.length) + validCharacters.length : initialKeyMatrix[i][j] % validCharacters.length);
    }
  }
  return finalKeyMatrix;
}

function buildingTextMatrix(inputText) {
  let inputTextMatrix = [];
  let inputNumericMatrix = [];
  let inputTextWithoutSpaces = inputText.split(' ').join('').split('');
  for(let i = 0; i < inputTextWithoutSpaces.length; ++i) {
    if(!validCharacters.includes(inputTextWithoutSpaces[i])) {
      return [true, `Invalid character ${inputTextWithoutSpaces[i]} found in text`, null];
    }
  }
  if(inputTextWithoutSpaces.length%3 !== 0) {
    let numberOfExtraCharacters = 3 - inputTextWithoutSpaces.length%3;
    for(let i = 0; i < numberOfExtraCharacters; ++i) {
      inputTextWithoutSpaces.push('X');
    }
  }
  for(let i = 0; i < inputTextWithoutSpaces.length; ++i) {
    if(i%3 === 0) {
      inputTextMatrix.push([]);
      inputNumericMatrix.push([]);
    }
    inputTextMatrix[inputTextMatrix.length-1].push(inputTextWithoutSpaces[i]);
    inputNumericMatrix[inputTextMatrix.length-1].push(validCharacters.indexOf(inputTextWithoutSpaces[i]));
  }
  return [false, inputTextMatrix, inputNumericMatrix];
}

function encrypt(inputNumericMatrix, keyMatrix) {
  let cipherNumericMatrix = [];
  let cipherNumericMatrixModValidCharactersLength = [];
  let cipherTextMatrix = [];
  let cipherText = '';
  for(let i = 0; i < inputNumericMatrix.length; ++i) {
    cipherNumericMatrix.push([]);
    cipherNumericMatrixModValidCharactersLength.push([]);
    cipherTextMatrix.push([]);

    let cipherNumber1 = inputNumericMatrix[i][0] * keyMatrix[0][0] + inputNumericMatrix[i][1] * keyMatrix[1][0] + inputNumericMatrix[i][2] * keyMatrix[2][0];
    let cipherNumber2 = inputNumericMatrix[i][0] * keyMatrix[0][1] + inputNumericMatrix[i][1] * keyMatrix[1][1] + inputNumericMatrix[i][2] * keyMatrix[2][1];
    let cipherNumber3 = inputNumericMatrix[i][0] * keyMatrix[0][2] + inputNumericMatrix[i][1] * keyMatrix[1][2] + inputNumericMatrix[i][2] * keyMatrix[2][2];

    cipherNumericMatrix[i].push(cipherNumber1);
    cipherNumericMatrix[i].push(cipherNumber2);
    cipherNumericMatrix[i].push(cipherNumber3);

    cipherNumericMatrixModValidCharactersLength[i].push(cipherNumber1 % validCharacters.length < 0 ? (cipherNumber1 % validCharacters.length) + validCharacters.length : cipherNumber1 % validCharacters.length);
    cipherNumericMatrixModValidCharactersLength[i].push(cipherNumber2 % validCharacters.length < 0 ? (cipherNumber2 % validCharacters.length) + validCharacters.length : cipherNumber2 % validCharacters.length);
    cipherNumericMatrixModValidCharactersLength[i].push(cipherNumber3 % validCharacters.length < 0 ? (cipherNumber3 % validCharacters.length) + validCharacters.length : cipherNumber3 % validCharacters.length);

    cipherTextMatrix[i].push(validCharacters[cipherNumericMatrixModValidCharactersLength[i][0]]);
    cipherTextMatrix[i].push(validCharacters[cipherNumericMatrixModValidCharactersLength[i][1]]);
    cipherTextMatrix[i].push(validCharacters[cipherNumericMatrixModValidCharactersLength[i][2]]);

    cipherText += `${cipherTextMatrix[i][0]}${cipherTextMatrix[i][1]}${cipherTextMatrix[i][2]}`;
  }
  return [cipherNumericMatrix, cipherNumericMatrixModValidCharactersLength, cipherTextMatrix, cipherText];
}

function decrypt(inputNumericMatrix, keyMatrix) {
  let originalNumericMatrix = [];
  let originalNumericMatrixModValidCharactersLength = [];
  let originalTextMatrix = [];
  let originalText = '';
  for(let i = 0; i < inputNumericMatrix.length; ++i) {
    originalNumericMatrix.push([]);
    originalNumericMatrixModValidCharactersLength.push([]);
    originalTextMatrix.push([]);

    let originalNumber1 = inputNumericMatrix[i][0] * keyMatrix[0][0] + inputNumericMatrix[i][1] * keyMatrix[1][0] + inputNumericMatrix[i][2] * keyMatrix[2][0];
    let originalNumber2 = inputNumericMatrix[i][0] * keyMatrix[0][1] + inputNumericMatrix[i][1] * keyMatrix[1][1] + inputNumericMatrix[i][2] * keyMatrix[2][1];
    let originalNumber3 = inputNumericMatrix[i][0] * keyMatrix[0][2] + inputNumericMatrix[i][1] * keyMatrix[1][2] + inputNumericMatrix[i][2] * keyMatrix[2][2];

    originalNumericMatrix[i].push(originalNumber1);
    originalNumericMatrix[i].push(originalNumber2);
    originalNumericMatrix[i].push(originalNumber3);

    originalNumericMatrixModValidCharactersLength[i].push(originalNumber1 % validCharacters.length < 0 ? (originalNumber1 % validCharacters.length) + validCharacters.length : originalNumber1 % validCharacters.length);
    originalNumericMatrixModValidCharactersLength[i].push(originalNumber2 % validCharacters.length < 0 ? (originalNumber2 % validCharacters.length) + validCharacters.length : originalNumber2 % validCharacters.length);
    originalNumericMatrixModValidCharactersLength[i].push(originalNumber3 % validCharacters.length < 0 ? (originalNumber3 % validCharacters.length) + validCharacters.length : originalNumber3 % validCharacters.length);

    originalTextMatrix[i].push(validCharacters[originalNumericMatrixModValidCharactersLength[i][0]]);
    originalTextMatrix[i].push(validCharacters[originalNumericMatrixModValidCharactersLength[i][1]]);
    originalTextMatrix[i].push(validCharacters[originalNumericMatrixModValidCharactersLength[i][2]]);

    originalText += `${originalTextMatrix[i][0]}${originalTextMatrix[i][1]}${originalTextMatrix[i][2]}`;
  }
  return [originalNumericMatrix, originalNumericMatrixModValidCharactersLength, originalTextMatrix, originalText];
}

function visualizeTextCreationEncryption(inputText, inputTextMatrix, inputNumericMatrix, initialKeyMatrix, finalKeyMatrix, cipherNumericMatrix, cipherNumericMatrixModValidCharactersLength, cipherTextMatrix, cipherText) {
  let visualizeText = `If length of Original text is not multiple of 3 then alphabet 'X' will be appended to the text until the length of it is multiple of 3 !\n\n0-Indexed :-\n\nValid Characters Array :- ['A'(0), 'B'(1)...'Z'(25), 'a'(26), 'b'(27)...'z'(51), 0(52), 1(53),...9(61), !(62),....](82)]\n\nOriginal Text          :- ${inputText}\nModified Original Text :- `;
  for(let i = 0; i < inputTextMatrix.length; ++i) {
    visualizeText += `${inputTextMatrix[i][0]}${inputTextMatrix[i][1]}${inputTextMatrix[i][2]}`;
  }
  visualizeText += '\n\n\n(Original Text & Indices) Matrix :-\n\n';
  for(let i = 0; i < inputTextMatrix.length; ++i) {
    visualizeText += `|\t\t ${inputTextMatrix[i][0]}\t\t ${inputTextMatrix[i][1]}\t\t ${inputTextMatrix[i][2]}\t\t|\t\t =\t\t|\t\t ${inputNumericMatrix[i][0]}\t\t ${inputNumericMatrix[i][1]}\t\t ${inputNumericMatrix[i][2]}\t\t|\n`;
  }
  visualizeText += '\n\n(Initial & Final) Key Matrix :-\n\n';
  for(let i = 0; i < 3; ++i){
    visualizeText += `|\t\t(${initialKeyMatrix[i][0]}) mod (${validCharacters.length})\t\t(${initialKeyMatrix[i][1]}) mod (${validCharacters.length})\t\t(${initialKeyMatrix[i][2]}) mod (${validCharacters.length})\t\t|\t\t =\t\t|\t\t${finalKeyMatrix[i][0]}\t\t${finalKeyMatrix[i][1]}\t\t${finalKeyMatrix[i][2]}\t\t|\n`;
  }
  visualizeText += '\n\nMatrix Multiplication between Indices Matrix(Original Text) and the Final Key Matrix :-\n\n';
  for(let i = 0; i < inputNumericMatrix.length; ++i) {
    visualizeText += `|\t\t (${inputNumericMatrix[i][0]} * ${finalKeyMatrix[0][0]} + ${inputNumericMatrix[i][1]} * ${finalKeyMatrix[1][0]} + ${inputNumericMatrix[i][2]} * ${finalKeyMatrix[2][0]}) mod (${validCharacters.length})\t\t (${inputNumericMatrix[i][0]} * ${finalKeyMatrix[0][1]} + ${inputNumericMatrix[i][1]} * ${finalKeyMatrix[1][1]} + ${inputNumericMatrix[i][2]} * ${finalKeyMatrix[2][1]}) mod (${validCharacters.length})\t\t (${inputNumericMatrix[i][0]} * ${finalKeyMatrix[0][2]} + ${inputNumericMatrix[i][1]} * ${finalKeyMatrix[1][2]} + ${inputNumericMatrix[i][2]} * ${finalKeyMatrix[2][2]}) mod (${validCharacters.length})\t\t|\t\t =\t\t|\t\t ${cipherNumericMatrixModValidCharactersLength[i][0]}\t\t ${cipherNumericMatrixModValidCharactersLength[i][1]}\t\t ${cipherNumericMatrixModValidCharactersLength[i][2]}\t\t|\t\t =\t\t|\t\t ${cipherTextMatrix[i][0]}\t\t ${cipherTextMatrix[i][1]}\t\t ${cipherTextMatrix[i][2]}\t\t|\n`;
  }
  visualizeText += `\nCipher Text :- ${cipherText}`;
  return visualizeText;
}

function inverseMatrix(keyMatrix) {
  let determinantString = `${keyMatrix[0][0]} * (${keyMatrix[1][1]} * ${keyMatrix[2][2]} - ${keyMatrix[1][2]} * ${keyMatrix[2][1]}) - ${keyMatrix[0][1]} * (${keyMatrix[1][0]} * ${keyMatrix[2][2]} - ${keyMatrix[2][0]} * ${keyMatrix[1][2]}) + ${keyMatrix[0][2]} * (${keyMatrix[1][0]} * ${keyMatrix[2][1]} - ${keyMatrix[2][0]} * ${keyMatrix[1][1]})`;
  let determinant = keyMatrix[0][0] * (keyMatrix[1][1] * keyMatrix[2][2] - keyMatrix[1][2] * keyMatrix[2][1]) - keyMatrix[0][1] * (keyMatrix[1][0] * keyMatrix[2][2] - keyMatrix[2][0] * keyMatrix[1][2]) + keyMatrix[0][2] * (keyMatrix[1][0] * keyMatrix[2][1] - keyMatrix[2][0] * keyMatrix[1][1]);
  let determinantModValidCharactersLength = determinant % validCharacters.length < 0 ? (determinant % validCharacters.length) + validCharacters.length : determinant % validCharacters.length;
  if(determinantModValidCharactersLength === 0) {
    return [true, determinantString, determinant, 0, null, null, null, null, null, null];
  }
  let multiplicativeInverseOfDeterminantModValidCharactersLength = null;
  for(let i = 0; i < validCharacters.length; ++i) {
    if((determinantModValidCharactersLength * i) % validCharacters.length === 1) {
      multiplicativeInverseOfDeterminantModValidCharactersLength = i;
      break;
    }
  }
  let tmp1 = [];
  for(let i = 0; i < 3; ++i) {
    tmp1.push([]);
    tmp1[i].push(keyMatrix[i][0]);
    tmp1[i].push(keyMatrix[i][1]);
    tmp1[i].push(keyMatrix[i][2]);
    tmp1[i].push(keyMatrix[i][0]);
    tmp1[i].push(keyMatrix[i][1]);
  }
  let tmp2 = [];
  for(let i = 0; i < 5; ++i) {
    tmp2.push([]);
    tmp2[i].push(tmp1[i%3][0]);
    tmp2[i].push(tmp1[i%3][1]);
    tmp2[i].push(tmp1[i%3][2]);
    tmp2[i].push(tmp1[i%3][3]);
    tmp2[i].push(tmp1[i%3][4]);
  }
  let adjointOfKeyMatrixStrings = [[`${tmp2[1][1]} * ${tmp2[2][2]} - ${tmp2[1][2]} * ${tmp2[2][1]}`, `${tmp2[2][1]} * ${tmp2[3][2]} - ${tmp2[2][2]} * ${tmp2[3][1]}`, `${tmp2[3][1]} * ${tmp2[4][2]} - ${tmp2[3][2]} * ${tmp2[4][1]}`],
    [`${tmp2[1][2]} * ${tmp2[2][3]} - ${tmp2[1][3]} * ${tmp2[2][2]}`, `${tmp2[2][2]} * ${tmp2[3][3]} - ${tmp2[2][3]} * ${tmp2[3][2]}`, `${tmp2[3][2]} * ${tmp2[4][3]} - ${tmp2[3][3]} * ${tmp2[4][2]}`],
    [`${tmp2[1][3]} * ${tmp2[2][4]} - ${tmp2[1][4]} * ${tmp2[2][3]}`, `${tmp2[2][3]} * ${tmp2[3][4]} - ${tmp2[2][4]} * ${tmp2[3][3]}`, `${tmp2[3][3]} * ${tmp2[4][4]} - ${tmp2[3][4]} * ${tmp2[4][3]}`]];
  let adjointOfKeyMatrix = [[tmp2[1][1] * tmp2[2][2] - tmp2[1][2] * tmp2[2][1], tmp2[2][1] * tmp2[3][2] - tmp2[2][2] * tmp2[3][1], tmp2[3][1] * tmp2[4][2] - tmp2[3][2] * tmp2[4][1]],
    [tmp2[1][2] * tmp2[2][3] - tmp2[1][3] * tmp2[2][2], tmp2[2][2] * tmp2[3][3] - tmp2[2][3] * tmp2[3][2], tmp2[3][2] * tmp2[4][3] - tmp2[3][3] * tmp2[4][2]],
    [tmp2[1][3] * tmp2[2][4] - tmp2[1][4] * tmp2[2][3], tmp2[2][3] * tmp2[3][4] - tmp2[2][4] * tmp2[3][3], tmp2[3][3] * tmp2[4][4] - tmp2[3][4] * tmp2[4][3]]];
  let adjointOfKeyMatrixModValidCharactersLength = [];
  for(let i = 0; i < 3; ++i) {
    adjointOfKeyMatrixModValidCharactersLength.push([]);
    adjointOfKeyMatrixModValidCharactersLength[i].push(adjointOfKeyMatrix[i][0] % validCharacters.length < 0 ? (adjointOfKeyMatrix[i][0] % validCharacters.length) + validCharacters.length : adjointOfKeyMatrix[i][0] % validCharacters.length);
    adjointOfKeyMatrixModValidCharactersLength[i].push(adjointOfKeyMatrix[i][1] % validCharacters.length < 0 ? (adjointOfKeyMatrix[i][1] % validCharacters.length) + validCharacters.length : adjointOfKeyMatrix[i][1] % validCharacters.length);
    adjointOfKeyMatrixModValidCharactersLength[i].push(adjointOfKeyMatrix[i][2] % validCharacters.length < 0 ? (adjointOfKeyMatrix[i][2] % validCharacters.length) + validCharacters.length : adjointOfKeyMatrix[i][2] % validCharacters.length);
  }
  let inverseOfKeyMatrix = [];
  let inverseOfKeyMatrixModValidCharactersLength = [];
  for(let i = 0; i < 3; ++i) {
    inverseOfKeyMatrix.push([]);
    inverseOfKeyMatrixModValidCharactersLength.push([]);

    inverseOfKeyMatrix[i].push(multiplicativeInverseOfDeterminantModValidCharactersLength * adjointOfKeyMatrixModValidCharactersLength[i][0]);
    inverseOfKeyMatrix[i].push(multiplicativeInverseOfDeterminantModValidCharactersLength * adjointOfKeyMatrixModValidCharactersLength[i][1]);
    inverseOfKeyMatrix[i].push(multiplicativeInverseOfDeterminantModValidCharactersLength * adjointOfKeyMatrixModValidCharactersLength[i][2]);

    inverseOfKeyMatrixModValidCharactersLength[i].push(inverseOfKeyMatrix[i][0] % validCharacters.length < 0 ? (inverseOfKeyMatrix[i][0] % validCharacters.length) + validCharacters.length : inverseOfKeyMatrix[i][0] % validCharacters.length);
    inverseOfKeyMatrixModValidCharactersLength[i].push(inverseOfKeyMatrix[i][1] % validCharacters.length < 0 ? (inverseOfKeyMatrix[i][1] % validCharacters.length) + validCharacters.length : inverseOfKeyMatrix[i][1] % validCharacters.length);
    inverseOfKeyMatrixModValidCharactersLength[i].push(inverseOfKeyMatrix[i][2] % validCharacters.length < 0 ? (inverseOfKeyMatrix[i][2] % validCharacters.length) + validCharacters.length : inverseOfKeyMatrix[i][2] % validCharacters.length);
  }
  return [false, determinantString, determinant, determinantModValidCharactersLength, multiplicativeInverseOfDeterminantModValidCharactersLength, adjointOfKeyMatrixStrings, adjointOfKeyMatrix, adjointOfKeyMatrixModValidCharactersLength, inverseOfKeyMatrix, inverseOfKeyMatrixModValidCharactersLength];
}

function visualizeTextCreationSpecialCases(initialKeyMatrix, finalKeyMatrix, determinantString, determinant, determinantModValidCharactersLength, singularOrNoMultiplicativeInverse) {
  let visualizeText = '';
  if(singularOrNoMultiplicativeInverse === 'singular') {
    visualizeText += 'OOPS 😢! The Key Matrix that you entered is SINGULAR !!!';
    visualizeText += '\n\n\n(Initial & Final) Key Matrix :-\n\n';
    for (let i = 0; i < 3; ++i) {
      visualizeText += `|\t\t(${initialKeyMatrix[i][0]}) mod (${validCharacters.length})\t\t(${initialKeyMatrix[i][1]}) mod (${validCharacters.length})\t\t(${initialKeyMatrix[i][2]}) mod (${validCharacters.length})\t\t|\t\t =\t\t|\t\t${finalKeyMatrix[i][0]}\t\t${finalKeyMatrix[i][1]}\t\t${finalKeyMatrix[i][2]}\t\t|\n`;
    }
    visualizeText += `\nDeterminant of Key Matrix => ${determinantString} = ${determinant}\n(${determinant}) mod (${validCharacters.length}) = ${determinantModValidCharactersLength}\n\nAs Determinant mod (${validCharacters.length}) is 0, so the inverse of the Key Matrix is not possible.\n\nTry with some other Key Matrix !!!`;
  } else {
    visualizeText += 'OOPS 😢! The Key Matrix that you entered will not work !!!';
    visualizeText += '\n\n\n(Initial & Final) Key Matrix :-\n\n';
    for (let i = 0; i < 3; ++i) {
      visualizeText += `|\t\t(${initialKeyMatrix[i][0]}) mod (${validCharacters.length})\t\t(${initialKeyMatrix[i][1]}) mod (${validCharacters.length})\t\t(${initialKeyMatrix[i][2]}) mod (${validCharacters.length})\t\t|\t\t =\t\t|\t\t${finalKeyMatrix[i][0]}\t\t${finalKeyMatrix[i][1]}\t\t${finalKeyMatrix[i][2]}\t\t|\n`;
    }
    visualizeText += `\nDeterminant of Key Matrix => ${determinantString} = ${determinant}\n(${determinant}) mod (${validCharacters.length}) = ${determinantModValidCharactersLength}\n\nAs Determinant mod (${validCharacters.length}) has no multiplicative inverse, so, further calculations are not possible.\n\nTry with some other Key Matrix !!!`;
  }
  return visualizeText;
}

function visualizeTextCreationDecryption(inputText, inputTextMatrix, inputNumericMatrix, initialKeyMatrix, finalKeyMatrix, originalNumericMatrix, originalNumericMatrixModValidCharactersLength, originalTextMatrix, originalText, determinantString, determinant, determinantModValidCharactersLength, multiplicativeInverseOfDeterminantModValidCharactersLength, adjointOfKeyMatrixStrings, adjointOfKeyMatrix, adjointOfKeyMatrixModValidCharactersLength, inverseOfKeyMatrix, inverseOfKeyMatrixModValidCharactersLength) {
  let visualizeText = `If length of Cipher text is not multiple of 3 then alphabet 'X' will be appended to the text until the length of it is multiple of 3 !\n\n0-Indexed :-\n\nValid Characters Array :- ['A'(0), 'B'(1)...'Z'(25), 'a'(26), 'b'(27)...'z'(51), 0(52), 1(53),...9(61), !(62),....](82)]\n\nCipher Text          :- ${inputText}\nModified Cipher Text :- `;
  for(let i = 0; i < inputTextMatrix.length; ++i) {
    visualizeText += `${inputTextMatrix[i][0]}${inputTextMatrix[i][1]}${inputTextMatrix[i][2]}`;
  }
  visualizeText += '\n\n\n(Cipher Text & Indices) Matrix :-\n\n';
  for(let i = 0; i < inputTextMatrix.length; ++i) {
    visualizeText += `|\t\t ${inputTextMatrix[i][0]}\t\t ${inputTextMatrix[i][1]}\t\t ${inputTextMatrix[i][2]}\t\t|\t\t =\t\t|\t\t ${inputNumericMatrix[i][0]}\t\t ${inputNumericMatrix[i][1]}\t\t ${inputNumericMatrix[i][2]}\t\t|\n`;
  }
  visualizeText += '\n\n(Initial & Final) Key Matrix :-\n\n';
  for(let i = 0; i < 3; ++i){
    visualizeText += `|\t\t(${initialKeyMatrix[i][0]}) mod (${validCharacters.length})\t\t(${initialKeyMatrix[i][1]}) mod (${validCharacters.length})\t\t(${initialKeyMatrix[i][2]}) mod (${validCharacters.length})\t\t|\t\t =\t\t|\t\t ${finalKeyMatrix[i][0]}\t\t ${finalKeyMatrix[i][1]}\t\t ${finalKeyMatrix[i][2]}\t\t|\n`;
  }
  visualizeText += `\nDeterminant of Final Key Matrix => ${determinantString} = ${determinant}\n`;
  visualizeText += `Multiplicative Inverse of ([${determinant} mod (${validCharacters.length})] => [${determinantModValidCharactersLength}]) is ${multiplicativeInverseOfDeterminantModValidCharactersLength} as\n\t(${determinantModValidCharactersLength} * ${multiplicativeInverseOfDeterminantModValidCharactersLength}) mod (${validCharacters.length}) = 1\n`;
  visualizeText += '\n\nAdjoint of Final Key Matrix :-\n\n';
  for(let i = 0; i < 3; ++i) {
    visualizeText += `|\t\t ${adjointOfKeyMatrixStrings[i][0]}\t\t ${adjointOfKeyMatrixStrings[i][1]}\t\t ${adjointOfKeyMatrixStrings[i][2]}\t\t|\t\t=\t\t|\t\t ${adjointOfKeyMatrix[i][0]}\t\t ${adjointOfKeyMatrix[i][1]}\t\t ${adjointOfKeyMatrix[i][2]}\t\t|\n`;
  }
  visualizeText += `\n\nAdjoint of Final Key Matrix mod (${validCharacters.length}) :-\n\n`;
  for(let i = 0; i < 3; ++i) {
    visualizeText += `|\t\t ${adjointOfKeyMatrixModValidCharactersLength[i][0]}\t\t ${adjointOfKeyMatrixModValidCharactersLength[i][1]}\t\t ${adjointOfKeyMatrixModValidCharactersLength[i][2]}\t\t|\n`;
  }
  visualizeText += `\n\nInverse of Final Key Matrix = (Multiplicative inverse of (Determinant of Final Key Matrix mod (${validCharacters.length})) * (Adjoint of Final Key Matrix mod (${validCharacters.length})) :-\n\n`;
  for(let i = 0; i < 3; ++i) {
    visualizeText += `|\t\t ${inverseOfKeyMatrix[i][0]}\t\t ${inverseOfKeyMatrix[i][1]}\t\t ${inverseOfKeyMatrix[i][2]}\t\t|\n`;
  }
  visualizeText += `\n\nInverse of Final Key Matrix mod (${validCharacters.length}) :-\n\n`;
  for(let i = 0; i < 3; ++i) {
    visualizeText += `|\t\t ${inverseOfKeyMatrixModValidCharactersLength[i][0]}\t\t ${inverseOfKeyMatrixModValidCharactersLength[i][1]}\t\t ${inverseOfKeyMatrixModValidCharactersLength[i][2]}\t\t|\n`;
  }
  visualizeText += `\n\nMatrix Multiplication between Indices Matrix(Original Text) and the (Inverse of Final Key Matrix mod (${validCharacters.length})) :-\n\n`;
  for(let i = 0; i < inputNumericMatrix.length; ++i) {
    visualizeText += `|\t\t (${inputNumericMatrix[i][0]} * ${inverseOfKeyMatrixModValidCharactersLength[0][0]} + ${inputNumericMatrix[i][1]} * ${inverseOfKeyMatrixModValidCharactersLength[1][0]} + ${inputNumericMatrix[i][2]} * ${inverseOfKeyMatrixModValidCharactersLength[2][0]}) mod (${validCharacters.length})\t\t (${inputNumericMatrix[i][0]} * ${inverseOfKeyMatrixModValidCharactersLength[0][1]} + ${inputNumericMatrix[i][1]} * ${inverseOfKeyMatrixModValidCharactersLength[1][1]} + ${inputNumericMatrix[i][2]} * ${inverseOfKeyMatrixModValidCharactersLength[2][1]}) mod (${validCharacters.length})\t\t (${inputNumericMatrix[i][0]} * ${inverseOfKeyMatrixModValidCharactersLength[0][2]} + ${inputNumericMatrix[i][1]} * ${inverseOfKeyMatrixModValidCharactersLength[1][2]} + ${inputNumericMatrix[i][2]} * ${inverseOfKeyMatrixModValidCharactersLength[2][2]}) mod (${validCharacters.length})\t\t|\t\t =\t\t|\t\t ${originalNumericMatrixModValidCharactersLength[i][0]}\t\t ${originalNumericMatrixModValidCharactersLength[i][1]}\t\t ${originalNumericMatrixModValidCharactersLength[i][2]}\t\t|\t\t =\t\t|\t\t ${originalTextMatrix[i][0]}\t\t ${originalTextMatrix[i][1]}\t\t ${originalTextMatrix[i][2]}\t\t|\n`;
  }
  visualizeText += `\nOriginal Text :- ${originalText}`;
  return visualizeText;
}

function calculate() {
  if(document.getElementById('decrypt').checked) {
    let initialKeyMatrix = [
      [Number(key11.value), Number(key12.value), Number(key13.value)],
      [Number(key21.value), Number(key22.value), Number(key23.value)],
      [Number(key31.value), Number(key32.value), Number(key33.value)]
    ];
    let finalKeyMatrix = buildingKeyMatrix(initialKeyMatrix);
    let [error, inputTextMatrix, inputNumericMatrix] = buildingTextMatrix(inputText.value);
    if(error) {
      outputBlock.style.display = 'none';
      inputText.value = '';
      key11.value = '';
      key12.value = '';
      key13.value = '';
      key21.value = '';
      key22.value = '';
      key23.value = '';
      key31.value = '';
      key32.value = '';
      key33.value = '';
      programVisualizeBlock.style.display = 'none';
      programOutputBlock.style.display = 'none';
      inputBlock.style.borderBottom = 'none';
      alert(inputTextMatrix);
    } else {
      let [isSingular, determinantString, determinant, determinantModValidCharactersLength, multiplicativeInverseOfDeterminantModValidCharactersLength, adjointOfKeyMatrixStrings, adjointOfKeyMatrix, adjointOfKeyMatrixModValidCharactersLength, inverseOfKeyMatrix, inverseOfKeyMatrixModValidCharactersLength] = inverseMatrix(finalKeyMatrix);
      if(isSingular) {
        outputBlock.style.display = 'none';
        programVisualizeBlock.style.display = 'none';
        programOutputBlock.style.display = 'none';
        // inputBlock.style.borderBottom = '3px solid black';
        visualizeText = visualizeTextCreationSpecialCases(initialKeyMatrix, finalKeyMatrix, determinantString, determinant, determinantModValidCharactersLength, 'singular');
        programVisualizeBlock.style.display = 'block';
        visualizeBlock.style.display = 'block';
        visualizeTitle.style.display = 'block';
        // programOutputBlock.style.borderBottom = '3px dashed black';
        programVisualizeBlock.style.padding="60px";
        visualizeTitle.innerHTML = `Visualization`;
        visualizeBlock.innerHTML = `<span class="visualizeText">${visualizeText}</span>`;
        copyVisualization.innerHTML = `<i class="far fa-copy copyIcon" onclick="copyVisualizeText()"></i>`;
        copyVisualization.style.display = 'block';
      } else {
        if(multiplicativeInverseOfDeterminantModValidCharactersLength === null) {
          outputBlock.style.display = 'none';
          programVisualizeBlock.style.display = 'none';
          programOutputBlock.style.display = 'none';
          // inputBlock.style.borderBottom = '3px solid black';
          visualizeText = visualizeTextCreationSpecialCases(initialKeyMatrix, finalKeyMatrix, determinantString, determinant, determinantModValidCharactersLength, 'no multiplicative inverse');
          programVisualizeBlock.style.display = 'block';
          visualizeBlock.style.display = 'block';
          visualizeTitle.style.display = 'block';
          // programOutputBlock.style.borderBottom = '3px dashed black';
          visualizeTitle.innerHTML = `Visualization`;
          visualizeBlock.innerHTML = `<span class="visualizeText">${visualizeText}</span>`;
          copyVisualization.innerHTML = `<i class="far fa-copy copyIcon" onclick="copyVisualizeText()"></i>`;
          copyVisualization.style.display = 'block';
        } else {
          let [originalNumericMatrix, originalNumericMatrixModValidCharactersLength, originalTextMatrix, originalText] = decrypt(inputNumericMatrix, inverseOfKeyMatrixModValidCharactersLength);
          visualizeText = visualizeTextCreationDecryption(inputText.value, inputTextMatrix, inputNumericMatrix, initialKeyMatrix, finalKeyMatrix, originalNumericMatrix, originalNumericMatrixModValidCharactersLength, originalTextMatrix, originalText, determinantString, determinant, determinantModValidCharactersLength, multiplicativeInverseOfDeterminantModValidCharactersLength, adjointOfKeyMatrixStrings, adjointOfKeyMatrix, adjointOfKeyMatrixModValidCharactersLength, inverseOfKeyMatrix, inverseOfKeyMatrixModValidCharactersLength);
          outputBlock.style.display = 'block';
          // inputBlock.style.borderBottom = '3px solid black';
          programVisualizeBlock.style.padding="0px" ;
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
  }
  if(document.getElementById('encrypt').checked){
    let initialKeyMatrix = [
      [Number(key11.value), Number(key12.value), Number(key13.value)],
      [Number(key21.value), Number(key22.value), Number(key23.value)],
      [Number(key31.value), Number(key32.value), Number(key33.value)]
    ];
    let finalKeyMatrix = buildingKeyMatrix(initialKeyMatrix);
    let [error, inputTextMatrix, inputNumericMatrix] = buildingTextMatrix(inputText.value);
    if(error) {
      outputBlock.style.display = 'none';
      inputText.value = '';
      key11.value = '';
      key12.value = '';
      key13.value = '';
      key21.value = '';
      key22.value = '';
      key23.value = '';
      key31.value = '';
      key32.value = '';
      key33.value = '';
      programVisualizeBlock.style.display = 'none';
      programOutputBlock.style.display = 'none';
      inputBlock.style.borderBottom = 'none';
      alert(inputTextMatrix);
    } else {
      const [cipherNumericMatrix, cipherNumericMatrixModValidCharactersLength, cipherTextMatrix, cipherText] = encrypt(inputNumericMatrix, finalKeyMatrix);
      visualizeText = visualizeTextCreationEncryption(inputText.value, inputTextMatrix, inputNumericMatrix, initialKeyMatrix, finalKeyMatrix, cipherNumericMatrix, cipherNumericMatrixModValidCharactersLength, cipherTextMatrix, cipherText);
      outputBlock.style.display = 'block';
      programVisualizeBlock.style.padding="0px" ;
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
  key11.value = '';
  key12.value = '';
  key13.value = '';
  key21.value = '';
  key22.value = '';
  key23.value = '';
  key31.value = '';
  key32.value = '';
  key33.value = '';
  programVisualizeBlock.style.display = 'none';
  programOutputBlock.style.display = 'none';
  inputBlock.style.borderBottom = 'none';
  overlay.style.display = 'none';
}

close.addEventListener('click', function () {
  closeWindow(hillWindow);
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
  hillWindow.style.display = 'block';
  overlay.style.display = 'block';
  overlay.style.height = `${document.documentElement.getBoundingClientRect().height}px`;
  overlay.style.width = `${document.documentElement.getBoundingClientRect().width}px`;
}

scrollTo.addEventListener('click', function(e) {
  implementation.scrollIntoView({
    behavior: 'smooth'
  });
});

