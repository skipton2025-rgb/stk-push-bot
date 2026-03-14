
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// 🔑 Replace with your Nestlink API key
const API_KEY = "7a479a3fc8b6e6e99521b35e";

app.post("/send", async (req, res) => {

  const numbers = req.body.numbers.split("\n");
  const amount = req.body.amount;

  for (let phone of numbers) {

    phone = phone.trim();
    if(!phone) continue;

    try {

      await axios.post(
        "https://api.nestlink.co.ke/runPrompt",
        {
          phone: phone,
          amount: amount,
          local_id: "ORDER_" + Math.floor(Math.random()*100000),
          transaction_desc: "Payment"
        },
        {
          headers:{
            "Content-Type":"application/json",
            "Api-Secret":API_KEY
          }
        }
      );

      console.log("STK sent to:", phone);

    } catch(e){

      console.log("Failed:", phone);

    }

    // delay to avoid API rate limits
    await new Promise(r => setTimeout(r, 2000));

  }

  res.send("STK requests processed");

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
  console.log("Server running on port", PORT);
});
