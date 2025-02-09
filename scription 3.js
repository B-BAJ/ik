// Database setup
const DB_NAME = "MessagesDB";
const STORE_NAME = "messages";
const DB_VERSION = 1;

// Open IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "timestamp" });
        store.createIndex("timestamp", "timestamp", { unique: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("Error opening database");
  });
}

async function saveMessages(messages) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    messages.forEach((msg) => store.put(msg));

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject("Error saving messages");
  });
}

async function getMessages() {
  return new Promise(async (resolve, reject) => {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll(); // Don't use await here

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("Error retrieving messages");
  });
}

// Valentine Messages
const Vmessages = [
  "Are you sure?",
  "Really sure??",
  "Are you positive?",
  "Pookie please...",
  "Just think about it!",
  "If you say no, I will be really sad...",
  "I will be very sad...",
  "I will be very very very sad...",
  "Ok fine, I will stop asking...",
  "Just kidding, say yes please! ❤️"
];

let messageIndex = 0;

function handleNoClick() {
  const noButton = document.querySelector('.no-button');
  const yesButton = document.querySelector('.yes-button');
  noButton.textContent = Vmessages[messageIndex];
  messageIndex = (messageIndex + 1) % Vmessages.length;
  const currentSize = parseFloat(window.getComputedStyle(yesButton).fontSize);
  yesButton.style.fontSize = `${currentSize * 2.5}px`;
}

function handleYesClick() {
  const yes = document.querySelector('.yes-container');
  const V = document.querySelector('.V-container');
  yes.style.display = 'block';
  V.style.display = 'none';
}

function unhandleYesClick() {
  const yes = document.querySelector('.yes-container');
  const V = document.querySelector('.V-container');
  yes.style.display = 'none';
  V.style.display = 'block';
  const yesButton = document.querySelector('.yes-button');
  yesButton.style.fontSize = '1.5em';
  const noButton = document.querySelector('.no-button');
  noButton.textContent = 'No';
}

// Fetch Dashboard Data
async function fetchDashboardData() {
  const token = localStorage.getItem("accessToken");
  console.log("Token:", token);
  if (!token) {
    window.location.href = "/login"; // Redirect to login if no token
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/dashboard-data", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch dashboard data");
    }

    const data = await response.json();
    console.log("Dashboard data:", data);
    const user = data.user;
    const profilePic = localStorage.getItem("profilePic");
    console.log("Profile pic:", profilePic);

    document.getElementById("profile-pic").src = profilePic;
    document.getElementById("username").innerText = `@${user.username}`;

    const linkElement = document.getElementById("a-link");
    linkElement.innerText = `localhost:5000/send-message?to=${user.username}`;
    linkElement.href = `http://localhost:5000/send-message?to=${user.username}`;

  } catch (error) {
    console.error("Error:", error);
    document.getElementById("loader").innerText = "Failed to load data.";
  }
}

// Fetch data on page load
window.onload = fetchDashboardData;

// Variables
const homeTab = document.getElementById('homeTab');
const valentine = document.getElementById('valentine');
const valentineSection = document.querySelector('.valentineSection');
const inboxTab = document.getElementById('inboxTab');
const homeSection = document.querySelector('.home');
const inboxSection = document.querySelector('.inbox');
const messageList = document.getElementById('messageList');
const modal = document.getElementById('modal');
const closeModalBtn = document.getElementById('closeModalBtn');
const replyInput = document.getElementById('replyInput');
const generateCardBtn = document.getElementById('generateCardBtn');
const generatedCardContainer = document.getElementById('generatedCardContainer');
const shareButton = document.getElementById('shareButton');
const baxt = document.getElementById('baxt');

// Dummy messages for Inbox
async function displayMessages() {
  const messages = await getMessages();
  console.log("Messages:", messages);
  messageList.innerHTML = '';
  messages.forEach(message => {
    const listItem = document.createElement('li');
    listItem.classList.add('message-item');
    listItem.innerHTML = `
      <span>${message.content}</span>
      <button class="view-btn" data-id="${message.id}">View</button>
    `;
    messageList.appendChild(listItem);
  });

  // Add View button functionality
  const viewButtons = document.querySelectorAll('.message-item .view-btn');
  viewButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const messageId = e.target.dataset.id;
      const message = messages.find(m => m.id == messageId);
      openModal(message);
    });
  });
}

// Open modal with selected message
function openModal(message) {
  modal.style.display = 'flex';
  const statusCard = document.getElementById('statusCard');
  statusCard.querySelector('.card-upper h3').textContent = "Anonymous Message";
  statusCard.querySelector('.card-lower p').textContent = message.content;
}

// Close modal
closeModalBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Generate and display status card
generateCardBtn.addEventListener('click', () => {
  const reply = replyInput.value.trim();
  if (!reply) {
    alert("Please enter a reply before proceeding.");
    generateCardBtn.style.display = "block";
    replyInput.style.display = "block";
    return;
  }

  // Create the status card
  const card = document.createElement("div");
  card.id = "card";
  card.className = "status-card";
  card.innerHTML = `
    <div class="card-upper">
      <h3>Anonymous Message</h3>
      <h4>Sema hio kitu ikutoke</h4>
    </div>
    <div class="card-lower">
      <p>This is the anonymous message.</p>
      <p><strong>Reply:</strong> ${reply}</p>
    </div>
  `;

  // Display the generated card
  generatedCardContainer.innerHTML = "";
  generatedCardContainer.appendChild(card);
  shareButton.style.display = "block";
  baxt.style.display = "block";
});

function disappearA() {
  generateCardBtn.style.display = "none";
  replyInput.style.display = "none";
}

function reappearA() {
  card.style.display = "none";
  shareButton.style.display = "none";
  baxt.style.display = "none";
  generateCardBtn.style.display = "block";
  replyInput.style.display = "block";
}

// Share the generated status card
shareButton.addEventListener('click', () => {
  const card = generatedCardContainer.querySelector(".status-card");
  if (!card) {
    alert("No card to share.");
    return;
  }

  // Convert card to an image
  html2canvas(card).then(canvas => {
    const imageData = canvas.toDataURL("image/png");
    fetch(imageData)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "status-card.png", { type: "image/png" });

        if (navigator.share) {
          navigator.share({
            title: "Anonymous Reply",
            files: [file],
            url: "https://example.com/reply/123", // Replace with your stored link
          }).then(() => console.log("Shared successfully!"))
            .catch(err => console.error("Error sharing:", err));
        } else {
          alert("Sharing is not supported on this browser.");
        }
      });
  });
});

// Fetch messages
async function fetchMessages() {
  try {
    const response = await fetch("http://localhost:5000/api/messages", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
      }
    });
    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }

    const data = await response.json();
    console.log("Messages:", data);
    await saveMessages(data.messages);
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to fetch messages.");
  }
}

// Fetch messages on page load
fetchMessages();

// Initialize with Home section visible
homeSection.style.display = 'block';
inboxSection.style.display = 'none';
valentineSection.style.display = 'none';
