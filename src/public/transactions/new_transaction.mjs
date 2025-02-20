const new_transaction = async (payload) => {
    try {
      const response = await fetch("http://localhost:3001/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }
  
      const data = await response.json();
  
      console.log("Resposta do servidor:", data);
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
    }
  };
  
  export default new_transaction
  