import React from 'react'
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
} from 'react-native'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import styles from './FeedScreenStyles'
import {loadAll} from 'ducks/days'
import DayCardView from '/view/organism/DayCardView'
import {getAllDaysList} from 'selector/daySelector'

class FeedScreen extends React.Component {
    static propTypes = {
        days: PropTypes.arrayOf(PropTypes.shape({})),
        isLoading: PropTypes.bool,
        navigation: PropTypes.object,
        //actions
        load: PropTypes.func,
    }

    componentWillMount() {
        this.props.load()
    }

    render() {
        const {
            days,
            navigation,
            isLoading,
        } = this.props
        return <View style={styles.container}>
            <View display-if={isLoading} style={{flex: 1, justifyContent: 'center'}}>
                <ActivityIndicator size={'large'} color={'#0000ff'}/>
            </View>
            <ScrollView display-if={days && !isLoading}>
                {days.map((day, i) =>
                    <DayCardView navigation={navigation} key={`dayview_${i}`} day={day}/>)}
            </ScrollView>
        </View>
    }

}

const mapStateToProps = (state, ownProps) => {
    let days = getAllDaysList(state)
    const isLoading = state.days.get('isLoading')
    return {
        days,
        isLoading,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        load: async () => {
            dispatch(await loadAll())
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedScreen)