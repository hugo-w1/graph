let dataId = null;
let selectedData = null;

function editData(e) {
    document.getElementById('edit_menu').style.display = 'block';
    dataId = e.target.getAttribute('dataId');
    //find the correct data relative to id
    for (let i = 0; i < data.length; i++) {
        if (data[i].id == dataId) {
            selectedData = data[i];
        }
    }
    for (let i = 0; i < selectedData.data.length; i++) {
        addToEditMeny(selectedData.data[i], i);
    }
}


function addToEditMeny(newData, elementId) {
    let tr = document.createElement('tr');
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');

    td1.innerHTML = newData.year;
    td2.innerHTML = `<input type="number" id="table_${elementId}" value="${newData.count}">`;

    tr.append(td1, td2);
    document.getElementById('edit_table').appendChild(tr);

}

document.getElementById('save_edit').addEventListener('click', () => {
    let tableCount = document.getElementById('edit_table').childNodes.length - 2;
    let newDataCount = [];
    for (let i = 0; i < tableCount; i++) {
        let elementId = 'table_' + i;
        let count = document.getElementById(elementId).value;
        newDataCount.push(count);
    }
    fuseData(newDataCount);



    document.getElementById('edit_table').innerHTML = "<th>X</th><th>Y</th>";
});

function fuseData(newDataCount) {
    let newGraphData = [];

    for (let i = 0; i < newDataCount.length; i++) {
        newGraphData.push({
            count: parseInt(newDataCount[i]),
            year: selectedData.data[i].year
        });
    }

    let newData = new dataClass(
        selectedData.columns,
        [selectedData.info],
        newGraphData, selectedData.id
    );


    let index = data.indexOf(selectedData);
    if (index > -1) { // only splice array when item is found
        data.splice(index, 1); // 2nd parameter means remove one item only
    }

    data.push(newData);

    updateTable();
    calculateGraphPositions()
    drawGraph();


    document.getElementById('edit_table').innerHTML = "<th>X</th><th>Y</th>";
    document.getElementById('edit_menu').style.display = 'none';
}



//add eventlistener to collapsable menu
let coll = document.getElementsByClassName("collapsible");
let i;
for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
}


