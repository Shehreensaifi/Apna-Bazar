/*eslint-disable*/
const item = document.querySelector(".item");
const cancelButton = document.getElementById("cancel-button");
const removeButton = document.getElementById("remove-button");
const confirmButton = document.getElementById("confirm-button");
const deliverButton = document.getElementById("deliver-button");

if (cancelButton) {
    cancelButton.addEventListener("click", e => {
        e.preventDefault();
        const orderId = item.dataset.id;
        const userRole = item.dataset.userRole;
        if (userRole === "user")
            apiRequest(orderId, "cancelled", "/api/v1/orders");
        else apiRequest(orderId, "cancelled", "/api/v1/orders/seller");
    });
}

if (removeButton) {
    removeButton.addEventListener("click", e => {
        e.preventDefault();
        const orderId = item.dataset.id;
        apiRequest(orderId, "removed", "/api/v1/orders");
    });
}

if (confirmButton) {
    confirmButton.addEventListener("click", e => {
        e.preventDefault();
        const orderId = item.dataset.id;
        apiRequest(orderId, "confirmed", "/api/v1/orders/seller");
    });
}

if (deliverButton) {
    deliverButton.addEventListener("click", e => {
        e.preventDefault();
        const orderId = item.dataset.id;
        apiRequest(orderId, "delivered", "/api/v1/orders/seller");
    });
}

async function apiRequest(orderId, status, baseUrl) {
    try {
        const res = await axios({
            method: "PATCH",
            url: `${baseUrl}/${orderId}`,
            data: {
                status
            }
        });
        if (res.data.status === "success") {
            alert(`Successfully ${status} your order`);
            return location.assign("/orders");
        }
        alert("OOps something went wrong");
    } catch (err) {
        alert(err.response.data.message);
    }
}
