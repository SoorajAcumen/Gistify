import axios from "axios";
import officeParser from 'officeparser';


export const getFileExtension  =  (url) => {
    const fileExtension = url?.split('.').pop().split(/\#|\?/)[0];
    let fileType;
    switch (fileExtension) {
        case 'pdf':
            fileType = 'application/pdf';
            break;
        case 'docx':
            fileType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            break;
        case 'pptx':
            fileType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
            break;
        default:
            fileType = 'Unknown File Type';
    }

    return fileType
}





export const getFileMimeType = async(url) => {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        const contentType = response.headers.get('Content-Type');
        return contentType;
    } catch (error) {
        console.error("Error fetching the URL:", error);
        return null;
    }
}


const extractTextFromDocuments = async (url) => {
    try {
        const response = await axios({
            url: url,
            method: 'GET',
            responseType: 'arraybuffer' // Binary data for documents
        });

        const bufferData = response.data;
        const result = await parseDocumentAsync(bufferData);

        return result;

    } catch (error) {
        console.error('Error fetching or parsing document:', error);
        throw error;
    }
};

// Helper function to wrap the officeParser in a promise
const parseDocumentAsync = (bufferData) => {
    return new Promise((resolve, reject) => {
        officeParser.parseOffice(bufferData, (data, err) => {
            if (err) {
                reject(err); // Reject the promise with error
            } else {
                resolve(data); // Resolve the promise with parsed data
            }
        });
    });
};

export default extractTextFromDocuments;
