let cvs = document.getElementById('cvs');
let ctx = cvs.getContext('2d');
ctx.font = "20px Arial";
/*
let data = [
    {
        count: 1615,
        year: '2017'
    },
    {
        count: 1688,
        year: '2018'
    },
    {
        count: 1644,
        year: '2019'
    },
    {
        count: 1665,
        year: '2020'
    },
    {
        count: 1651,
        year: '2021'
    },
    {
        count: 1526,
        year: '2022'
    },
    {
        count: 1543,
        year: '2023'
    }
];*/


let data = [];

loadFile();
async function loadFile() {
    //fetch file
    await fetch('ME0104B8_20240417-010512.json')
        .then(response => response.json())
        .then(response => {
            response.data.forEach(element => {
                data.push({
                    count: parseInt(element.values[0]),
                    year: element.key[1]
                });
            });
        });


    drawGraph();

}


let maxXCount = () => {
    let max = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i].count > max) {
            max = data[i].count;
        }
    }
    return max;
}


function drawGraph() {

    //PRINT INFORMATION

    //x 

    let width = cvs.width / (data.length + 1);
    let x = width;
    for (let i = 0; i < data.length; i++) {
        if (i % 1 == 0) {
            console.log(data[i].year);
            ctx.fillText(data[i].year, x, 380);
        }
        x += width
    }


    let positions = calculateGraph();

    for (let i = 0; i < positions.length; i++) {
        ctx.beginPath();
        if (i == 0) {
            //  ctx.moveTo(0, 400);
            ctx.lineTo(positions[i].x, positions[i].y);
        } else {
            ctx.moveTo(positions[i - 1].x, positions[i - 1].y);
            ctx.lineTo(positions[i].x, positions[i].y);
            if (i % 1 == 0) {
                ctx.fillText(data[i].count, positions[i].x, positions[i].y);

            }
        }
        ctx.stroke();

        // ctx.fillText(data[i].year, positions[i].x, positions[i].y);
    }
}

function calculateGraph() {
    let positions = [];

    //canvas scale 
    let x = cvs.width / (data.length);
    let yScale = (cvs.height / maxXCount());

    //starting pos  
    let canvasX = x;
    let canvasY = cvs.height + 50;

    for (let i = 0; i < data.length; i++) {

        let xCoord = canvasX;
        let yCoord = canvasY - data[i].count * yScale

        positions.push({ x: xCoord, y: yCoord });

        canvasX += x;
    }

    console.log(positions);
    return positions;
}
