import axios from "axios";
import { NextApiHandler } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generate: NextApiHandler = async (req, res) => {
  const { prompt } = req.body;
  const { data: response } = await openai.createImage({
    prompt,
    n: 1,
    size: "256x256",
  });

  const url = response.data[0].url!;
  const { data: imageBuffer } = await axios.get(url, { responseType: "arraybuffer" });
  res.send(imageBuffer);
};

export default generate;
