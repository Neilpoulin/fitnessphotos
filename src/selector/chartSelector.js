import Immutable from 'immutable'
import {formatShortDate, getTimeStampFromDayKey, getDayKey} from 'util/TimeUtil'
import {getAllDaysList} from 'selector/daySelector'

const CHART_X_DEFAULT = 'x'
const CHART_Y_DEFAULT = 'y'

const defaultOpts = Immutable.fromJS({
    xValue: CHART_X_DEFAULT,
    yValue: CHART_Y_DEFAULT,
})


const defaultChartOptions = Immutable.fromJS({
    width: 250,
    height: 250,
    color: '#2980B9',
    margin: {
        top: 10,
        left: 35,
        bottom: 30,
        right: 10,
    },
    animate: {
        type: 'delayed',
        duration: 200,
    },
    axisX: {
        showAxis: true,
        showLines: true,
        showLabels: true,
        showTicks: true,
        zeroAxis: false,
        orient: 'bottom',
        tickValues: [],
        label: {
            fontFamily: 'Arial',
            fontSize: 8,
            fontWeight: true,
            fill: '#34495E',
        },
    },
    labelFunction: ((v) => {
        let key = getDayKey(v)
        console.log('getting label for ', key)
        return key
    }),
    axisY: {
        showAxis: true,
        showLines: true,
        showLabels: true,
        showTicks: true,
        zeroAxis: false,
        orient: 'left',
        tickValues: [],
        label: {
            fontFamily: 'Arial',
            fontSize: 8,
            fontWeight: true,
            fill: '#34495E',
        },
    },
    interaction: true,
    cursorLine: {
        stroke: 'white',
        strokeWidth: 2,
    },
})

export function getStepData(state, opts = defaultOpts) {
    opts = defaultOpts.merge(opts).toJS()
    const days = getAllDaysList(state, false)
    let stepSeries = days
        .filter(day => day.get('steps') != null)
        .sort(day => day.get('dayKey'))
        .reduce((series, day, i, array) => {
            return series.push({
                [opts.yValue]: day.get('steps'),
                [opts.xValue]: getTimeStampFromDayKey(day.get('dayKey')),
            })
        }, Immutable.List()).toJS()
    return {
        series: [stepSeries],
        options: getChartOptions({}),
    }
}

export function getWeightData(state, opts = defaultOpts) {
    opts = defaultOpts.merge(opts).toJS()
    const days = getAllDaysList(state, false)
    let weightSeries = days
        .filter(day => day.get('weight') != null)
        .sort(day => day.get('dayKey'))
        .reduce((series, day, i, array) => {
            return series.push({
                [opts.yValue]: day.get('weight'),
                [opts.xValue]: getTimeStampFromDayKey(day.get('dayKey')),
            })
        }, Immutable.List()).toJS()
    return {
        series: [weightSeries],
        options: getChartOptions({'color': '#B93226'}),
    }
}

function getChartOptions(overrides, labelFunction = formatShortDate) {
    let opts = defaultChartOptions.merge(overrides).toJS()
    opts.axisX.labelFunction = ((v) => {
        return labelFunction(v)
    })
    return opts
}