// form.js - Handles the search form functionality

document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.getElementById("search-form");
  const cardIdInput = document.getElementById("card-id");

  // Handle form submission
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const cardId = cardIdInput.value.trim();

    if (cardId) {
      // Show loading state (could add a spinner here)
      document.body.classList.add("loading");

      // Get client data from API
      API.getClientById(cardId)
        .then((client) => {
          // Clear loading state
          document.body.classList.remove("loading");

          // Update UI with client data
          updateClientInfo(client);
          updateLoyaltyCard(client);
          updateAppointmentHistory(client);

          // Show previously hidden sections
          document.getElementById("client-info").classList.remove("hidden");
          document.getElementById("loyalty-card").classList.remove("hidden");
          document
            .getElementById("appointment-history")
            .classList.remove("hidden");
        })
        .catch((error) => {
          // Clear loading state
          document.body.classList.remove("loading");

          // Show error message
          alert(
            error.message || "Ocorreu um erro ao buscar os dados do cliente."
          );

          // Hide sections if previously shown
          document.getElementById("client-info").classList.add("hidden");
          document.getElementById("loyalty-card").classList.add("hidden");
          document
            .getElementById("appointment-history")
            .classList.add("hidden");
        });
    }
  });

  // Functions to update UI elements
  function updateClientInfo(client) {
    document.getElementById("client-name").textContent = client.name;
    document.getElementById(
      "client-since"
    ).textContent = `Cliente desde ${client.clientSince}`;
    // Could also update avatar if we had real avatars
  }

  function updateLoyaltyCard(client) {
    // Update card ID display
    document.getElementById(
      "card-id-display"
    ).textContent = `ID: ${client.cardId}`;

    // Update loyalty card stamps
    updateLoyaltyStamps(client.loyaltyCard);

    // Update cuts remaining info
    document.getElementById("cuts-remaining-count").textContent =
      client.loyaltyCard.cutsRemaining;
    document.getElementById("progress-text").textContent = `${
      client.loyaltyCard.totalCuts % client.loyaltyCard.cutsNeeded ||
      client.loyaltyCard.cutsNeeded
    } de ${client.loyaltyCard.cutsNeeded}`;

    // Update progress bar
    const progressPercentage =
      ((client.loyaltyCard.totalCuts % client.loyaltyCard.cutsNeeded) /
        client.loyaltyCard.cutsNeeded) *
      100;
    document.getElementById(
      "progress-bar"
    ).style.width = `${progressPercentage}%`;
  }

  function updateAppointmentHistory(client) {
    document.getElementById(
      "total-cuts"
    ).textContent = `${client.loyaltyCard.totalCuts} cortes`;

    // Get the history list container
    const historyList = document.getElementById("history-list");
    historyList.innerHTML = "";

    // Add each appointment to the history list
    client.appointmentHistory.forEach((appointment) => {
      const historyItem = document.createElement("div");
      historyItem.className = "history-item";

      historyItem.innerHTML = `
              <div class="history-info">
                  <div class="history-date">${appointment.date}</div>
                  <div class="history-time">${appointment.time}</div>
              </div>
              <div class="history-check">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
              </div>
          `;

      historyList.appendChild(historyItem);
    });
  }
});
