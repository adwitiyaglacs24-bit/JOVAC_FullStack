console.log("JS Loaded Successfully");
const API_KEY = "xxxxxx";
const MODEL = "llama-3.3-70b-versatile";
const reportFile = document.getElementById("reportFile");
const analyzeBtn = document.getElementById("analyzeBtn");
const loading = document.getElementById("loading");
const reportSummary = document.getElementById("reportSummary");
const questionInput = document.getElementById("questionInput");
const askBtn = document.getElementById("askBtn");
const aiResponse = document.getElementById("aiResponse");
const dashboard = document.getElementById("dashboard");
const dailyTip = document.getElementById("dailyTip");
const healthStatus = document.getElementById("healthStatus");
const riskStatus = document.getElementById("riskStatus");
const emergencyStatus = document.getElementById("emergencyStatus");
let extractedText = "";

async function readPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({
    data: arrayBuffer,
  }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item) => item.str);
    text += strings.join(" ") + "\n";
  }
  return text;
}

analyzeBtn.addEventListener("click", async () => {
  analyzeBtn.disabled = true;
  console.log("Button clicked");
  if (reportFile.files.length === 0) {
    alert("Please upload a PDF.");
    return;
  }
  loading.classList.remove("hidden");
  const file = reportFile.files[0];
  extractedText = await readPDF(file);
  console.log("Extracted Text:");
  console.log(extractedText);
  await analyzeReport(extractedText);
  loading.classList.remove("hidden");
  loading.innerHTML = "🧠 Extracting report...";
  setTimeout(() => {
    loading.innerHTML = "📊 Analyzing medical values...";
  }, 1200);
  setTimeout(() => {
    loading.innerHTML = "🤖 Generating AI insights...";
  }, 2500);
  analyzeBtn.disabled = false;
});

async function analyzeReport(text) {
  console.log("Sending request to Groq...");
  const prompt = `
You are an experienced AI Health Assistant.
Analyze ONLY the uploaded medical report.
If the uploaded document is NOT a medical report or prescription, reply ONLY with:
This does not appear to be a valid medical report.
Please upload a genuine medical report or prescription.
Otherwise generate your response in Markdown format using the exact headings below.
# Health Report Summary
Give a short overview of the patient's condition in simple English.
# Overall Health Status
Mention whether the report indicates:
- Excellent
- Good
- Fair
- Needs Medical Attention
Explain why.
# ⚠ Risk Analysis
Mention possible health risks ONLY if they are supported by the report.
If none exist, write:
No significant risks detected.
# Emergency Alert
If any value suggests an emergency,
clearly mention it.
Otherwise write:
No emergency indicators detected.
# Medicines Mentioned
List medicines found in the report.
If none are mentioned write:
No medicines mentioned.
# Diet Recommendations
Suggest diet recommendations based ONLY on the report.
# Lifestyle Recommendations
Suggest healthy lifestyle improvements.
# Today's Health Tip
Give ONE practical health tip related to this report.
# Medical Disclaimer
Clearly state that:
This AI-generated analysis is for informational purposes only.
Do not rely solely on AI for medical decisions.
Always consult a qualified healthcare professional before making any diagnosis, treatment, or medication changes.
Medical Report:
${text}
`;
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + API_KEY,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    },
  );
  console.log(response.status);
  const data = await response.json();
  console.log(data);
  if (!response.ok) {
    reportSummary.innerHTML = data.error.message;
    return;
  }
  reportSummary.innerHTML = marked.parse(data.choices[0].message.content);
  const report = data.choices[0].message.content.toLowerCase();

  if (report.includes("excellent")) {
    healthStatus.innerHTML = "<span class='good'>🟢 Excellent</span>";
  } else if (report.includes("good")) {
    healthStatus.innerHTML = "<span class='good'>🟢 Good</span>";
  } else if (report.includes("fair")) {
    healthStatus.innerHTML = "<span class='warning'>🟡 Fair</span>";
  } else {
    healthStatus.innerHTML =
      "<span class='danger'>🔴 Needs Medical Attention</span>";
  }

  if (report.includes("no significant risks")) {
    riskStatus.innerHTML = "<span class='good'>Low Risk</span>";
  } else {
    riskStatus.innerHTML = "<span class='warning'>Risk Detected</span>";
  }

  if (report.includes("no emergency indicators")) {
    emergencyStatus.innerHTML = "<span class='good'>No Emergency</span>";
  } else {
    emergencyStatus.innerHTML =
      "<span class='danger'>Immediate Attention</span>";
  }
}

askBtn.addEventListener("click", async () => {
  askBtn.disabled = true;
  const question = questionInput.value.trim();
  if (question === "") {
    return;
  }
  aiResponse.innerHTML = "Thinking...";
  const prompt = `
You are an AI Medical Assistant.
Use ONLY the uploaded report to answer.
If the answer is not available in the report,
say:
"I couldn't find that information in the uploaded report."
Do not guess.
Do not invent medical information.
At the end of every answer write:
"⚕ Please consult a healthcare professional before making any medical decisions."
Medical Report:
${extractedText}
Question:
${question}
`;
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + API_KEY,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    },
  );
  const data = await response.json();
  aiResponse.innerHTML = marked.parse(data.choices[0].message.content);
  askBtn.disabled = false;
});
const tips = [
  "💧 Drink at least 2-3 litres of water daily.",
  "🥗 Eat more fresh fruits and vegetables.",
  "🚶 Walk for at least 30 minutes every day.",
  "😴 Sleep 7-8 hours for better recovery.",
  "🧘 Reduce stress through meditation or yoga.",
  "🚭 Avoid smoking and limit alcohol intake.",
  "🩺 Schedule regular health checkups.",
  "🍎 Reduce processed sugar in your diet.",
];
function showDailyTip() {
  const random = Math.floor(Math.random() * tips.length);
  dailyTip.innerHTML = tips[random];
}
showDailyTip();