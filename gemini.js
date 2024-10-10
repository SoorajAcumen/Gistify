import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { VertexAI } from "@google-cloud/vertexai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.API_KEY
const projectId = process.env.PROJECT_ID


// Initialize GoogleGenerativeAI with your API_KEY.
const googleAI = new GoogleGenerativeAI(apiKey);

// Initialize GoogleAIFileManager with your API_KEY.
const fileManager = new GoogleAIFileManager(apiKey);

// Initialize VertexAI with your PROJECT_ID.
const vertexAI = new VertexAI({ project: projectId, location: 'us-central1' });


const geminiConfig = {
    temperature: 0.9,
    topP: 1,
    topK: 1,
    maxOutputTokens: 4096,
};

const geminiPromptModel = googleAI.getGenerativeModel({
    model: "gemini-pro",
    geminiConfig,
});

const geminiPdfModel = googleAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const generativeModel = vertexAI.getGenerativeModel({
    model: 'gemini-1.5-flash-001',
});



export const generateFromPrompt = async (prompt) => {
    try {
        const result = await geminiPromptModel.generateContent(prompt);
        const response = result.response.text()
        return response
    } catch (error) {
        console.log("response error", error);
    }
};

export const generatePdfSummary = async (fileName, prompt) => {
    try {
        const uploadResponse = await fileManager.uploadFile(`uploads/${fileName}`, {
            mimeType: "application/pdf",
            displayName: "Gemini 1.5 PDF",
        });

        const result = await geminiPdfModel.generateContent([
            {
                fileData: {
                    mimeType: uploadResponse.file.mimeType,
                    fileUri: uploadResponse.file.uri,
                },
            },
            { text: prompt || "Can you summarize this document as a bulleted list." },
        ]);

        const response = result.response.text();
        return response
    } catch (error) {
        console.log("response error", error);
    }
}


export const summaryFromPdfUri = async() => {
    try {
       
        const filePart = {
            file_data: {
                file_uri: 'gs://cloud-samples-data/generative-ai/pdf/2403.05530.pdf',
                mime_type: 'application/pdf',
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
        return JSON.stringify(contentResponse)
    } catch (error) {
        
    }
}