// loyalty-card.js - Handles loyalty card visualization

// Function to update the loyalty card stamps based on client data
function updateLoyaltyStamps(loyaltyCardData) {
  const stampContainer = document.querySelector(".card-stamps");
  stampContainer.innerHTML = "";

  const totalNeeded = loyaltyCardData.cutsNeeded;
  const completed = loyaltyCardData.totalCuts % totalNeeded || 0;

  // Create a stamp for each slot in the loyalty card
  for (let i = 0; i < totalNeeded; i++) {
    const stamp = document.createElement("div");

    // Last stamp is the gift stamp
    if (i === totalNeeded - 1) {
      stamp.className = "stamp gift";
      stamp.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-gift">
                  <polyline points="20 12 20 22 4 22 4 12"></polyline>
                  <rect x="2" y="7" width="20" height="5"></rect>
                  <line x1="12" y1="22" x2="12" y2="7"></line>
                  <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
                  <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
              </svg>
          `;
    } else {
      // Regular stamp
      stamp.className = i < completed ? "stamp active" : "stamp";
      stamp.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check">
                  <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
          `;
    }

    stampContainer.appendChild(stamp);
  }
}

// Function to add a new cut to the loyalty card (with animation)
function addNewCut(clientId) {
  // Get the current date and time
  const now = new Date();
  const dateString = now.toLocaleDateString("pt-BR");
  const timeString = now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Add appointment via API
  API.addAppointment(clientId, dateString, timeString)
    .then((updatedClient) => {
      // Update UI
      updateLoyaltyCard(updatedClient);
      updateAppointmentHistory(updatedClient);

      // Add animation for a new stamp
      animateNewStamp();
    })
    .catch((error) => {
      alert(error.message || "Ocorreu um erro ao adicionar um novo corte.");
    });
}

// Function to animate a new stamp being added
function animateNewStamp() {
  const stamps = document.querySelectorAll(".stamp");
  let animatedStamp = null;

  // Find the first inactive stamp
  for (let i = 0; i < stamps.length; i++) {
    if (
      !stamps[i].classList.contains("active") &&
      !stamps[i].classList.contains("gift")
    ) {
      animatedStamp = stamps[i];
      break;
    }
  }

  if (animatedStamp) {
    // Add animation class
    animatedStamp.classList.add("animating");

    // After a short delay, add the active class
    setTimeout(() => {
      animatedStamp.classList.add("active");
      animatedStamp.classList.remove("animating");
    }, 500);
  }
}
