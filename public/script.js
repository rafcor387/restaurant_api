document.addEventListener('DOMContentLoaded', () => {
    const restaurantList = document.getElementById('restaurant-list');
    const restaurantForm = document.getElementById('restaurant-form');
    const modal = document.getElementById('modal');
    const closeModal = document.getElementById('close-modal');
    const plateForm = document.getElementById('plate-form');
    const plateList = document.getElementById('plate-list'); // Agrega un contenedor para los platos
    let currentRestaurantId = null;
    let currentSucursal = null;

    // Cargar todos los restaurantes al cargar la página
    fetchRestaurants();

    // Evento para añadir un nuevo restaurante
    restaurantForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const sucursales = document.getElementById('sucursales').value.split(',');

        const response = await fetch('/api/restaurantes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, sucursales })
        });

        const newRestaurant = await response.json();
        addRestaurantToList(newRestaurant);

        restaurantForm.reset();
    });

    // Cargar los restaurantes
    async function fetchRestaurants() {
        const response = await fetch('/api/restaurantes');
        const restaurants = await response.json();

        restaurants.forEach(addRestaurantToList);
    }

    // Añadir restaurante a la lista
    function addRestaurantToList(restaurant) {
        const li = document.createElement('li');
        li.textContent = restaurant.nombre;

        // Dropdown para sucursales
        const select = document.createElement('select');
        restaurant.sucursales.forEach((sucursal) => {
            const option = document.createElement('option');
            option.value = sucursal;
            option.textContent = sucursal;
            select.appendChild(option);
        });

        // Dropdown para añadir platos
        const plateSelect = document.createElement('select');
        plateSelect.disabled = true; // Inicialmente deshabilitado

        // Botón para ver platos de una sucursal
        const viewPlatesButton = document.createElement('button');
        viewPlatesButton.textContent = 'Ver Platos';
        viewPlatesButton.onclick = async () => {
            const sucursal = select.value;
            const response = await fetch(`/api/restaurantes/${restaurant._id}/platos/${sucursal}`);
            const platos = await response.json();

            // Mostrar los platos en la lista
            plateList.innerHTML = ''; // Limpiar lista de platos
            platos.forEach(plato => {
                const plateItem = document.createElement('li');
                plateItem.textContent = `${plato.nombre}: ${plato.descripcion} - ${plato.precio} (${plato.porcion})`;
                plateList.appendChild(plateItem);
            });
        };

        // Actualizar platos cuando se cambia la sucursal
        select.onchange = async () => {
            currentSucursal = select.value; // Guardar sucursal seleccionada
            plateSelect.disabled = false;

            // Obtener platos de la sucursal seleccionada
            const response = await fetch(`/api/restaurantes/${restaurant._id}/platos/${currentSucursal}`);
            const platos = await response.json();

            // Limpiar y actualizar dropdown de platos
            plateSelect.innerHTML = '';
            platos.forEach(plato => {
                const option = document.createElement('option');
                option.value = plato._id;
                option.textContent = `${plato.nombre}: ${plato.descripcion} - ${plato.precio} (${plato.porcion})`;
                plateSelect.appendChild(option);
            });
        };

        // Botón para agregar plato
        const addPlateButton = document.createElement('button');
        addPlateButton.textContent = 'Agregar Plato';
        addPlateButton.onclick = () => {
            currentRestaurantId = restaurant._id;
            modal.style.display = 'block';
        };

        // Botón para eliminar restaurante
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.className = 'delete-btn';
        deleteButton.onclick = async () => {
            await fetch(`/api/restaurantes/${restaurant._id}`, { method: 'DELETE' });
            li.remove();
        };

        li.appendChild(select);
        li.appendChild(viewPlatesButton); // Agregar botón para ver platos
        li.appendChild(plateSelect); // Dropdown para agregar platos
        li.appendChild(addPlateButton);
        li.appendChild(deleteButton);
        restaurantList.appendChild(li);
    }

    // Cerrar modal
    closeModal.onclick = () => {
        modal.style.display = 'none';
    };

    // Evento para añadir un plato
    plateForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre-plato').value;
        const descripcion = document.getElementById('descripcion-plato').value;
        const precio = document.getElementById('precio-plato').value;
        const porcion = document.getElementById('porcion-plato').value;

        const response = await fetch(`/api/restaurantes/${currentRestaurantId}/platos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, descripcion, precio, porcion, sucursal: currentSucursal })
        });

        const updatedRestaurant = await response.json();

        // Actualizar la UI si es necesario
        modal.style.display = 'none';
        plateForm.reset();
    });
});
