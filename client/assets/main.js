console.log("JS Loaded");

const API_BASE_URL = "https://drug-backend-lovh.onrender.com";

// ================= COMMON =================
const setMessage = (el, msg, type = "success") => {
  if (!el) return;
  el.className = `result-box ${type}`;
  el.textContent = msg;
};

const showLoading = (el, text = "Loading...") => {
  if (!el) return;
  el.className = "result-box success";
  el.innerHTML = `<span class="loading"></span>${text}`;
};

const getQueryParam = (param) => {
  return new URLSearchParams(window.location.search).get(param);
};

const getHashParam = (param) => {
  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;
  return new URLSearchParams(hash).get(param);
};

const getDrugNameFromPath = () => {
  const parts = window.location.pathname.split("/").filter(Boolean);
  if (!parts.length) return null;

  const lastPart = decodeURIComponent(parts[parts.length - 1]);
  if (!lastPart) return null;

  if (lastPart.toLowerCase() !== "drug" && lastPart.toLowerCase() !== "drug.html") {
    return lastPart;
  }

  return null;
};

const saveLastDrugName = (name) => {
  try {
    if (name && name.trim()) {
      sessionStorage.setItem("lastDrugName", name.trim());
    }
  } catch {}
};

const getLastDrugName = () => {
  try {
    return sessionStorage.getItem("lastDrugName");
  } catch {
    return null;
  }
};

// ================= RENDER =================
const renderDrugCards = (drugs, container) => {
  if (!container) return;

  container.innerHTML = drugs.map(d => `
    <article class="drug-card">
      <h3>${d.name}</h3>
      <p>${d.usage}</p>
      <a href="./drug.html?name=${encodeURIComponent(d.name)}">View details</a>
    </article>
  `).join("");
};

// ================= API =================
const fetchDrugByName = async (name) => {
  const res = await fetch(`${API_BASE_URL}/drugs/${encodeURIComponent(name.trim())}`);
  if (!res.ok) throw new Error("Drug not found");

  const data = await res.json();
  if (!data.success) throw new Error("Drug not found");

  return data.data;
};

const checkInteraction = async (drug1, drug2) => {
  const res = await fetch(`${API_BASE_URL}/interactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ drug1, drug2 })
  });

  const data = await res.json();
  if (!data.success) throw new Error("Interaction error");

  return data;
};

// ================= HOME =================
const initHomePage = () => {
  const btn = document.getElementById("homeSearchBtn");
  const input = document.getElementById("homeSearchInput");

  if (btn && input) {
    btn.onclick = () => {
      const val = input.value.trim();
      if (!val) return;

      saveLastDrugName(val);
      window.location.href = `./drug.html?name=${encodeURIComponent(val)}`;
    };
  }

  const checkBtn = document.getElementById("checkInteractionBtn");

  if (checkBtn) {
    checkBtn.onclick = async () => {
      const d1 = document.getElementById("drug1").value.trim();
      const d2 = document.getElementById("drug2").value.trim();
      const resultBox = document.getElementById("interactionResult");

      if (!d1 || !d2) {
        setMessage(resultBox, "Enter both drugs", "error");
        return;
      }

      try {
        showLoading(resultBox);

        const res = await checkInteraction(d1, d2);

        if (!res.hasInteraction) {
          setMessage(resultBox, res.message, "success");
        } else {
          setMessage(resultBox, `⚠ ${res.severity}: ${res.message}`, "error");
        }
      } catch (err) {
        setMessage(resultBox, err.message, "error");
      }
    };
  }
};

// ================= SEARCH =================
const initSearchPage = () => {
  const input = document.getElementById("searchInput");
  const btn = document.getElementById("searchBtn");
  const container = document.getElementById("searchResults");
  const message = document.getElementById("searchMessage");

  if (!input || !btn || !container) return;

  const runSearch = async () => {
    const q = input.value.trim();

    if (!q) {
      container.innerHTML = "";
      setMessage(message, "Please enter a drug name to search.", "error");
      return;
    }

    try {
      showLoading(message, "Searching...");

      const drug = await fetchDrugByName(q);

      renderDrugCards([drug], container);
      setMessage(message, "Result found!", "success");

    } catch (err) {
      container.innerHTML = "";
      setMessage(message, "No drugs found for your search.", "error");
    }
  };

  btn.onclick = runSearch;

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") runSearch();
  });
};

// ================= DETAILS =================
const initDrugDetailsPage = async () => {
  const el = document.getElementById("detailsContent");
  if (!el) return;

  const name =
    getQueryParam("name") ||
    getHashParam("name") ||
    getDrugNameFromPath() ||
    getLastDrugName();

  if (!name) {
    el.innerHTML = "<p>No drug name provided</p>";
    return;
  }

  try {
    showLoading(el);

    const drug = await fetchDrugByName(name);

    el.innerHTML = `
      <h3>${drug.name}</h3>
      <p><strong>Usage:</strong> ${drug.usage}</p>
      <p><strong>Dosage:</strong> ${drug.dosage}</p>
      <p><strong>Side Effects:</strong></p>
      <ul>${(drug.sideEffects || []).map(e => `<li>${e}</li>`).join("")}</ul>
      <p><strong>Warnings:</strong></p>
      <ul>${(drug.warnings || []).map(w => `<li>${w}</li>`).join("")}</ul>
    `;
  } catch (err) {
    el.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
};

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  initHomePage();
  initSearchPage();
  initDrugDetailsPage();
});