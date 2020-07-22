import React, { Component } from 'react'

export default class Small extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { color, children, className } = this.props
        return (
            <small className={`text-color__${color} mb-0 ${className}`}>
                {children}
            </small>
        )
    }
}