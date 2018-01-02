import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    Image,
    ScrollView,
} from 'react-native';
import {ImagePicker, FileSystem} from 'expo';
import uuid from 'uuid'


export default class PhotoViewerPage extends React.Component {
    state = {
        photos: [],
    };

    componentDidMount() {
        this._loadImages();
        FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'photosArchived').catch(e => {
            console.log(e, 'Directory exists');
        });
    }

    _loadImages(){
        FileSystem.readDirectoryAsync(FileSystem.documentDirectory + 'photos').then(photos => {
            console.log('photos fetched', photos)
            this.setState({
                photos,
            });
        });
    }

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false,
            // aspect: [4, 3],
        });

        console.log(result);

        let from = result.uri;
        let imageId = uuid.v4();
        let parts = from ? from.split('/') : [];
        if ( !parts.length > 0){
            return
        }
        let filename = parts[parts.length - 1];

        let to = `${FileSystem.documentDirectory}photos/${imageId}-${filename}`;
        FileSystem.copyAsync({
            from, to,
        }).then(result => {
            console.log('successfully copied image');
            this._loadImages()
        })

    };

    _archivePicture = ({uri, index}) => {
        console.log('attempting to delete image', uri);
        let from = `${FileSystem.documentDirectory}photos/${uri}`;
        let to = `${FileSystem.documentDirectory}photosArchived/${uri}`;
        FileSystem.moveAsync({
            from, to,
        }).then(result => {
            console.log('successfully archived image');
            this._loadImages()
        })
    };

    render() {
        let {photos} = this.state;

        return (
            <View style={styles.container}>
                <Text>Shake your phone to open the developer menu.</Text>
                <View style={styles.imageScrollContainer}>
                    <ScrollView
                        style={styles.imagesContainer}
                        horizontal={true}
                        centerContent={false}
                    >
                        {photos.map((photoUri, i) => <View key={`photos_${i}`}><Image
                            key={photoUri}
                            style={styles.image}
                            source={{
                                uri: `${FileSystem.documentDirectory}photos/${photoUri}`,
                            }}
                        />
                            <Button key={`removeImage_${i}`} title="Delete" onPress={() => this._archivePicture({uri: photoUri, index: i})}/>
                        </View>)}

                    </ScrollView>
                </View>

                <Button
                    title="Pick an image from camera roll"
                    onPress={this._pickImage}
                />
                <Button title='Refresh Images' onPress={this._loadImages.bind(this)}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cameraContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    imageScrollContainer: {
        height: 240,
    },
    imagesContainer: {
        // flex: 1,
        // width: 200,
        // flexDirection: 'row',
        // alignItems: 'flex-start',
        // justifyContent: 'center',
        // height: 200,
        // width: 300,
        padding: 10,
    },
    image: {
        width: 200,
        height: 200,
        marginRight: 10,
    }
});
