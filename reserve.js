import { db, collection, addDoc, serverTimestamp } from "./firebase.js";

window.confirmReservation = async function () {

  const vehicleNumber = document.getElementById("vehicleNumber").value;
  const result = document.getElementById("reserveResult");

  if (!vehicleNumber) {
    result.innerText = "❗ Please enter vehicle number";
    return;
  }

  try {
    await addDoc(collection(db, "reservations"), {
      vehicleNumber: vehicleNumber,
      location: "FC Road",
      status: "CONFIRMED",
      createdAt: serverTimestamp()
    });

    result.innerText = "✅ Reservation confirmed!";
    console.log("✅ Reservation saved");

  } catch (error) {
    console.error("❌ Reservation error:", error);
    result.innerText = "❌ Failed to save reservation";
  }
}