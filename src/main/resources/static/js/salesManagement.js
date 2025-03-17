let currentSale = {
    customer: null,
    products: [],
    total: 0
};

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("startSaleButton").addEventListener("click", toggleSaleForm);
    document.getElementById("productSearch").addEventListener("input", filterSaleProducts);
    document.getElementById("customerSelect").addEventListener("change", selectCustomer);
    document.getElementById("confirmSaleButton").addEventListener("click", confirmSale);
});

function toggleSaleForm() {
    let saleCard = document.getElementById("saleCard");
    saleCard.classList.toggle("d-none");
    if (!saleCard.classList.contains("d-none")) {
        resetSale();
    }
}

function filterSaleProducts() {
    let input = document.getElementById("productSearch").value.toLowerCase();
    fetch(`/products/search?name=${input}`)
        .then(response => response.json())
        .then(products => {
            let list = document.getElementById("productList");
            list.innerHTML = "";
            products.forEach(product => {
                let row = `<tr>
                    <td>${product.name}</td>
                    <td>${product.salePrice}</td>
                    <td>
                        <input type='number' min='1' max='${product.stock}' value='1' id='qty-${product.id}'>
                        <button class="btn btn-primary btn-sm" onclick="addProductToSale(${product.id}, '${product.name}', ${product.salePrice})">Añadir</button>
                    </td>
                </tr>`;
                list.innerHTML += row;
            });
        });
}

function addProductToSale(id, name, price) {
    let quantity = parseInt(document.getElementById(`qty-${id}`).value);
    if (isNaN(quantity) || quantity <= 0) return;

    let existingProduct = currentSale.products.find(p => p.id === id);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        currentSale.products.push({ id, name, price, quantity });
    }
    updateSaleSummary();
}

function updateSaleSummary() {
    let summary = document.getElementById("saleSummary");
    summary.innerHTML = "";
    currentSale.total = 0;

    currentSale.products.forEach(product => {
        let subtotal = product.price * product.quantity;
        currentSale.total += subtotal;
        summary.innerHTML += `<tr>
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>${subtotal.toFixed(2)}</td>
            <td><button class='btn btn-danger btn-sm' onclick='removeProductFromSale(${product.id})'>X</button></td>
        </tr>`;
    });
    document.getElementById("totalSale").innerText = currentSale.total.toFixed(2);
}

function removeProductFromSale(id) {
    currentSale.products = currentSale.products.filter(p => p.id !== id);
    updateSaleSummary();
}

function selectCustomer() {
    let customerId = document.getElementById("customerSelect").value;
    currentSale.customer = customerId;
}

function confirmSale() {
    if (!currentSale.customer || currentSale.products.length === 0) {
        alert("Debe seleccionar un cliente y agregar productos");
        return;
    }
    fetch("/sales/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentSale)
    })
        .then(response => response.json())
        .then(result => {
            alert("Venta registrada correctamente");
            toggleSaleForm();
        })
        .catch(error => console.error("Error al registrar la venta", error));
}

function resetSale() {
    currentSale = { customer: null, products: [], total: 0 };
    document.getElementById("saleSummary").innerHTML = "";
    document.getElementById("totalSale").innerText = "0.00";
}
