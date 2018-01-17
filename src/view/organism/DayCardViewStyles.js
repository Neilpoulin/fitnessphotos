import {StyleSheet} from 'react-native';

const imageHeight = 100
const imageWidth = 100
const cardHeight = 60
const cardMargin = 10
const cardPadding = 10
const circleDiameter = 50

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'column',
        marginTop: cardMargin,
        marginBottom: cardMargin,
        // alignItems: 'flex-start',
        // justifyContent: 'center',
    },
    marginBottom: {
        marginBottom: cardMargin
    },
    padded: {
        padding: cardPadding,

    },
    columns: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rows: {
        flex: 1,
        flexDirection: 'column',
    },
    title: {
        fontWeight: 'bold',
    },
    scoresContainer: {
        justifyContent: 'flex-start',
        flex: 1,
        flexDirection: 'row',
    },
    scoreView: {
        marginRight: 20,
    },
    scoreCircle: {
        borderRadius: circleDiameter / 2,
        height: circleDiameter,
        width: circleDiameter,
        // flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scoreCircleText: {
        color: 'white',
    },
    score0CircleText: {
        color: 'black',
    },
    score1CircleText: {
        color: 'white',
    },
    score2CircleText: {
        color: 'black',
    },
    score3CircleText: {
        color: 'white',
    },
    scoreLabel: {
        textAlign: 'center',
    },
    score0View: {
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'gray',
    },
    score1View: {
        backgroundColor: 'red',
    },
    score2View: {
        backgroundColor: 'yellow',
    },
    score3View: {
        backgroundColor: 'green',
    },
    containerInner: {
        flex: 1,
        flexDirection: 'row',
        height: cardHeight,

        paddingTop: cardPadding,
        paddingBottom: cardPadding,
    },
    imageContainer: {
        // height: imageHeight,
        // width: imageWidth,
        flex: .5,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    image: {
        height: imageHeight,
        width: imageWidth
    }

})

export default styles