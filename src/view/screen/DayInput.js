import React from 'react'
import PropTypes from 'prop-types'
import {
    View,
    Text,
    Button
} from 'react-native'
import {connect} from 'react-redux'
import {formatLongDate} from 'util/TimeUtil'
import {goToNextDate, goToPreviousDate} from 'ducks/dayInput'
import styles from './DayInputStyle'
import Ionicon from 'react-native-vector-icons/Ionicons';

class DayInput extends React.Component {
    static propTypes = {
        dateFormatted: PropTypes.string,
        foodSelections: PropTypes.arrayOf(PropTypes.any),
        mindSelections: PropTypes.arrayOf(PropTypes.any),
        bodySelections: PropTypes.arrayOf(PropTypes.any),
        nextDay: PropTypes.func.isRequired,
        previousDay: PropTypes.func.isRequired,
    }

    render() {
        const {
            dateFormatted,
            nextDay,
            previousDay,
        } = this.props
        return <View style={styles.container}>
            <View style={styles.topNavContainer}>
                <View style={styles.topNav}>
                    <Ionicon
                        name={'ios-arrow-back'}
                        size={42}
                        style={styles.topNavButton}
                        onPress={previousDay}
                    />
                    <Text style={styles.dayTitle}>{dateFormatted}</Text>
                    <Ionicon
                        name={'ios-arrow-forward'}
                        size={42}
                        style={styles.topNavButton}
                        onPress={nextDay}
                    />
                </View>
            </View>
            <View>
                <Text>This is a view</Text>
                <Button title={'Click me'} onPress={nextDay}/>
            </View>

        </View>
    }

}

const mapStateToProps = (state, ownProps) => {
    let page = state.dayInput;
    return {
        dateFormatted: formatLongDate(page.get('date'))
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        nextDay: () => {
            dispatch(goToNextDate())
        },
        previousDay: () => {
            dispatch(goToPreviousDate())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DayInput)