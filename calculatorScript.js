window.onload = function () {

var userExp = ""

/// MAIN CALC KEYS //////////

for (let i = 0; i <= 9; i++) {
  document.getElementById("key" + i).addEventListener("click", function(){
    displayKeyClick(i);
  })
}

var otherDisplayKeys = [["Plus", "+"], ["Minus", "-"], ["Div", "/"], ["Mult", "*"], ["Dot", "."], ["LPar", "("], ["RPar", ")"], ["Exp", "^"]]

for (let i = 0; i < otherDisplayKeys.length; i++) {
  document.getElementById("key" + otherDisplayKeys[i][0]).addEventListener("click", function(){
    displayKeyClick(otherDisplayKeys[i][1]);
  })
}

document.getElementById("keyClear").addEventListener("click", function(){
    clearDisplay();
});
document.getElementById("keyEquals").addEventListener("click", function(){
    processExp();
});


/// BASIC KEY ACTIONS ///////

function displayKeyClick(val) {
  document.getElementById("display").innerText += val;
  userExp += val;
}

function clearDisplay() {
  document.getElementById("display").innerText = "";
  userExp = ''
}

function processExp() {
  var result = parseCalcInput(userExp);
  document.getElementById("display").innerText = result;
  console.log("Calculated: ", userExp, " equals ", result); 
  userExp = result;
}

//// MAIN CALCULATING ROUTINE /////////

var ops = ['^', '*', '/', '+', '!']
// to add an operation, add it to ops in order of precedence, add to otherDisplayKeys, and add a clause to performOp
// '!' is a substitute for '-' to disambiguate negatives vs minus

function parseCalcInput(str) {
  if (isNum(str)) {return str}
  str = deminusify(str);
  while (str.includes('(')) {
    str = calcParens(str)
  }
  while (hasAnOp(str)) {
    str = calcNoPs(str);
  }
  return str 
}

function calcNoPs(str) {
  for (let i = 0; i < ops.length; i++) {
    while (str.includes(ops[i])) {
      str = performOp(str,ops[i])
    }
  }
  return str 
}


function isNum(str) {
  return !Number.isNaN(Number(str)) ? true : false
}

function hasAnOp(str) {
  if (ops.some(function (o) {return str.includes(o)})) {
    return true
  }
  return false
}


function calcParens(str) {
  let firstRPIndex = str.indexOf(')');
  if (firstRPIndex >= 0) {
    let firstLPIndex = str.lastIndexOf('(',firstRPIndex);
    let innerPForm = str.slice(firstLPIndex+1,firstRPIndex);
    let parsedInnerPForm = calcNoPs(innerPForm);
    str = str.slice(0,firstLPIndex) + parsedInnerPForm + str.slice(firstRPIndex+1)
  }
  return str 
}

function performOp(str, opStr) {
  let toInsert = '';
  let firstOpIndex = str.indexOf(opStr);
  if (firstOpIndex < 0) {return str}
  let leftStart = startIndexOfNumberLeftOf(str,firstOpIndex);
  let rightEnd = endIndexOfNumberRightOf(str,firstOpIndex);
  let leftNum = Number(str.slice(leftStart,firstOpIndex));
  let rightNum = Number(str.slice(firstOpIndex+1,rightEnd+1));
  if (opStr === '^') {
    toInsert = (Math.pow(leftNum,rightNum)).toString();
  } else if (opStr === '*') {
    toInsert = (leftNum * rightNum).toString();
  } else if (opStr === '/') {
    toInsert = (leftNum / rightNum).toString();
  } else if (opStr === '+') {
    toInsert = (leftNum + rightNum).toString();
  } else if (opStr === '!') {
    toInsert = (leftNum - rightNum).toString();
  } else {
    return str 
  }
  str = str.slice(0,leftStart) + toInsert + str.slice(rightEnd+1, str.length)
  return str 
}

function isNegSign(str, idx) {
  if (str[idx] !== '-') {
    return false
  } else if (idx === 0 || ops.includes(str[idx-1])) {
    return true 
  } else {
    return false
  }  
}

function deminusify(str) {
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '-' && !isNegSign(str, i)) {
      str = str.slice(0,i) + '!' + str.slice(i+1)
    }
  }
  return str 
}

function startIndexOfNumberLeftOf(str, idx) {
  for (let i = idx-1; i >= 0; i--) {
    if (i === 0) {return 0}
    if (ops.includes(str[i])) {
      return i+1 
    }
  }
}

function endIndexOfNumberRightOf(str, idx) {
  for (let i = idx+1; i < str.length; i++) {
    if (i === str.length-1) {return str.length-1}
    if (ops.includes(str[i])) {return i-1}
  }
}

//// MEMORY /////////

var memoryBank = 2;

for (let i = 1; i <= memoryBank; i++) {
  document.getElementById("storeButton" + i).addEventListener("click", function(){
    storeMemory(i);
  })
  document.getElementById("retrieveButton" + i).addEventListener("click", function(){
    retrieveMemory(i);
  })
}

function storeMemory(slotNum) {
  document.getElementById("memorySlot" + slotNum.toString()).innerText = userExp;
}

function retrieveMemory(slotNum) {
  let str = document.getElementById("memorySlot" + slotNum.toString()).innerText;
  document.getElementById("display").innerText += str;
  userExp += str;
}

document.getElementById("addMemorySlot").addEventListener("click", function(){
    addMemorySlot();
  })

function addMemorySlot() {
  memoryBank += 1;
  let num = memoryBank;
  let newSlot = document.createElement("p");
  newSlot.id = "memorySlot" + num.toString();
  newSlot.innerHTML = "Memory " + num.toString(); 
  let newStoreButton = document.createElement("input");
  newStoreButton.type = "button";
  newStoreButton.id = "storeButton" + num.toString();
  newStoreButton.value = "Store";
  newStoreButton.className = "newButton";
  newStoreButton.addEventListener("click", function(){storeMemory(num)})
  let newRetrieveButton = document.createElement("input");
  newRetrieveButton.type = "button";
  newRetrieveButton.id = "retrieveButton" + num.toString();
  newRetrieveButton.value = "Retrieve";
  newRetrieveButton.className = "newButton";
  newRetrieveButton.addEventListener("click", function(){retrieveMemory(num)})
  
  let aMD = document.getElementById('addMemoryDiv');
  aMD.parentNode.insertBefore(newSlot, aMD);
  aMD.parentNode.insertBefore(newStoreButton, aMD);
  aMD.parentNode.insertBefore(newRetrieveButton, aMD);
}

}
