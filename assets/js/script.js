import { v4 as uuidv4 } from "https://jspm.dev/uuid";

let forBusqueda = document.querySelector("#formularioBusqueda form");
let btnAgregar = document.getElementById("btnAgregarPokemon");
let currentPokemon = "";
let arrayPokemones = [];

class Pokemon {
    constructor(pokedex, nombre, tipo, imagen) {
        this.id = uuidv4().slice(0, 6);
        this.pokedex = pokedex;
        this.nombre = nombre;
        this.tipo = tipo;
        this.imagen = imagen;
    }
}

forBusqueda.addEventListener("submit", async function (event) {
    event.preventDefault();
    let respuesta = await consultaPokemon(namePokemon.value);
    if (respuesta.status == "ok") {
        //types, id, name, sprites
        let { types, id, name, sprites } = respuesta.pokemon;
        let pokemon = new Pokemon(
            id,
            name,
            types[0].type.name,
            sprites.front_default
        );
        currentPokemon = pokemon;
        console.log(pokemon);
        mostrarPokemon(pokemon);
    } else {
        alert(respuesta.message);
    }
});

async function consultaPokemon(nombrePokemon = "ditto") {
    try {
        let url = "https://pokeapi.co/api/v2/pokemon/" + nombrePokemon;
        let response = await fetch(url);
        if (response.status == 200) {
            let pokemon = await response.json();
            return { status: "ok", pokemon };
        } else {
            let data = await response.text();
            console.log(data);
            return { status: false, message: "Pokémon no encontrado" };
        }
    } catch (error) {
        console.log(error);
        return {
            status: false,
            message: "Algo salió mal en la petición de pokémones",
        };
    }
}

function mostrarPokemon(pokemon) {
    let imagen = document.querySelector("#infoPokemon img");
    imagen.setAttribute("src", pokemon.imagen);
    imagen.setAttribute("alt", pokemon.nombre);
    document.getElementById("infoNombre").innerText = pokemon.nombre;
    document.getElementById("infoTipo").innerText = pokemon.tipo;
}

btnAgregar.addEventListener("click", function () {
    arrayPokemones.push(currentPokemon);
    //GUARDAR INFORMACIÓN EN EL LOCAL STORAGE
    localStorage.setItem("pokemones", JSON.stringify(arrayPokemones));
    cargarTabla(arrayPokemones);
});

function cargarTabla(pokemones) {
    console.log(pokemones);
    let cuerpoTabla = document.querySelector("#misPokemones tbody");

    let filas = "";
    pokemones.forEach((pokemon, index) => {
        filas += `
            <tr>
              <th scope="row">${index + 1}</th>
              <td>${pokemon.pokedex}</td>
              <td>${pokemon.nombre}</td>
              <td>${pokemon.tipo}</td>
              <td><button class="btn btn-danger" data-id="${
                  pokemon.id
              }" onclick="eliminarPokemon('${
            pokemon.id
        }')">Eliminar</button></td>
            </tr>
        
        `;
    });
    cuerpoTabla.innerHTML = filas;
}

function main() {
    let pokemones = JSON.parse(localStorage.getItem("pokemones"));
    if (pokemones) {
        pokemones = pokemones.map(
            (pokemon) =>
                new Pokemon(
                    pokemon.pokedex,
                    pokemon.nombre,
                    pokemon.tipo,
                    pokemon.imagen
                )
        );
        arrayPokemones = pokemones;
        cargarTabla(pokemones);
    }
}

window.eliminarPokemon = function (id) {
    console.log(id);
};

main();
