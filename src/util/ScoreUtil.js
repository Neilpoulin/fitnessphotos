export function formatScore(score) {
    let display = 'Not Set'
    if (!score) {
        return display
    }
    switch (score) {
        case 0:
            display = 'Not Set'
            break
        case 1:
            display = 'Poor'
            break
        case 2:
            display = 'Average'
            break
        case 3:
            display = 'Excellent'
            break
        default:
            display = 'Not Set'
            break
    }
    return display
}


export function getExpressiveValue(score) {
    switch (score) {
        case 1:
            return ':-('
        case 2:
            return ':-|'
        case 3:
            return ':-)'
        default:
            return '?'
    }
}
