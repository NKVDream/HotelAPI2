const API_BASE = 'https://localhost:7162/api';

class HotelApp {
    constructor() {
        // Загружаем данные после инициализации DOM
        setTimeout(() => {
            this.init();
        }, 100);
    }

    async init() {
        console.log('HotelApp initializing...');

        try {
            // Загружаем все данные параллельно для скорости
            await Promise.all([
                this.loadGuests(),
                this.loadRooms(),
                this.loadEmployees(),
                this.loadReservations()
            ]);

            this.setupEventListeners();
            console.log('HotelApp initialized successfully');
        } catch (error) {
            console.error('Error initializing HotelApp:', error);
            this.showError('Ошибка загрузки данных');
        }
    }

    setupEventListeners() {
        // Форма гостя
        const guestForm = document.getElementById('guestForm');
        if (guestForm) {
            guestForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createGuest();
            });
        }

        // Форма бронирования
        const reservationForm = document.getElementById('reservationForm');
        if (reservationForm) {
            reservationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createReservation();
            });
        }
    }

    // ========== Гости ==========
    async createGuest() {
        const name = document.getElementById('guestName');
        const surname = document.getElementById('guestSurname');
        const phone = document.getElementById('guestPhone');

        if (!name || !surname || !phone) {
            alert('❌ Не все поля формы найдены');
            return;
        }

        const guestData = {
            name: name.value.trim(),
            surname: surname.value.trim(),
            phone: phone.value.trim()
        };

        // Валидация
        if (!guestData.name || !guestData.surname || !guestData.phone) {
            alert('❌ Заполните обязательные поля: Имя, Фамилия, Телефон');
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/Guests`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(guestData)
            });

            if (response.ok) {
                const newGuest = await response.json();
                console.log('✅ Создан гость:', newGuest);

                // Очистка формы
                document.getElementById('guestForm').reset();

                // Обновление списка гостей
                await this.loadGuests();

                // Выбор нового гостя в форме бронирования
                const guestSelect = document.getElementById('guestSelect');
                if (guestSelect) {
                    guestSelect.value = newGuest.id;
                }

                alert('✅ Гость успешно добавлен!');
            } else {
                const errorText = await response.text();
                console.error('❌ Ошибка сервера:', errorText);
                alert('❌ Ошибка при добавлении гостя: ' + errorText);
            }
        } catch (error) {
            console.error('💥 Ошибка:', error);
            alert('❌ Ошибка при добавлении гостя: ' + error.message);
        }
    }

    async loadGuests() {
        try {
            const response = await fetch(`${API_BASE}/Guests`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const guests = await response.json();
            console.log('Guests loaded:', guests);

            const select = document.getElementById('guestSelect');
            if (select) {
                // Сохраняем текущее значение
                const currentValue = select.value;

                select.innerHTML = '<option value="">Выберите гостя</option>';

                guests.forEach(guest => {
                    const option = document.createElement('option');
                    option.value = guest.id;
                    option.textContent = `${guest.name} ${guest.surname} (${guest.phone})`;
                    select.appendChild(option);
                });

                // Восстанавливаем значение если оно есть
                if (currentValue && guests.some(g => g.id == currentValue)) {
                    select.value = currentValue;
                }
            }
        } catch (error) {
            console.error('Ошибка загрузки гостей:', error);
        }
    }

    // ========== Комнаты ==========
    async loadRooms() {
        try {
            const response = await fetch(`${API_BASE}/Rooms`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const rooms = await response.json();
            console.log('Rooms loaded:', rooms);

            const select = document.getElementById('roomSelect');
            if (select) {
                const currentValue = select.value;

                select.innerHTML = '<option value="">Выберите комнату</option>';

                rooms.forEach(room => {
                    const option = document.createElement('option');
                    option.value = room.id;
                    // Показываем только доступные комнаты
                    const status = room.availability ? '✅' : '❌';
                    option.textContent = `Комната ${room.id} (${room.floor} этаж, ${room.roomCapacity} чел.) ${status}`;
                    select.appendChild(option);
                });

                if (currentValue && rooms.some(r => r.id == currentValue)) {
                    select.value = currentValue;
                }
            }
        } catch (error) {
            console.error('Ошибка загрузки комнат:', error);
        }
    }

    // ========== Сотрудники ==========
    async loadEmployees() {
        try {
            const response = await fetch(`${API_BASE}/Employees`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const employees = await response.json();
            console.log('Employees loaded:', employees);

            const select = document.getElementById('employeeSelect');
            if (select) {
                const currentValue = select.value;

                select.innerHTML = '<option value="">Выберите сотрудника</option>';

                employees.forEach(employee => {
                    const option = document.createElement('option');
                    option.value = employee.id;
                    option.textContent = `${employee.name} ${employee.surname}`;
                    select.appendChild(option);
                });

                if (currentValue && employees.some(e => e.id == currentValue)) {
                    select.value = currentValue;
                }
            }
        } catch (error) {
            console.error('Ошибка загрузки сотрудников:', error);
        }
    }

    // ========== Бронирования ==========
    async createReservation() {
        const guestSelect = document.getElementById('guestSelect');
        const roomSelect = document.getElementById('roomSelect');
        const employeeSelect = document.getElementById('employeeSelect');
        const startDate = document.getElementById('startDate');
        const endDate = document.getElementById('endDate');

        if (!guestSelect || !roomSelect || !employeeSelect || !startDate || !endDate) {
            alert('Не все поля формы найдены');
            return;
        }

        // Подготовка данных как в вашем API
        const reservationData = {
            guestId: parseInt(guestSelect.value),
            roomId: parseInt(roomSelect.value),
            employeeId: parseInt(employeeSelect.value),
            startDate: startDate.value,
            endDate: endDate.value
        };

        console.log('📤 Отправляемые данные:', JSON.stringify(reservationData));

        // Валидация
        if (!reservationData.guestId || !reservationData.roomId ||
            !reservationData.employeeId || !reservationData.startDate ||
            !reservationData.endDate) {
            alert('Заполните все поля');
            return;
        }

        // Проверка дат
        if (new Date(reservationData.endDate) <= new Date(reservationData.startDate)) {
            alert('Дата выезда должна быть позже даты заезда');
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/Reservations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reservationData)
            });

            console.log('📥 Ответ сервера:', response.status);

            if (response.ok) {
                const newReservation = await response.json();
                console.log('✅ Резервация создана:', newReservation);

                // Очистка формы
                document.getElementById('reservationForm').reset();

                // Перезагрузка списка
                await this.loadReservations();

                alert(`✅ Резервация успешно создана! ID: ${newReservation.id}`);
            } else {
                const errorText = await response.text();
                console.error('❌ Ошибка сервера:', errorText);
                alert('❌ Ошибка при создании резервации: ' + errorText);
            }
        } catch (error) {
            console.error('💥 Ошибка:', error);
            alert('❌ Ошибка: ' + error.message);
        }
    }

    async loadReservations() {
        try {
            const response = await fetch(`${API_BASE}/Reservations`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reservations = await response.json();
            console.log('Reservations loaded:', reservations);

            this.displayReservations(reservations);
        } catch (error) {
            console.error('Ошибка загрузки резерваций:', error);
            this.showError('Не удалось загрузить список резерваций');
        }
    }

    displayReservations(reservations) {
        const container = document.getElementById('reservationsList');

        if (!container) {
            console.error('Reservations container not found');
            return;
        }

        if (!reservations || reservations.length === 0) {
            container.innerHTML = '<div class="loading">Нет активных резерваций</div>';
            return;
        }

        // Сортируем по дате заезда (новые сверху)
        reservations.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

        container.innerHTML = reservations.map(reservation => `
            <div class="reservation-card">
                <div class="reservation-header">
                    <span class="reservation-id">Резервация #${reservation.id}</span>
                    <span class="reservation-dates">
                        ${this.formatDate(reservation.startDate)} - ${this.formatDate(reservation.endDate)}
                    </span>
                </div>
                <div class="reservation-details">
                    <div class="detail-item">
                        <span class="detail-label">Гость ID:</span>
                        ${reservation.guestId}
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Комната ID:</span>
                        ${reservation.roomId}
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Сотрудник ID:</span>
                        ${reservation.employeeId}
                    </div>
                </div>
                <div class="reservation-actions">
                    <button class="btn btn-danger" onclick="app.deleteReservation(${reservation.id})">
                        Удалить
                    </button>
                </div>
            </div>
        `).join('');
    }

    async deleteReservation(id) {
        if (!confirm('Вы уверены, что хотите удалить эту резервацию?')) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/Reservations/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await this.loadReservations();
                alert('✅ Резервация удалена!');
            } else {
                const errorText = await response.text();
                alert('❌ Ошибка при удалении: ' + errorText);
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('❌ Ошибка при удалении: ' + error.message);
        }
    }

    // ========== Вспомогательные методы ==========
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    showError(message) {
        const container = document.getElementById('reservationsList');
        if (container) {
            container.innerHTML = `<div class="error">${message}</div>`;
        }
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function () {
    window.app = new HotelApp();
});

// Глобальная функция для удаления
window.deleteReservation = function (id) {
    if (window.app) {
        window.app.deleteReservation(id);
    }
};