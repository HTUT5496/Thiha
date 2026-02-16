/* --- Configuration & Initialization --- */
const supabaseUrl = "https://utvivcjbmyhsmkjfqgra.supabase.co";
const supabaseKey = "sb_publishable_uih5zl6drERvSSf0AN4qmQ_MqX8SY8G";
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

let currentLang = "mm";
let activeType = "";
let activeCat = "";

const catConfig = {
  Income: {
    Salary: "fa-wallet", Bonus: "fa-gift", Investment: "fa-chart-line",
    "Mote Pho": "fa-cookie", TransferIn: "fa-arrow-down-left",
    Gift: "fa-hand-holding-heart", Other: "fa-plus",
  },
  Expense: {
    Food: "fa-utensils", Shopping: "fa-bag-shopping", Bill: "fa-credit-card",
    TransferOut: "fa-arrow-up-right", Travel: "fa-car",
    Health: "fa-heart-pulse", Other: "fa-tags",
  },
};

const langData = {
  mm: {
    income: "ဝင်ငွေ", expense: "အသုံးစရိတ်", balance: "လက်ကျန်",
    incTitle: "ဝင်ငွေ အမျိုးအစားများ", expTitle: "အသုံးစရိတ် အမျိုးအစားများ",
    viewInc: "ဝင်ငွေမှတ်တမ်း ကြည့်ရန်", viewExp: "အသုံးစရိတ်မှတ်တမ်း ကြည့်ရန်",
    modalTitle: "စာရင်းအသစ်", modalSave: "သိမ်းဆည်းမည်",
    placeAmt: "ပမာဏ", placeNotes: "မှတ်စု", cancel: "မလုပ်တော့ပါ",
    greet: "မင်္ဂလာပါ", logout: "ထွက်ရန်",
    Salary: "လစာ", Bonus: "ဆုကြေး", Investment: "ရင်းနှီးမြှုပ်နှံမှု",
    "Mote Pho": "မုန့်ဖိုး", TransferIn: "လွှဲဝင်ငွေ", Gift: "လက်ဆောင်",
    Food: "စားစရိတ်", Shopping: "ဝယ်ယူမှု", Bill: "ဘေလ်/မီတာ",
    TransferOut: "လွှဲထွက်ငွေ", Travel: "ခရီးစရိတ်", Health: "ကျန်းမာရေး", Other: "အခြား",
  },
  en: {
    income: "Income", expense: "Expense", balance: "Balance",
    incTitle: "Income Sources", expTitle: "Expense Categories",
    viewInc: "View Income History", viewExp: "View Expense History",
    modalTitle: "New Transaction", modalSave: "Save Record",
    placeAmt: "Amount", placeNotes: "Notes", cancel: "Cancel",
    greet: "Mingalarpar", logout: "Logout",
    Salary: "Salary", Bonus: "Bonus", Investment: "Invest",
    "Mote Pho": "Mote Pho", TransferIn: "Transfer In", Gift: "Gift",
    Food: "Food", Shopping: "Shopping", Bill: "Bill",
    TransferOut: "Transfer Out", Travel: "Travel", Health: "Health", Other: "Other",
  },
};

/* --- UI Logic --- */
function toggleProfileDropdown() {
  document.getElementById("logout-dropdown").classList.toggle("active");
}

window.onclick = function (event) {
  if (!event.target.closest("#profile-trigger")) {
    const dropdown = document.getElementById("logout-dropdown");
    if (dropdown && dropdown.classList.contains("active")) {
      dropdown.classList.remove("active");
    }
  }
};

function switchSection(type) {
  document.getElementById("income-section").classList.toggle("section-hidden", type !== "income");
  document.getElementById("expense-section").classList.toggle("section-hidden", type !== "expense");
  document.getElementById("tab-inc-head").classList.toggle("active", type === "income");
  document.getElementById("tab-exp-head").classList.toggle("active", type === "expense");
}

function renderButtons() {
  const createGrid = (type, target) => {
    const container = document.getElementById(target);
    container.innerHTML = "";
    Object.keys(catConfig[type]).forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = `cat-btn ${type === "Income" ? "inc-btn" : "exp-btn"}`;
      btn.onclick = () => openModal(type, cat);
      btn.innerHTML = `<div class="icon-box"><i class="fa-solid ${catConfig[type][cat]}"></i></div>
        <div class="cat-info">
          <span class="cat-label">${langData[currentLang][cat] || cat}</span>
          <span class="cat-val" id="amt-${cat.replace(/\s/g, "")}">0</span>
        </div>`;
      container.appendChild(btn);
    });
  };
  createGrid("Income", "income-grid");
  createGrid("Expense", "expense-grid");
}

