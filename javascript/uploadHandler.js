document.getElementById('save_upload').addEventListener('click', () => {
    let col1 = document.getElementById('col1').value;
    let col2 = document.getElementById('col2').value;

    let col3 = document.getElementById('col3').value;
    let col4 = document.getElementById('col4').value;

    let json = JSON.parse(document.getElementById('paste_upload').value);

    let newGraphData = [];

    json.data.forEach(element => {
        newGraphData.push({
            count: parseInt(element.values[col4]),
            year: element.key[col3]
        });
    });
    if (data.length > 3) {
        alert('Data limit reached, You cant have more than 4 graphs at once.')
    } else {

        //create a new dataClass and add it to the data array.
        let newData = new dataClass(
            [json.columns[col2].text, json.columns[1].text],
            [json.metadata[0].label],
            newGraphData, null
        );
        data.push(newData);
        //refresh and render graph
        updateTable();
        calculateGraphPositions();

        localStorage.setItem('data', JSON.stringify(data))


        drawGraph();
        document.getElementById('upload_menu').style.display = 'none';
    }

});

document.getElementById('paste_upload').addEventListener('change', (e) => {

    let json = JSON.parse(e.target.value);
    let keyValue = identifyKeyValue(json);

    document.getElementById('col1').value = keyValue[0]; //Xcol
    document.getElementById('col2').value = keyValue[1]; //Ycol

    document.getElementById('col3').value = keyValue[0]; //Xcol
    document.getElementById('col4').value = 0;

});


function identifyKeyValue(json) {

    let Xcol = json.columns.length - 2; //col 1
    let Ycol = json.columns.length - 1; //col2

    let x_key = json.columns[Xcol].text; //column for x-text col 3
    let y_key = json.columns[Ycol].text; //column for y-text col 4

    return ([Xcol, Ycol, x_key, y_key]);
}
