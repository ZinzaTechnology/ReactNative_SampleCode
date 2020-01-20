import React, { PureComponent } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';
class ImageButton extends PureComponent {

    render() {
        const {onPress, style, imageStyle, ...props} = this.props;

        return (
            <TouchableOpacity onPress={onPress} style={style}>
                <Image {...props} style={imageStyle} />
            </TouchableOpacity>
        );
    }

}

module.exports = ImageButton;
