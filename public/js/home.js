/*eslint-disable*/
const toggleButton = document.getElementsByClassName("toggle-button")[0];
const navbarLinks = document.getElementsByClassName("navbar-links")[0];
const buttonMore = document.querySelectorAll(".button-more");

const logoutBtn = document.getElementById("logoutOption");

toggleButton.addEventListener("click", () => {
    navbarLinks.classList.toggle("active");
});

if (logoutBtn) {
    logoutBtn.addEventListener("click", async e => {
        try {
            const res = await axios({
                method: "GET",
                url: "/api/v1/users/logout"
            });
            if (res.data.status === "success") {
                location.assign("/");
            }
        } catch (err) {
            console.log(err);
        }
    });
}
