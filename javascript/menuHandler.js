document.getElementById('settings').addEventListener('click', () => {

    document.getElementById('fontsize').value = settings[0];
    document.getElementById('spacing').value = settings[2];

    document.getElementById('space_amount').innerHTML = settings[2];

    
    document.getElementById('dot_spacing').value = settings[3];

    document.getElementById('yvaluecount').checked = settings[4];
    document.getElementById('yvaluelines').checked = settings[5];


    document.getElementById('menu').style.display = 'block';
});

document.getElementById('cancel_setting').addEventListener('click', () => {
    document.getElementById('menu').style.display = 'none';
});

document.getElementById('spacing').addEventListener('change', (e) => {
    document.getElementById('space_amount').innerText = e.target.value;
});

document.getElementById('dot_spacing').addEventListener('change', (e) => {
    document.getElementById('dot_space_amount').innerText = e.target.value;
});


document.getElementById('save_setting').addEventListener('click', () => {

    settings[0] = document.getElementById('fontsize').value;
    ctx.font = `${settings[0]}px Arial`;
    settings[2] = document.getElementById('spacing').value;
    settings[3] = document.getElementById('dot_spacing').value;


    settings[4] = document.getElementById('yvaluecount').checked;
    settings[5] = document.getElementById('yvaluelines').checked;

    localStorage.setItem('settings', JSON.stringify(settings))

    //draw graph with new settings and close the menu
    drawGraph();
    document.getElementById('menu').style.display = 'none';
});

document.getElementById('upload_data').addEventListener('click', () => {
    document.getElementById('upload_menu').style.display = 'block';
});

document.getElementById('cancel_upload').addEventListener('click', () => {
    document.getElementById('upload_menu').style.display = 'none';
});



//edit menu opener is applied at addToTable(parmam) (script.js)
document.getElementById('cancel_edit').addEventListener('click', () => {
    document.getElementById('edit_table').innerHTML = "<th>X</th><th>Y</th>";
    document.getElementById('edit_menu').style.display = 'none';
});

