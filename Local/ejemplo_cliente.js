const prices = { baguet: 375, lagarto: 475, pina: 375 };
const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

// Guardar datos en MongoDB
async function saveData(day, type, value) {
    const updatedDay = { day };
    updatedDay[type] = parseInt(value);

    try {
        const response = await fetch("http://localhost:5000/data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedDay),
        });
        const result = await response.json();
        console.log("Datos guardados:", result.message);
    } catch (error) {
        console.error("Error al guardar datos:", error);
    }
}

// Cargar datos desde MongoDB y sincronizarlos con los selectores
async function loadSavedData() {
    try {
        const response = await fetch("http://localhost:5000/data");
        const data = await response.json();

        days.forEach(day => {
            const dayData = data.find(d => d.day === day) || {
                baguet: 0, lagarto: 0, pina: 0,
                sobranteBaguet: 0, sobranteLagarto: 0, sobrantePina: 0
            };

            Object.keys(dayData).forEach(type => {
                const element = document.getElementById(`${day}-${type.replace("sobrante", "sobrante-")}`);
                if (element) {
                    element.value = dayData[type];
                }
            });
        });
    } catch (error) {
        console.error("Error al cargar datos:", error);
    }
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
                        <h4>Pan Llegado</h4>
                        <label>Baguet: <select id="${day}-baguet" onchange="saveData('${day}', 'baguet', this.value)">${generateOptions()}</select></label>
                        <label>Lagarto: <select id="${day}-lagarto" onchange="saveData('${day}', 'lagarto', this.value)">${generateOptions()}</select></label>
                        <label>Piña: <select id="${day}-pina" onchange="saveData('${day}', 'pina', this.value)">${generateOptions()}</select></label>
                    </div>
                    <div class="column">
                        <h4>Sobrantes</h4>
                        <label>Baguet: <select id="${day}-sobrante-baguet" onchange="saveData('${day}', 'sobranteBaguet', this.value)">${generateOptions()}</select></label>
                        <label>Lagarto: <select id="${day}-sobrante-lagarto" onchange="saveData('${day}', 'sobranteLagarto', this.value)">${generateOptions()}</select></label>
                        <label>Piña: <select id="${day}-sobrante-pina" onchange="saveData('${day}', 'sobrantePina', this.value)">${generateOptions()}</select></label>
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
    for (let i = 0; i <= 20; i++) {
        options += `<option value="${i}">${i}</option>`;
    }
    return options;
}

// Calcular el total semanal por tipo de pan
async function calculateWeeklyTotal() {
    try {
        const response = await fetch("http://localhost:5000/data");
        const data = await response.json();

        let totalPanes = 0;
        let totalDinero = 0;

        // Procesar cada día
        data.forEach(dayData => {
            
            const { baguet, lagarto, pina, sobranteBaguet, sobranteLagarto, sobrantePina } = dayData;

            // Calcular panes vendidos y dinero
            totalPanes += (baguet - sobranteBaguet) + (lagarto - sobranteLagarto) + (pina - sobrantePina);
            totalDinero += (baguet * prices.baguet - sobranteBaguet * prices.baguet)
                        + (lagarto * prices.lagarto - sobranteLagarto * prices.lagarto)
                        + (pina * prices.pina - sobrantePina * prices.pina);
        });

        // Mostrar resultados
        document.getElementById("totalPanes").innerText = `Total de panes vendidos: ${totalPanes}`;
        document.getElementById("totalDinero").innerText = `Monto total para el panadero: ₡${totalDinero.toFixed(2)}`;
    } catch (error) {
        console.error("Error al calcular totales:", error);
    }
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
createDayInputs();
