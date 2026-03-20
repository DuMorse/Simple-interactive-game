function horario(){
    const hora = document.getElementById('hora');
    const agora = new Date();
    const hh = String(agora.getHours()).padStart(2,'0');
    const mm = String(agora.getMinutes()).padStart(2, '0');
    hora.textContent = `${hh}:${mm}`;
}
setInterval(horario,1000); horario();

 const salvar = document.getElementById("salvar");
  const codigo = document.getElementById("codigo");
  const msg = document.getElementById("mensagem");
  const fim = document.getElementById("fim");
let apagar = false;

  salvar.addEventListener("click", () => {
    const texto = codigo.value;
    if (texto.includes("/head") && !texto.includes("hed")) {
      msg.style.color = "#90ee90";
      msg.textContent = "Código corrigido com sucesso! VS Code pode ser fechado.";
      tarefaFinalizada();
      
    } else {
      msg.style.color = "#ffb4b4";
      msg.textContent = "Erro: o evento ainda está escrito errado. Corrija 'onlcik' para 'onclick'.";
    }
  });

  
window.addEventListener("load", () => {
  const pcID = 3;

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
