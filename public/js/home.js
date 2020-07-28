/*eslint-disable*/
const toggleButton = document.getElementsByClassName("toggle-button")[0];
const navbarLinks = document.getElementsByClassName("navbar-links")[0];
const buttonMore = document.querySelectorAll(".button-more");

toggleButton.addEventListener("click", () => {
    navbarLinks.classList.toggle("active");
});
