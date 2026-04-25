
  // Select all nav links
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Remove 'active' from all links
      navLinks.forEach(l => l.classList.remove('active'));
      
      // Add 'active' to the clicked link
      this.classList.add('active');
    });
  });


document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("searchInput");
    const dropdown = document.querySelector(".search-dropdown");

    input.addEventListener("focus", () => {
        dropdown.classList.add("show");
    });

    document.addEventListener("click", (e) => {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove("show");
        }
    });
});



const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});