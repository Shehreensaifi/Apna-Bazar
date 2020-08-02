/*eslint-disable */
const form = document.querySelector(".container");

form.addEventListener("submit", async e => {
    e.preventDefault();
    const formData = new FormData(form);
    console.log(formData);
    try {
        const res = await axios({
            url: "/api/v1/products",
            method: "POST",
            data: formData
        });
        if (res.data.status === "success") {
            alert("Successfully created!");
            location.assign("/products");
        }
    } catch (err) {
        alert(err.response.data);
    }
});
