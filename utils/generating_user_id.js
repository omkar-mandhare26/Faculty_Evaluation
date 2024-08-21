import { v4 as uuidv4 } from 'uuid';

function generateUserId() {
    const length = 5;
    const hexString = uuidv4().replace(/-/g, '');
    let userId = hexString.slice(0, length);
    if (!/[a-zA-Z]/.test(userId[0])) {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        userId = letters.charAt(Math.floor(Math.random() * letters.length)) + userId.slice(1);
    }

    return userId.toUpperCase();
}

export default generateUserId;