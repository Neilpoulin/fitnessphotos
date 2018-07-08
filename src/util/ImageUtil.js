import {FileSystem, ImageManipulator} from 'expo'
import {Dimensions} from 'react-native'
import uuid from 'uuid'

export async function resizeImage(imageUri) {

    var {height: windowHeight, width: windowWidth} = Dimensions.get('window')
    let actions = [{resize: {width: windowWidth}}]
    let saveOpts = {compress: 1}

    const result = await ImageManipulator.manipulate(imageUri, actions, saveOpts)

    // const { uri, width, height } = result
    return result
}

/**
 * this will copy to a local app directory and resize the input image
 * @param uri
 * @param height
 * @param width
 * @returns {Promise<*>}
 */
export async function processRawImage({uri, height, width}) {
    console.log('processing "raw image"', uri, height, width)
    // let imageId = uuid.v4()
    let parts = uri ? uri.split('/') : []
    let filename = null
    if (!parts.length > 0) {
        return
    } else {
        filename = parts[parts.length - 1]
    }

    let imageId = uuid()

    let resizeResult = await resizeImage(uri)
    console.log('resized image successfully. Result = ', resizeResult)
    let toUri = `${FileSystem.documentDirectory}photos/${imageId}-${filename}`


    return FileSystem.copyAsync({
        from: resizeResult.uri, to: toUri,
    }).then((copiedImage) => {
        console.log('successfully copied image from', uri, 'to', toUri, copiedImage)
        // this._loadImages()
        return {
            uri: toUri,
            height: resizeResult.height,
            width: resizeResult.width,
            filename,
            localUri: toUri,
        }
    })
}