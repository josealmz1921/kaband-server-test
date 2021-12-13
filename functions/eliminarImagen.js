const {Storage} = require('@google-cloud/storage');

exports.eliminarImagen = async (imagen) => {

    const storage = new Storage({
        projectId: 'grupo-kaband',
        keyFilename: './keyfiles.json'
    });

    const bucket = storage.bucket('grupokaband');

    if(imagen !== 'no-image-default.png'){
        var file = bucket.file(imagen);
        file.delete(function(err, apiResponse) {})
    }
}