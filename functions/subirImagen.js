const {Storage} = require('@google-cloud/storage');
const streamifier = require('streamifier');
const { v4: uuidv4 } = require('uuid');

exports.subirImagen = async (filesend) => {
    if(filesend){

        const storage = new Storage({
            projectId: 'grupo-kaband',
            keyFilename: './keyfiles.json'
        });
    
        const bucket = storage.bucket('grupokaband');

        const nombreImagenNuevo = `${uuidv4()}.${filesend.mimetype.split('/')[1]}`;

        const blob = bucket.file(nombreImagenNuevo);

        const blobStream = blob.createWriteStream();

        const response = await new Promise((resolve, reject) => {
            streamifier.createReadStream(filesend.buffer)
            .on('error', (err) => {
                reject(false) 
            })
            .pipe(blobStream)
            .on('finish', async (resp) => {
                resolve(nombreImagenNuevo);
            });
        })

        return response;

    }
}