const ImageKit = require('@imagekit/nodejs');

const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || process.env.IMAGEKIT_PRIVATEKEY,
});

async function uploadFile(file, fileName, mimeType) {
    let uploadValue = file;

    if (Buffer.isBuffer(file)) {
        uploadValue = new File([file], fileName, { type: mimeType });
    }

    const response = await client.files.upload({
        file: uploadValue,
        fileName,
    });
    return response;
}

module.exports = {
    uploadFile,
}