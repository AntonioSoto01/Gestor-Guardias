document.addEventListener('DOMContentLoaded', function() {
getAllGuards();

});

function loadSelectorAndTable(guardias) {
    // Get all guard duties


    // Get unique professor names from guard duties
    let professorNames = [...new Set(guardias.map(guard => guard.professorName))];

    // Populate the dropdown selector with professor names
    let selector = document.getElementById('professor-selector');
    selector.innerHTML = '';
    professorNames.forEach(name => {
        let option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        selector.appendChild(option);
    });

    // Update table with guard duties of the first professor in the list (or any default behavior)
    updateTable(guardias.filter(guard => guard.professorName === professorNames[0]));
}

function getAllGuards() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `http://localhost:3000/api/guards`, false);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let updatedGuardDuties = JSON.parse(xhr.responseText);
         loadSelectorAndTable(updatedGuardDuties);
            } else {
                console.error('Error: ' + xhr.status);
            }
        }
    };
    xhr.send();
}
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

function updateTable(guardias) {
    loadTable(); // Clear and reinitialize the table
    guardias.forEach(guard => {
        let cellId = guard.day.toLowerCase() + '-' + guard.time;
        let cell = document.getElementById(cellId);
        if (cell) {
            cell.textContent = guard.professorName + ' (' + guard.place + ')';
        }
    });
}