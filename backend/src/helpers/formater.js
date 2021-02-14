// Modules
const date = require('date-and-time');

const toDate = (dateString) => {
    try {
        const dateObj = new Date(dateString);

        return date.format(dateObj, 'YYYY-MM-DD');
    } catch (error) {
        throw error;
    }
}


module.exports = {
    toDate
}