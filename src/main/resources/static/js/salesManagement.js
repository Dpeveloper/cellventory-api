document.addEventListener("DOMContentLoaded", () => {
    const btnIniciarVenta = document.getElementById("iniciarVenta")
    const modalVenta = new bootstrap.Modal(document.getElementById("modalVenta"))
    const btnCerrarModal = document.getElementById("cerrarModal")
    const btnCancelarVenta = document.getElementById("cancelarVenta")
    const inputBuscarProducto = document.getElementById("buscarProducto")
    const btnBuscar = document.getElementById("buscar")
    const listaProductos = document.getElementById("listaProductos")
    const listaSeleccionados = document.getElementById("listaSeleccionados")
    const totalVenta = document.getElementById("totalVenta")
    const btnConfirmarVenta = document.getElementById("confirmarVenta")
    const selectCliente = document.getElementById("cliente")

    let productosSeleccionados = []

    // Abrir modal de venta
    btnIniciarVenta.addEventListener("click", () => {
        modalVenta.show()
    })

    // Cerrar modal de venta
    btnCerrarModal.addEventListener("click", () => {
        modalVenta.hide()
        resetearVenta()
    })

    // Cancelar venta
    btnCancelarVenta.addEventListener("click", () => {
        modalVenta.hide()
        resetearVenta()
    })

    // Buscar productos al presionar Enter
    inputBuscarProducto.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            buscarProductos()
        }
    })

    // Buscar productos
    btnBuscar.addEventListener("click", () => {
        buscarProductos()
    })

    function buscarProductos() {
        const query = inputBuscarProducto.value.trim()
        if (query !== "") {
            // Simulamos la búsqueda con datos de ejemplo
            // En producción, esto debería hacer un fetch a tu API
            const productosEncontrados = [
                { id: 1, nombre: "Laptop HP", precio: 899.99, stock: 10 },
                { id: 2, nombre: "Monitor LG", precio: 249.99, stock: 15 },
                { id: 3, nombre: "Teclado Mecánico", precio: 79.99, stock: 20 },
            ]
            mostrarResultados(productosEncontrados)

            // Versión con fetch (comentada)
            /*
                  fetch(`/products/search?name=${query}`)
                      .then(response => response.json())
                      .then(data => mostrarResultados(data))
                      .catch(error => console.error("Error buscando productos:", error));
                  */
        }
    }

    function mostrarResultados(productos) {
        listaProductos.innerHTML = ""
        productos.forEach((producto) => {
            const fila = document.createElement("tr")
            fila.innerHTML = `
                <td>${producto.nombre}</td>
                <td>$${producto.precio.toFixed(2)}</td>
                <td>
                    <div class="input-group input-group-sm" style="width: 120px">
                        <button class="btn btn-outline-secondary btn-sm decrementar" type="button">-</button>
                        <input type="number" min="1" max="${producto.stock}" value="1" class="form-control text-center cantidadProducto" 
                               data-id="${producto.id}" data-precio="${producto.precio}">
                        <button class="btn btn-outline-secondary btn-sm incrementar" type="button">+</button>
                    </div>
                </td>
                <td>
                    <button class="btn btn-primary btn-sm agregarProducto" 
                            data-id="${producto.id}" 
                            data-nombre="${producto.nombre}" 
                            data-precio="${producto.precio}">
                        <i class="bi bi-plus-circle"></i> Agregar
                    </button>
                </td>
            `
            listaProductos.appendChild(fila)
        })

        // Agregar eventos a los botones de incrementar/decrementar
        document.querySelectorAll(".incrementar").forEach((btn) => {
            btn.addEventListener("click", function () {
                const input = this.parentNode.querySelector("input")
                const max = Number.parseInt(input.getAttribute("max"))
                const value = Number.parseInt(input.value)
                if (value < max) {
                    input.value = value + 1
                }
            })
        })

        document.querySelectorAll(".decrementar").forEach((btn) => {
            btn.addEventListener("click", function () {
                const input = this.parentNode.querySelector("input")
                const value = Number.parseInt(input.value)
                if (value > 1) {
                    input.value = value - 1
                }
            })
        })

        // Agregar evento a los botones de agregar
        document.querySelectorAll(".agregarProducto").forEach((btn) => {
            btn.addEventListener("click", function () {
                const id = this.getAttribute("data-id")
                const nombre = this.getAttribute("data-nombre")
                const precio = Number.parseFloat(this.getAttribute("data-precio"))
                const cantidad = Number.parseInt(this.closest("tr").querySelector(".cantidadProducto").value)

                agregarProducto(id, nombre, precio, cantidad)
            })
        })
    }

    function agregarProducto(id, nombre, precio, cantidad) {
        // Verificar si el producto ya está en la lista
        const productoExistente = productosSeleccionados.find((p) => p.id === id)

        if (productoExistente) {
            productoExistente.cantidad += cantidad
        } else {
            productosSeleccionados.push({ id, nombre, precio, cantidad })
        }

        actualizarListaSeleccionados()
        actualizarTotal()
    }

    function actualizarListaSeleccionados() {
        listaSeleccionados.innerHTML = ""

        productosSeleccionados.forEach((producto, index) => {
            const subtotal = producto.precio * producto.cantidad
            const fila = document.createElement("tr")
            fila.innerHTML = `
                <td>${producto.nombre}</td>
                <td>$${producto.precio.toFixed(2)}</td>
                <td>${producto.cantidad}</td>
                <td>$${subtotal.toFixed(2)}</td>
                <td>
                    <button class="btn btn-danger btn-sm eliminarProducto" data-index="${index}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `
            listaSeleccionados.appendChild(fila)
        })

        // Agregar evento a los botones de eliminar
        document.querySelectorAll(".eliminarProducto").forEach((btn) => {
            btn.addEventListener("click", function () {
                const index = Number.parseInt(this.getAttribute("data-index"))
                productosSeleccionados.splice(index, 1)
                actualizarListaSeleccionados()
                actualizarTotal()
            })
        })
    }

    function actualizarTotal() {
        const total = productosSeleccionados.reduce((sum, p) => sum + p.precio * p.cantidad, 0)
        totalVenta.textContent = total.toFixed(2)
    }

    function resetearVenta() {
        productosSeleccionados = []
        listaProductos.innerHTML = ""
        listaSeleccionados.innerHTML = ""
        inputBuscarProducto.value = ""
        totalVenta.textContent = "0.00"
        selectCliente.value = ""
    }

    btnConfirmarVenta.addEventListener("click", () => {
        if (productosSeleccionados.length === 0) {
            alert("Debe agregar productos a la venta.")
            return
        }

        const clienteId = selectCliente.value
        if (!clienteId) {
            alert("Seleccione un cliente.")
            return
        }

        const venta = {
            clienteId,
            productos: productosSeleccionados,
        }

        // Simulamos el registro de la venta
        console.log("Venta a registrar:", venta)
        alert("¡Venta registrada con éxito!")
        modalVenta.hide()
        resetearVenta()

        // Versión con fetch (comentada)
        /*
            fetch("/ventas/registrar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(venta),
            })
                .then(response => response.json())
                .then(data => {
                    alert("Venta registrada con éxito!");
                    modalVenta.hide();
                    resetearVenta();
                })
                .catch(error => console.error("Error registrando venta:", error));
            */
    })
})

