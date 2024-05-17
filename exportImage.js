document.getElementById('export').addEventListener('click', () => {
    if (window.confirm('Save as png?')) {
        drawGraph();
        drawGraph();
    
        let canvas = document.getElementById('cvs');
        // Convert the canvas to data
        let image = canvas.toDataURL();
        // Create a link
        let downloadLink = document.createElement('a');
        // Add the name of the file to the link
        downloadLink.download = 'canvas_image.png';
        // Attach the data to the link
        downloadLink.href = image;
        // click the download link
        downloadLink.click();
    }
});

document.getElementById('copy').addEventListener('click', (e) => {
    drawGraph();
    drawGraph();

    e.target.innerHTML = 'Copied!'
    cvs.toBlob(blob => navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]));
    setTimeout(() => { e.target.innerHTML = 'Copy to Clipboard' }, 600);
});