document.addEventListener('DOMContentLoaded', () => {
    // === Theme Management ===
    const themeToggle = document.getElementById('themeToggle');
    const root = document.documentElement;
    const currentTheme = localStorage.getItem('carivo_theme') || 'dark';

    // Apply saved theme
    if (currentTheme === 'light') {
        root.setAttribute('data-theme', 'light');
        themeToggle.textContent = '🌙';
    }

    themeToggle.addEventListener('click', () => {
        let theme = root.getAttribute('data-theme');
        if (theme === 'light') {
            root.removeAttribute('data-theme');
            localStorage.setItem('carivo_theme', 'dark');
            themeToggle.textContent = '🌞';
        } else {
            root.setAttribute('data-theme', 'light');
            localStorage.setItem('carivo_theme', 'light');
            themeToggle.textContent = '🌙';
        }
    });

    // === Mock Data (Cars & Map Markers) ===
    const carData = [
        {
            id: 1,
            make: "Tesla Model 3",
            type: "electric",
            price: 85,
            location: "Limassol",
            coords: [34.6786, 33.0413],
            image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 2,
            make: "Mercedes-Benz G-Class",
            type: "suv",
            price: 250,
            location: "Paphos",
            coords: [34.7720, 32.4245],
            image: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 3,
            make: "Porsche 911",
            type: "luxury",
            price: 320,
            location: "Nicosia",
            coords: [35.1856, 33.3823],
            image: "https://images.unsplash.com/photo-1503376760367-19ea0eebda29?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 4,
            make: "Hyundai Ioniq 5",
            type: "electric",
            price: 70,
            location: "Larnaca",
            coords: [34.9167, 33.6292],
            image: "https://images.unsplash.com/photo-1620023420857-41a457a1b0b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 5,
            make: "Audi Q8",
            type: "suv",
            price: 150,
            location: "Limassol",
            coords: [34.7000, 33.0500],
            image: "https://images.unsplash.com/photo-1517364121773-8fb54d682060?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 6,
            make: "BMW 4 Series Convertible",
            type: "luxury",
            price: 180,
            location: "Ayia Napa",
            coords: [34.9829, 33.9996],
            image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        }
    ];

    // === Render Cars ===
    const carListingsContainer = document.getElementById('carListings');

    function renderCars(cars) {
        carListingsContainer.innerHTML = '';
        if (cars.length === 0) {
            carListingsContainer.innerHTML = '<p class="text-center text-muted" style="grid-column: 1/-1;">No cars found matching your criteria.</p>';
            return;
        }

        cars.forEach(car => {
            const card = document.createElement('div');
            card.className = 'car-card glass';
            card.innerHTML = `
                <img src="${car.image}" alt="${car.make}" class="car-image">
                <div class="car-info">
                    <div>
                        <h3>${car.make}</h3>
                        <p class="car-location">📍 ${car.location}</p>
                    </div>
                    <div class="car-price">€${car.price}/day</div>
                </div>
                <button class="btn btn-primary mt-2 w-100" onclick="document.getElementById('btnRegister').click()">Book Now</button>
            `;
            carListingsContainer.appendChild(card);
        });
    }

    // Initial render
    renderCars(carData);

    // === Search Functionality ===
    const btnSearch = document.getElementById('btnSearch');
    if (btnSearch) {
        btnSearch.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent any form submission or unexpected default behavior
            try {
                const locationInput = document.getElementById('searchLocation');
                const locationQuery = locationInput ? locationInput.value.toLowerCase() : '';
                
                const typeInput = document.getElementById('searchType');
                const typeQuery = typeInput ? typeInput.value : 'all';

                const filteredCars = carData.filter(car => {
                    const matchLocation = car.location.toLowerCase().includes(locationQuery);
                    const matchType = typeQuery === 'all' || car.type === typeQuery;
                    return matchLocation && matchType;
                });

                renderCars(filteredCars);
                
                // Scroll to results
                const exploreSection = document.getElementById('explore');
                if(exploreSection) {
                    exploreSection.scrollIntoView({ behavior: 'smooth' });
                }
            } catch (err) {
                console.error("Search functionality error:", err);
            }
        });
    }

    // === Interactive Map (Leaflet.js) ===
    try {
        // Center map on Cyprus
        const map = L.map('map').setView([35.0, 33.0], 8);

        // Add Dark Matter tile layer for premium look (suitable for dark theme)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        // Custom Marker Icon (Optional, using default for simplicity but stylized)
        // Add markers for each car
        carData.forEach(car => {
            const marker = L.marker(car.coords).addTo(map);
            marker.bindPopup(`<b>${car.make}</b><br>€${car.price}/day<br>${car.location}`);
        });
    } catch (e) {
        console.error("Map initialization failed. This can happen when running locally via file:// due to browser security restrictions.", e);
        const mapContainer = document.getElementById('map');
        mapContainer.innerHTML = '<div style="display:flex; align-items:center; justify-content:center; height:100%; color:var(--text-muted);">Interactive map requires HTTP/HTTPS to load correctly. Please upload to GitHub Pages or use a local server.</div>';
    }

    // Handle map redraw on theme change (if needed for light mode map tiles, though dark map looks premium on both)
    
    // === Initialize Flatpickr for Dates ===
    flatpickr("#searchDate", {
        minDate: "today",
        dateFormat: "Y-m-d",
        placeholder: "Select Date",
    });

    // === Authentication Mock Logic ===
    const btnRegister = document.getElementById('btnRegister');
    const authModal = document.getElementById('authModal');
    const closeModal = document.getElementById('closeModal');
    const btnNotify = document.getElementById('btnNotify');

    function openModal() {
        authModal.classList.add('active');
    }

    function hideModal() {
        authModal.classList.remove('active');
    }

    btnRegister.addEventListener('click', openModal);
    closeModal.addEventListener('click', hideModal);
    
    // Close modal if clicked outside
    window.addEventListener('click', (e) => {
        if (e.target === authModal) {
            hideModal();
        }
    });

    btnNotify.addEventListener('click', () => {
        btnNotify.textContent = "You're on the list!";
        btnNotify.style.background = "#10B981"; // Success green
        setTimeout(() => {
            hideModal();
            btnNotify.textContent = "Notify Me";
            btnNotify.style.background = "";
        }, 2000);
    });

    // Nav Links Smooth Scroll
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#dashboard') {
                document.getElementById('dashboard').classList.remove('hidden');
            }
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
