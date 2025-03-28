document.addEventListener("DOMContentLoaded", () => {
    // Elementos DOM
    const btnIniciarVenta = document.getElementById("iniciarVenta")
    const btnIniciarVentaDesdeHistorial = document.getElementById("iniciarVentaDesdeHistorial")
    const modalVentaElement = document.getElementById("modalVenta")
    const modalVenta = new bootstrap.Modal(modalVentaElement)
    const btnCerrarModal = document.getElementById("cerrarModal")
    const btnCancelarVenta = document.getElementById("cancelarVenta")
    const inputBuscarProducto = document.getElementById("buscarProducto")
    const btnBuscar = document.getElementById("buscar")
    const listaProductos = document.getElementById("listaProductos")
    const listaSeleccionados = document.getElementById("listaSeleccionados")
    const totalVenta = document.getElementById("totalVenta")
    const btnConfirmarVenta = document.getElementById("confirmarVenta")
    const clienteInput = document.getElementById("clienteInput")

    // Elementos para la navegación
    const navProductos = document.getElementById("navProductos")
    const navVentas = document.getElementById("navVentas")
    const seccionProductos = document.getElementById("seccionProductos")
    const seccionVentas = document.getElementById("seccionVentas")

    // Elementos para el historial de ventas
    const ventasTableBody = document.getElementById("ventasTableBody")
    const buscarVentas = document.getElementById("buscarVentas")
    const searchVentaInput = document.getElementById("searchVentaInput")
    const filtroFechaVentas = document.getElementById("filtroFechaVentas")
    const ventasCount = document.getElementById("ventasCount")
    const btnVerVentas = document.getElementById("verVentas")
    const btnExportVentasCSV = document.getElementById("exportVentasCSV")
    const btnPrintVentas = document.getElementById("btnPrintVentas")

    // Variables globales
    let productosSeleccionados = []
    let currentSaleId = null
    let ventasHistorial = []

    // Navegación entre secciones
    navProductos.addEventListener("click", (e) => {
        e.preventDefault()
        seccionProductos.style.display = "block"
        seccionVentas.style.display = "none"
        navProductos.classList.add("active")
        navVentas.classList.remove("active")
    })

    navVentas.addEventListener("click", (e) => {
        e.preventDefault()
        seccionProductos.style.display = "none"
        seccionVentas.style.display = "block"
        navProductos.classList.remove("active")
        navVentas.classList.add("active")
        cargarVentas()
    })

    // Botón para ver ventas desde la sección de productos
    btnVerVentas.addEventListener("click", () => {
        seccionProductos.style.display = "none"
        seccionVentas.style.display = "block"
        navProductos.classList.remove("active")
        navVentas.classList.add("active")
        cargarVentas()
    })

    // Abrir modal de venta desde cualquier sección
    btnIniciarVenta.addEventListener("click", () => {
        modalVenta.show()
    })

    btnIniciarVentaDesdeHistorial.addEventListener("click", () => {
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

    // Buscar ventas
    buscarVentas.addEventListener("click", () => {
        filtrarVentas()
    })

    // Filtrar ventas al cambiar el filtro de fecha
    filtroFechaVentas.addEventListener("change", () => {
        filtrarVentas()
    })

    // Buscar ventas al presionar Enter
    searchVentaInput.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            filtrarVentas()
        }
    })

    function buscarProductos() {
        const query = inputBuscarProducto.value.trim()
        if (query !== "") {
            fetch(`/products/search?name=${query}`)
                .then((response) => response.json())
                .then((data) => mostrarResultados(data))
                .catch((error) => {
                    console.error("Error buscando productos:", error)
                    mostrarAlerta("Error al buscar productos. Intente nuevamente.", "danger")
                })
        }
    }

    function mostrarResultados(productos) {
        listaProductos.innerHTML = ""
        if (productos.length === 0) {
            listaProductos.innerHTML = `<tr><td colspan="4" class="text-center">No se encontraron productos</td></tr>`
            return
        }

        productos.forEach((producto) => {
            const fila = document.createElement("tr")
            fila.innerHTML = `
        <td>${producto.name}</td>
        <td>$${producto.salePrice.toFixed(2)}</td>
        <td>
          <div class="input-group input-group-sm" style="width: 120px">
            <button class="btn btn-outline-secondary btn-sm decrementar" type="button">-</button>
            <input type="number" min="1" max="${producto.stock}" value="1" class="form-control text-center cantidadProducto" 
                   data-id="${producto.id}" data-precio="${producto.salePrice}">
            <button class="btn btn-outline-secondary btn-sm incrementar" type="button">+</button>
          </div>
        </td>
        <td>
          <button class="btn btn-primary btn-sm agregarProducto" 
                  data-id="${producto.id}" 
                  data-nombre="${producto.name}" 
                  data-precio="${producto.salePrice}">
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
        const productoExistente = productosSeleccionados.find((p) => p.product.id === id)

        if (productoExistente) {
            productoExistente.quantity += cantidad
        } else {
            // Crear un objeto ProductDto para usar en SaleDetailDto
            const productoDto = {
                id: id,
                name: nombre,
                salePrice: precio,

            }

            productosSeleccionados.push({
                id: null, // Se asignará cuando se guarde
                product: productoDto,
                quantity: cantidad,
                subtotal: precio * cantidad,
            })
        }

        actualizarListaSeleccionados()
        actualizarTotal()
    }

    function actualizarListaSeleccionados() {
        listaSeleccionados.innerHTML = ""

        if (productosSeleccionados.length === 0) {
            listaSeleccionados.innerHTML = `<tr><td colspan="5" class="text-center">No hay productos seleccionados</td></tr>`
            return
        }

        productosSeleccionados.forEach((producto, index) => {
            const subtotal = producto.product.salePrice * producto.quantity
            const fila = document.createElement("tr")
            fila.innerHTML = `
        <td>${producto.product.name}</td>
        <td>$${producto.product.salePrice.toFixed(2)}</td>
        <td>${producto.quantity}</td>
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
        const total = productosSeleccionados.reduce((sum, p) => sum + p.product.salePrice * p.quantity, 0)
        totalVenta.textContent = total.toFixed(2)
    }

    function resetearVenta() {
        productosSeleccionados = []
        listaProductos.innerHTML = ""
        listaSeleccionados.innerHTML = ""
        inputBuscarProducto.value = ""
        clienteInput.value = ""
        totalVenta.textContent = "0.00"
        currentSaleId = null
    }

    btnConfirmarVenta.addEventListener("click", async () => {
        if (productosSeleccionados.length === 0) {
            mostrarAlerta("Debe agregar productos a la venta.", "warning")
            return
        }

        const cliente = clienteInput.value.trim()
        if (!cliente) {
            mostrarAlerta("Ingrese el nombre del cliente.", "warning")
            return
        }

        try {
            // Calcular el total
            const total = productosSeleccionados.reduce((sum, p) => sum + p.product.salePrice * p.quantity, 0)

            // Crear el objeto SaleDto
            const saleDto = {
                id: null, // Se asignará en el backend
                dateOfSale: new Date().toISOString(),
                products: productosSeleccionados.map((item) => item.product),
                client: cliente,
                total: total,
            }

            console.log(JSON.stringify(saleDto));

            // Enviar la venta al servidor usando el nuevo endpoint
            const saleResponse = await fetch("/sales", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(saleDto),
            })

            if (!saleResponse.ok) {
                throw new Error("Error al crear la venta")
            }

            const saleData = await saleResponse.json()
            currentSaleId = saleData.id

            // Crear los detalles de la venta
            const detailPromises = productosSeleccionados.map((producto) => {
                const saleDetailDto = {
                    id: null, // Se asignará en el backend
                    sale: { id: currentSaleId },
                    product: producto.product,
                    quantity: producto.quantity,
                }

                return fetch("/sale-details", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(saleDetailDto),
                })
            })

            await Promise.all(detailPromises)

            mostrarAlerta("¡Venta registrada con éxito!", "success")
            modalVenta.hide()
            resetearVenta()

            // Si estamos en la sección de ventas, actualizar la lista
            if (seccionVentas.style.display !== "none") {
                cargarVentas()
            }
        } catch (error) {
            console.error("Error al registrar la venta:", error)
            mostrarAlerta("Error al registrar la venta. Intente nuevamente.", "danger")
        }
    })

    function mostrarAlerta(mensaje, tipo) {
        // Crear alerta
        const alertaDiv = document.createElement("div")
        alertaDiv.className = `alert alert-${tipo} alert-dismissible fade show`
        alertaDiv.role = "alert"
        alertaDiv.innerHTML = `
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `

        // Insertar alerta en el modal
        const alertContainer = document.createElement("div")
        alertContainer.className = "alert-container"
        alertContainer.appendChild(alertaDiv)

        modalVentaElement.querySelector(".modal-body").prepend(alertContainer)

        // Eliminar después de 5 segundos
        setTimeout(() => {
            alertaDiv.remove()
        }, 5000)
    }

    // Funciones para el historial de ventas
    function cargarVentas() {
        // Usar el nuevo endpoint para cargar ventas
        fetch("/sales")
            .then((response) => response.json())
            .then((data) => {
                console.log(JSON.stringify(data))
                ventasHistorial = data
                mostrarVentas(data)
            })
            .catch((error) => {
                console.error("Error cargando ventas:", error)
                mostrarAlertaGlobal("Error al cargar las ventas. Intente nuevamente.", "danger")
            })
    }

    function mostrarVentas(ventas) {
        ventasTableBody.innerHTML = ""

        if (ventas.length === 0) {
            ventasTableBody.innerHTML = `<tr><td colspan="6" class="text-center">No hay ventas registradas</td></tr>`
            ventasCount.textContent = "0 ventas"
            return
        }

        ventas.forEach((venta) => {
            console.log(JSON.stringify(venta))
            const fecha = new Date(venta.dateOfSale).toLocaleString()
            const fila = document.createElement("tr")

            fila.innerHTML = `
        <td>${venta.id}</td>
        <td>${fecha}</td>
        <td>${venta.client}</td>
        <td>$${venta.total.toFixed(2)}</td>
        <td>${venta.products.length} productos</td>
        <td class="text-center">
          <div class="btn-group btn-group-sm">
            <button class="btn btn-info verDetalle" data-id="${venta.id}">
              <i class="bi bi-eye"></i>
            </button>
            <button class="btn btn-warning editarVenta" data-id="${venta.id}">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-danger eliminarVenta" data-id="${venta.id}">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      `

            ventasTableBody.appendChild(fila)
        })

        // Actualizar contador
        ventasCount.textContent = `${ventas.length} ventas`

        // Agregar evento a los botones de ver detalle
        document.querySelectorAll(".verDetalle").forEach((btn) => {
            btn.addEventListener("click", function () {
                const ventaId = Number.parseInt(this.getAttribute("data-id"))
                mostrarDetalleVenta(ventaId)
            })
        })

        // Agregar evento a los botones de editar
        document.querySelectorAll(".editarVenta").forEach((btn) => {
            btn.addEventListener("click", function () {
                const ventaId = Number.parseInt(this.getAttribute("data-id"))
                editarVenta(ventaId)
            })
        })

        // Agregar evento a los botones de eliminar
        document.querySelectorAll(".eliminarVenta").forEach((btn) => {
            btn.addEventListener("click", function () {
                const ventaId = Number.parseInt(this.getAttribute("data-id"))
                confirmarEliminarVenta(ventaId)
            })
        })
    }

    function filtrarVentas() {
        const busqueda = searchVentaInput.value.toLowerCase().trim()
        const filtroFecha = filtroFechaVentas.value

        let ventasFiltradas = [...ventasHistorial]

        // Filtrar por cliente
        if (busqueda) {
            ventasFiltradas = ventasFiltradas.filter((venta) => venta.client.toLowerCase().includes(busqueda))
        }

        // Filtrar por fecha
        if (filtroFecha !== "all") {
            const hoy = new Date()
            hoy.setHours(0, 0, 0, 0)

            const inicioSemana = new Date(hoy)
            inicioSemana.setDate(hoy.getDate() - hoy.getDay())

            const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)

            ventasFiltradas = ventasFiltradas.filter((venta) => {
                const fechaVenta = new Date(venta.dateOfSale)

                switch (filtroFecha) {
                    case "today":
                        return fechaVenta >= hoy
                    case "week":
                        return fechaVenta >= inicioSemana
                    case "month":
                        return fechaVenta >= inicioMes
                    default:
                        return true
                }
            })
        }

        mostrarVentas(ventasFiltradas)
    }

    function mostrarDetalleVenta(ventaId) {
        // Obtener detalles de la venta usando el nuevo endpoint
        fetch(`/sales/${ventaId}/details`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al obtener detalles de la venta")
                }
                return response.json()
            })
            .then((detalles) => {
                const venta = ventasHistorial.find((v) => v.id === ventaId)
                if (venta) {
                    mostrarModalDetalle(venta, detalles)
                } else {
                    throw new Error("Venta no encontrada")
                }
            })
            .catch((error) => {
                console.error("Error cargando detalles:", error)
                mostrarAlertaGlobal("Error al cargar los detalles de la venta.", "danger")
            })
    }

    function mostrarModalDetalle(venta, detalles) {
        // Llenar información de la venta
        document.getElementById("detalleVentaId").textContent = venta.id
        document.getElementById("detalleVentaFecha").textContent = new Date(venta.dateOfSale).toLocaleString()
        document.getElementById("detalleVentaCliente").textContent = venta.client
        document.getElementById("detalleVentaTotal").textContent = venta.total.toFixed(2)

        // Llenar tabla de productos
        const detalleVentaProductos = document.getElementById("detalleVentaProductos")
        detalleVentaProductos.innerHTML = ""

        if (detalles.length === 0) {
            detalleVentaProductos.innerHTML = `<tr><td colspan="4" class="text-center">No hay productos en esta venta</td></tr>`
        } else {
            detalles.forEach((detalle) => {
                const subtotal = detalle.product.salePrice * detalle.quantity
                const fila = document.createElement("tr")

                fila.innerHTML = `
          <td>${detalle.product.name}</td>
          <td>$${detalle.product.salePrice.toFixed(2)}</td>
          <td>${detalle.quantity}</td>
          <td>$${subtotal.toFixed(2)}</td>
        `

                detalleVentaProductos.appendChild(fila)
            })
        }

        // Mostrar modal
        const detalleVentaModal = new bootstrap.Modal(document.getElementById("detalleVentaModal"))
        detalleVentaModal.show()
    }

    // Nueva función para editar venta
    function editarVenta(ventaId) {
        const venta = ventasHistorial.find((v) => v.id === ventaId)
        if (!venta) {
            mostrarAlertaGlobal("Venta no encontrada", "danger")
            return
        }

        // Obtener detalles de la venta
        fetch(`/sales/${ventaId}/details`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al obtener detalles de la venta")
                }
                return response.json()
            })
            .then((detalles) => {
                // Preparar el modal para edición
                resetearVenta()
                clienteInput.value = venta.client
                currentSaleId = venta.id

                // Cargar productos seleccionados
                productosSeleccionados = detalles.map((detalle) => ({
                    id: detalle.id,
                    product: detalle.product,
                    quantity: detalle.quantity,
                    subtotal: detalle.product.salePrice * detalle.quantity,
                }))

                actualizarListaSeleccionados()
                actualizarTotal()

                // Cambiar el título y botón del modal
                document.getElementById("modalVentaLabel").textContent = "Editar Venta"
                btnConfirmarVenta.textContent = "Actualizar Venta"
                btnConfirmarVenta.dataset.mode = "edit"
                btnConfirmarVenta.dataset.ventaId = ventaId

                // Mostrar el modal
                modalVenta.show()
            })
            .catch((error) => {
                console.error("Error cargando detalles para edición:", error)
                mostrarAlertaGlobal("Error al cargar los detalles de la venta para edición.", "danger")
            })
    }

    // Nueva función para confirmar eliminación de venta
    function confirmarEliminarVenta(ventaId) {
        if (confirm("¿Está seguro que desea eliminar esta venta? Esta acción no se puede deshacer.")) {
            eliminarVenta(ventaId)
        }
    }

    // Nueva función para eliminar venta
    function eliminarVenta(ventaId) {
        fetch(`/sales/${ventaId}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al eliminar la venta")
                }
                mostrarAlertaGlobal("Venta eliminada correctamente", "success")
                cargarVentas()
            })
            .catch((error) => {
                console.error("Error eliminando venta:", error)
                mostrarAlertaGlobal("Error al eliminar la venta", "danger")
            })
    }

    // Función para mostrar alertas globales (fuera del modal)
    function mostrarAlertaGlobal(mensaje, tipo) {
        const alertaContainer = document.createElement("div")
        alertaContainer.className = "alert-container position-fixed top-0 start-50 translate-middle-x mt-3"
        alertaContainer.style.zIndex = "9999"

        const alertaDiv = document.createElement("div")
        alertaDiv.className = `alert alert-${tipo} alert-dismissible fade show`
        alertaDiv.role = "alert"
        alertaDiv.innerHTML = `
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `

        alertaContainer.appendChild(alertaDiv)
        document.body.appendChild(alertaContainer)

        // Eliminar después de 5 segundos
        setTimeout(() => {
            alertaContainer.remove()
        }, 5000)
    }

    // Evento para imprimir detalle de venta
    document.getElementById("imprimirDetalle").addEventListener("click", () => {
        const contenido = document.getElementById("detalleVentaModal").querySelector(".modal-body").innerHTML
        const ventana = window.open("", "_blank")
        ventana.document.write(`
      <html>
        <head>
          <title>Detalle de Venta</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
          <style>
            body { padding: 20px; }
            @media print {
              .no-print { display: none; }
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h3 class="mb-4">Detalle de Venta</h3>
            ${contenido}
            <div class="mt-4 text-end no-print">
              <button class="btn btn-primary" onclick="window.print()">Imprimir</button>
            </div>
          </div>
        </body>
      </html>
    `)
        ventana.document.close()
    })

    // Exportar ventas a CSV
    btnExportVentasCSV.addEventListener("click", () => {
        if (ventasHistorial.length === 0) {
            mostrarAlertaGlobal("No hay ventas para exportar", "warning")
            return
        }

        // Crear contenido CSV
        let csvContent = "ID,Fecha,Cliente,Total,Productos\n"

        ventasHistorial.forEach((venta) => {
            const fecha = new Date(venta.dateOfSale).toLocaleString()
            csvContent += `${venta.id},"${fecha}","${venta.client}",${venta.total},${venta.products.length}\n`
        })

        // Crear blob y descargar
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", "ventas.csv")
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    })

    // Imprimir lista de ventas
    btnPrintVentas.addEventListener("click", () => {
        if (ventasHistorial.length === 0) {
            mostrarAlertaGlobal("No hay ventas para imprimir", "warning")
            return
        }

        // Crear tabla HTML para imprimir
        let ventasHTML = `
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Productos</th>
          </tr>
        </thead>
        <tbody>
    `

        ventasHistorial.forEach((venta) => {
            const fecha = new Date(venta.dateOfSale).toLocaleString()
            ventasHTML += `
        <tr>
          <td>${venta.id}</td>
          <td>${fecha}</td>
          <td>${venta.client}</td>
          <td>$${venta.total.toFixed(2)}</td>
          <td>${venta.products.length}</td>
        </tr>
      `
        })

        ventasHTML += `
        </tbody>
      </table>
    `

        // Abrir ventana de impresión
        const ventana = window.open("", "_blank")
        ventana.document.write(`
      <html>
        <head>
          <title>Historial de Ventas</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
          <style>
            body { padding: 20px; }
            @media print {
              .no-print { display: none; }
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h3 class="mb-4">Historial de Ventas</h3>
            ${ventasHTML}
            <div class="mt-4 text-end no-print">
              <button class="btn btn-primary" onclick="window.print()">Imprimir</button>
            </div>
          </div>
        </body>
      </html>
    `)
        ventana.document.close()
    })

    // Modificar el comportamiento del botón confirmar venta para manejar edición
    btnConfirmarVenta.addEventListener("click", async () => {
        if (productosSeleccionados.length === 0) {
            mostrarAlerta("Debe agregar productos a la venta.", "warning")
            return
        }

        const cliente = clienteInput.value.trim()
        if (!cliente) {
            mostrarAlerta("Ingrese el nombre del cliente.", "warning")
            return
        }

        try {
            // Calcular el total
            const total = productosSeleccionados.reduce((sum, p) => sum + p.product.salePrice * p.quantity, 0)

            // Verificar si es edición o creación
            const isEdit = btnConfirmarVenta.dataset.mode === "edit"
            const ventaId = isEdit ? Number.parseInt(btnConfirmarVenta.dataset.ventaId) : null

            // Crear el objeto SaleDto
            const saleDto = {
                id: ventaId, // null para nueva venta, id existente para edición
                dateOfSale: new Date().toISOString(),
                products: productosSeleccionados.map((item) => item.product),
                client: cliente,
                total: total,
            }

            let saleResponse

            if (isEdit) {
                // Actualizar venta existente
                saleResponse = await fetch(`/sales/${ventaId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(saleDto),
                })
            } else {
                // Crear nueva venta
                saleResponse = await fetch("/sales", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(saleDto),
                })
            }

            if (!saleResponse.ok) {
                throw new Error(`Error al ${isEdit ? "actualizar" : "crear"} la venta`)
            }

            const saleData = await saleResponse.json()
            currentSaleId = saleData.id

            // Si es edición, primero eliminar los detalles antiguos
            if (isEdit) {
                // Obtener detalles actuales para eliminarlos
                const currentDetails = await fetch(`/sales/${ventaId}/details`).then((res) => res.json())

                // Eliminar cada detalle
                for (const detail of currentDetails) {
                    await fetch(`/sale-details/${detail.id}`, {
                        method: "DELETE",
                    })
                }
            }

            // Crear los nuevos detalles de la venta
            const detailPromises = productosSeleccionados.map((producto) => {
                const saleDetailDto = {
                    id: null, // Siempre nuevo para simplificar
                    sale: { id: currentSaleId },
                    product: producto.product,
                    quantity: producto.quantity,
                }

                return fetch("/sale-details", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(saleDetailDto),
                })
            })

            await Promise.all(detailPromises)

            // Restaurar el botón a su estado original si estaba en modo edición
            if (isEdit) {
                document.getElementById("modalVentaLabel").textContent = "Editar Venta"
                btnConfirmarVenta.textContent = "Actualizar Venta"
                delete btnConfirmarVenta.dataset.mode
                delete btnConfirmarVenta.dataset.ventaId

                mostrarAlerta("¡Venta actualizada con éxito!", "success")
            } else {
                mostrarAlerta("¡Venta registrada con éxito!", "success")
            }

            modalVenta.hide()
            resetearVenta()

            // Si estamos en la sección de ventas, actualizar la lista
            if (seccionVentas.style.display !== "none") {
                cargarVentas()
            }
        } catch (error) {
            console.error("Error al procesar la venta:", error)
            mostrarAlerta(
                `Error al ${btnConfirmarVenta.dataset.mode === "edit" ? "actualizar" : "registrar"} la venta. Intente nuevamente.`,
                "danger",
            )
        }
    })

    // Inicializar la interfaz
    actualizarListaSeleccionados()
})

