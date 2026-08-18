//validations
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidName(name) {
    return typeof name === 'string' && name.trim().length >= 3;
}

function isUniqueNumericId(id, users) {
    return typeof id === 'number' && !users.some(user => user.id === id);
}

function validateUser(user, users) {
    const {name, email, id} = user;
    if(!isValidName(name)) {
        return { valid: false, error: 'Invalid name, must be at least 3 characters long' };
    }
    if(!isValidEmail(email)) {
        return { valid: false, error: 'Invalid email' };
    }
    if(!isUniqueNumericId(id, users)) {
        return { valid: false, error: 'ID is not unique or not a number' };
    }
    return { valid: true };
}

module.exports = {
    isValidEmail,
    isValidName,
    isUniqueNumericId,
    validateUser
};