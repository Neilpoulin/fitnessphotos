import PropTypes from 'prop-types'

export const navigationProp = PropTypes.shape({
    goBack: PropTypes.func,
    state: PropTypes.shape({
        params: PropTypes.shape({}),
    }),
})