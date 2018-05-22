import {StyleSheet} from 'react-native'
import {getViewWidth} from 'style/GlobalStyles'

const imageHeight = 80
const imageWidth = 80
const cardHeight = 60
const cardMargin = 10
const cardPadding = 10
const circleDiameter = 50

const redColor = '#ef1c27'
const greenColor = '#19a45d'
const yellowColor = '#fdf103'


export function getCardWidth() {
    const windowWidth = getViewWidth()
    console.log('window width', windowWidth)
    return windowWidth - 2 * cardMargin
}

export function getScaledImageSize(imageSizes) {
    let width = getCardWidth()
    if (!imageSizes) {
        return {
            width,
            height: width,
        }
    }


    let scaling = width / imageSizes.width
    return {
        width,
        height: Math.ceil(imageSizes.height * scaling),
    }
}

const styles = StyleSheet.create({
    container: {
        marginBottom: cardMargin,
        marginLeft: cardMargin,
        marginRight: cardMargin,
        // alignItems: 'flex-start',
        // justifyContent: 'center',
    },
    marginBottom: {
        marginBottom: cardMargin,
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
        justifyContent: 'space-between',
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
        fontWeight: '900',
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
        fontSize: 10,
    },
    score0View: {
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'gray',
    },
    score1View: {
        backgroundColor: redColor,
    },
    score2View: {
        backgroundColor: yellowColor,
    },
    score3View: {
        backgroundColor: greenColor,
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

        // justifyContent: 'center',
        // flexDirection: 'column',
        // alignItems: 'center',
        position: 'relative',
        // height: 400,
        // justifyContent: 'center',
        // alignItems: 'center',
        // flex: 1,
        backgroundColor: 'red',
    },
    image: {
        // position: 'absolute',
        // top: 0,
        // left: 0,
        // bottom: 0,
        // right: 0,
    },
    imageEmpty: {
        borderWidth: 1,
        borderColor: 'gray',
        borderStyle: 'dashed',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    weightContainer: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        padding: 6,
    },
    weightText: {
        textAlign: 'center',
    },

})

export default styles