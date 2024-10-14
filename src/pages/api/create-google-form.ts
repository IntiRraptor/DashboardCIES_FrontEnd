import { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import credentials from "../../../credentials.json";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const auth = new google.auth.GoogleAuth({
        keyFile: credentials as any,
        scopes: ["https://www.googleapis.com/auth/forms"],
      });
      const client = await auth.getClient();
      const forms = google.forms({ version: "v1", auth: client as any });

      const { title, questions } = req.body;

      const response = await forms.forms.create({
        requestBody: {
          info: {
            title,
          },
          items: questions.map((question: string) => ({
            title: question,
            questionItem: {
              question: {
                textQuestion: {},
              },
            },
          })),
        },
      });

      res.status(200).json({ responderUri: response.data.responderUri });
    } catch (error) {
      console.error("Error creating Google Form:", error);
      res.status(500).json({ error: "Failed to create Google Form" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
