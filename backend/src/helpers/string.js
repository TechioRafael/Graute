const string = {};

string.randomString = (length) => {
    const aphabet = "abcdefghijklmnopqrstuzwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let string = "";
    for (let i = 0; i < length; i++) {
        string = string + aphabet[Math.floor(Math.random() * aphabet.length)]
    }
    return string;
}

module.exports = string;