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

const link = document.getElementById('link');

link.addEventListener("click", () => {
fim.style.display = "flex";
tarefaFinalizada();
fim.style.display = "none";

})


window.addEventListener("load", () => {
const pcID = 4;

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

socket.on("end", (data) => {
if (data.result === "green") {
  fim.style.backgroundColor = "green";
} else if (data.result === "red") {
  fim.style.backgroundColor = "red";
}
});


function tarefaFinalizada() {
  socket.emit("done", { id: pcID });
}

window.tarefaFinalizada = tarefaFinalizada;
});
