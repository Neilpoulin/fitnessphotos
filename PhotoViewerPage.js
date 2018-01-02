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
        selectedPhotos: [],
    };

    constructor(props) {
        super(props);
        // this._loadImages = this._loadImages.bind(this);
        // this._archivePicture = this._archivePicture.bind(this);
        // this._pickImage = this._pickImage.bind(this);
        this._selectPhoto = this._selectPhoto.bind(this);
        this._unselectPhoto = this._unselectPhoto.bind(this);
    }

    componentDidMount() {
        this._loadImages();
        FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'photosArchived').catch(e => {
            console.log(e, 'Directory exists');
        });
    }

    _loadImages() {
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
        if (!parts.length > 0) {
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

    _selectPhoto = ({uri, index}) => {
        try {
            let selected = this.state.selectedPhotos || [];
            console.log('state selected photos is', this.state.selectedPhotos);
            if (selected.length >= 2) {
                console.log('too may selected');
                return null
            } else if (selected.indexOf(uri) !== -1) {
                console.log('image already selected')
            }
            console.log('selecting the image', uri);
            selected = [uri, ...selected];
            console.log('selected a photo and now selected is', selected);
            this.setState({
                selectedPhotos: selected,
            })
        } catch (e) {
            console.error(e)
        }

    };

    _unselectPhoto = ({uri}) => {
        let selected = this.state.selectedPhotos || [];
        selected = [...selected];
        let filtered = selected.filter(s => s !== uri);
        this.setState({
            selectedPhotos: filtered,
        })
    };

    render() {
        let {photos, selectedPhotos} = this.state;

        return (
            <ScrollView style={styles.container}>
                <View style={{
                    // flex: 1,
                    // flexDirection: 'row-reverse',
                    // justifyContent: 'flex-start',
                    // // padding: 10,
                }}>
                    <Text>Selected Photos</Text>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row-reverse',
                        justifyContent: 'flex-start',
                        // padding: 10,
                    }}>

                        {selectedPhotos.map((photoUri, i) => <View key={`selected_photos_${i}`}
                                                                   style={styles.selectedImageContainer}>
                            <Image
                                key={photoUri}
                                style={styles.selectedImage}
                                source={{
                                    uri: `${FileSystem.documentDirectory}photos/${photoUri}`,
                                }}
                            />
                            <Button key={`unselectImage_${i}`} title="Remove"
                                    onPress={() => this._unselectPhoto({uri: photoUri, index: i})}/>
                        </View>)}
                    </View>
                </View>
                <View style={styles.imageScrollContainer}>
                    <ScrollView
                        style={styles.imagesContainer}
                        horizontal={true}
                        centerContent={false}
                    >
                        {photos.map((photoUri, i) => <View key={`photos_${i}`}>
                            <Image
                                key={photoUri}
                                style={styles.image}
                                source={{
                                    uri: `${FileSystem.documentDirectory}photos/${photoUri}`,
                                }}
                            />
                            {selectedPhotos.indexOf(photoUri) === -1 && selectedPhotos.length < 2 &&
                            <Button key={`selecteImage_${i}`}
                                    title="Select"
                                    onPress={() => this._selectPhoto({uri: photoUri, index: i})}/>}
                            <Button key={`removeImage_${i}`} title="Delete"
                                    onPress={() => this._archivePicture({uri: photoUri, index: i})}/>
                        </View>)}

                    </ScrollView>
                </View>

                <Button
                    title="Pick an image from camera roll"
                    onPress={this._pickImage}
                />
                <Button title='Refresh Images' onPress={this._loadImages.bind(this)}/>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 20,
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    cameraContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    imageScrollContainer: {
        height: 280,
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
    selectedImage: {
        width: 120,
        height: 150,
    },
    selectedImageContainer: {
        width: 190,
        height: 200,
        margin: 10,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 10,
    }
});
