import React, {Component} from 'react'
import {View, Image} from 'react-native'
import PropTypes from 'prop-types'

export default class FullWidthImage extends Component {
    static propTypes = {
        ratio: PropTypes.number,
        source: PropTypes.shape({
            uri: PropTypes.string.isRequired,
        }).isRequired,
        dimensions: PropTypes.shape({
            height: PropTypes.number,
            width: PropTypes.number,
        }),
    }

    static defaultProps = {
        dimensions: {
            height: 0,
            width: 0,
        },
    }

    constructor(props) {
        super(props)
        this.containerWidth = null

        this.state = {
            height: 0,
            width: 0,
        }
    }

    componentWillReceiveProps(newProps) {
        if (this.containerWidth && newProps && newProps.dimensions && newProps.dimensions.width) {
            this.setState({
                width: this.containerWidth,
                height: this.containerWidth * newProps.dimensions.height / newProps.dimensions.width,
            })
        }
    }

    _onLayout(event) {
        const containerWidth = event.nativeEvent.layout.width
        this.containerWidth = containerWidth
        if (!this.props.source) {
            console.debug('no source provided')
            return
        }

        console.log('container width from FullWidthImage', containerWidth)
        if (this.props.ratio) {
            this.setState({
                width: containerWidth,
                height: containerWidth * this.props.ratio,
            })
        } else if (this.props.dimensions && this.props.dimensions.width && this.props.dimensions.height) {
            this.setState({
                width: containerWidth,
                height: containerWidth * this.props.dimensions.height / this.props.dimensions.width,
            })
        }
        else {
            Image.getSize(this.props.source, (width, height) => {
                this.setState({
                    width: containerWidth,
                    height: containerWidth * height / width,
                })
            }, (error) => console.debug('failed to get size for image', error))
        }
    }

    render() {
        return (
            <View onLayout={(event) => this._onLayout(event)}>
                <Image
                    {...this.props}
                    source={this.props.source}
                    style={{
                        width: this.state.width,
                        height: this.state.height,
                    }}

                />
            </View>
        )
    }
}