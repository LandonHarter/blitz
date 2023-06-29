import { Template, generate } from "@pdfme/generator";
import { BLANK_PDF } from "@pdfme/ui";

import { onCall, CallableRequest } from "firebase-functions/v2/https";

import * as admin from "firebase-admin";
import { randomUUID } from "crypto";

admin.initializeApp();

export const generatePdf = onCall(async (request:CallableRequest) => {
    const template:Template = {
        schemas: [{
            title: {
                type: "text",
                position: {
                  x: 52.2,
                  y: 10.85
                },
                width: 111.46,
                height: 6.99,
                alignment: "center",
                fontSize: 28,
                characterSpacing: 0,
                lineHeight: 1,
                fontName: "Roboto"
            },
        }],
        basePdf: BLANK_PDF,
    };

    const inputs:any[] = [{
        title: request.data.title,
    }];
    const questions = request.data.questions;
    for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        template.schemas[0][`question${i + 1}`] = {
            type: "text",
            position: {
                x: 17.8,
                y: (40 * i) + 40
            },
            width: 176,
            height: 7,
            alignment: "left",
            fontSize: 14,
            characterSpacing: 0,
            lineHeight: 1,
            fontName: "Roboto"
        };
        inputs[0][`question${i + 1}`] = `${i + 1}. ${question}`;
    }

    const pdf = await generate({ template, inputs });
    const fileId = randomUUID();

    const bucket = admin.storage().bucket();
    const destFile = bucket.file(`worksheets/${fileId}.pdf`);
    const stream = destFile.createWriteStream({
        metadata: {
            contentType: "application/pdf",
        },
    });

    await new Promise((resolve, reject) => {
        stream.on("error", (err) => {
            reject(err);
        });
        stream.on("finish", () => {
            resolve(null);
        });

        stream.end(pdf);
    });

    await destFile.makePublic();
    const url = destFile.publicUrl();
    return {
        fileUrl: url,
    };
});