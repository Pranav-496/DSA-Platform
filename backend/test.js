const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YWJjZDEyMzQ1Njc4OTAiLCJlbWFpbCI6InRlc3RAYWxnb25vdmEuY29tIiwibmFtZSI6IlRlc3QgVXNlciJ9.mocksignature";

async function testProfileUpdate() {
  try {
    console.log("Token ends with .mocksignature:", mockToken.endsWith(".mocksignature"));
    
    const res = await fetch("http://127.0.0.1:5000/api/profile/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + mockToken,
      },
      body: JSON.stringify({ name: "Updated Name", bio: "My bio", website: "https://example.com" }),
    });

    console.log("Status:", res.status, res.statusText);
    const text = await res.text();
    console.log("Response:", text);
  } catch (e) {
    console.error("Error:", e.message);
  }
}

testProfileUpdate();
