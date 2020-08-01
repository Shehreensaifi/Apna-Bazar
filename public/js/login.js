/*eslint-disable */
const form = document.querySelector(".container");
const emailTextField = document.querySelector("input[type='email'");
const passwordTextField = document.querySelector("input[type='password'");

form.addEventListener("submit", async e => {
    e.preventDefault();
    try {
        const res = await axios({
            method: "POST",
            url: "/api/v1/users/login",
            data: {
                email: emailTextField.value,
                password: passwordTextField.value
            }
        });

        if (res.data.status === "success") {
            // const markUp = `<div>Successfully logged in</div>`;
            // document
            //     .querySelector("nav")
            //     .insertAdjacentHTML("afterend", markUp);
            alert("Logged in successfully");
            location.assign("/");
        }
    } catch (e) {
        alert(e.response.data.message);
        // const markUp = `<div>${e}</div>`;
        // document.querySelector("body").insertAdjacentHTML("afterbegin", markUp);
    }
});