/* --- Modal Actions --- */
function openModal(type, cat) {
  activeType = type;
  activeCat = cat;
  document.getElementById("modal-cat-display").innerText = langData[currentLang][cat] || cat;
  document.getElementById("m-date").valueAsDate = new Date();
  document.getElementById("m-amount").value = "";
  document.getElementById("m-notes").value = "";
  document.getElementById("lbl-modal-save").style.background = type === "Income" ? "#10b981" : "#ef4444";
  document.getElementById("addModal").classList.add("active");
  setTimeout(() => document.getElementById("m-amount").focus(), 300);
}

function closeModal() {
  document.getElementById("addModal").classList.remove("active");
}

/* --- Data Handling --- */
async function saveFromModal() {
  const { data: { user } } = await _supabase.auth.getUser();
  const amt = parseFloat(document.getElementById("m-amount").value);
  if (!amt) return;
  const btn = document.getElementById("lbl-modal-save");
  btn.disabled = true;
  const { error } = await _supabase.from("transactions").insert([
    {
      date: document.getElementById("m-date").value,
      type: activeType,
      amount: amt,
      category: activeCat,
      notes: document.getElementById("m-notes").value,
      user_id: user.id,
    },
  ]);
  if (!error) {
    await loadData();
    closeModal();
  }
  btn.disabled = false;
}

async function loadData() {
  const { data: { user } } = await _supabase.auth.getUser();
  if (!user) return;
  
  if (user.user_metadata) {
    const name = user.user_metadata.full_name || user.email;
    const avatar = user.user_metadata.avatar_url;
    const greeting = langData[currentLang].greet;
    document.getElementById("user-profile").innerHTML =
      `<div class="profile-box">
          ${avatar ? `<img src="${avatar}" class="profile-img" alt="avatar">` : `<div class="avatar-placeholder">${name.charAt(0)}</div>`}
          <div class="user-details"><span class="welcome-text">${greeting},</span><span id="user-name">${name}</span></div>
        </div>`;
  }

  const { data } = await _supabase.from("transactions").select("*").eq("user_id", user.id);
  if (data) {
    let tInc = 0, tExp = 0, sums = {};
    data.forEach((i) => {
      if (i.type === "Income") tInc += i.amount;
      else tExp += i.amount;
      const key = i.category.replace(/\s/g, "");
      sums[key] = (sums[key] || 0) + i.amount;
    });
    document.getElementById("val-income").innerText = tInc.toLocaleString();
    document.getElementById("val-expense").innerText = tExp.toLocaleString();
    document.getElementById("val-balance").innerText = (tInc - tExp).toLocaleString();
    document.querySelectorAll(".cat-val").forEach((el) => (el.innerText = "0"));
    Object.keys(sums).forEach((c) => {
      const el = document.getElementById(`amt-${c}`);
      if (el) el.innerText = sums[c].toLocaleString();
    });
  }
}

/* --- Settings & Auth --- */
function toggleLang() {
  changeLang(currentLang === "mm" ? "en" : "mm");
}

function changeLang(lang) {
  currentLang = lang;
  localStorage.setItem("selectedLang", lang);
  document.getElementById("lbl-income").innerText = langData[lang].income;
  document.getElementById("lbl-expense").innerText = langData[lang].expense;
  document.getElementById("lbl-balance").innerText = langData[lang].balance;
  document.getElementById("tab-inc-head").innerText = langData[lang].incTitle;
  document.getElementById("tab-exp-head").innerText = langData[lang].expTitle;
  document.getElementById("lbl-view-inc").innerText = langData[lang].viewInc;
  document.getElementById("lbl-view-exp").innerText = langData[lang].viewExp;
  document.getElementById("lbl-logout-text").innerText = langData[lang].logout;
  document.getElementById("btn-lang-toggle").innerText = lang === "mm" ? "ENGLISH" : "မြန်မာ";
  renderButtons();
  loadData();
}

function toggleTheme() {
  const html = document.documentElement;
  const newTheme = html.getAttribute("data-theme") === "light" ? "dark" : "light";
  html.setAttribute("data-theme", newTheme);
  document.getElementById("theme-icon").innerText = newTheme === "dark" ? "☀️" : "🌙";
  localStorage.setItem("theme", newTheme);
}

async function handleLogout() {
  await _supabase.auth.signOut();
  window.location.href = "https://htut5496.github.io/Thiha/index.html";
}

/* --- Initialization --- */
window.onload = async () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  document.getElementById("theme-icon").innerText = savedTheme === "dark" ? "☀️" : "🌙";
  changeLang(localStorage.getItem("selectedLang") || "mm");
};
