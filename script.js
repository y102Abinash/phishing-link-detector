async function checkURL() {
  const url = document.getElementById("urlInput").value.trim();
  const result = document.getElementById("result");
  const report = document.getElementById("report");
  const riskFill = document.getElementById("risk-fill");
  const loader = document.getElementById("loader");

  result.innerHTML = "";
  report.innerHTML = "";
  riskFill.style.width = "0%";
  loader.style.display = "block";

  const dot1 = document.getElementById("dot1");
  const dot2 = document.getElementById("dot2");

  dot1.style.animation = "moveInputToScanner 1s linear";
  dot1.style.opacity = 1;

  setTimeout(() => {
    dot1.style.opacity = 0;
    dot1.style.animation = "";

    const scannerNode = document.getElementById("scanner-node");
    scannerNode.style.animation = "pulse 1s";

    dot2.style.animation = "moveScannerToResult 1s linear";
    dot2.style.opacity = 1;

    setTimeout(() => {
      dot2.style.opacity = 0;
      dot2.style.animation = "";

      const resultNode = document.getElementById("result-node");
      resultNode.style.animation = "pulse 1s";

      setTimeout(() => {
        scannerNode.style.animation = "";
        resultNode.style.animation = "";
      }, 1000);
    }, 1000);
  }, 1000);

  const suspiciousKeywords = ["login", "secure", "account", "update", "verify", "password"];
  const found = suspiciousKeywords.filter(keyword =>
    url.toLowerCase().includes(keyword)
  );

  let riskScore = found.length * 15;
  if (riskScore > 100) riskScore = 100;
  const safeLevel = 100 - riskScore;

  riskFill.style.width = riskScore + "%";
  riskFill.style.backgroundColor = riskScore >= 70 ? "red" : (riskScore >= 30 ? "orange" : "green");

  if (found.length > 0) {
    result.innerHTML = `<div style="font-size: 13px;">⚠️ SUSPICIOUS<br>` +
      found.map(k => `🔴 Contains suspicious keyword: "<b>${k}</b>"`).join("<br>") + "</div>";
  } else {
    result.innerHTML = `<span style="color: lightgreen; font-size: 13px;">✅ Safe</span>`;
  }

  const domain = url.replace(/^https?:\/\//i, '').split('/')[0];
  const fakeDomainAge = Math.floor(Math.random() * 1000);
  const fakeRegistrar = "Simulated Registrar Inc.";
  const fakeSSL = Math.random() > 0.3;
  const fakeBlacklist = riskScore >= 80;
  const fakeSuspicious = found.length > 0;

  report.innerHTML = `
    <h3 style="color:#8cf;">🔍 Simulated Security Report</h3>
    🌐 <b>Domain:</b> ${domain}<br>
    🏢 <b>Registrar:</b> ${fakeRegistrar}<br>
    🕵️ <b>WHOIS Created:</b> ${fakeDomainAge} days ago<br>
    🔒 <b>SSL Certificate:</b> ${fakeSSL ? 'Valid ✅' : 'Not Found ❌'}<br>
    🚫 <b>Blacklisted:</b> ${fakeBlacklist ? 'Yes 🔴' : 'No 🟢'}<br>
    ⚠️ <b>Suspicious:</b> ${fakeSuspicious ? 'Yes 🔶' : 'No ✅'}<br>
    💡 <b>Risk Score:</b> ${riskScore}/100
  `;

  // Draw Line Chart with white text on dark background
  const ctx = document.getElementById('riskGraph').getContext('2d');

  if (window.riskChart) {
    window.riskChart.destroy(); // remove old chart
  }

  window.riskChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Start', 'Now'],
      datasets: [
        {
          label: 'Risk Level',
          data: [0, riskScore],
          borderColor: 'red',
          backgroundColor: 'rgba(255,0,0,0.2)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'red'
        },
        {
          label: 'Safe Level',
          data: [0, safeLevel],
          borderColor: 'lightgreen',
          backgroundColor: 'rgba(144,238,144,0.2)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'lightgreen'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            color: '#ffffff' // Y axis text color
          },
          grid: {
            color: 'rgba(255,255,255,0.1)' // Y grid color
          }
        },
        x: {
          ticks: {
            color: '#ffffff' // X axis text color
          },
          grid: {
            color: 'rgba(255,255,255,0.1)' // X grid color
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: '#ffffff' // Legend text color
          }
        }
      }
    }
  });

  loader.style.display = "none";
}
