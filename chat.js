// Substitua a função sendMessage atual por esta:
async function sendMessage() {
    const input = document.getElementById('userInput');
    const msg = input.value.trim();
    if (!msg) return;

    addMessage(msg, true);
    input.value = '';
    showTyping();

    try {
        // Chama a API que criamos acima
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg })
        });

        const data = await response.json();
        hideTyping();

        // Aqui você processaria a resposta da IA
        // A API da Claude retorna a resposta em data.content[0].text
        if (data.content && data.content[0]) {
            const aiResponse = data.content[0].text;
            addMessage(aiResponse, false);
            
            // Lógica extra: Se a IA sugerir criar tarefa (baseado no prompt do sistema), você adiciona aqui
        }
    } catch (error) {
        hideTyping();
        addMessage('Desculpe, tive um erro ao processar sua mensagem.', false);
        console.error(error);
    }
}