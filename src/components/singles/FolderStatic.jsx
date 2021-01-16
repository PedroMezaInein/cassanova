import React, { Component } from 'react'

class FolderFijo extends Component {
    state = {
        hover: false,
    }
    render() {
        const { text, onClick, element } = this.props
        const { hover } = this.state
        return (
            <>
                <div class="card card-box-shadow card-hover-shadow card-custom  wave wave-animate-slower shadow-none border border-light"   onClick={(e) => { e.preventDefault(); onClick(element) }}
                    onMouseEnter={() => this.setState({ ...this.state, hover: true })}
                    onMouseLeave={() => this.setState({ ...this.state, hover: false })}
                >
                    <div class="card-body">
                        <div class="mr-6 text-center">
                            {
                                hover ?
                                    <i className="fas fa-folder-open text-primary hover-primary text-hover-primary icon-4x text-hover mr-2"></i>
                                    :
                                    <i className="fas fa-folder text-primary hover-primary text-hover-primary icon-4x text-hover mr-2"></i>
                            }
                        </div>
                        <div class="d-flex flex-column">
                            <div class="text-dark font-weight-bold font-size-h4 text-center mt-3">{text}</div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default FolderFijo