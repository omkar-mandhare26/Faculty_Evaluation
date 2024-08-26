import { v4 as uuidv4 } from "uuid";

function generateUserId() {
    const length = 5;
    const allowedChars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789";

    function getRandomChar() {
        return allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
    }

    let userId = "";
    while (userId.length < length) {
        userId += getRandomChar();
    }

    return userId.toUpperCase();
}

export default generateUserId;
