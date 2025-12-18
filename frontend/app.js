const API_URL = "http://localhost:5000/api";

const loginView = document.getElementById("login-view");
const signupView = document.getElementById("signup-view");
const dashboardView = document.getElementById("dashboard-view");
const errorMessage = document.getElementById("error-message");

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
}

function hideError() {
  errorMessage.style.display = "none";
}

function showLogin() {
  loginView.style.display = "block";
  signupView.style.display = "none";
  dashboardView.style.display = "none";
  hideError();
}

function showSignup() {
  loginView.style.display = "none";
  signupView.style.display = "block";
  dashboardView.style.display = "none";
  hideError();
}

function showDashboard(username) {
  loginView.style.display = "none";
  signupView.style.display = "none";
  dashboardView.style.display = "block";
  document.getElementById("username").textContent = username;
  hideError();
}

document.getElementById("show-signup").onclick = showSignup;
document.getElementById("show-login").onclick = showLogin;

document.getElementById("signup-btn").onclick = async () => {
  const username = document.getElementById("signup-username").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  if (!username || !email || !password) {
    showError("All fields are required");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      showLogin();
      showError("Account created successfully! Please login.");
      document.getElementById("signup-username").value = "";
      document.getElementById("signup-email").value = "";
      document.getElementById("signup-password").value = "";
    } else {
      showError(data.error || "Signup failed");
    }
  } catch (err) {
    showError("Network error. Make sure backend is running on port 5000.");
  }
};

document.getElementById("login-btn").onclick = async () => {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  if (!username || !password) {
    showError("Username and password are required");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("authToken", data.token);
      showDashboard(data.username);
      document.getElementById("login-username").value = "";
      document.getElementById("login-password").value = "";
    } else {
      showError(data.error || "Login failed");
    }
  } catch (err) {
    showError("Network error. Make sure backend is running on port 5000.");
  }
};

document.getElementById("logout-btn").onclick = async () => {
  const token = localStorage.getItem("authToken");

  try {
    await fetch(`${API_URL}/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    console.error("Logout failed:", err);
  }

  localStorage.removeItem("authToken");
  showLogin();
};

showLogin();
