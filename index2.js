const tableBody = document.getElementById("tableBody");
let currentCategory = "aves";

// Obtener datos desde el servidor
async function fetchData(category) {
    currentCategory = category;
    tableBody.innerHTML = "<tr><td colspan='4'>Cargando...</td></tr>";

    const response = await fetch(`http://localhost:5000/inventory`);
    const data = await response.json();

    const filteredData = data.filter(item => item.categoria === category);
    renderTable(filteredData);
}

// Renderizar la tabla con los datos obtenidos
function renderTable(data) {
    tableBody.innerHTML = "";
    data.forEach((item, index) => {
        tableBody.innerHTML += `
            <tr>
                <td>${item.nombre}</td>
                <td>${item.precio.toLocaleString()}</td>
                <td>${item.cantidad}</td>
                <td>
                    <button onclick="sellProduct('${item._id}', ${item.cantidad})">Vender</button>
                    <button onclick="restockProduct('${item._id}')">Reabastecer</button>
                </td>
            </tr>`;
    });
}

// Vender producto
async function sellProduct(id, cantidad) {
    if (cantidad > 0) {
        await fetch(`http://localhost:5000/inventory/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cantidad: cantidad - 1 })
        });
        fetchData(currentCategory);
    } else {
        alert("¡No hay unidades disponibles!");
    }
}

// Reabastecer producto
async function restockProduct(id) {
    const restockAmount = prompt("Ingrese la cantidad a agregar:");
    if (restockAmount && restockAmount > 0) {
        await fetch(`http://localhost:5000/inventory/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cantidad: parseInt(restockAmount) })
        });
        fetchData(currentCategory);
    } else {
        alert("Cantidad no válida.");
    }
}

// Agregar nuevo producto
async function addProduct() {
    const category = document.getElementById("categorySelect").value;
    const name = document.getElementById("productName").value;
    const price = document.getElementById("productPrice").value;
    const quantity = document.getElementById("productQuantity").value;

    if (name && price > 0 && quantity > 0) {
        await fetch("http://localhost:5000/inventory", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nombre: name,
                precio: parseInt(price),
                cantidad: parseInt(quantity),
                categoria: category
            })
        });
        fetchData(currentCategory);
    } else {
        alert("Complete todos los campos correctamente.");
    }
}

// Cargar categoría inicial
fetchData(currentCategory);
