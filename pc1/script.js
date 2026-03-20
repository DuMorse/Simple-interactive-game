function horario(){
    const hora = document.getElementById('hora');
    const agora = new Date();
    const hh = String(agora.getHours()).padStart(2,'0');
    const mm = String(agora.getMinutes()).padStart(2, '0');
    hora.textContent = `${hh}:${mm}`;
}
setInterval(horario,1000); horario();



let cursorEspecialAtivo = false; 

document.addEventListener("keydown", (event) => {
  if (event.key === "F4") {
    cursorEspecialAtivo = !cursorEspecialAtivo;

    if (cursorEspecialAtivo) {
      document.body.style.cursor = "url('img/xie.cur'), auto";
    } else {
      document.body.style.cursor = "url('./img/default_arrow.cur'), auto";
    }
  }
});

const textarea = document.getElementById('texto');
const botaoSalvar = document.getElementById('salvar');
const msg = document.getElementById("mensagem");
const fim = document.getElementById("fim");

const palavraChave = "start cmd"; 
let apagar = false;

botaoSalvar.addEventListener('click', () => {
  const conteudo = textarea.value.toLowerCase();

  if (conteudo.includes(palavraChave.toLowerCase())) {
      msg.style.color = "#ff0000ff";
      msg.textContent = "Executando codigo...";
      tarefaFinalizada();
       
        } else if (conteudo.trim() === "") {
      msg.style.color = "#ff0000ff";
      msg.textContent = "nota vazia";
  } else {
      msg.style.color = "#ff0000ff";
      msg.textContent = "erro: codigo invalido";
  }
});

window.addEventListener("load", () => {
  const pcID = 1;

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
