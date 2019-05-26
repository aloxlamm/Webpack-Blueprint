// PHOENIX OS
// DATE AND TIME
//---------------------------------------------------------------------------------------------------------

export function getActualYear(){
    return new Date().getFullYear();
}

export function getActualWeekDay(){
    return new Date().getDay();
}

export function getActualWeekNumber() {
    let now = new Date();
    let onejan = new Date(now.getFullYear(), 0, 1);
    let week = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    return week;
}

export function getDateFromWeekNumber (year, week, day) {
    const firstDayOfYear = new Date(year, 0, 1);
    const days = 2 + day + (week - 1) * 7 - firstDayOfYear.getDay();
    return new Date(year, 0, days);
}