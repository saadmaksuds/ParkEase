import { db, collection, addDoc, serverTimestamp } from "./firebase.js";

function getAIInsight(vehicle, day, time) {
    const hour = parseInt(time.split(":")[0]);

    // Weekend evening rush
    if (day === "Weekend" && hour >= 18) {
        return "🚦 AI Insight: High parking demand expected due to weekend evening rush. Consider arriving earlier.";
    }

    // Morning peak hours
    if (hour >= 9 && hour <= 11) {
        return "🧠 AI Insight: Morning peak hours detected. Parking turnover may be slow.";
    }

    // Evening car congestion
    if (vehicle === "Car" && hour >= 17) {
        return "🤖 AI Insight: Car parking demand increases in the evening. Two-wheelers may find slots faster.";
    }

    // Normal condition
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
    result.innerText = "✅ Parking available. Redirecting...";
    
    setTimeout(() => {
      window.location.href = "reserve.html";
    }, 1500);
  }

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

