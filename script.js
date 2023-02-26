const BASE_URL = `https://pokeapi.co`
const INDEX_URL = BASE_URL + `/api/v2/pokemon/`
const pokemonMenu = document.querySelector('.pokemon-menu')
const modalBox = document.querySelector('#modal-data')
const closeButton = document.querySelector('.close')
const searchForm = document.querySelector('.search')
const searchInput = document.querySelector('#search-bar')
const shinyBtn = document.querySelector('.shiny-icon ion-icon')
const turnBackBtn = document.querySelector('.turn-back-icon ion-icon')


const allPokemon = []
let searchedPokemon = []

function addToFavoriteList(id) {
    const list = JSON.parse(localStorage.getItem('favoritePokemons')) || []
    const pokemon = allPokemon.find((pokemon) => pokemon.id === id)


    if (list.some((pokemon) => pokemon.id === id)) {
        return alert('「' + pokemon.name + '」 was already added to favorite list')
    }
    list.push(pokemon)
    localStorage.setItem('favoritePokemons', JSON.stringify(list))
    return alert('Added 「' + pokemon.name + '」into favorite list')
}

function showPokemonModal(id) {
    const modalTitle = document.querySelector('#modal-title')
    const modalImage = document.querySelector('.modal-image')

    axios.get(INDEX_URL + id).then((response) => {
    const data = response.data
    
    modalTitle.innerText = `No. ${data.id}`
    modalImage.innerHTML = `<img src="${data.sprites['front_default']}">`
    

     shinyBtn.addEventListener('click', function(event) {
         const frontDefault = `<img src="${data.sprites['front_default']}">`
         const target = event.target.parentElement.parentElement.parentElement.children[0].innerHTML
         console.log(event.target)
        
         if (target === frontDefault) {
             modalImage.innerHTML = `<img src="${data.sprites['front_shiny']}">`
         } else {
             modalImage.innerHTML = `<img src="${data.sprites['front_default']}">`
         }
      })
    
    turnBackBtn.addEventListener('click', function(event) {
        const frontDefault = `<img src="${data.sprites['front_default']}">`
        const target = event.target.parentElement.parentElement.parentElement.children[0].innerHTML

        if (target === frontDefault) {
            modalImage.innerHTML = `<img src="${data.sprites['back_default']}">`
        } else {
            modalImage.innerHTML = `<img src="${data.sprites['front_default']}">`
        }
    })
    })
}

function renderPokemon(pokemon) {
    let pokeCard = ''
    
    for (let i = 0; i < pokemon.length; i++) {
        pokeCard += `
            <div class="pokemon-card">
                <div class="top">
                    <div class="id-num" data-id="${pokemon[i].id}">ID: ${pokemon[i].id}</div>
                    <div class="mark-icon-div"><ion-icon name="bookmark-outline" class="mark-icon" data-id="${pokemon[i].id}"></ion-icon></div>
                </div>
                <div class="pokemon-image">
                    <img src="${pokemon[i].img_front}" alt=${pokemon[i].name}>
                </div>
                <h2>${pokemon[i].name}</h2>
                <div class="type">${pokemon[i].types[0].type.name}</div>`
                if (pokemon[i].types.length > 1) {
                    pokeCard += `<div class="type">${pokemon[i].types[1].type.name}</div>`
                }
                pokeCard += `
                <button id="moreBtn" data-id="${pokemon[i].id}">More</button>
            </div>`
    }

    pokemonMenu.innerHTML = pokeCard
}

for (let i = 1; i <= 251; i++) {
    const INDEX_URL = BASE_URL + `/api/v2/pokemon/${i}`

    axios.get(INDEX_URL).then((response) => {
        const result = response.data

        const pokemon = {
            name: result.name,
            img_front: result.sprites['front_default'],
            img_back: result.sprites['back_default'],
            img_shiny_front: result.sprites['front_shiny'],
            img_official: result.sprites.other['official-artwork']['front_default'],
            img_shiny_official: result.sprites.other['official-artwork']['front_shiny'],
            id: result.id,
            types: result.types
        }
        allPokemon.push(pokemon)
        renderPokemon(allPokemon)
    })
}

closeButton.onclick = function() {
    modalBox.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modalBox) {
        modalBox.style.display = "none";
    }
}

pokemonMenu.addEventListener('click', function onClikckedPokemon(event) {
    const target = event.target
    if (target.matches('#moreBtn')) {
        modalBox.style.display = "block"
        showPokemonModal(Number(target.dataset.id))
    } else if (target.matches('.mark-icon')) {
        addToFavoriteList(Number(target.dataset.id))
    }

})

 searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
     event.preventDefault()
     const keyword = searchInput.value.trim().toLowerCase()

     if (keyword.length === 0) {
        return alert('Please enter a valid string')
     }

     searchedPokemon = allPokemon.filter((pokemon) => 
        pokemon.name.toLowerCase().includes(keyword)
     )

     if (searchedPokemon.length === 0) {
        return alert('Cannot find the Pokemon with keyword: ' + keyword)
     }

     renderPokemon(searchedPokemon)
     
 })

