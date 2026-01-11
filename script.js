import { db, collection, addDoc, serverTimestamp } from "./firebase.js";

function getAIInsight(vehicle, day, time) {
    const hour = parseInt(time.split(":")[0]);

    if (day === "Weekend" && hour >= 18) {
        return "🚦 AI Insight: High parking demand expected due to weekend evening rush. Consider arriving earlier.";
    }

    if (hour >= 9 && hour <= 11) {
        return "🧠 AI Insight: Morning peak hours detected. Parking turnover may be slow.";
    }

    if (vehicle === "Car" && hour >= 17) {
        return "🤖 AI Insight: Car parking demand increases in the evening. Two-wheelers may find slots faster.";
    }

    return "✅ AI Insight: Parking conditions appear normal. Availability is likely.";
}

window.checkParking = async function () {

  const vehicle = document.getElementById("vehicle").value;
  const location = document.getElementById("location").value;
  const day = document.getElementById("day").value;
  const time = document.getElementById("time").value;
  const result = document.getElementById("result");

  if (!time) {
    result.innerText = "❗ Please select a time";
    return;
  }

  const hour = parseInt(time.split(":")[0]);
  let status = "";

  if (day === "Weekend" && hour >= 17 && hour <= 21) {
    status = "FULL";
    result.innerText = "🚫 Parking is FULL";
  } 
  else if (hour >= 10 && hour <= 13) {
    status = "ALMOST FULL";
    result.innerText = "⚠️ Parking almost full";
  } 
  else {
    status = "AVAILABLE";
    result.innerText = "✅ Parking available";

    // ✅ CONFIRMATION POPUP
    const proceed = window.confirm(
      "Parking is available.\n\nDo you want to proceed to reservation?"
    );

    if (proceed) {
      window.location.href = "reserve.html";
    }
  }

  // AI Insight
  const aiMessage = getAIInsight(vehicle, day, time);
  document.getElementById("aiResult").innerText = aiMessage;

  // Save to Firestore
  try {
    await addDoc(collection(db, "parkingChecks"), {
      vehicle,
      location,
      day,
      time,
      status,
      createdAt: serverTimestamp()
    });

    console.log("✅ Data saved");
  } catch (e) {
    console.error("❌ Firestore error", e);
  }
};

