import express from 'express'
import * as dotenv from 'dotenv'
import { Configuration, OpenAIApi } from 'openai';


dotenv.config();

const router = express.Router();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

router.route('/').get((req, res) => {
    res.send('Hello from DALL-E!');
})

router.route('/').post(async (req,res) => {
    try{
        const { prompt } = req.body;

        const aiResponse = await openai.createImage({
            prompt,
            n:1,
            size: '1024x1024',response_format:'b64_json',
        })
        console.log(aiResponse)

        if (!aiResponse?.data?.data || aiResponse.data.data.length === 0) {
            console.log("Invalid response from OpenAI API.");
            return res.status(500).json({ error: "Invalid response from OpenAI API." });
        }

        const responseData = aiResponse.data.data[0];
        console.log(responseData);

        const image = responseData?.b64_json;

        if (!image) {
            console.log("Image data not found in the response.");
            return res.status(500).json({ error: "Image data not found in the response." });
        }

        res.status(200).json({ photo: image });
    } catch (error) {
        console.log(error);
        res.status(500).send(error?.response?.data?.error?.message || "Internal server error.");
    }
})

export default router;