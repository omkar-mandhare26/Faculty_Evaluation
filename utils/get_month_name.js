function getMonthName(monthNumber) {
    const months = ["Null", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    if (monthNumber >= 1 && monthNumber <= 12) {
        return { month: months[monthNumber], error: false };
    } else {
        return { month: null, error: true };
    }
}

export default getMonthName;
