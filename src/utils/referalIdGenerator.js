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

module.exports = {
  generateRefId,
};
