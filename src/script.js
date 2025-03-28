import { cardsFetch, scheduleFetchByDay } from "./services/courteous-fech";

// Elementos do DOM
const cardIdInput = document.getElementById("card-id");
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
async function displayClientInfo(cardId) {
  const client = await cardsFetch(cardId);

  if (!client) {
    alert("Cliente não encontrado. Por favor, verifique o número do cartão.");
    return;
  }

  clientName.textContent = client.name;
  clientSince.textContent = `Cliente desde ${client.clientSince}`;
  cardIdNumber.textContent = `ID: ${client.id}`;

  cutsRemaining.textContent = client.loyaltyCard.cutsRemaining;
  cutsCompleted.textContent = client.loyaltyCard.totalCuts;
  cutsNeeded.textContent = client.loyaltyCard.cutsNeeded;
  totalCuts.textContent = `${client.loyaltyCard.totalCuts} cortes`;

  const progressPercentage =
    (client.loyaltyCard.totalCuts / client.loyaltyCard.cutsNeeded) * 100;
  progressFill.style.width = `${progressPercentage}%`;

  client.loyaltyCard.totalCuts === client.loyaltyCard.cutsNeeded &&
    alert("Parabéns! Seu próximo corte é gratuito!");

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
        <img src="./src/assets/vector1.svg" alt="Concluído" />
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
    console.log("Resetting stamp:", stamp);
    stamp.className = "stamp";
    stamp.innerHTML = "";
  });

  // Atualiza selos com base nos cortes completados
  for (let i = 0; i < completedCuts && i < stamps.length; i++) {
    stamps[i].className = "stamp active";
  }
}

// Evento de clique no botão de busca
searchButton.addEventListener("click", () => {
  const cardId = cardIdInput.value.trim();
  console.log("Card ID:", cardId);
  if (cardId) {
    displayClientInfo(cardId);
  } else {
    alert("Por favor, insira um número de cartão válido.");
  }
});

// Evento de pressionar Enter no campo de busca
cardIdInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchButton.click();
  }
});

// Carrega o primeiro cliente ao iniciar a página
window.addEventListener("DOMContentLoaded", () => {
  displayClientInfo("1");
});
