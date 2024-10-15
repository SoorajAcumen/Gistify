import { VertexAI } from "@google-cloud/vertexai";
import dotenv from "dotenv";
dotenv.config();

const projectId = process.env.PROJECT_ID

const vertexAI = new VertexAI({ project: projectId, location: 'us-central1' });



const generativeModel = vertexAI.getGenerativeModel({
    model: 'gemini-1.5-flash-001',
});



export const summaryFromPdfUri = async (url, mimeType) => {
    try {
        const filePart = {
            file_data: {
                file_uri: url,
                mime_type: mimeType,
            },
        };
        const textPart = {
            text: `
    You are a very professional document summarization specialist.
    Please summarize the given document.`,
        };

        const request = {
            contents: [{ role: 'user', parts: [filePart, textPart] }],
        };

        const resp = await generativeModel.generateContent(request);
        const contentResponse = resp.response;
        console.log(JSON.stringify(contentResponse));

        console.log(contentResponse);

        return contentResponse
    } catch (error) {
        console.log(error)
    }
}