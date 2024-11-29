
export const isDifferentDay = (currentDate: Date, previousDate:Date):  boolean => {
    const day1 = currentDate.getUTCDate();
    const month1 = currentDate.getUTCMonth();
    const year1 = currentDate.getUTCFullYear();

    const day2 = previousDate.getUTCDate();
    const month2 = previousDate.getUTCMonth();
    const year2 = previousDate.getUTCFullYear();
    const isDifferentDay = day1 !== day2 || month1 !== month2 || year1 !== year2;
    return isDifferentDay;
}
