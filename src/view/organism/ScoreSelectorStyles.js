import {StyleSheet} from 'react-native'

const labelFontSize = 16

const styles = StyleSheet.create({
    scoreButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    labelContainer: {
        marginBottom: 10,
    },
    label: {
        fontWeight: 'bold',
        fontSize: labelFontSize,
    },
    labelValue: {
        fontSize: labelFontSize,
    },
    container: {
        marginBottom: 25,
    },
})

export default styles