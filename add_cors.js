import fetch from 'node-fetch';
async function run() {
  const res = await fetch('https://api.sanity.io/v1/projects/b6pkfjxp/cors', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.VITE_SANITY_WRITE_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      origin: 'http://localhost:5173',
      allowCredentials: true
    })
  });
  const data = await res.json();
  console.log(data);
}
run();
