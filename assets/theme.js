// The Random Store — theme scripts
(function () {
  var hamburger = document.getElementById('Hamburger');
  var mobileMenu = document.getElementById('MobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
  }
})();
