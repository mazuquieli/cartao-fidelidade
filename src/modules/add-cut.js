// add-cut.js - Handles adding new cuts to a client's loyalty card

document.addEventListener("DOMContentLoaded", function () {
  // This function would be called when a new cut is registered
  // For example, through a button click or form submission

  window.registerNewCut = function (clientId) {
    if (!clientId) {
      // Try to get client ID from URL if not provided
      clientId = new URLSearchParams(window.location.search).get("id");
    }

    if (!clientId) {
      alert("Por favor, busque um cliente primeiro.");
      return;
    }

    // Get current date and time
    const now = new Date();
    const dateString = now.toLocaleDateString("pt-BR");
    const timeString = now.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Show loading indicator
    document.body.classList.add("loading");

    // Add the new cut via API
    API.addAppointment(clientId, dateString, timeString)
      .then((updatedClient) => {
        // Remove loading indicator
        document.body.classList.remove("loading");

        // Update UI with new client data
        updateLoyaltyCard(updatedClient);
        updateAppointmentHistory(updatedClient);

        // Show success message
        showNotification("Corte registrado com sucesso!", "success");

        // Check if client earned a free cut
        if (
          updatedClient.loyaltyCard.cutsRemaining ===
          updatedClient.loyaltyCard.cutsNeeded
        ) {
          showNotification("Cliente ganhou um corte grátis!", "success");
        }
      })
      .catch((error) => {
        // Remove loading indicator
        document.body.classList.remove("loading");

        // Show error message
        showNotification(error.message || "Erro ao registrar corte.", "error");
      });
  };

  // Helper function to show notifications
  function showNotification(message, type = "info") {
    // Check if notification container exists, create if not
    let notificationContainer = document.getElementById(
      "notification-container"
    );

    if (!notificationContainer) {
      notificationContainer = document.createElement("div");
      notificationContainer.id = "notification-container";
      notificationContainer.style.position = "fixed";
      notificationContainer.style.top = "20px";
      notificationContainer.style.right = "20px";
      notificationContainer.style.zIndex = "1000";
      document.body.appendChild(notificationContainer);
    }

    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Style the notification
    notification.style.padding = "10px 20px";
    notification.style.marginBottom = "10px";
    notification.style.borderRadius = "5px";
    notification.style.backgroundColor =
      type === "success" ? "#4caf50" : "#f44336";
    notification.style.color = "white";
    notification.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";

    // Add to container
    notificationContainer.appendChild(notification);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transition = "opacity 0.5s";

      setTimeout(() => {
        notification.remove();

        // Remove container if empty
        if (notificationContainer.children.length === 0) {
          notificationContainer.remove();
        }
      }, 500);
    }, 3000);
  }
});
