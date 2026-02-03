// Elements
const envelope = document.getElementById("envelope-container");
const letter = document.getElementById("letter-container");
const noteContainer = document.getElementById("note-container");
const noteMessage = document.getElementById("note-message");
const continueBtn = document.getElementById("continue-btn");
const noBtn = document.querySelector(".no-btn");
const yesBtn = document.querySelector(".btn[alt='Yes']");

const title = document.getElementById("letter-title");
const catImg = document.getElementById("letter-cat");
const buttons = document.getElementById("letter-buttons");
const finalText = document.getElementById("final-text");

const loveMessageText = "Reconnecting with you late last year was one of my highlights of 2025. You brought a lot of laughter with that reconnection 😅. I’m really looking forward to seeing you on Valentine’s Day.";

// Click Envelope - Open to paper note

envelope.addEventListener("click", () => {
    envelope.style.animation = "fadeOut 0.6s ease forwards";
    setTimeout(() => {
        envelope.style.display = "none";
        noteContainer.style.display = "flex";
        // Start typewriter on the note message
        typewriterEffect(noteMessage, loveMessageText, 12);
    }, 600);
});

// Continue button - Paper note to question

continueBtn.addEventListener("click", () => {
    noteContainer.style.animation = "fadeOut 0.6s ease forwards";
    setTimeout(() => {
        noteContainer.style.display = "none";
        letter.style.display = "flex";
        setTimeout(() => {
            document.querySelector(".letter-window").classList.add("open");
            typewriterEffect(title, "Will you be my Valentine?", 30);
            // Show and start the countdown
            const countdownEl = document.getElementById('countdown');
            if (countdownEl) {
                countdownEl.style.display = 'inline-block';
                // compute the nearest upcoming Feb 14 at 19:00
                const target = getNextValentineDate();
                startCountdown(target, countdownEl);
            }
        }, 50);
    }, 600);
});

// Returns the next Valentine's date (Feb 14 at 19:00) in local time
function getNextValentineDate() {
    const now = new Date();
    let year = now.getFullYear();
    let target = new Date(year, 1, 14, 19, 0, 0); // month index 1 => Feb
    if (target <= now) {
        target = new Date(year + 1, 1, 14, 19, 0, 0);
    }
    return target;
}

// Countdown timer: updates the element text every second
function startCountdown(targetDate, el) {
    // clear any existing interval
    if (window._valentineCountdownInterval) clearInterval(window._valentineCountdownInterval);

    function update() {
        const now = new Date();
        let diff = Math.max(0, targetDate - now);

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        diff -= days * (1000 * 60 * 60 * 24);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        diff -= hours * (1000 * 60 * 60);
        const minutes = Math.floor(diff / (1000 * 60));
        diff -= minutes * (1000 * 60);
        const seconds = Math.floor(diff / 1000);

        if (days + hours + minutes + seconds <= 0) {
            el.textContent = "It's Valentine’s time!";
            clearInterval(window._valentineCountdownInterval);
            // small celebration
            createConfetti();
            return;
        }

        el.textContent = `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
    }

    update();
    window._valentineCountdownInterval = setInterval(update, 1000);
}

function pad(n) { return (n < 10 ? '0' : '') + n; }

// Logic to move the NO btn

noBtn.addEventListener("mouseover", () => {
    // Add shake animation class
    noBtn.classList.add("shaking");

    const min = 200;
    const max = 200;

    const distance = Math.random() * (max - min) + min;
    const angle = Math.random() * Math.PI * 2;

    const moveX = Math.cos(angle) * distance;
    const moveY = Math.sin(angle) * distance;

    noBtn.style.transition = "transform 0.3s ease";
    noBtn.style.transform = `translate(${moveX}px, ${moveY}px)`;

    // Remove shake class after animation completes
    setTimeout(() => {
        noBtn.classList.remove("shaking");
    }, 600);
});

// Logic to make YES btn to grow

// let yesScale = 1;

// yesBtn.style.position = "relative"
// yesBtn.style.transformOrigin = "center center";
// yesBtn.style.transition = "transform 0.3s ease";

// noBtn.addEventListener("click", () => {
//     yesScale += 2;

//     if (yesBtn.style.position !== "fixed") {
//         yesBtn.style.position = "fixed";
//         yesBtn.style.top = "50%";
//         yesBtn.style.left = "50%";
//         yesBtn.style.transform = `translate(-50%, -50%) scale(${yesScale})`;
//     }else{
//         yesBtn.style.transform = `translate(-50%, -50%) scale(${yesScale})`;
//     }
// });

// YES is clicked

yesBtn.addEventListener("click", () => {
    title.textContent = "Yippeeee!";

    catImg.src = "cat_dance.gif";

    document.querySelector(".letter-window").classList.add("final");

    buttons.style.display = "none";

    finalText.style.display = "block";

    // Trigger confetti explosion
    createConfetti();
});

// Confetti particle generator
function createConfetti() {
    const hearts = ["♡", "♥", "💕", "💖", "✨"];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti");
        confetti.textContent = hearts[Math.floor(Math.random() * hearts.length)];

        // Random horizontal position
        const startX = Math.random() * window.innerWidth;
        confetti.style.left = startX + "px";
        confetti.style.top = "-30px";

        // Random duration (3-5 seconds)
        const duration = Math.random() * 2 + 3;
        confetti.style.setProperty("--duration", duration + "s");
        confetti.style.animation = `confetti-fall ${duration}s linear forwards`;

        // Random horizontal drift
        const drift = (Math.random() - 0.5) * 200;
        confetti.style.transform = `translateX(${drift}px)`;

        document.body.appendChild(confetti);

        // Remove element after animation completes
        setTimeout(() => confetti.remove(), duration * 1000);
    }
}

// Typewriter effect function - optimized for performance
// Typewriter effect using requestAnimationFrame for smoother rendering
function typewriterEffect(element, text, speed) {
    // cancel any existing typing on this element
    if (element._typeRaf) {
        cancelAnimationFrame(element._typeRaf);
        element._typeRaf = null;
    }

    element.textContent = "";
    element.classList.add("typewriter");

    let index = 0;
    let lastTime = performance.now();

    function step(now) {
        const elapsed = now - lastTime;
        const frameMs = Math.max(speed, 16); // don't try to type faster than a frame
        if (elapsed >= frameMs) {
            // add at most 2 characters per frame to keep updates smooth
            const maxPerFrame = 2;
            const chars = Math.min(maxPerFrame, Math.max(1, Math.floor(elapsed / frameMs)));
            element.textContent += text.slice(index, index + chars);
            index += chars;
            lastTime = now;

            // force a small layout read to encourage an immediate paint
            void element.offsetWidth;
        }

        if (index < text.length) {
            element._typeRaf = requestAnimationFrame(step);
        } else {
            element._typeRaf = null;
            setTimeout(() => element.classList.remove("typewriter"), 300);
        }
    }

    element._typeRaf = requestAnimationFrame(step);
}
