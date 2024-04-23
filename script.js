let cvs = document.getElementById('cvs');
let ctx = cvs.getContext('2d');
ctx.font = "20px Arial";


let data = {
    "columns": [],
    "info": [],
    "graph_data": []
};
let positions = [];

loadFile();
async function loadFile() {
    //fetch file
    await fetch('data/högskolebehörighet.json')
        .then(response => response.json())
        .then(response => {
            console.log(response);
            data.columns.push(response.columns[3].text);
            data.columns.push(response.columns[2].text);
            data.info.push(response.metadata[0].label);

            response.data.forEach(element => {
                data.graph_data.push({
                    count: parseInt(element.values[0]),
                    year: element.key[3]
                });
            });
        });

    calculateGraph();
}


let maxYCount = () => {
    let max = 0;
    for (let i = 0; i < data.graph_data.length; i++) {
        if (data.graph_data[i].count > max) {
            max = data.graph_data[i].count;
        }
    }
    return max;
}

let outOfCanvas = (clientX, i) => {
    //make the text not go outside screen
    let pxOutside = clientX + data.graph_data[i].count.toString().length * 12 + data.columns[1].length * 12;
    if (pxOutside >= cvs.width) {
        let offset = 0;
        offset = -data.graph_data[i].count.toString().length - data.columns[1].length * 4;
        return offset;
    } else {
        return 10;
    }
}

function drawGraph() {
    //print graph label
    ctx.fillStyle = "black";
    ctx.fillText(data.info[0], 10, 20);

    for (let i = 0; i < positions.length; i++) {
        ctx.beginPath();
        if (i == 0) {
            ctx.lineTo(positions[i].x, positions[i].y);
        } else {
            ctx.moveTo(positions[i - 1].x, positions[i - 1].y);
            ctx.lineTo(positions[i].x, positions[i].y);
        }

        if (i % 3 == 0) {

            ctx.fillText(data.graph_data[i].year, positions[i].x, cvs.height - 20);
        }

        ctx.stroke();
    }
}

function calculateGraph() {

    //canvas scale 
    let xScale = cvs.width / (data.graph_data.length + 3);
    let yScale = cvs.height / (maxYCount() + 1);

    console.log(xScale);
    console.log(yScale);

    //starting pos  
    let canvasX = xScale;
    let canvasY = cvs.height + 70;

    for (let i = 0; i < data.graph_data.length; i++) {

        let xCoord = canvasX;
        let yCoord = canvasY - data.graph_data[i].count * yScale;

        positions.push({ x: xCoord, y: yCoord });

        canvasX += xScale;
    }
    drawGraph();

}


function drawGraphInteraction(clientX) {
    for (let i = 0; i < positions.length; i++) {
        if (positions[i].x - 2 < clientX && positions[i].x + 2 > clientX) {

            ctx.beginPath();
            ctx.arc(positions[i].x, positions[i].y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = "red";
            ctx.fill();

            ctx.fillText(`${data.columns[0]}: ${data.graph_data[i].year}`, positions[i].x + outOfCanvas(clientX, i), positions[i].y + 50);
            ctx.fillText(`${data.columns[1]}: ${data.graph_data[i].count}`, positions[i].x + outOfCanvas(clientX, i), positions[i].y + 30);
            ctx.stroke();
        }
    }
}



//mouse events on canvas
cvs.addEventListener('mousemove', (e) => {
    ctx.clearRect(0, 0, cvs.width, cvs.height);

    drawGraph();
    drawGraphInteraction(e.clientX);

    ctx.beginPath();
    ctx.moveTo(e.clientX, 0);
    ctx.lineTo(e.clientX, cvs.height);
    ctx.stroke();
});