import {StyleSheet} from 'react-native'
import {greenColor, redColor, yellowColor} from 'style/GlobalStyles'

const styles = StyleSheet.create({
    container: {
        borderRadius: 50,
        borderColor: 'gray',
        borderWidth: 2,
        padding: 18,
    },
    label: {color: 'gray'},
    selected: {
        fontWeight: 'bold',
        color: 'black',
        borderColor: 'black',
    },
    selected1: {
        backgroundColor: redColor,
    },
    selected2: {
        backgroundColor: yellowColor,
    },
    selected3: {
        backgroundColor: greenColor,
    },
})

export default styles