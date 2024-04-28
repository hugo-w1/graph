let cvs = document.getElementById('cvs');
let ctx = cvs.getContext('2d');
ctx.font = "20px Arial";

let settings = [
    20, //font size
    'red', //font color [not editable]
    5, // x-value spacing
    1,   //dot spacing
    false, // y-value-count
    false // y-value-lines
];

class dataClass {
    #setColor(id) {
        if (id > 3) {
            console.log('limit reached!');
            return;
        }
        let colors = ['red', 'blue', 'purple', 'green'];
        return colors[id];
    }

    #generateId() {
        return data.length;

    }

    constructor(columns, info, data) {
        this.columns = columns;
        this.info = info;
        this.data = data;
        this.positions = [];
        this.id = this.#generateId();
        this.color = this.#setColor(this.id);

    }

}


let data = [];

loadFile('habo_invPerKm2.json');
loadFile('jönköping_invPerKm2.json');

async function loadFile(file) {
    //fetch file
    await fetch(file)
        .then(response => response.json())
        .then(response => {
            console.log(response);

            let newGraphData = [];

            response.data.forEach(element => {
                newGraphData.push({
                    count: parseInt(element.values[0]),
                    year: element.key[1]
                });
            });
            console.log(newGraphData);

            let newData = new dataClass(
                [response.columns[2].text, response.columns[1].text],
                [response.metadata[0].label],
                newGraphData
            );
            data.push(newData);
            addToTable(newData);

        });
    drawGraph();
    calculateGraphPositions();
}



function calculateGraphPositions() {
    let totalGraphData = [];
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].data.length; j++) {
            totalGraphData.push([data[i].data[j].count, data[i].data[j].year]);
        }
    }
    for (let i = 0; i < data.length; i++) {
        data[i].positions = calculateGraph(data[i].data, totalGraphData);
    }
}



function maxYCount(totalGraphData) {
    let max = 0;
    for (let i = 0; i < totalGraphData.length; i++) {
        if (totalGraphData[i][0] > max) {
            max = totalGraphData[i][0];
        }
    }
    return max;
}

function outOfCanvas(clientX, i, graphData) {
    //make the text not go outside screen
    if (clientX >= cvs.width / 1.5) {
        //calculate offset with fontsize
        let offset = (graphData.data[i].count.toString().length + graphData.columns[0].length) * settings[0] / 1.5;
        return -offset;
    } else {
        return 10;
    }
}

function drawGraph() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);

    let drawnValues = [];
    ctx.fillStyle = 'black';
    //draw Y-value-count to the left
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].positions.length; j++) {

            //make sure it dosent draw the same number multiple times
            if (j % 10 == 0) {

                if (!drawnValues.includes(data[i].data[j].count)) {
                    if (settings[4]) {
                        ctx.fillText(data[i].data[j].count, 5, data[i].positions[j].y);
                    }

                    if (settings[5]) {
                        ctx.moveTo(0, data[i].positions[j].y);
                        ctx.lineTo(cvs.width, data[i].positions[j].y);
                    }
                    ctx.stroke();

                    drawnValues.push(data[i].data[j].count);
                }
            }

        }
    }


    //draw graph
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].positions.length; j++) {
            ctx.beginPath();
            if (j == 0) {
                ctx.lineTo(data[i].positions[j].x, data[i].positions[j].y);
            } else {
                ctx.moveTo(data[i].positions[j - 1].x, data[i].positions[j - 1].y);
                ctx.lineTo(data[i].positions[j].x, data[i].positions[j].y);
            }

            if (j % settings[3] == 0) {
                ctx.arc(data[i].positions[j].x, data[i].positions[j].y, 3, 0, 2 * Math.PI);
            }

            if (j % settings[2] == 0) {
                ctx.fillStyle = 'black';
                ctx.fillText(data[i].data[j].year, data[i].positions[j].x, cvs.height - 20);
            }
            ctx.stroke();
        }
    }
}

