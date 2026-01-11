import { db, collection, addDoc, serverTimestamp } from "./firebase.js";

// Function to generate random alphanumeric code
function generateReservationCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Function to assign random parking number (e.g., 1–50)
function generateParkingNumber() {
  return Math.floor(Math.random() * 50) + 1;
}

window.confirmReservation = async function () {
  const vehicleNumber = document.getElementById("vehicleNumber").value;
  const result = document.getElementById("reserveResult");

  if (!vehicleNumber) {
    result.innerText = "❗ Please enter vehicle number";
    return;
  }

  // Generate reservation code & slot number
  const reservationCode = generateReservationCode();
  const parkingNumber = generateParkingNumber();

  try {
    await addDoc(collection(db, "reservations"), {
      vehicleNumber: vehicleNumber,
      location: "FC Road",
      status: "CONFIRMED",
      reservationCode: reservationCode,
      parkingNumber: parkingNumber,
      createdAt: serverTimestamp()
    });

    result.innerHTML = `✅ Reservation confirmed!<br>
                        🎫 Code: <b>${reservationCode}</b><br>
                        🅿️ Parking Slot: <b>${parkingNumber}</b>`;
    console.log("✅ Reservation saved:", reservationCode, parkingNumber);

  } catch (error) {
    console.error("❌ Reservation error:", error);
    result.innerText = "❌ Failed to save reservation";
  }
}