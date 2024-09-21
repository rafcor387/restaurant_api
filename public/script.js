document.addEventListener("DOMContentLoaded", () => {
  const restaurantList = document.getElementById("restaurant-list");
  const restaurantForm = document.getElementById("restaurant-form");
  const modal = document.getElementById("modal");
  const closeModalBtn = document.querySelector(".close");
  let currentRestaurantId = null; // Variable para guardar el ID del restaurante seleccionado para agregar plato

  // Cargar todos los restaurantes al cargar la página
  fetchRestaurants();

  // Evento para añadir un nuevo restaurante
  restaurantForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const sucursales = document.getElementById("sucursales").value.split(",");
    const platos = [];

    const response = await fetch("/api/restaurantes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, sucursales, platos }),
    });

    const newRestaurant = await response.json();
    addRestaurantToList(newRestaurant);

    restaurantForm.reset();
  });

  // Función para cargar restaurantes
  async function fetchRestaurants() {
    const response = await fetch("/api/restaurantes");
    const restaurants = await response.json();

    restaurants.forEach(addRestaurantToList);
  }

  // Función para añadir un restaurante a la lista
  function addRestaurantToList(restaurant) {
    const li = document.createElement("li");
    li.textContent = restaurant.nombre;

    // Crear dropdown para sucursales
    const dropdownSucursales = document.createElement("select");
    restaurant.sucursales.forEach((sucursal) => {
      const option = document.createElement("option");
      option.value = sucursal;
      option.textContent = sucursal;
      dropdownSucursales.appendChild(option);
    });

    // Crear dropdown para platos
    const dropdownPlatos = document.createElement("select");
    restaurant.platos.forEach((plato) => {
      const option = document.createElement("option");
      option.value = plato.nombre;
      option.textContent = `${plato.nombre} - ${plato.precio} USD (${plato.porcion})`;
      dropdownPlatos.appendChild(option);
    });

    // Botón para eliminar el restaurante
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    deleteButton.className = "delete-btn";
    deleteButton.onclick = async () => {
      await fetch(`/api/restaurantes/${restaurant._id}`, { method: "DELETE" });
      li.remove();
    };

    // Botón para agregar plato
    const addPlatoButton = document.createElement("button");
    addPlatoButton.textContent = "Agregar Plato";
    addPlatoButton.onclick = () => {
      currentRestaurantId = restaurant._id; // Guardamos el ID del restaurante
      modal.style.display = "block"; // Mostramos el modal
    };

    li.appendChild(dropdownSucursales);
    li.appendChild(dropdownPlatos);
    li.appendChild(addPlatoButton);
    li.appendChild(deleteButton);
    restaurantList.appendChild(li);
  }

  // Cerrar el modal
  closeModalBtn.onclick = () => {
    modal.style.display = "none";
  };

  // Cuando el usuario hace clic fuera del modal, cerrarlo
  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // Evento para añadir un plato desde el modal
  const platoForm = document.getElementById("plato-form");
  platoForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("plato-nombre").value;
    const descripcion = document.getElementById("plato-descripcion").value;
    const precio = document.getElementById("plato-precio").value;
    const porcion = document.getElementById("plato-porcion").value;

    const nuevoPlato = { nombre, descripcion, precio, porcion };

    await fetch(`/api/restaurantes/${currentRestaurantId}/platos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoPlato),
    });

    // Cerrar el modal
    modal.style.display = "none";

    // Recargar la página para evitar duplicados y actualizar los datos
    window.location.reload();
  });

  function addRestaurantToList(restaurant) {
    const tr = document.createElement("tr");

    // Columna para nombre del restaurante
    const nameTd = document.createElement("td");
    nameTd.textContent = restaurant.nombre;

    // Columna para el dropdown de sucursales
    const sucursalesTd = document.createElement("td");
    const dropdownSucursales = document.createElement("select");
    restaurant.sucursales.forEach((sucursal) => {
      const option = document.createElement("option");
      option.value = sucursal;
      option.textContent = sucursal;
      dropdownSucursales.appendChild(option);
    });
    sucursalesTd.appendChild(dropdownSucursales);

    // Columna para el dropdown de platos
    const platosTd = document.createElement("td");
    const dropdownPlatos = document.createElement("select");
    restaurant.platos.forEach((plato) => {
      const option = document.createElement("option");
      option.value = plato.nombre;
      option.textContent = `${plato.nombre} - ${plato.precio} USD (${plato.porcion})`;
      dropdownPlatos.appendChild(option);
    });
    platosTd.appendChild(dropdownPlatos);

    // Columna para botones de acciones
    const actionsTd = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    deleteButton.className = "delete-btn";
    deleteButton.onclick = async () => {
      await fetch(`/api/restaurantes/${restaurant._id}`, { method: "DELETE" });
      tr.remove();
    };

    const addPlatoButton = document.createElement("button");
    addPlatoButton.textContent = "Agregar Plato";
    addPlatoButton.onclick = () => {
      currentRestaurantId = restaurant._id;
      modal.style.display = "block";
    };

    actionsTd.appendChild(addPlatoButton);
    actionsTd.appendChild(deleteButton);

    // Añadir columnas a la fila
    tr.appendChild(nameTd);
    tr.appendChild(sucursalesTd);
    tr.appendChild(platosTd);
    tr.appendChild(actionsTd);

    // Añadir fila a la tabla
    restaurantList.appendChild(tr);
  }
});
