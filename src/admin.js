document.addEventListener('DOMContentLoaded', function () {

    loadTable();
    loadGuardEditor();
});

function loadTable() {
    let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    let times = ['16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];

    const table = document.getElementById('guard-duty-table');
    table.innerHTML = '';

    let headerRow = document.createElement('tr');
    let emptyHeaderCell = document.createElement('td');
    headerRow.appendChild(emptyHeaderCell);

    days.forEach(day => {
        let headerCell = document.createElement('td');
        headerCell.textContent = day;
        headerRow.appendChild(headerCell);
    });

    table.appendChild(headerRow);

    times.forEach(time => {
        let row = document.createElement('tr');
        let timeCell = document.createElement('td');
        timeCell.textContent = time;
        row.appendChild(timeCell);

        days.forEach(day => {
            let cell = document.createElement('td');
            cell.id = day.toLowerCase() + '-' + time;
            row.appendChild(cell);
        });

        table.appendChild(row);
    });

    document.body.appendChild(table);
}




function addGuardDuty() {
    let professorName = document.getElementById('professor-name').value;
    let day = document.getElementById('guard-duty-day').value;
    let time = document.getElementById('guard-duty-time').value;
    let place = document.getElementById('guard-duty-place').value;
    let guard = {
        professorName: professorName,
        day: day,
        time: time,
        place: place
    }

    // Create a new XMLHttpRequest
    let xhr = new XMLHttpRequest();

    // Configure the request
    xhr.open('POST', `http://localhost:3000/api/guards`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    // Send the request
    xhr.send(JSON.stringify(guard));
    // Handle the response
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // The server responded successfully

            // Parse the updated guard duties from the response
            let updatedGuardDuties = JSON.parse(xhr.responseText);

            // Update the table with the new data
            updateTable(updatedGuardDuties);
            loadGuardEditor();
        } else if (xhr.readyState === 4) {
            // The server responded with an error
            console.error('Error: ' + xhr.status);
        }
    };


}
function getAllGuards() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `http://localhost:3000/api/guards`, false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
    if (xhr.readyState === 4 && xhr.status === 200) {
        let updatedGuardDuties = JSON.parse(xhr.responseText);
        updateTable(updatedGuardDuties);
        return updatedGuardDuties;
    }
    else if (xhr.readyState === 4) {
        console.error('Error: ' + xhr.status);
    }
}
function deleteGuardDutie(guard) {
    let xhr = new XMLHttpRequest();
    xhr.open('DELETE', `http://localhost:3000/api/guards/${guard.id}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let updatedGuardDuties = JSON.parse(xhr.responseText);
            updateTable(updatedGuardDuties);
            loadGuardEditor();
        } else if (xhr.readyState === 4) {
            console.error('Error: ' + xhr.status);
        }
    };
}
function modifyGuardDutie(guard) {
    console.log(guard);
    let xhr = new XMLHttpRequest();
    xhr.open('PUT', `http://localhost:3000/api/guards/${guard.id}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(guard));
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let updatedGuardDuties = JSON.parse(xhr.responseText);
            console.log(updatedGuardDuties);
            updateTable(updatedGuardDuties);
loadGuardEditor();
        } else if (xhr.readyState === 4) {
            console.error('Error: ' + xhr.status);
        }
    };

}
function updateTable(guardias) {
    loadTable();
    guardias.forEach(guard => {
        let cellId = guard.day.toLowerCase() + '-' + guard.time;
        let cell = document.getElementById(cellId);
        if (cell) {
            cell.textContent = guard.professorName + ' (' + guard.place + ')';
        }
    });
}
function loadGuardEditor() {

    const professorSelector = document.getElementById('professor-selector');

    professorSelector.innerHTML = '';
    // Obtener todos los profesores disponibles
    const allGuards = getAllGuards();
    const professors = [...new Set(allGuards.map(guard => guard.professorName))];

    // Llenar el selector de profesor con los nombres de los profesores
    professors.forEach(professor => {
        const option = document.createElement('option');
        option.value = professor;
        option.textContent = professor;
        professorSelector.appendChild(option);
    });

    professorSelector.addEventListener('change', showProfessorGuardDuties);
    showProfessorGuardDuties();
}


function showProfessorGuardDuties() {
    const professorName = document.getElementById('professor-selector').value;
    const guardDutiesList = document.getElementById('guard-duties-list');

    guardDutiesList.innerHTML = '';

    const allGuards = getAllGuards();
    const professorGuardDuties = allGuards.filter(guard => guard.professorName === professorName);


    professorGuardDuties.forEach(guard => {
        const listItem = document.createElement('li');

        const dayElement = document.createElement('span');
        dayElement.textContent = guard.day;
        listItem.appendChild(dayElement);

        const timeSeparator = document.createElement('span');
        timeSeparator.textContent = ' ';
        listItem.appendChild(timeSeparator);

        const timeElement = document.createElement('span');
        timeElement.textContent = guard.time;
        listItem.appendChild(timeElement);

        const placeSeparator = document.createElement('span');
        placeSeparator.textContent = ' - ';
        listItem.appendChild(placeSeparator);

        const placeElement = document.createElement('span');
        placeElement.textContent = guard.place;
        listItem.appendChild(placeElement);


        // Botón de editar
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.addEventListener('click', () => editGuardDuty(listItem,guard.id));
        listItem.appendChild(editButton);


        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', () => deleteGuardDutie(guard));
        listItem.appendChild(deleteButton);

        guardDutiesList.appendChild(listItem);
    });
}


function editGuardDuty(listItem,id) {
    const dayElement = listItem.querySelector('span:nth-of-type(1)');
    const timeElement = listItem.querySelector('span:nth-of-type(3)');
    const placeElement = listItem.querySelector('span:nth-of-type(5)');

    const originalDay = dayElement.textContent;
    const originalTime = timeElement.textContent;
    const originalPlace = placeElement.textContent;

    const dayInput = document.createElement('input');
    dayInput.value = originalDay;
    listItem.replaceChild(dayInput, dayElement);

    const timeInput = document.createElement('input');
    timeInput.value = originalTime;
    listItem.replaceChild(timeInput, timeElement);

    const placeInput = document.createElement('input');
    placeInput.value = originalPlace;
    listItem.replaceChild(placeInput, placeElement);

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Guardar';
    saveButton.addEventListener('click', () => {
        const newDay = dayInput.value;
        const newTime = timeInput.value;
        const newPlace = placeInput.value;

        const guard = {
            professorName: document.getElementById('professor-selector').value,
            day: newDay,
            time: newTime,
            place: newPlace,
            id:id
        };
        modifyGuardDutie(guard);
        dayElement.textContent = newDay;
        timeElement.textContent = newTime;
        placeElement.textContent = newPlace;

        // Remover los campos de entrada y el botón de guardar
        listItem.replaceChild(dayElement, dayInput);
        listItem.replaceChild(timeElement, timeInput);
        listItem.replaceChild(placeElement, placeInput);
        listItem.removeChild(saveButton);
    });

    listItem.appendChild(saveButton);
}





