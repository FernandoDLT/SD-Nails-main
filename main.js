// Has an effect on page-load
document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector("#carousel");
  const carouselItems = document.querySelectorAll("#carousel li"); // li wraps the img
  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");

  let currentIndex = 0;
  let isTransitioning = false;
  const totalItems = carouselItems.length;

  // Clones the first and last images to create a seamless transition
  const firstClone = carouselItems[0].cloneNode(true);
  const lastClone = carouselItems[totalItems - 1].cloneNode(true);

  // Appends and prepends the clones
  carousel.appendChild(firstClone);
  carousel.insertBefore(lastClone, carouselItems[0]);

  const updatedTotalItems = totalItems + 2; // Account for the clones

  // Function to update the carousel
  function updateCarousel() {
    if (isTransitioning) return; // Prevent multiple transitions at once

    isTransitioning = true;
    const offset = -currentIndex * 100; // Move the carousel based on index
    carousel.style.transition = "transform 0.9s ease";
    carousel.style.transform = `translateX(${offset}%)`;
  }

  // Handles the transition end only once
  carousel.addEventListener("transitionend", () => {
    isTransitioning = false;

    if (currentIndex === 0 || currentIndex === updatedTotalItems - 1) {
      // Reset position for seamless looping at boundaries
      carousel.style.transition = "none";
      currentIndex = (currentIndex === 0) ? totalItems : 1;
      const offset = -currentIndex * 100;
      carousel.style.transform = `translateX(${offset}%)`;
    }
  });

  // Button event listeners (next and previous)
  function handleButtonClick(direction) {
    if (!isTransitioning) {
      currentIndex = (currentIndex + direction + updatedTotalItems) % updatedTotalItems;
      updateCarousel();
    }
  }

  nextButton.addEventListener("click", () => handleButtonClick(1));
  prevButton.addEventListener("click", () => handleButtonClick(-1));

  // Touch event handling for mobile
  let startX = 0;
  let endX = 0;

  function handleTouchStart(event) {
    startX = event.touches[0].clientX;
  }

  function handleTouchMove(event) {
    endX = event.touches[0].clientX;
  }

  function handleTouchEnd() {
    const threshold = 50; // Minimum swipe distance in pixels to trigger a change
    if (Math.abs(startX - endX) > threshold) {
      handleButtonClick(startX - endX > 0 ? 1 : -1); // Determine swipe direction
    }
  }

  if (window.innerWidth <= 770) {
    carousel.addEventListener("touchstart", handleTouchStart);
    carousel.addEventListener("touchmove", handleTouchMove);
    carousel.addEventListener("touchend", handleTouchEnd);
  }

  // Initial setup with the first image displayed
  currentIndex = 1;
  carousel.style.transform = `translateX(-100%)`; // Show the real first image

  // Autoplay: Automatically move to the next slide every 3 seconds
  const autoplayInterval = setInterval(() => {
    if (!isTransitioning) {
      currentIndex = (currentIndex + 1) % updatedTotalItems;
      updateCarousel();
    }
  }, 5000); // Change the slide every 3 seconds

  // Stop autoplay on user interaction
  nextButton.addEventListener("click", () => clearInterval(autoplayInterval));
  prevButton.addEventListener("click", () => clearInterval(autoplayInterval));
});


// Email functionality
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const card = document.querySelector('.card');
    const emailInput = document.getElementById('email');
    const dismissButton = document.querySelector('.dismiss');

    if (form) {
        emailInput.addEventListener('input', function () {
            updateInputClass(emailInput);
        });

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const formData = new FormData(form);
            const email = formData.get('email');
            const name = formData.get('name');
            // const message = formData.get('message');

            fetch('/sendEmail', {
                method: 'POST',
                body: JSON.stringify({ email, name }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.text())
            .then(responseText => {
                console.log(responseText); // Output server response
                if (responseText === 'Message sent!') {
                    // Show success message card
                    card.classList.remove('hide');
                    // Reset form
                    form.reset();
                } else {
                    console.error('Failed to send message');
                }
            })
            .catch(error => console.error('Error:', error));
        });

        function updateInputClass(inputElement) {
            if (inputElement.value.trim() !== '') {
                inputElement.classList.add('has-value');
            } else {
                inputElement.classList.remove('has-value');
            }
        }

        dismissButton.addEventListener('click', function (event) {
            // Hide success message card
            card.classList.add('hide');
            event.preventDefault();
        });
    } else {
        console.error('Form not found');
    }
});

// Message success functionality
window.addEventListener('load', function () {
    const form = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const nameInput = document.getElementById('name');
    const card = document.querySelector(".card");
    const dismissButton = document.querySelector(".dismiss");
    const formH2 = document.querySelector(".form-and-info h2");

    if (form) {
        emailInput.addEventListener('input', function () {
            updateInputClass(emailInput);
        });

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const usernameInput = form.querySelector('input[type="text"]');
            const username = usernameInput ? usernameInput.value : '';
            const email = emailInput.value;
            const name = nameInput.value;

            if (validateInputs(username, email, name)) {
                form.style.display = 'none';
                formH2.style.display = 'none';
                card.classList.remove('hide');
            }
        });

        function updateInputClass(inputElement) {
            if (inputElement.value.trim() !== '') {
                inputElement.classList.add('has-value');
            } else {
                inputElement.classList.remove('has-value');
            }
        }
        
        function validateInputs(username, email, name) {
            if (!username && !email && !name) {
                alert('Please fill in at least one field');
                return false;
            }
            
            return true;
        }
        
        dismissButton.addEventListener("click", (e) => {
            window.location.href = "index.html"
            e.preventDefault();
        });
    } else {
        console.error('Form not found');
    }
});

const form = document.querySelector('form');
const successCard = document.querySelector('.card');
const dismissButton = document.querySelector('.dismiss');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.classList.add('hide'); // Hide the form
    successCard.classList.add('show'); // Show the card
});

dismissButton.addEventListener('click', () => {
    successCard.classList.remove('show'); // Hide the card
    form.classList.remove('hide'); // Show the form again
});

const burgerMenu = document.querySelector('.burger-menu');
const navContainer = document.querySelector('.nav-container');
const servicesSection = document.querySelector('#services-carousel');

burgerMenu.addEventListener('click', function () {
    navContainer.classList.toggle('nav-open');

    if (navContainer.classList.contains('nav-open')) {
        servicesSection.style.marginTop = '260px'
    } else {
        servicesSection.style.marginTop = '0'
    }
});