/**
 * Flatten the catalog object
 * @param {array} products 
 */
function getImages(products) {
    return products.filter((product) => product.images)
    .map((product) => product.images)
    .reduce((accumulator, arr) => accumulator.concat(arr))
    .map((group) => group['image-group'])
    .reduce((accumulator, arr) => accumulator.concat(arr))
    .map((img) => img.image)
    .reduce((accumulator, arr) => accumulator.concat(arr))
    .map(img => img.$.path)
}

module.exports = (path) => {
    const fs = require('fs');
    var parseString = require('xml2js').parseString;

    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                console.log('The XML file cannot be found');
                throw err;
            }
            parseString(data, (err, result) => {
                if (err) {
                    throw err;
                }

                resolve({
                    catalogId: result.catalog.$['catalog-id'],
                    images: getImages(result.catalog.product),
                });
            });
        });
    });

};