function calculateGraph(graphData, totalGraphData) {

    let positions = [];

    //canvas scale 
    console.log(graphData);
    let xScale = cvs.width / (graphData.length + 5); // add margin with 5 on both scales
    let yScale = cvs.height / (maxYCount(totalGraphData) + 5);


    console.log(yScale)
    //starting pos  
    let canvasX = xScale + 50;
    let canvasY = cvs.height + yScale;

    for (let i = 0; i < graphData.length; i++) {

        let xCoord = canvasX;
        let yCoord = canvasY - graphData[i].count * yScale;

        positions.push({ x: xCoord, y: yCoord });

        canvasX += xScale;
    }

    return positions;

    //drawGraph();

}

/**
 * Draws the interactions on canvas
 * Iterates the data classes and prints data relative to clientX 
 * @param {int} clientX cursor x positon on canvas
 */
function drawGraphInteraction(clientX) {
    if (data.length > 1) {
        for (let i = data.length - 1; i >= data.length - 1; i--) {
            //loop over postisions
            for (let j = 0; j < data[i].positions.length; j++) {
                if (data[i].positions[j].x - 2 < clientX && data[i].positions[j].x + 2 > clientX) {

                    let information = [];

                    //assing y as an dynamic int
                    let y = data[i].positions[j].y;
                    if (y > 255) {
                        //do not make y go under screen
                        y = 255;
                    }

                    console.log(y);

                    //multi dimensional graph data
                    for (let k = data.length - 1; k >= 0; k--) {
                        console.log(data[i - k].data[j].count + ' :' + k);
                        information.push([data[i - k].data[j].count, data[i - k].color, data[i - k].columns[0]]);
                    }

                    //put bounding box
                    ctx.fillStyle = "lightgray";
                    ctx.fillRect(data[i].positions[j].x + outOfCanvas(clientX, i, data[i]), y, 200, 150);
                    //put x-value in box
                    ctx.fillStyle = "black";
                    ctx.fillText(`${data[i].columns[1]}: ${data[i].data[j].year}`, data[i].positions[j].x + outOfCanvas(clientX, i, data[i]), y + 20);

                    let margin = 60;
                    for (let a = 0; a < information.length; a++) {
                        ctx.fillStyle = information[a][1];
                        ctx.fillText(`${information[a][2]}: ${information[a][0]}`, data[i].positions[j].x + outOfCanvas(clientX, i, data[i]), y + margin);
                        margin += 20;

                    }
                    break;
                }
            }
        }
    } else {

        data.forEach(data => {

            for (let i = 0; i < data.positions.length; i++) {
                //position marker interval
                if (data.positions[i].x - 2 < clientX && data.positions[i].x + 2 > clientX) {

                    ctx.beginPath();
                    ctx.arc(data.positions[i].x, data.positions[i].y, 5, 0, 2 * Math.PI);
                    ctx.fillStyle = settings[1];
                    ctx.fill();
                    //print information next to graph marker 
                    ctx.fillText(`${data.columns[1]}: ${data.data[i].year}`, data.positions[i].x + outOfCanvas(clientX, i, data), data.positions[i].y + 50);
                    ctx.fillText(`${data.columns[0]}: ${data.data[i].count}`, data.positions[i].x + outOfCanvas(clientX, i, data), data.positions[i].y + 30);
                    ctx.stroke();
                }
            }
        });
    }
}

//mouse events on canvas
cvs.addEventListener('mousemove', (e) => {
    ctx.clearRect(0, 0, cvs.width, cvs.height);

    if (data.length > 0) {
        drawGraph();
    }

    drawGraphInteraction(e.clientX);

    ctx.beginPath();
    ctx.moveTo(e.clientX, 0);
    ctx.lineTo(e.clientX, cvs.height);
    ctx.stroke();
});


function addToTable(newData) {

    let tr = document.createElement('tr');
    let td1 = document.createElement('td')
    let td2 = document.createElement('td')

    td1.innerHTML = newData.id;
    td2.innerHTML = newData.info[0];
    td1.style.color = newData.color;
    td2.style.color = newData.color;

    tr.append(td1, td2);
    document.getElementById('table').appendChild(tr);


}

