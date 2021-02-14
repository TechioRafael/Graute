// Regex
const date = RegExp(/^[0-9]{4}[-][0-9]{2}[-][0-9]{2}$/);
const password = RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/);

// Verify-funcions
const isDate = (value) => {
    if(date.test(value)){
        return true;
    }else{
        return false;
    }
}

const isPassword = (value) => {
    if(password.test(value)){
        return true;
    }else{
        return false;
    }
}

module.exports = {
    date,
    password,

    isDate,
    isPassword
}