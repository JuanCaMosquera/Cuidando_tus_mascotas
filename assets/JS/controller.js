let appointments = [];
let isEditing = false;

const fields = ["userName", "userLastName", "userEmail", "userPhone", "userID", "userDate", "userHour", "userService"];
appointments = JSON.parse(Cookies?.get("appointments") || "[]") || [];

window.onload = () => {
    const queryString = window.location.search;
    const urlString = new URLSearchParams(queryString);
    let serviceId = urlString.get("id");
    let targetDiv = document.getElementById("form");
    if (serviceId) {
        let indexOfAppointment = appointments.findIndex(el => el.userID == serviceId);
        if (indexOfAppointment !== -1) {
            let editingText = document.createElement("h4");
            editingText.textContent = `Editando documento #${appointments[indexOfAppointment]["userID"]}`;
            targetDiv.appendChild(editingText);
            isEditing = true;
            Object.keys(appointments[indexOfAppointment]).map(key => {
                document.getElementById(key).value = appointments[indexOfAppointment][key];
            })
        }
    }
}

const editData = (field, appointment) => {
    let fieldValue = document.getElementById(field)?.value || "";
    if (fieldValue.length == 0) return null;
    appointment[field] = fieldValue;
    document.getElementById(field).value = "";
    return appointment;
}

const submitCallbackFn = (e) => {
    let appointment = {};
    let error = false;
    fields.forEach(field => {
        appointment = editData(field, appointment);
        if (!appointment) {
            error = true;
            return false;
        };
    });
    if (error) {
        Swal.fire(
            'Campos vacíos',
            'No puedes guardar citas con contenido vacío.',
            'error'
        )
    } else {
        if (isEditing) {
            Swal.fire(
                `¡Cita con documento ${appointment["userID"]} editada!`,
                'Hemos actualizado tu cita satisfactoriamente.',
                'success'
            )
            let indexOfAppointment = appointments.findIndex(el => el.userID == serviceId);
            appointments[indexOfAppointment] = appointment;
        } else {
            Swal.fire(
                '¡Cita agendada!',
                'Hemos agendado tu cita satisfactoriamente.',
                'success'
            )
            appointments.push(appointment);
        }
        Cookies.set('appointments', JSON.stringify(appointments), { expires: 365 });
    }
}

const handleSubmit = (e) => {
    switch (e.target.id) {
        case "editButton":
        case "deleteButton":
            let serviceId = e.target.name;
            if (e.target.id == "editButton") {
                window.location = `index.html?id=${serviceId}#form`;
            } else {
                Swal.fire({
                    title: '¿Seguro que deseas eliminar esta cita?',
                    text: "Será eliminada de manera permanente.",
                    type: 'warning',
                    showCancelButton: true,
                    cancelButtonText: 'Cancelar',
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí, eliminala'
                    }).then(() => {
                        Swal.fire(
                        'Cita eliminada',
                        'Cita eliminada satisfactoriamente.',
                        'success'
                        );
                    }
                )
                let indexOfAppointment = appointments.findIndex(el => el.userID == serviceId);
                appointments.splice(indexOfAppointment, 1);
            }
            break;

        default:
            break;
    }
}

window.addEventListener("click", handleSubmit);

// DRAW LIST OF APPOINBTMENTS

let appointmentsContainer = document.getElementById("appointments-container");

const getHourLabel = (value) => {
    let label = "7:15 am";
    switch (parseInt(value)) {
        case 2:
            label = "8:15 am";
            break;
        case 3:
            label = "9:15 am";
            break;
        case 4:
            label = "10:15 am";
            break;
        case 5:
            label = "11:15 am";
            break;
        case 6:
            label = "12:15 am";
            break;
        case 7:
            label = "13:15 am";
            break;
            
        default:
            label = "14:15 am";
            break;
    }
    return label;
}

const getServiceLabel = (value) => {
    let label = "Limpieza total";
    switch (parseInt(value)) {
        case 2:
            label = "Corte estiludo";
            break;
        case 3:
            label = "Corte de puntica";
            break;
            
        default:
            break;
    }
    return label;
}

const getAppointments = () => {
    let cookieExists = Cookies.get("appointments");
    if (cookieExists) {
        appointments = JSON.parse(cookieExists);
    }
    appointments.map((appointment, i) => {
        let appointmentDiv = document.createElement("div");
        appointmentDiv.setAttribute("id", appointment?.userID);
        let names = document.createElement("h1");
        let email = document.createElement("h3");
        let phone = document.createElement("p");
        let details = document.createElement("p");
        let buttonsDiv = document.createElement("div");
        let editButton = document.createElement("button");
        let deleteButton = document.createElement("button");
        editButton.innerHTML = "Editar";
        deleteButton.innerHTML = "Eliminar";
        editButton.setAttribute("id", "editButton")
        deleteButton.setAttribute("id", "deleteButton")
        editButton.setAttribute("name", `${appointment?.userID}`);
        deleteButton.setAttribute("name", `${appointment?.userID}`);
        buttonsDiv.appendChild(editButton);
        buttonsDiv.appendChild(deleteButton);
        names.textContent = `${appointment?.userName} ${appointment?.userLastName}`;
        email.textContent = `${appointment?.userEmail}`;
        phone.textContent = `${appointment?.userPhone}`;
        details.textContent = `${appointment?.userDate} | ${getHourLabel(appointment?.userHour)} | ${getServiceLabel(appointment?.userService)}`
        appointmentDiv.appendChild(names);
        appointmentDiv.appendChild(email);
        appointmentDiv.appendChild(phone);
        appointmentDiv.appendChild(details);
        appointmentDiv.appendChild(buttonsDiv);
        return appointmentsContainer?.appendChild(appointmentDiv);
    })
}

getAppointments();
