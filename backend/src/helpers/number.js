const number = {};

number.randomNumber = (min, max) => {
    min ? min : 1;
    max ? max : 10;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = number;