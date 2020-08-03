/*eslint-disable*/
const form = document.querySelector(".container");

form.addEventListener("submit", async e => {
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
        if (res.data.status === "success") {
            alert("Successfully placed your order!");
            return location.assign("/orders");
        }
        alert("OOps something went wrong...");
    } catch (err) {
        alert(err.response.data.message);
    }
});
