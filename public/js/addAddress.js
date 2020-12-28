/*eslint-disable*/
const form = document.querySelector(".container");
const addressTextField = document.querySelector("input[type='text']");
const numberTextField = document.querySelector("input[type='number']");

form.addEventListener("submit", async e => {
    e.preventDefault();
    try {
        const res = await axios({
            method: "POST",
            url: "/api/v1/address",
            data: {
                address: addressTextField.value,
                phone: numberTextField.value
            }
        });

        if (res.data.status == "success") {
            alert("Address saved successfully");
            return history.back();
        }
        alert("OOps something went wrong...");
    } catch (e) {
        alert(e.response.data.message);
    }
});
