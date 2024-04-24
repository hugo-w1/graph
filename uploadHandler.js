document.getElementById('save_upload').addEventListener('click', () => {
    let col1 = document.getElementById('col1').value;
    let col2 = document.getElementById('col2').value;

    let col3 = document.getElementById('col3').value;
    let col4 = document.getElementById('col4').value;


    let json = JSON.parse(document.getElementById('paste_upload').value);

    data.columns.push(json.columns[col1].text);
    data.columns.push(json.columns[col2].text);

    data.info.push(json.metadata[0].label);

    json.data.forEach(element => {
        data.graph_data.push({
            count: parseInt(element.values[col4]),
            year: element.key[col3]
        });
    });

    calculateGraph();
    document.getElementById('upload_menu').style.display = 'none';

});

document.getElementById('paste_upload').addEventListener('change', (e) => {
    let json = JSON.parse(e.target.value);

    let Xcol = json.columns.length - 2;
    let Ycol = json.columns.length - 1;

    let x_key = json.columns[Xcol].text; //column for x-text
    let y_key = json.columns[Ycol].text; //column for y-text


    console.log(Xcol, Ycol);
    console.log(x_key, y_key);




    document.getElementById('col1').value = Xcol;
    document.getElementById('col2').value = Ycol;

    document.getElementById('col3').value = Xcol;
    document.getElementById('col4').value = 0;


});
