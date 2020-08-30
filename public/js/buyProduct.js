/*eslint-disable*/
const form = document.querySelector(".container");
const submitButton = document.querySelector("#submit");

form.addEventListener("submit", async e => {
    const buttonText = submitButton.value;
    //Changing button text and state
    submitButton.disabled = true;
    submitButton.value = "Processing...";
    e.preventDefault();
    try {
        const id = form.dataset.id;
        const res = await axios({
            method: "POST",
            url: "/api/v1/orders",
            data: {
                product: id
            }
        });

        submitButton.disabled = false;
        submitButton.value = buttonText;

        if (res.data.status === "success") {
            alert("Successfully placed your order!");
            return location.assign("/orders");
        }
        alert("OOps something went wrong...");
    } catch (err) {
        alert(err.response.data.message);
        submitButton.disabled = false;
        submitButton.value = buttonText;
    }
});
