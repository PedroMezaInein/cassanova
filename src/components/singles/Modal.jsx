import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal'

class modal extends Component {
    

    componentDidUpdate(){
        var elementos = document.getElementsByClassName('modal');
        for(let cont = 0; cont < elementos.length; cont ++){
            elementos[cont].removeAttribute("tabindex")
        }
    }

    render() {
        const { show, handleClose, children, title, size } = this.props

        return (
            <>
                <Modal
                    show={show}
                    size={size}
                    onHide={handleClose}
                    keyboard={true}
                    centered
                >
                    <Modal.Header>
                        <h5 className="modal-title" id="exampleModalLabel">{title}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleClose}>
                            <i aria-hidden="true" className="ki ki-close"></i>
                        </button>
                    </Modal.Header>
                    <Modal.Body style={{ paddingTop: "0px" }}>
                        {children}
                    </Modal.Body>
                </Modal>
            </>
        )
    }
}

export default modal