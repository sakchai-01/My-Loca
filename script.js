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

  navigator.geolocation.getCurrentPosition(async function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    output.innerHTML = `
      <strong>👤 Name:</strong> ${name}<br>
      <strong>Latitude:</strong> ${latitude}<br>
      <strong>Longitude:</strong> ${longitude}<br>
      <em>Sending data to Discord...</em>
    `;

    try {
      await sendToDiscord(name, latitude, longitude);
      output.innerHTML += `<br><strong>✅ ส่งเข้า Discord เรียบร้อยแล้ว!</strong>`;
    } catch(err) {
      output.innerHTML += `<br><strong>❌ ส่งข้อมูลล้มเหลว: ${err.message}</strong>`;
      console.error(err);
    }

  }, function error() {
    output.textContent = 'ไม่สามารถเข้าถึงพิกัดได้ 😥';
  });
});

async function sendToDiscord(name, lat, lng) {
  const webhookURL = "https://discord.com/api/webhooks/1391646097528717322/D3VW1hQsPPUiEFE9lTwhjfXaDyf2qLHaf9rWGPOSTcCEzaY1OuNNGdUyirbpimBPOlzI";

  const safeName = name.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const content = {
    content: `📥 **New Location Received**\n👤 Name: ${safeName}\n🌐 Lat: ${lat}\n🌐 Lng: ${lng}\n🗺️ https://maps.google.com/?q=${lat},${lng}`
  };

  const res = await fetch(webhookURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(content)
  });

  if (!res.ok) throw new Error(`Status ${res.status}`);
}
