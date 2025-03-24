const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { mensagem } = req.body;

  if (!mensagem) {
    return res.status(400).json({ error: "Mensagem ausente" });
  }

  try {
    const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Você é um assistente especializado em Acupuntura Tradicional Chinesa, guiando alunos da Jornada do Samurai com clareza, precisão e acolhimento."
          },
          {
            role: "user",
            content: mensagem
          }
        ]
      })
    });

    const data = await resposta.json();
    res.json({ resposta: data.choices?.[0]?.message?.content || "Não entendi sua pergunta." });
  } catch (error) {
    console.error("Erro ao consultar OpenAI:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
