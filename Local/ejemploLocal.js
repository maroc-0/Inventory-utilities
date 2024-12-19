const prices = { baguet: 375, lagarto: 475, pina: 375 };
const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

// Inicializar datos en localStorage
function initializeData() {
    if (!localStorage.getItem("panData")) {
        const initialData = {};
        days.forEach(day => {
            initialData[day] = {
                baguet: 0,
                lagarto: 0,
                pina: 0,
                sobranteBaguet: 0,
                sobranteLagarto: 0,
                sobrantePina: 0,
            };
        });
        localStorage.setItem("panData", JSON.stringify(initialData));
    }
}

// Cargar datos desde localStorage
function getData() {
    return JSON.parse(localStorage.getItem("panData"));
}

// Guardar datos en mongoDB
async function saveData(day, type, value) {
  const data = await fetch("/data").then(res => res.json());
  const updatedDay = data.find(d => d.day === day) || { day };

  updatedDay[type] = value;

  fetch("http://localhost:5000/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedDay)
  });
}

// Crear inputs dinámicos
function createDayInputs() {
    const daysContainer = document.getElementById("daysContainer");

    days.forEach(day => {
        const dayDiv = document.createElement("div");
        dayDiv.innerHTML = `
            <button type="button" class="collapsible">${day}</button>
            <div class="content">
                <div class="columns">
                    <div class="column">
                        <h4>Vendidos</h4>
                        <label>Baguet: <select id="${day}-baguet" onchange="updateData('${day}', 'baguet')">${generateOptions()}</select></label>
                        <label>Lagarto: <select id="${day}-lagarto" onchange="updateData('${day}', 'lagarto')">${generateOptions()}</select></label>
                        <label>Piña: <select id="${day}-pina" onchange="updateData('${day}', 'pina')">${generateOptions()}</select></label>
                    </div>
                    <div class="column">
                        <h4>Sobrantes</h4>
                        <label>Baguet: <select id="${day}-sobrante-baguet" onchange="updateData('${day}', 'sobranteBaguet')">${generateOptions()}</select></label>
                        <label>Lagarto: <select id="${day}-sobrante-lagarto" onchange="updateData('${day}', 'sobranteLagarto')">${generateOptions()}</select></label>
                        <label>Piña: <select id="${day}-sobrante-pina" onchange="updateData('${day}', 'sobrantePina')">${generateOptions()}</select></label>
                    </div>
                </div>
            </div>
        `;
        daysContainer.appendChild(dayDiv);
    });

    setupCollapsible();
    loadSavedData();
}

// Generar opciones para los selectores
function generateOptions() {
    let options = "";
    for (let i = 0; i <= 50; i++) {
        options += `<option value="${i}">${i}</option>`;
    }
    return options;
}

// Cargar los datos guardados en los selectores
function loadSavedData() {
    const data = getData();
    days.forEach(day => {
        Object.keys(data[day]).forEach(type => {
            const element = document.getElementById(`${day}-${type.replace("sobrante", "sobrante-")}`);
            if (element) {
                element.value = data[day][type];
            }
        });
    });
}

// Actualizar datos en localStorage cuando cambian los valores
function updateData(day, type) {
    const element = document.getElementById(`${day}-${type.replace("sobrante", "sobrante-")}`);
    if (element) {
        saveData(day, type, parseInt(element.value));
    }
}

// Calcular el total semanal
function calculateWeeklyTotal() {
    const data = getData();
    let totalPanes = 0;
    let totalDinero = 0;

    days.forEach(day => {
        const { baguet, lagarto, pina, sobranteBaguet, sobranteLagarto, sobrantePina } = data[day];

        // Total panes vendidos ajustados por sobrantes
        totalPanes += (baguet - sobranteBaguet) + (lagarto - sobranteLagarto) + (pina - sobrantePina);

        // Total dinero ajustado por sobrantes
        totalDinero += (baguet * prices.baguet - sobranteBaguet * prices.baguet)
            + (lagarto * prices.lagarto - sobranteLagarto * prices.lagarto)
            + (pina * prices.pina - sobrantePina * prices.pina);
    });

    document.getElementById("totalPanes").innerText = `Total de panes vendidos: ${totalPanes}`;
    document.getElementById("totalDinero").innerText = `Monto total para el panadero: ₡${totalDinero.toFixed(2)}`;
}

// Configuración de los botones desplegables
function setupCollapsible() {
    const collapsibles = document.querySelectorAll(".collapsible");

    collapsibles.forEach(button => {
        button.addEventListener("click", () => {
            button.classList.toggle("active");
            const content = button.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    });
}

// Inicializar aplicación
initializeData();
createDayInputs();
