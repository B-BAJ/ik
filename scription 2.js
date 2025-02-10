let Messages;


const storedLink = "https://example.com/reply/123"; // Replace with your stored link

// Database setup
const DB_NAME = "MessagesDB";
const STORE_NAME = "messages";
const DB_VERSION = 1;

/*const request = indexedDB.deleteDatabase(DB_NAME);
request.onsuccess = function () {
  console.log('Database deleted successfully');
};
request.onerror = function () {
  console.error('Error deleting database');
};*/

document.getElementById('delete-all-message').addEventListener('click', () => {
    // Replace with your actual database name
     
  
    // Create a request to delete the database
    const request = indexedDB.deleteDatabase(DB_NAME);
  
    // On success
    request.onsuccess = function () {
      console.log('Database deleted successfully');
    };
  
    // On error
    request.onerror = function () {
      console.error('Error deleting database');
    };
  });
  

// Open IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: '_id' });
        store.createIndex("createdAt", "createdAt");
        store.createIndex('status', 'status');
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
    
    // Add or update messages with status property
    messages.forEach(message => {
      // Ensure message has _id
      const messageWithId = {
        ...message,
        _id: message._id || new Date().getTime(), // Ensure unique _id
        status: 'unread', // Default status is 'unread'
      };

      // Log the message to confirm the structure
      console.log('Message to store:', messageWithId);

      // Add the message to the store
      store.put(messageWithId);
      
      
    });

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
  
      request.onsuccess = () => {
        console.log("Messages fetched from IndexedDB:", request.result);
        resolve(request.result);}
      request.onerror = () => reject("Error retrieving messages");
    });
  }
  

  async function fetchMessages() {
    try {
      // Call getMessages and wait for the result
      Messages = await getMessages();
  
      // Store the retrieved messages in a variable
      console.log("Messages retrieved:", Messages);
      
      // Now you can use 'messages' as needed
      return Messages;
    } catch (error) {
      console.error("Error retrieving messages:", error);
    }
  }
  


  Messages = fetchMessages();
  console.log("Messages:mmm", Messages);

  

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
                // Hide loader and show content
                document.getElementById("profile-pic").src =  profilePic;
                // Update username
            document.getElementById("username").innerText = `@${user.username}`;

            // Update link text and href
            const linkElement = document.getElementById("a-link");
            linkElement.innerText = `localhost:5000/send-message?to=${user.username}`;
            linkElement.href = `http://localhost:5000/send-message?to=${user.username}`;

            } catch (error) {
                console.error("Error:", error);
                document.getElementById("loader").innerText = "Failed to load data.";
            }
        }

        // Fetch data on page load
       // window.onload = fetchDashboardData;


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
  
    //console.log("Messages:", messages);
    const messages =
    [  { id: 1, content: "Hello, I need some help!" },
      { id: 2, content: "Can you please assist me with something?" },
      { id: 3, content: "Looking forward to hearing back from you!" }
    ];

    // Stored link for sharing
 // Replace with your stored link

    // Switch to Home section
    homeTab.addEventListener('click', () => {
      homeSection.style.display = 'block';
      inboxSection.style.display = 'none';
      valentineSection.style.display = 'none';
    });

    // Switch to valentine section
    valentine.addEventListener('click', () => {
      homeSection.style.display = 'none';
      inboxSection.style.display = 'none';
      valentineSection.style.display = 'block';
    });

    // Switch to Inbox section
    inboxTab.addEventListener('click', () => {
      homeSection.style.display = 'none';
      inboxSection.style.display = 'block';
      valentineSection.style.display = 'none';
      displayMessages();
    });

    // Display messages in Inbox
  async  function displayMessages() {
      messageList.innerHTML = '';
      Messages.forEach(message => {
        const listItem = document.createElement('li');
        listItem.classList.add('message-item');
        listItem.innerHTML = `
          <span>${message.message}</span>
          <button class="view-btn" data-_id="${message._id}">View</button>
        `;
        messageList.appendChild(listItem);
      });

      // Add View button functionality  .view-btn
      const  viewButtons= document.querySelectorAll('.message-item, .view-btn');
      viewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          const messageId = e.target.dataset._id;
          console.log(e.target.dataset)
          console.log("Message ID:", messageId);
          const message = Messages.find(m => 

            m._id == messageId);
          console.log("Message:", message);
          openModal(message);
        });
      });
    }

    // Open modal with selected message
    function openModal(message) {
      modal.style.display = 'flex';
      const statusCard = document.getElementById('statusCard');
      statusCard.querySelector('.card-upper h3').textContent = "Anonymous Message";
      statusCard.querySelector('.card-lower p').textContent = message.message;
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
      card.id = "card"
      card.className = "status-card";
      card.innerHTML = `
      <a href="${storedLink}" target="_blank" rel="noopener noreferrer">
        <div class="card-upper">
          <h3>Anonymous Message</h3>
          <h4>Sema hio kitu ikutoke</h4>
        </div>
        <div class="card-lower">
          <p>This is the anonymous message.</p>
          <p><strong>Reply:</strong> ${reply}</p>
        </div>
        </a>
      `;

      // Display the generated card
      generatedCardContainer.innerHTML = "";
      generatedCardContainer.appendChild(card);
      shareButton.style.display = "block";
      baxt.style.display = "block";
    });

    function disappearA(){
      generateCardBtn.style.display = "none";
      replyInput.style.display = "none";

    };

    function reappearA(){
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
      html2canvas(card ,{ useCORS: true, scale: 3 }).then(canvas => {
        const imageData = canvas.toDataURL("image/png");
        fetch(imageData)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], "status-card.png", { type: "image/png" });

            if (navigator.share) {
              navigator.share({
                title: "Anonymous Reply",
                files: [file],
                url: storedLink, // Redirect link when the image is clicked
              }).then(() => console.log("Shared successfully!"))
                .catch(err => console.error("Error sharing:", err));
            } else {
              alert("Sharing is not supported on this browser.");
            }
          });
      });
    });

    // Initialize with Home section visible
    homeSection.style.display = 'block';
    inboxSection.style.display = 'none';
    valentineSection.style.display = 'none';

     fetchMessage = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/messages", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
          }});
          if (!response.ok) {
            throw new Error("Failed to fetch messages.o")};

            const data = await response.json();
            console.log("Messages:", data);         
            saveMessages(data);
          }
          catch (error) {
            console.error("Error:", error);
            alert("Failed to fetch messages.io");
          } };

            fetchMessage();


