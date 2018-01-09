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

export function getDateKey(date) {
    return moment(date).format('YYYY-MM-DD')
}