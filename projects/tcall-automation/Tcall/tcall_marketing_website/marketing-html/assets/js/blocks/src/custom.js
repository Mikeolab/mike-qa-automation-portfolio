window.addEventListener('scroll', function() {
  var header = document.querySelector('.o-header');
  if (window.scrollY > header.offsetTop) {
    header.classList.add('sticky');
  } else {
    header.classList.remove('sticky');
  }
});
document.addEventListener("DOMContentLoaded", function() {
  function checkWindowSize() {
      // Check if window width is less than 992 pixels
      if (window.innerWidth < 992) {
          // Remove the class from the element(s)
          document.querySelectorAll('.o-howitwork__mainwrap').forEach(function(element) {
              element.classList.remove('js-vertical-wrap-main');
          });
          document.querySelectorAll('.o-howitwork__textlist').forEach(function(element) {
            element.classList.remove('js-vertical-text');
          });
          document.querySelectorAll('.o-howitwork__imagelist').forEach(function(element) {
            element.classList.remove('js-vertical-image');
          });
          document.querySelectorAll('.o-howitwork__tabcontent').forEach(function(element) {
            element.classList.remove('js-vertical-paragraph');
          });
      }
  }

  // Run the function once on page load
  checkWindowSize();

  // Run the function whenever the window is resized
  window.addEventListener('resize', checkWindowSize);
});

// INPUT type
document.querySelectorAll('input[type="number"]').forEach(function(input) {
    input.addEventListener("keypress", function (evt) {
        // Check if the key pressed is not a number (0-9) or backspace (8)
        if (evt.which < 48 || evt.which > 57) {
            evt.preventDefault();
        }
    });
});

const elements = document.querySelectorAll(".js-eye");

elements.forEach((element) => {
  element.addEventListener("click", () => {
    const password = element
      .closest(".o-modal__loginformgroup")
      .querySelector(".js-grouppass");
    if (password) {
      password.classList.toggle("showPass");
    }
  });
});


document.querySelectorAll('.js-smooth-scroll').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href'); // e.g., "#section1"
      const target = document.querySelector(targetId);

      if (target) {
          // Smoothly scroll to the target element
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
          console.warn(`Target not found for anchor: ${targetId}`);
      }
  });
});

