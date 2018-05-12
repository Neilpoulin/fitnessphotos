import React from 'react'
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
} from 'react-native'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {getStepData, getWeightData} from 'selector/chartSelector'
import {StockLine} from 'react-native-pathjs-charts'
import {SafeAreaView} from 'react-navigation'


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f7f7f7',
    },
})

const chartData_prop = PropTypes.shape({
    series: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({}))),
    options: PropTypes.shape({}),
})

class ChartScreen extends React.Component {
    static propTypes = {
        chartOptions: PropTypes.object,
        stepData: chartData_prop,
        weightData: chartData_prop,
    }

    constructor(props) {
        super(props)
        this.state = {}
    }

    componentWillMount() {
        this._panHandlerStart = this._panHandlerStart.bind(this)
        this._panHandlerMove = this._panHandlerStart.bind(this)
        this._panHandlerEnd = this._panHandlerEnd.bind(this)
    }

    _panHandlerStart(cursorPositionX) {
        this.setState({
            selectedDataPointPosition: String(Math.floor(cursorPositionX * (data[0].length - 1))),
        })
    }

    _panHandlerMove(cursorPositionX) {
        this.setState({
            selectedDataPointPosition: String(Math.floor(cursorPositionX * (data[0].length - 1))),
        })
    }

    _panHandlerEnd(cursorPositionX) {
        this.setState({
            selectedDataPointPosition: '',
        })
    }

    render() {
        const {
            stepData,
            weightData,
            chartOptions,
        } = this.props
        return <SafeAreaView>
            <ScrollView>
                <View style={styles.container}>
                    <Text>Step Data</Text>
                    <StockLine
                        data={stepData.series}
                        display-if={stepData && stepData.series[0].length}
                        panHandlerStart={this._panHandlerStart}
                        panHandlerMove={this._panHandlerMove}
                        panHandlerEnd={this._panHandlerEnd}
                        xKey='x'
                        yKey='y'
                        options={stepData.options}
                    />

                    <Text>Weight Data</Text>
                    <StockLine
                        data={weightData.series}
                        display-if={weightData && weightData.series[0].length}
                        panHandlerStart={this._panHandlerStart}
                        panHandlerMove={this._panHandlerMove}
                        panHandlerEnd={this._panHandlerEnd}
                        xKey='x'
                        yKey='y'
                        options={weightData.options}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    }

}

const mapStateToProps = (state, ownProps) => {
    let stepData = getStepData(state)
    let weightData = getWeightData(state)
    console.log('step data', stepData)
    console.log('weight data', weightData)
    return {
        stepData,
        weightData,
        // weightData,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ChartScreen)


