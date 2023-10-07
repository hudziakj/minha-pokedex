function obterPokemons() {
    const pokedex = document.querySelector(".pokedex");
    const url = "https://pokeapi.co/api/v2/pokemon?limit=10&offset=0";

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            const pokemonPromises = data.results.map((pokemon) => {
                return fetch(pokemon.url)
                    .then((response) => response.json())
                    .then((pokemonData) => {
                        return {
                            name: pokemon.name,
                            image: pokemonData.sprites.front_default,
                            stats: pokemonData.stats
                        };
                    });
            });

            return Promise.all(pokemonPromises);
        })
        .then((pokemonDataArray) => {
            pokemonDataArray.forEach((pokemon, index) => {
                const listItem = document.createElement('li');
                listItem.classList.add('pokemon');
                listItem.id = `pokemon-${index}`;
                listItem.innerHTML = `
                    <h3>${pokemon.name}</h3>
                    <img src="${pokemon.image}" alt="${pokemon.name}">
                `;
                listItem.addEventListener('click', () => {
                    abrirModal(pokemon);
                });
                pokedex.appendChild(listItem);
            });
        })
        .catch((error) => {
            console.error('Erro ao buscar dados da API:', error);
        });
}

function abrirModal(pokemon) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalStats = document.getElementById('modal-stats');
    const closeButton = document.querySelector('.close');
    modalTitle.textContent = pokemon.name;
    modalStats.innerHTML = '';

    pokemon.stats.forEach((stat) => {
        const statElement = document.createElement('div');
        statElement.textContent = `${stat.stat.name}: ${stat.base_stat}`;
        modalStats.appendChild(statElement);
    });

    modal.style.display = 'block';
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
}

obterPokemons();
