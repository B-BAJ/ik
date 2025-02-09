
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
