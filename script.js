import { db, collection, addDoc, serverTimestamp } from "./firebase.js";

// AI Insight function with probability and suggestions
function getAIInsight(vehicle, day, time) {
    const hour = parseInt(time.split(":")[0]);
    let message = "✅ Parking conditions appear normal. Availability is likely.";
    let probability = 80; // default probability

    // Weekend evening rush
    if (day === "Weekend" && hour >= 18) {
        message = "🚦 High demand expected due to weekend evening rush.";
        probability = 30;
    }
    // Morning peak hours
    else if (hour >= 9 && hour <= 11) {
        message = "🧠 Morning peak hours detected. Parking turnover may be slow.";
        probability = 50;
    }
    // Evening car congestion
    else if (vehicle.toLowerCase() === "car" && hour >= 17) {
        message = "🤖 Car parking demand increases in the evening. Two-wheelers may find slots faster.";
        probability = 40;
    }

    // Suggest early arrival if probability is low
    if (probability < 60) {
        message += " ⏰ Suggest arriving 15-20 minutes earlier to secure a spot.";
    }

    return `${message} (Availability probability: ${probability}%)`;
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
        } else {
            result.innerText = "❌ Reservation canceled by user";
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
}

