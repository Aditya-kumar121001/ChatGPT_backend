const express = require("express");
const dotenv= require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const app=express();

//middleware
app.use(express.json())

//chat gpt config
const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

//Routes
app.post("/find-complexity", async (req, res) => {
    try {
      const { prompt } = req.body;
      const response = await openai.createCompletion({
        model: "text-davinci-001",
        prompt: `
                ${prompt}
                The time complexity of this function is
                ###
              `,
        max_tokens: 64,
        temperature: 0,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop: ["\n"],
      });
  
      return res.status(200).json({
        success: true,
        data: response.data.choices[0].text,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error.response
          ? error.response.data
          : "There was an issue on the server",
      });
    }
  });

//Server 
const PORT = process.env.PORT || 5000
app.listen(PORT ,()=>{
    console.log(`server is running on ${PORT}`)
})