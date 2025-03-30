document.addEventListener("DOMContentLoaded", function () {
    const salesTableBody = document.getElementById("salesTableBody");
    const createSaleButton = document.getElementById("confirmarVenta");
    const clientNameInput = document.getElementById("clientName");
    const productSelect = document.getElementById("productSelect");
    const quantityInput = document.getElementById("quantity");
    const addProductButton = document.getElementById("addProductButton");
    const saleDetails = [];

    // Obtener todas las ventas
    function fetchSales() {
        fetch("/sales")
            .then(response => response.json())
            .then(data => {
                salesTableBody.innerHTML = "";
                data.forEach(sale => {
                    const row = `<tr>
                        <td>${sale.id}</td>
                        <td>${sale.saleDate}</td>
                        <td>${sale.clientName}</td>
                        <td>${sale.total.toFixed(2)}</td>
                        <td>${sale.status}</td>
                    </tr>`;
                    salesTableBody.innerHTML += row;
                });
            })
            .catch(error => console.error("Error obteniendo ventas:", error));
    }

    // Agregar producto a la venta
    addProductButton.addEventListener("click", function () {
        const productId = parseInt(productSelect.value);
        const quantity = parseInt(quantityInput.value);

        if (!productId || !quantity || quantity <= 0) {
            alert("Selecciona un producto y una cantidad válida");
            return;
        }

        saleDetails.push({ productId, quantity });
        alert("Producto agregado a la venta");
    });

    // Crear una nueva venta
    createSaleButton.addEventListener("click", function () {
        const clientName = clientNameInput.value.trim();

        if (!clientName || saleDetails.length === 0) {
            alert("Ingresa el nombre del cliente y al menos un producto");
            return;
        }

        const saleData = {
            clientName,
            status: "PENDIENTE",
            saleDetailList: saleDetails
        };

        fetch("/sales", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(saleData)
        })
            .then(response => response.json())
            .then(data => {
                alert("Venta creada con éxito. Total: " + data.total);
                saleDetails.length = 0; // Resetear la lista de productos
                fetchSales(); // Actualizar lista de ventas
            })
            .catch(error => console.error("Error creando venta:", error));
    });

    // Cargar las ventas al iniciar
    fetchSales();
});
