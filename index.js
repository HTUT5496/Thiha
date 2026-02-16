/* --- Configuration --- */
const supabaseUrl = "https://utvivcjbmyhsmkjfqgra.supabase.co";
const supabaseKey = "sb_publishable_uih5zl6drERvSSf0AN4qmQ_MqX8SY8G";
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

/* --- Auth Logic --- */
async function checkAuth() {
  const isRecovery =
    window.location.hash && window.location.hash.includes("type=recovery");
  const {
    data: { session },
  } = await _supabase.auth.getSession();
  if (session && !isRecovery) {
    window.location.href = "https://htut5496.github.io/Thiha/dashboard.html";
  }
}

function togglePass(id, el) {
  const input = document.getElementById(id);
  if (input.type === "password") {
    input.type = "text";
    el.innerText = "🙈";
  } else {
    input.type = "password";
    el.innerText = "👁️";
  }
}

/* --- Translation Data --- */
const translations = {
  mm: {
    labels: {
      "app-info": "ငွေကြေးစီမံခန့်ခွဲမှု ဆော့ဖ်ဝဲမှ ကြိုဆိုပါသည်။ သင်၏ ပိုင်ဆိုင်မှုနှင့် ဆုံးရှုံးမှုများကို အကောင်းဆုံး ခွဲခြားနိုင်ရန် ကျွန်ုပ်တို့ အမြဲ ကြိုးပမ်းသွားမည်ဖြစ်ပါသည်။",
      "login-title": "ဝင်ရန်",
      "signup-title": "အကောင့်သစ်ဖွင့်ရန်",
      "nav-login": "ဝင်ရန်",
      "login-btn": "ဝင်မည်",
      "signup-btn": "အတည်ပြုလွှာ ပို့ရန်",
      "go-signup": "အကောင့်အသစ်ဖွင့်ရန်",
      "go-forgot": "စကားဝှက်မေ့နေသလား?",
      "go-login": "အကောင့်ရှိပြီးသားလား? ပြန်ဝင်ရန်",
      "google-login": "Google ဖြင့်ဝင်မည်",
      "google-signup": "Google ဖြင့်ဝင်မည်",
    },
    placeholders: {
      "login-email": "Gmail လိပ်စာ",
      "login-password": "စကားဝှက်",
      "signup-email": "Gmail လိပ်စာ",
      "signup-password": "စကားဝှက်အသစ်",
      "signup-confirm": "စကားဝှက်အတည်ပြုပါ",
    },
  },
  en: {
    labels: {
      "app-info": "Welcome to the financial management software. We will always try to distinguish your assets and losses in a good way.",
      "login-title": "Welcome Back",
      "signup-title": "Create Account",
      "nav-login": "Login",
      "login-btn": "Sign In",
      "signup-btn": "Register Now",
      "go-signup": "Don't have an account? Sign up",
      "go-forgot": "Forgot password?",
      "go-login": "Already have an account? Login",
      "google-login": "Sign in with Google",
      "google-signup": "Sign up with Google",
    },
    placeholders: {
      "login-email": "Email Address",
      "login-password": "Password",
      "signup-email": "Email Address",
      "signup-password": "New Password",
      "signup-confirm": "Confirm Password",
    },
  },
};

/* --- UI Interactions --- */
function toggleTheme() {
  const html = document.documentElement;
  const icon = document.getElementById("theme-icon");
  const newTheme = html.getAttribute("data-theme") === "light" ? "dark" : "light";
  html.setAttribute("data-theme", newTheme);
  icon.innerText = newTheme === "dark" ? "☀️" : "🌙";
  localStorage.setItem("theme", newTheme);
}

function toggleLang() {
  const currentLang = localStorage.getItem("selectedLang") || "mm";
  const newLang = currentLang === "mm" ? "en" : "mm";
  changeLang(newLang);
}

function changeLang(lang) {
  localStorage.setItem("selectedLang", lang);
  const data = translations[lang];

  Object.keys(data.labels).forEach((key) => {
    const el = document.getElementById(`lbl-${key}`);
    if (el) el.innerText = data.labels[key];
  });

  Object.keys(data.placeholders).forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.placeholder = data.placeholders[id];
  });

  const langToggleBtn = document.getElementById("btn-lang-toggle");
  if (langToggleBtn) {
    langToggleBtn.innerText = lang === "mm" ? "မြန်မာ" : "EN";
  }
}

function showForm(formId) {
  const statusEl = document.getElementById("status");
  if (statusEl) statusEl.classList.add("hidden");
  
  ["login-form", "signup-form"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });
  
  const target = document.getElementById(formId + "-form");
  if (target) target.classList.remove("hidden");
}

function setStatus(msg, isError = true) {
  const el = document.getElementById("status");
  if (!el) return;
  el.innerText = msg;
  el.classList.remove("hidden", "error", "success");
  el.classList.add(isError ? "error" : "success");
}

/* --- Form Handling --- */
async function handleLogin() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  if (!email || !password) return setStatus("Please fill all fields");
  
  const btn = document.getElementById("lbl-login-btn");
  btn.disabled = true;
  
  const { error } = await _supabase.auth.signInWithPassword({ email, password });
  
  if (error) {
    setStatus(error.message);
    btn.disabled = false;
  } else {
    window.location.href = "https://htut5496.github.io/Thiha/dashboard.html";
  }
}

async function handleSignUp() {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirm = document.getElementById("signup-confirm").value;
  
  if (password !== confirm) return setStatus("Passwords do not match!");
  
  const btn = document.getElementById("lbl-signup-btn");
  btn.disabled = true;
  
  const { error } = await _supabase.auth.signUp({ email, password });
  
  if (error) {
    setStatus(error.message);
    btn.disabled = false;
  } else {
    setStatus("Check your Gmail to confirm!", false);
  }
}

async function handleGoogleLogin() {
  const { error } = await _supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "https://htut5496.github.io/Thiha/dashboard.html",
    },
  });
  if (error) setStatus(error.message);
}

/* --- Initialization --- */
window.onload = () => {
  // Theme Init
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  const themeIcon = document.getElementById("theme-icon");
  if (themeIcon) {
    themeIcon.innerText = savedTheme === "dark" ? "☀️" : "🌙";
  }

  // Language Init
  const savedLang = localStorage.getItem("selectedLang") || "mm";
  changeLang(savedLang);

  // Initial Auth Check
  checkAuth();
  _supabase.auth.getSession().then(({ data: { session } }) => {
    if (!session) showForm("signup");
  });
};
