// PHOENIX OS
// SORT DATA
//---------------------------------------------------------------------------------------------------------


export function sort(data, configuration) {        
    let sortkey = undefined;
    let sortorder = undefined;
    let type = 'text';
    let sorted_data = undefined;
    let multipleFields = false;

    if (configuration !== undefined) {
        if (configuration.sortkey !== undefined)
            sortkey = configuration.sortkey;
        if (configuration.sortorder !== undefined)
            sortorder = configuration.sortorder;
        if (configuration.type !== undefined)
            type = configuration.type;
        if (configuration.exclude !== undefined)
            exclude = configuration.exclude;
        if (configuration.multipleFields !== undefined)
            multipleFields = configuration.multipleFields;
    }

    sorted_data = data.sort(function (a, b) {
        if (multipleFields === false) {
            if (type === 'text') {
                var xtemp = a[sortkey];
                var ytemp = b[sortkey];

                if (xtemp === undefined) {
                    var x = '1';
                } else {
                    var x = xtemp.toLowerCase();
                }

                if (ytemp === undefined) {
                    var y = '1';
                } else {
                    var y = ytemp.toLowerCase();
                }

            } else if (type === 'date') {
                var x = parseDate(a[sortkey]);
                var y = parseDate(b[sortkey]);
            } else if (type === 'time') {
                var x = parseTime(a[sortkey]);
                var y = parseTime(b[sortkey]);
            } else if (type === 'dateTime') {
                var x = parseDateTime(a[sortkey]);
                var y = parseDateTime(b[sortkey]);
            } else if (type === 'number'){
                var x = parseInt(a[sortkey]);
                var y = parseInt(b[sortkey]);
            }

            if (x < y) {
                return -1;
            }
            if (x > y) {
                return 1;
            }
            return 0;

        } else if (multipleFields === true) {
            var sortkey1 = sortkey[0];
            var sortkey2 = sortkey[1];
            var type1 = type[0];
            var type2 = type[1];

            if (type1 === 'text') {
                var x1 = a[sortkey1].toLowerCase();
                var y1 = b[sortkey1].toLowerCase();
            } else if (type1 === 'date') {
                var x1 = parseDate(a[sortkey1]);
                var y1 = parseDate(b[sortkey1]);
            } else if (type1 === 'time') {
                var x1 = parseTime(a[sortkey1]);
                var y1 = parseTime(b[sortkey1]);
            } else if (type1 === 'dateTime') {
                var x1 = parseDateTime(a[sortkey1]);
                var y1 = parseDateTime(b[sortkey1]);
            }

            if (type2 === 'text') {
                var x2 = a[sortkey2].toLowerCase();
                var y2 = b[sortkey2].toLowerCase();
            } else if (type2 === 'date') {
                var x2 = parseDate(a[sortkey2]);
                var y2 = parseDate(b[sortkey2]);
            } else if (type2 === 'time') {
                var x2 = parseTime(a[sortkey2]);
                var y2 = parseTime(b[sortkey2]);
            } else if (type2 === 'dateTime') {
                var x2 = parseDateTime(a[sortkey2]);
                var y2 = parseDateTime(b[sortkey2]);
            }

            if (x1 !== undefined && x2 !== undefined && y1 !== undefined && y2 !== undefined) {

                if (x1 < y1) {
                    return -1;
                } else if (x1 > y1) {
                    return 1;
                } else if (x2 < y2) {
                    return -1;
                } else if (x2 > y2) {
                    return 1;
                } else {
                    return 0;
                }
            } else
                return 0;
        }
    });

    if (sortorder === 'desc') {
        sorted_data.reverse();
    }
    return sorted_data;
};

function parseDate(date) {
    try {
        let datex = date.split('.');
        let newDate = datex[2] + datex[1] + datex[0];
        return parseInt(newDate);
    } catch (err) {
        console.log(err);
    }
};

function parseTime(time) {
    try {
        let timex = time.split(':');
        let newTime = time[0] + time[1];
        return parseInt(newTime);
    } catch (err) {
        console.log(err);
    }
};

function parseDateTime (dateTime) {   // format (30.11.2017 13:01:24)
    try {
        let dt = dateTime.split(' ');
        let date = dt[0].split('.');
        let time = dt[1].split(':');
        let newDateTime = date[2] + date[1] + date[0] + time[0] + time[1] + time[2];
        return parseInt(newDateTime);
    } catch (err) {
        console.log(err);
    }
};