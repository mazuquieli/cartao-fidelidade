// api.js - Simulates API communication

// Mock database from the JSON data provided
const mockDatabase = {
  clients: [
    {
      id: "1",
      name: "Natália Miranda",
      clientSince: "18/09/2023",
      appointmentHistory: [
        { date: "29/04/2024", time: "18:30" },
        { date: "16/03/2024", time: "17:00" },
        { date: "01/02/2024", time: "17:30" },
        { date: "03/01/2024", time: "15:00" },
        { date: "28/11/2023", time: "14:00" },
        { date: "23/10/2023", time: "15:00" },
      ],
      loyaltyCard: {
        totalCuts: 7,
        cutsNeeded: 10,
        cutsRemaining: 3,
      },
    },
    {
      id: "2",
      name: "Capitão Nascimento",
      clientSince: "12/04/2023",
      appointmentHistory: [
        { date: "01/05/2024", time: "10:00" },
        { date: "12/02/2024", time: "09:00" },
        { date: "30/12/2023", time: "11:00" },
        { date: "05/11/2023", time: "10:30" },
      ],
      loyaltyCard: {
        totalCuts: 4,
        cutsNeeded: 10,
        cutsRemaining: 6,
      },
    },
    {
      id: "3",
      name: "Sansão",
      clientSince: "15/07/2023",
      appointmentHistory: [
        { date: "22/04/2024", time: "16:00" },
        { date: "18/03/2024", time: "16:30" },
        { date: "24/01/2024", time: "17:45" },
        { date: "20/12/2023", time: "15:15" },
      ],
      loyaltyCard: {
        totalCuts: 5,
        cutsNeeded: 8,
        cutsRemaining: 3,
      },
    },
  ],
};

// API functions
const API = {
  // Get client by ID
  getClientById: function (id) {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        const client = mockDatabase.clients.find((c) => c.id === id);

        if (client) {
          // Format the client data for display
          const formattedClient = {
            ...client,
            cardId: `124-537-835-${id.padStart(3, "0")}`, // Generate a fake card ID
          };
          resolve(formattedClient);
        } else {
          reject(new Error("Cliente não encontrado"));
        }
      }, 300);
    });
  },

  // Add a new appointment (haircut)
  addAppointment: function (clientId, date, time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const clientIndex = mockDatabase.clients.findIndex(
          (c) => c.id === clientId
        );

        if (clientIndex !== -1) {
          // Add new appointment to the history
          mockDatabase.clients[clientIndex].appointmentHistory.unshift({
            date,
            time,
          });

          // Update loyalty card info
          const loyaltyCard = mockDatabase.clients[clientIndex].loyaltyCard;
          loyaltyCard.totalCuts += 1;
          loyaltyCard.cutsRemaining =
            loyaltyCard.cutsNeeded -
            (loyaltyCard.totalCuts % loyaltyCard.cutsNeeded);

          // If cutsRemaining becomes 0, it means they get a free haircut
          if (loyaltyCard.cutsRemaining === 0) {
            loyaltyCard.cutsRemaining = loyaltyCard.cutsNeeded;
          }

          resolve(mockDatabase.clients[clientIndex]);
        } else {
          reject(new Error("Cliente não encontrado"));
        }
      }, 300);
    });
  },
};
