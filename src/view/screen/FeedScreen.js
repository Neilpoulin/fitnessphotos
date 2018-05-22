import React from 'react'
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    RefreshControl,
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
import LoadingIndicator from 'view/organism/LoadingIndicator'

class FeedScreen extends React.Component {
    static propTypes = {
        days: PropTypes.arrayOf(PropTypes.shape({})),
        isLoading: PropTypes.bool,
        navigation: PropTypes.object,
        //actions
        load: PropTypes.func,
    }

    state = {
        refreshing: false,
    }

    _onRefresh() {
        this.setState({refreshing: true})
        this.props.load().then(() => {
            this.setState({refreshing: false})
        })
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

            <LoadingIndicator size={'small'} text={'Loading Feed'} display-if={(!days || !days.length) && isLoading && !this.state.refreshing}/>

            <FlatList display-if={days && days.length}
                style={{padding: 10}}
                data={days || []}
                renderItem={({item}) => <DayCardView navigation={navigation} day={item}/>}
                keyExtractor={(item, index) => `${index}`}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh.bind(this)}
                    />
                }
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
            return await dispatch(await loadAll())
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedScreen)