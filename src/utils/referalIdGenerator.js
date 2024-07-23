const generateRefId = async (letter, existingId) => {
  let charCode = letter.charCodeAt(0);
  let base = charCode >= 65 && charCode <= 90 ? 65 : 97;
  let nextCharCode = base + ((charCode - base + 1) % 26);
  let LetterValue = String.fromCharCode(nextCharCode);
  let id = "A" + LetterValue;
  let numeric;
  if (existingId <= 9) {
    numeric = "000";
  } else if (existingId > 9 && existingId <= 99) {
    numeric = "00";
  } else if (existingId > 99 && existingId <= 999) {
    numeric = "0";
  }
  return { ID: id + numeric };
};

function NumberToLetters(num) {
  let result = '';
  while (num > 0) {
      num--; // Decrement num to make it zero-indexed
      let remainder = num % 26;
      result = String.fromCharCode(65 + remainder) + result;
      num = Math.floor(num / 26);
  }
  return result;
}


module.exports = {
  generateRefId,
  NumberToLetters
};

