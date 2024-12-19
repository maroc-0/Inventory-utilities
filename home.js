// Datos de ejemplo para las secciones
const panData = [
  { nombre: "Baguet", precio: 1200, cantidad: 50 },
  { nombre: "Pan Integral", precio: 1500, cantidad: 30 }
];

const concentradoData = [
  { nombre: "Concentrado de Aves", precio: 3500, cantidad: 100 },
  { nombre: "Concentrado de Bovinos", precio: 4500, cantidad: 75 }
];

// Mostrar sección seleccionada
function showSection(sectionId) {
  const sections = document.querySelectorAll(".content-section");
  sections.forEach(section => section.style.display = "none");

  const activeSection = document.getElementById(sectionId);
  if (activeSection) {
      activeSection.style.display = "block";
      if (sectionId === "pan") renderTable(panData, "panTableBody");
      if (sectionId === "concentrados") renderTable(concentradoData, "concentradoTableBody");
  }
}

// Renderizar datos en una tabla
function renderTable(data, tableBodyId) {
  const tableBody = document.getElementById(tableBodyId);
  tableBody.innerHTML = ""; // Limpiar la tabla
  data.forEach(item => {
      tableBody.innerHTML += `
          <tr>
              <td>${item.nombre}</td>
              <td>${item.precio.toLocaleString()}</td>
              <td>${item.cantidad}</td>
          </tr>`;
  });
}

// Mostrar la página de inicio al cargar
showSection("home");
