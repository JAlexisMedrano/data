fetch('https://raw.githubusercontent.com/JAlexisMedrano/data/refs/heads/main/channels.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('channel-container');
        const categoryList = document.getElementById('category-list');
        const categorias = data.categorias;

        const categoryItems = [];
        for (const categoria in categorias) {
            const categoryItem = document.createElement('li');
            categoryItem.textContent = categoria;
            categoryItem.setAttribute('tabindex', '0');

            categoryItem.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    loadCategory(categoria);
                }
            });

            categoryItems.push(categoryItem);
            categoryList.appendChild(categoryItem);
        }

        function loadCategory(selectedCategory) {
            container.innerHTML = '';

            const selectedChannels = categorias[selectedCategory];
            const categoryContainer = document.createElement('div');
            categoryContainer.classList.add('carousel-container');

            selectedChannels.forEach((channel) => {
                const card = document.createElement('div');
                card.classList.add('card');
                card.setAttribute('tabindex', '0');

                card.innerHTML = `
                    <a href="${channel.link}" target="_blank">
                        <img src="${channel.image}" alt="${channel.name}">
                        <h4>${channel.name}</h4>
                    </a>
                `;

                card.addEventListener('focus', () => {
                    card.classList.add('focused');
                });

                card.addEventListener('blur', () => {
                    card.classList.remove('focused');
                });

                card.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') {
                        window.open(card.querySelector('a').href, '_blank');
                    } else if (event.key === 'ArrowLeft') {
                        const index = Array.prototype.indexOf.call(categoryContainer.children, card);
                        if (index === 0) {
                            // Volver al menú lateral
                            categoryItems[0].focus();
                            document.getElementById('sidebar').style.display = 'block'; // Mostrar el menú
                        } else {
                            const prevCard = categoryContainer.children[index - 1];
                            if (prevCard) prevCard.focus();
                        }
                    } else if (event.key === 'ArrowRight') {
                        const index = Array.prototype.indexOf.call(categoryContainer.children, card);
                        const nextCard = categoryContainer.children[index + 1];
                        if (nextCard) nextCard.focus();
                    } else if (event.key === 'ArrowUp') {
                        // Volver al menú lateral desde la primera card
                        categoryItems[0].focus();
                        document.getElementById('sidebar').style.display = 'block'; // Mostrar el menú
                    }
                });

                categoryContainer.appendChild(card);
            });

            container.appendChild(categoryContainer);

            if (categoryContainer.children.length > 0) {
                categoryContainer.children[0].focus();
            }
        }

        let currentCategoryIndex = 0;

        categoryItems.forEach((item, index) => {
            item.addEventListener('keydown', (event) => {
                if (event.key === 'ArrowDown') {
                    currentCategoryIndex = (index + 1) % categoryItems.length;
                    categoryItems[currentCategoryIndex].focus();
                } else if (event.key === 'ArrowUp') {
                    currentCategoryIndex = (index - 1 + categoryItems.length) % categoryItems.length;
                    categoryItems[currentCategoryIndex].focus();
                } else if (event.key === 'ArrowRight') {
                    const firstCard = container.querySelector('.card');
                    if (firstCard) {
                        firstCard.focus();
                        document.getElementById('sidebar').style.display = 'none'; // Ocultar el menú
                    }
                }
            });
        });

        document.getElementById('hamburger').addEventListener('click', () => {
            const sidebar = document.getElementById('sidebar');
            sidebar.style.display = sidebar.style.display === 'block' ? 'none' : 'block';
        });
    })
    .catch(error => console.error('Error cargando el JSON:', error));
