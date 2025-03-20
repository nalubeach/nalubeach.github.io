
// check if window is scrolled to add opacity to the navbar
window.addEventListener('scroll', function() {
    var navbar = document.querySelector('.navbar');
    var scrolled = window.scrollY > 0;
    if (scrolled) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
});


  if (window.location.pathname.endsWith(".html")) {
    window.history.replaceState(null, "", window.location.pathname.replace(".html", ""));
  }
