import moment from 'moment'

export function formatShortDate(date) {
    return moment(date).format('M/D/YY')
}

export function formatLongDate(date, showYear = false) {
    if (showYear) {
        return moment(date).format('dddd, MMMM D, YYYY')
    }
    return moment(date).format('dddd, MMMM D')

}

export function formatDayOfWeekShort(date, showYear = false) {
    if (showYear) {
        return moment(date).format('dd, M D, YYYY')
    }
    return moment(date).format('ddd, MMM D')

}

export function getDayKey(date) {
    return moment(date).format('YYYY-MM-DD')
}

export function getTimeStampFromDayKey(dayKey) {
    return moment(dayKey).toDate().getTime()
}

export function isBeforeNow(time, plus, period) {
    let toCheck = moment(time)
    let now = new Date()
    if (plus && period) {
        toCheck = toCheck.add(plus, period)
    }

    return toCheck.isBefore(now)
}

export function addDuration({start = (new Date()), amount = 0, period = 'ms'}) {

    return moment(start).add(amount, period).toDate()
}