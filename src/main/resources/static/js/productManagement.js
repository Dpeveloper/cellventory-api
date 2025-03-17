let editingProductId = null;

document.addEventListener("DOMContentLoaded", function () {
    loadProducts();
    document.getElementById("searchInput").addEventListener("input", filterProducts);
    document.getElementById("productForm").addEventListener("submit", function (event) {
        event.preventDefault();
        saveProduct();
    });
    // Detectar cambios en el precio en tiempo real
    document.getElementById("purchasePrice").addEventListener("input", updateSalePrice);
    // Detectar cambios en el precio de compra
    document.getElementById("purchasePrice").addEventListener("input", updateSalePrice);
});




let productsList = []; // Lista global de productos

let productsListFilter = []; // lista local de productos

function loadProducts() {
    fetch("/products")
        .then(response => response.json())
        .then(products => {
            productsList = products; // Guardar en memoria
            let tableBody = document.getElementById("productTableBody");
            tableBody.innerHTML = "";
            products.forEach(product => {
                let row = `<tr>
                        <td>${product.name}</td>
                        <td>${product.category}</td>
                        <td>${product.model}</td>
                        <td>${product.salePrice}</td>
                        <td>${product.stock}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editProduct(${product.id})">Editar</button>
                            <button class="btn btn-danger btn-sm" onclick="confirmDelete(${product.id})">Eliminar</button>
                        </td>
                    </tr>`;
                tableBody.innerHTML += row;
            });
        });
}


function filterProducts() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    fetch(`/products/search?name=${input}`)
        .then(response => response.json())
        .then(products => {
            productsListFilter = products;
            let tableBody = document.getElementById("productTableBody");
            tableBody.innerHTML = "";
            products.forEach(product => {
                let row = `<tr>
                        <td>${product.name}</td>
                        <td>${product.category}</td>
                        <td>${product.model}</td>
                        <td>${product.salePrice}</td>
                        <td>${product.stock}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editProduct(${product.id})">Editar</button>
                            <button class="btn btn-danger btn-sm" onclick="confirmDelete(${product.id})">Eliminar</button>
                        </td>
                    </tr>`;
                tableBody.innerHTML += row;
            });
        });
}

function toggleForm(forceClose = false) {
    let card = document.getElementById("productCard");

    if (forceClose || !card.classList.contains("d-none")) {
        document.getElementById("productForm").reset();
        editingProductId = null;
        document.getElementById("formTitle").innerText = "Agregar Producto";
    }

    card.classList.toggle("d-none");
}


function editProduct(id) {
    toggleForm();
    let product = productsListFilter.find(p => p.id === id); // Buscar en la lista

    if (!product) {
        console.error("Producto no encontrado en memoria.");
        return;
    }

    let form = document.getElementById("productForm");
    editingProductId = product.id;

    form.elements["name"].value = product.name;
    form.elements["category"].value = product.category;
    form.elements["model"].value = product.model;
    form.elements["purchasePrice"].value = product.purchasePrice;
    form.elements["salePrice"].value = product.salePrice;
    form.elements["stock"].value = product.stock;
    form.elements["description"].value = product.description;

    document.getElementById("formTitle").innerText = "Editar Producto";

}

async function saveProduct() {
    let form = document.getElementById("productForm");
    let formData = new FormData(form);
    let url = "/products/save";
    let method = "POST";

    if (editingProductId) {
        url = `/products/${editingProductId}`;
        method = "PUT";
    }

    let response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData))
    });

    if (response.ok) {
        form.reset();
        toggleForm();
        await loadProducts(); // 🔥 Ahora se espera que la tabla se recargue antes de continuar
    } else {
        console.error("Error al guardar el producto");
    }
}


function confirmDelete(id) {
    if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
        deleteProduct(id);
    }
}

function deleteProduct(id) {
    fetch(`/products/${id}`, {
        method: "DELETE"
    })
        .then(response => {
            if (response.ok) {
                alert("Producto eliminado correctamente.");
                loadProducts();
            } else {
                alert("Error al eliminar el producto.");
                console.error("Error en la solicitud:", response.status);
            }
        })
        .catch(error => console.error("Error en fetch:", error));
}

function updateSalePrice() {
    let purchasePriceInput = document.getElementById("purchasePrice");
    let salePriceInput = document.getElementById("salePrice");

    let purchasePrice = parseFloat(purchasePriceInput.value);
    if (!isNaN(purchasePrice)) {
        let salePrice = purchasePrice * 1.2; // Agregar 20%
        salePriceInput.value = salePrice.toFixed(2); // Redondear a dos decimales
    }else{
        salePriceInput.value = 0;
    }
}


