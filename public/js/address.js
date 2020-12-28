/* eslint-disable*/

const removeButtons = document.querySelectorAll(".remove");

removeButtons.forEach(button => {
    button.addEventListener("click", async () => {
        const id = button.dataset.id;
        try {
            const res = await axios({
                method: "DELETE",
                url: `/api/v1/address/${id}`
            });

            if (res.status === 204) {
                return location.reload();
            }
            alert("OOps something went wrong...");
        } catch (e) {
            alert(e.response.data.message);
        }
    });
});
