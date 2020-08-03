/*eslint-disable */
const form = document.querySelector(".container");
const inputName = document.getElementById("name");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const inputPasswordConfirm = document.getElementById("password-confirm");
const inputRole = document.getElementById("role");

form.addEventListener("submit", async e => {
    e.preventDefault();
    const name = inputName.value;
    const email = inputEmail.value;
    const password = inputPassword.value;
    const passwordConfirm = inputPasswordConfirm.value;
    const role = inputRole.checked === true ? "seller" : "user";

    if (password !== passwordConfirm) return alert("password mismatch");

    try {
        const res = await axios({
            method: "POST",
            url: "/api/v1/users/signup",
            data: {
                name,
                email,
                password,
                passwordConfirm,
                role
            }
        });
        if (res.data.status === "success") {
            alert("successfully created");
            return location.assign("/");
        }
        alert("OOps something went wrong...");
    } catch (err) {
        alert(err.response.data.message);
    }
});
