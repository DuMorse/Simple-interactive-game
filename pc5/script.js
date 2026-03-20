function horario(){
    const hora = document.getElementById('hora');
    const agora = new Date();
    const hh = String(agora.getHours()).padStart(2,'0');
    const mm = String(agora.getMinutes()).padStart(2, '0');
    hora.textContent = `${hh}:${mm}`;
}
setInterval(horario,1000); horario();

 const btn = document.getElementById("executar");
  const statusBox = document.getElementById("status");
  const msg = document.getElementById("mensagem");

  btn.addEventListener("click", () => {
    const valor = document.getElementById("codigo").value.trim();

    if (valor === "reset_antivirus()") {
      statusBox.textContent = "✅ Status: Sistema Seguro";
      statusBox.style.color = "#070";
      statusBox.style.background = "#ccffcc";
      msg.style.color = "#070";
      msg.textContent = "Antivírus restaurado com sucesso!";
      fim.style.color = "green";
      fim.style.display = "flex";
      
    } else {
      msg.style.color = "#900";
      msg.textContent = "❌ Código incorreto. Tente novamente.";
    }
  });

  
window.addEventListener("load", () => {
  const pcID = 5;

  const socket = io("http://192.168.137.1:3000");

  socket.on("connect", () => {
    console.log("✅ Conectado ao servidor com ID:", pcID);
  });

  socket.on("disconnect", () => {
    console.log("❌ Desconectado do servidor");
  });

  socket.on("activate", (data) => {
    console.log("Recebido activate:", data);
    if (data.next === pcID) {
      fim.style.display = "none";
    } else {
      fim.style.display = "flex";
    }
  });

  function tarefaFinalizada() {
    socket.emit("done", { id: pcID });
  }

  window.tarefaFinalizada = tarefaFinalizada;
});
