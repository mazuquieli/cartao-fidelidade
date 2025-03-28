// Elementos do DOM
const clientIdInput = document.getElementById("client-id");
const searchButton = document.getElementById("search-button");
const clientName = document.getElementById("client-name");
const clientSince = document.getElementById("client-since");
const cardIdNumber = document.getElementById("card-id-number");
const cutsRemaining = document.getElementById("cuts-remaining");
const cutsCompleted = document.getElementById("cuts-completed");
const cutsNeeded = document.getElementById("cuts-needed");
const totalCuts = document.getElementById("total-cuts");
const appointmentList = document.getElementById("appointment-list");
const progressFill = document.querySelector(".progress-fill");

// Função para exibir cartão de um cliente
function displayClientInfo(clientId) {
  // Encontra o cliente pelo ID
  const client = clientsData.clients.find((c) => c.id === clientId);

  if (!client) {
    alert("Cliente não encontrado. Por favor, verifique o número do cartão.");
    return;
  }

  // Atualiza informações do cliente
  clientName.textContent = client.name;
  clientSince.textContent = `Cliente desde ${client.clientSince}`;
  cardIdNumber.textContent = `ID: 124-537-835-${clientId}30`;

  // Atualiza informações do cartão fidelidade
  cutsRemaining.textContent = client.loyaltyCard.cutsRemaining;
  cutsCompleted.textContent = client.loyaltyCard.totalCuts;
  cutsNeeded.textContent = client.loyaltyCard.cutsNeeded;
  totalCuts.textContent = `${client.loyaltyCard.totalCuts} cortes`;

  // Atualiza a barra de progresso
  const progressPercentage =
    (client.loyaltyCard.totalCuts / client.loyaltyCard.cutsNeeded) * 100;
  progressFill.style.width = `${progressPercentage}%`;

  // Atualiza os carimbos do cartão
  updateStamps(client.loyaltyCard.totalCuts, client.loyaltyCard.cutsNeeded);

  // Limpa e atualiza o histórico de agendamentos
  appointmentList.innerHTML = "";
  client.appointmentHistory.forEach((appointment) => {
    const listItem = document.createElement("li");
    listItem.className = "history-item";

    listItem.innerHTML = `
      <div class="history-date">
        <div>${appointment.date}</div>
        <div class="history-time">${appointment.time}</div>
      </div>
      <div class="history-check">
        <img src="assets/check-circle.svg" alt="Concluído" />
      </div>
    `;

    appointmentList.appendChild(listItem);
  });
}

// Função para atualizar os carimbos do cartão fidelidade
function updateStamps(completedCuts, totalNeeded) {
  const stamps = document.querySelectorAll(".stamp:not(.gift)");

  // Reset all stamps first
  stamps.forEach((stamp) => {
    stamp.className = "stamp";
    stamp.innerHTML = "";
  });

  // Atualiza selos com base nos cortes completados
  for (let i = 0; i < completedCuts && i < stamps.length; i++) {
    stamps[i].className = "stamp active";
    stamps[i].innerHTML =
      '<img src="assets/check.svg" alt="Corte concluído" />';
  }
}

// Evento de clique no botão de busca
searchButton.addEventListener("click", () => {
  const clientId = clientIdInput.value.trim();
  if (clientId) {
    displayClientInfo(clientId);
  } else {
    alert("Por favor, insira um número de cartão válido.");
  }
});

// Evento de pressionar Enter no campo de busca
clientIdInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchButton.click();
  }
});

// Carrega o primeiro cliente ao iniciar a página
window.addEventListener("DOMContentLoaded", () => {
  displayClientInfo("1");
});
