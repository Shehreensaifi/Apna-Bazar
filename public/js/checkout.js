/*eslint-disable*/
const form = document.querySelector(".container");
const submitButton = document.querySelector("#submit");
const price = document.getElementById("price");
const quantityInput = document.getElementById("quantity");
const totalPrice = document.getElementById("totalPrice");

quantityInput.addEventListener("change", () => {
    const itemCost = price.dataset.price;
    const cost = quantityInput.value * itemCost;
    totalPrice.innerText = `₹${cost}`;
});

form.addEventListener("submit", async e => {
    console.log(quantityInput.value);

    const buttonText = submitButton.value;
    //Changing button text and state
    submitButton.disabled = true;
    submitButton.value = "Processing...";
    e.preventDefault();
    try {
        const address = form.dataset.addressId;
        const product = form.dataset.productId;
        const quantity = quantityInput.value;
        const res = await axios({
            method: "POST",
            url: "/api/v1/orders",
            data: {
                product,
                address,
                quantity
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
