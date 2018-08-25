module.exports = (outputFile, data) => {
    const fs = require('fs-extra');
    const xlsx = require('node-xlsx');
    const headers = ['XML images', 'Folder images', 'Images copied', 'Images skipped'];
    let totalLines = data.totalXmlImages >= data.totalFolderImages ? data.totalXmlImages : data.totalFolderImages;

    function createRow(index) {
        let row = [];
        row.push(data.xmlImages[index] || '');
        row.push(data.folderImages[index] || '');
        row.push(data.copiedImages[index] || '');
        row.push(data.skippedImages[index] || '');
        return row;
    }

    const rows = [];
    rows.push(headers);
    for (let i = 0, l = totalLines; i < l; i++) {
        rows.push(createRow(i));
    }
    const xlsBuffer = xlsx.build([{name: 'exportSFCCResults', data: rows}]);

    return fs.outputFile(outputFile, xlsBuffer).then(() => {
        return data;
    });
}