let cvs = document.getElementById('cvs');
let ctx = cvs.getContext('2d');
ctx.font = "10px Arial";


let data = [];

loadFile();
async function loadFile() {
    //fetch file
    await fetch('BE0101B8_20240419-124124.json')
        .then(response => response.json())
        .then(response => {
            response.data.forEach(element => {
                data.push({
                    count: parseInt(element.values[0]),
                    year: element.key[0]
                });
            });
        });


    drawGraph();

}


let maxYCount = () => {
    let max = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i].count > max) {
            max = data[i].count;
        }
    }
    return max;
}


function drawGraph() {

    let positions = calculateGraph();

    for (let i = 0; i < positions.length; i++) {
        ctx.beginPath();
        if (i == 0) {
            ctx.lineTo(positions[i].x, positions[i].y);
            console.log(positions[i].x, positions[i].y);
        } else {
            ctx.moveTo(positions[i - 1].x, positions[i - 1].y);
            ctx.lineTo(positions[i].x, positions[i].y);
        }
        if (i % 1 == 0) {

            ctx.moveTo(positions[i].x, positions[i].y);
            ctx.lineTo(positions[i].x, 380);

            ctx.fillText(data[i].count, positions[i].x, positions[i].y);
            ctx.fillText(data[i].year, positions[i].x, 380);

        }
        ctx.stroke();
    }
}

function calculateGraph() {
    let positions = [];

    //canvas scale 
    let xScale = cvs.width / (data.length + 3);
    let yScale = cvs.height / (maxYCount() + 1);

    console.log(xScale);
    console.log(yScale);

    //starting pos  
    let canvasX = xScale;
    let canvasY = cvs.height + 70;

    for (let i = 0; i < data.length; i++) {

        let xCoord = canvasX;
        let yCoord = canvasY - data[i].count * yScale;

        positions.push({ x: xCoord, y: yCoord });

        canvasX += xScale;
    }

    console.log(positions);
    return positions;
}
