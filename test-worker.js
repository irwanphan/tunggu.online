// Test script to simulate Cloudflare Worker
const sites = [
  { name: "DPR RI", url: "https://dpr.go.id" },
  { name: "POLRI", url: "https://polri.go.id" },
  { name: "Kemenkeu", url: "https://kemenkeu.go.id" }
];

async function testWorker() {
  for (const site of sites) {
    const start = Date.now();
    let status = "Offline";
    
    try {
      const res = await fetch(site.url, { method: "HEAD" });
      status = res.ok ? "Online" : "Offline";
    } catch (err) {
      status = "Offline";
    }
    
    const responseTime = Date.now() - start;
    
    // Send to our API
    try {
      const apiResponse = await fetch("http://localhost:5699/api/gov-monitoring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: site.name,
          url: site.url,
          status: status,
          responseTime: responseTime
        })
      });
      
      const result = await apiResponse.json();
      console.log(`Site: ${site.name}`);
      console.log(`Status: ${status}`);
      console.log(`Response Time: ${responseTime}ms`);
      console.log(`API Result:`, result);
      console.log('---');
    } catch (error) {
      console.error(`Error sending data for ${site.name}:`, error);
    }
  }
}

// Run the test
testWorker(); 