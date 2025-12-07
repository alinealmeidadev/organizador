// Nome do arquivo: api/chat.js

export default async function handler(req, res) {
  // Configuração de CORS para permitir que seu site chame esta função
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Responde imediatamente a requisições OPTIONS (pre-flight do navegador)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Apenas aceita POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message } = req.body;

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'Chave da API (ANTHROPIC_API_KEY) não configurada no Vercel' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 1024,
        messages: [{ role: "user", content: message }],
        system: "Você é um assistente pessoal organizado e útil para um app de produtividade. Se o usuário pedir para criar uma tarefa, rotina ou lembrete, ajude-o confirmando que entendeu. Seja breve e amigável."
      })
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Erro na API:', error);
    return res.status(500).json({ error: 'Erro ao processar mensagem com a IA', details: error.message });
  }
}