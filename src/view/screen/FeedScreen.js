import React from 'react'
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
} from 'react-native'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import styles from './FeedScreenStyles'
import {loadAll} from 'ducks/days'
import DayCardView from '/view/organism/DayCardView'
import {getAllDaysList} from 'selector/daySelector'
import {SafeAreaView} from 'react-navigation'
import {textLightColor} from 'style/GlobalStyles'
import {Button} from 'react-native-elements'
import {DAY_INPUT_SCREEN} from 'view/nav/Routes'

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
        return <SafeAreaView style={styles.container}>
            <View display-if={isLoading} style={styles.verticalCenterContainer}>
                <ActivityIndicator size={'small'} color={textLightColor}/>
                <Text style={[styles.centerAlignText, {color: textLightColor, fontSize: 15}]}>Loading Feed</Text>
            </View>

            <FlatList display-if={days && days.length > 0 && !isLoading}
                style={{padding: 10}}
                data={days || []}
                renderItem={({item}) => <DayCardView navigation={navigation} day={item}/>}
                keyExtractor={(item, index) => `${index}`}
            />
            <View display-if={!isLoading && (!days || days.length === 0)} style={[styles.verticalCenterContainer, styles.emptyStateContainer]}>
                <Text style={[styles.centerAlignText]}>You have no activity yet</Text>
                <Button onPress={() => navigation.navigate(DAY_INPUT_SCREEN)} title={'Add Activity'}/>
            </View>
        </SafeAreaView>
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