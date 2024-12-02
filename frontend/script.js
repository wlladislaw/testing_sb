document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('login-section');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const loader = document.getElementById('loader');
    const serviceSection = document.getElementById('service-section');
    const selectedService = document.getElementById('selected-service');
    const logoutButton = document.getElementById('logout-btn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('login-button');
    const selectConfirmButton = document.getElementById('select-button');
    const dashboardSection = document.getElementById('dashboard-section');

    function checkInputs() {
        if (usernameInput.value.trim() && passwordInput.value.trim()) {
            loginButton.classList.add('active');
            passwordInput.classList.add('active');
        } else {
            loginButton.classList.remove('active');
            passwordInput.classList.remove('active');
        }
    }

    usernameInput.addEventListener('input', checkInputs);
    passwordInput.addEventListener('input', checkInputs);

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        loader.classList.remove('hidden');
        loginButton.classList.add('loading');
        usernameInput.disabled = true;
        passwordInput.disabled = true;

        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.status === 401) {
                loginError.style.display = 'flex';
                loginButton.classList.remove('loading');
                loader.classList.add('hidden');
                loginForm.reset();
                usernameInput.disabled = false;
                passwordInput.disabled = false;
                passwordInput.classList.remove('active');
                return;
            }
            usernameInput.disabled = false;
            passwordInput.disabled = false;
            loginSection.classList.add('hidden');
            serviceSection.classList.remove('hidden');
        } catch (error) {
            loginError.style.display = 'flex';
        }
    });

    const selectPanel = document.querySelector('.select-panel');
    const dropdown = document.querySelector('.dropdown');
    const options = document.querySelectorAll('.dropdown li');
    let selectedValue = '';

    selectPanel.addEventListener('click', () => {
        dropdown.classList.toggle('hidden');
        selectPanel.parentElement.classList.toggle('open');
    });

    options.forEach((option) => {
        option.addEventListener('click', () => {
            selectedValue = option.dataset.value;
            selectPanel.textContent = option.textContent;
            dropdown.classList.add('hidden');
            selectPanel.parentElement.classList.remove('open');

            if (selectPanel.textContent !== 'Выберите сервис') {
                selectConfirmButton.classList.add('active');
                selectPanel.classList.add('active');
                selectConfirmButton.disabled = false;
            }
        });
    });

    document.addEventListener('click', (event) => {
        if (!selectPanel.parentElement.contains(event.target)) {
            dropdown.classList.add('hidden');
            selectPanel.parentElement.classList.remove('open');
        }
    });
    const bigLoader = document.querySelector('.loader-big');
    selectConfirmButton.addEventListener('click', async (e) => {
        bigLoader.classList.remove('hidden');
        serviceSection.classList.add('hidden');
        await renderChart();
        bigLoader.classList.add('hidden');
        selectedService.classList.remove('hidden');
        dashboardSection.classList.remove('hidden');

        selectedService.textContent = selectedValue;
        logoutButton.classList.remove('hidden');
    });

    const chartInfoContainer = document.querySelector('.chart-info_grid');
    async function renderChart() {
        try {
            const response = await fetch('http://localhost:3000/chart/data');
            const dataSet = await response.json();
            console.log('data: ', dataSet);

            chartInfoContainer.innerHTML = '';
            dataSet.forEach((item) => {
                const chartItem = document.createElement('div');
                chartItem.classList.add('chart-info_item');
                const colorCircle = document.createElement('span');
                colorCircle.classList.add('colorCircle');
                colorCircle.style.backgroundColor = item.color;
                const labelText = document.createTextNode(item.label);
                const percentageSpan = document.createElement('span');
                percentageSpan.classList.add('percentage');
                percentageSpan.textContent = `${item.value}%`;
                chartItem.appendChild(colorCircle);
                chartItem.appendChild(labelText);
                chartItem.appendChild(percentageSpan);

                chartInfoContainer.appendChild(chartItem);
            });
            const ctx = document.getElementById('chart').getContext('2d');

            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: dataSet.map((label) => label.label),
                    datasets: [
                        {
                            data: dataSet.map((per) => per.value),
                            backgroundColor: dataSet.map((color) => color.color),
                            borderWidth: 0,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false,
                        },
                    },
                    cutout: '85%',
                    offset: 6,

                    layout: {
                        padding: 30,
                    },
                },
            });

            Chart.register({
                id: 'labels-plugin',
                afterDraw(chart) {
                    const { ctx, data } = chart;
                    const dataset = data.datasets[0];
                    const meta = chart.getDatasetMeta(0);

                    ctx.font = '14px Arial';
                    ctx.textBaseline = 'middle';
                    ctx.textAlign = 'center';

                    meta.data.forEach((arc, index) => {
                        const { startAngle, endAngle } = arc;
                        const angle = (startAngle + endAngle) / 2;
                        const radius = arc.outerRadius + 20;
                        const x = arc.x + radius * Math.cos(angle);
                        const y = arc.y + radius * Math.sin(angle);
                        const value = dataset.data[index];
                        const percentage = value + '%';
                        ctx.fillStyle = dataset.backgroundColor[index];
                        ctx.fillText(percentage, x, y);
                    });
                },
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    const modalOverlay = document.querySelector('.modal-overlay');
    const cancelBtn = document.querySelector('.modal__cancel-btn');
    const closeModalBtn = document.querySelector('.modal__close-btn');
    const confirmLogoutBtn = document.querySelector('.modal__confirm-btn');

    logoutButton.addEventListener('click', () => {
        modalOverlay.classList.remove('hidden');
    });

    [cancelBtn, closeModalBtn].forEach((btn) => {
        btn.addEventListener('click', () => {
            modalOverlay.classList.add('hidden');
        });
    });

    confirmLogoutBtn.addEventListener('click', async () => {
        try {
            await fetch('http://localhost:3000/auth/logout');
            modalOverlay.classList.add('hidden');
            logoutButton.classList.add('hidden');
            selectedService.classList.add('hidden');
            serviceSection.classList.add('hidden');
            dashboardSection.classList.add('hidden');
            loginSection.classList.remove('hidden');
            loginForm.reset();
            loginButton.classList.remove('active');
            loginError.style.display = 'none';
            loginButton.classList.remove('loading');
            loader.classList.add('hidden');
            passwordInput.classList.remove('active');
        } catch (error) {
            console.log('error: ', error);
        }
    });
});
