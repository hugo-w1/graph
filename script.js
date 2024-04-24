let cvs = document.getElementById('cvs');
let ctx = cvs.getContext('2d');
ctx.font = "20px Arial";

let settings = [
    20, //font size
    'red', //font color
    2, // x-value spacing
    1   //dot spacing
];

class dataClass {
    #generateId() {
        let chars = 'QWERTYUIOPASDFGHJKL1234567890';
        let tmp = '';
        for (let i = 0; i < 5; i++) {
            tmp += chars[Math.ceil(Math.random() * chars.length)];
        }
        return tmp;
    }

    constructor(columns, info, data, positions, color) {
        this.columns = columns;
        this.info = info;
        this.data = data;
        this.positions = positions;
        this.color = color;
        this.id = this.#generateId();
    }

}


let data = [];

//loadFile();
async function loadFile() {
    //fetch file
    await fetch('data/men.json')
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

            let newData = new dataClass(
                [response.columns[2].text, response.columns[1].text],
                [response.metadata[0].label],
                newGraphData,
                calculateGraph(newGraphData),
                'blue'
            );
            console.log(newData);

            data.push(newData);

        });
    drawGraph();
}


function maxYCount(graphData) {
    let max = 0;
    for (let i = 0; i < graphData.length; i++) {
        if (graphData[i].count > max) {
            max = graphData[i].count;
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


    data.forEach(data => {
        //print graph label
        ctx.fillStyle = "black";
        ctx.fillText(data.info[0], 10, 20);

        for (let i = 0; i < data.positions.length; i++) {
            ctx.beginPath();
            if (i == 0) {
                ctx.lineTo(data.positions[i].x, data.positions[i].y);
            } else {
                ctx.moveTo(data.positions[i - 1].x, data.positions[i - 1].y);
                ctx.lineTo(data.positions[i].x, data.positions[i].y);
            }

            if (i % settings[3] == 0) {
                ctx.arc(data.positions[i].x, data.positions[i].y, 3, 0, 2 * Math.PI);
            }


            if (i % settings[2] == 0) {

                ctx.fillText(data.data[i].year, data.positions[i].x, cvs.height - 20);
            }
            ctx.stroke();
        }
    });
}

function calculateGraph(graphData) {

    let positions = [];

    //canvas scale 
    console.log(graphData);
    let xScale = cvs.width / (graphData.length + 3);
    let yScale = cvs.height / (maxYCount(graphData) + 1);

    console.log(xScale);
    console.log(yScale);

    //starting pos  
    let canvasX = xScale;
    let canvasY = cvs.height + 70;

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
 * @param {int} clientX cursor x positon on canvas
 */
function drawGraphInteraction(clientX) {

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


