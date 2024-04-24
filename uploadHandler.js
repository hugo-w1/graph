document.getElementById('save_upload').addEventListener('click', () => {
    let col1 = document.getElementById('col1').value;
    let col2 = document.getElementById('col2').value;

    let col3 = document.getElementById('col3').value;
    let col4 = document.getElementById('col4').value;


    let json = JSON.parse(document.getElementById('paste_upload').value);

    console.log(json);

    data.columns.push(json.columns[col1].text);
    data.columns.push(json.columns[col2].text);

    data.info.push(json.metadata[0].label);

    json.data.forEach(element => {
        data.graph_data.push({
            count: parseInt(element.values[col3]),
            year: element.key[col4]
        });
    });

    calculateGraph();
    document.getElementById('upload_menu').style.display = 'none';




});

