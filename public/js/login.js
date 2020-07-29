/*eslint-disable */
const submitButton = document.querySelector("input[type='submit']");
const emailTextField = document.querySelector("input[type='email'");
const passwordTextField = document.querySelector("input[type='password'");

submitButton.addEventListener("click", async e => {
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
        alert(e);
        // const markUp = `<div>${e}</div>`;
        // document.querySelector("body").insertAdjacentHTML("afterbegin", markUp);
    }
});
