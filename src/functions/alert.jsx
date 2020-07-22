import swal from 'sweetalert'

export function waitAlert() {
    swal({
        title: '¡Un momento!',
        text: 'La información está siendo procesada.',
        buttons: false
    })
}

export function errorAlert(text) {
    swal({
        title: '¡Ups 😕!',
        text: text,
        icon: 'error',
    })
}

export function deleteAlert(text, action) {
    swal({
        title: text,
        buttons: {
            cancel: {
                text: "Cancelar",
                value: null,
                visible: true,
                className: "button__green btn-primary cancel",
                closeModal: true,
            },
            confirm: {
                text: "Aceptar",
                value: true,
                visible: true,
                className: "button__red btn-primary",
                closeModal: true
            }
        }
    }).then((result) => {
        if (result) {
            action()
        }
    })
}


export function createAlert(title, text, action) {
    swal({
        title: title,
        text: text,
        buttons: {
            cancel: {
                text: "Cancelar",
                value: null,
                visible: true,
                className: "button__green btn-primary cancel",
                closeModal: true,
            },
            confirm: {
                text: "Aceptar",
                value: true,
                visible: true,
                className: "button__red btn-primary",
                closeModal: true
            }
        }
    }).then((result) => {
        if (result) {
            action()
        }
    })
}

export function forbiddenAccessAlert() {
    swal({
        title: '¡Ups 😕!',
        text: 'Parece que no has iniciado sesión',
        icon: 'warning',
        confirmButtonText: 'Inicia sesión'
    });
}

export function validateAlert(success, e, name) {
    var elementsInvalid = document.getElementById(name).getElementsByClassName("is-invalid");
    if (elementsInvalid.length === 0) {
        success(e)
    } else {
        alert("Rellena todos los campos")
    }
}