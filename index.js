const producto = document.querySelector(".producto");
const sidebar = document.querySelector(".sidebar");
let formulario = document.getElementById("idForm");
let botonMostrarUsuarios = document.getElementById("idbotonMostrarUsers");
let divUsers = document.getElementById("divUsuarios");
let botonMostrarCarrito = document.getElementById("botonMostrarCarrito");
let divCarrito = document.getElementById("carrito");

let aumentoPrecios = 1.2; // --> Modificar esta variable para aumentar el precio de los productos
let productoSeleccionado;

//Usuarios
class User {
  constructor(user, email, password) {
    this.user = user;
    this.email = email;
    this.password = password;
  }

  loguearse() {
    console.log(`${this.user} esta logeado correctamente.`);
  }
}

let arrayUsuarios = [];

if (localStorage.getItem(`usuarios`)) {
  arrayUsuarios = JSON.parse(localStorage.getItem(`usuarios`));
} else {
  localStorage.setItem(`usuarios`, JSON.stringify(arrayUsuarios));
}

formulario.addEventListener(`submit`, (e) => {
  e.preventDefault();

  let user = document.getElementById("idUser").value;
  let email = document.getElementById("idEmail").value;
  let password = document.getElementById("idPassword").value;

  if (!arrayUsuarios.some((usuarioEnArray) => usuarioEnArray.email == email)) {
    const usuario = new User(user, email, password);
    arrayUsuarios.push(usuario);
    localStorage.setItem(`usuarios`, JSON.stringify(arrayUsuarios));
    formulario.reset();
  }
});
//Muestra los usuarios
botonMostrarUsuarios.addEventListener(`click`, () => {
  divUsers.innerHTML = "";
  arrayUsuarios.forEach((usuarioEnArray, indice) => {
    divUsers.innerHTML += `
      <div class="card" id="user${indice}" style="width: 18rem;">        
          <div class="card-body">
            <h5 class="card-title">Usuario ${usuarioEnArray.user}</h5>
            <p class="card-text">Email: ${usuarioEnArray.email}</p>
            <button id="boton${indice}" class="btn btn-danger">Eliminar</button>
          </div>
    </div>
    `;
  });
});

//Productos
class Producto {
  constructor(id, nombre, precio, stock) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
  }

  sumaIVA() {
    this.precio *= 1.21;
  }
  aumentarPrecio() {
    if (aumentoPrecios < 1) {
      this.precio = this.precio * aumentoPrecios + this.precio;
    } else {
      this.precio *= aumentoPrecios;
    }
  }
}

const producto1 = new Producto(1, "Grasa", 500, 1);
const producto2 = new Producto(2, "Desengrasante", 1000, 1);
const producto3 = new Producto(3, "Aceite", 750, 1);
const producto4 = new Producto(4, "Refrigerante", 800, 1);
const producto5 = new Producto(5, "Próximamente", 000, 1);
const producto6 = new Producto(5, "Próximamente", 000);
const producto7 = new Producto(5, "Próximamente", 000);
const producto8 = new Producto(5, "Próximamente", 000);
const producto9 = new Producto(5, "Próximamente", 000);

const productos = [
  producto1,
  producto2,
  producto3,
  producto4,
  producto5,
  producto6,
  producto7,
  producto8,
  producto9,
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const usuario = document.getElementById("usuario");

//Método Aumentar precio productos
productos.forEach((listaProductos) => {
  listaProductos.aumentarPrecio();
});

//Mostrar productos en el html
let divProducto = document.getElementById("producto");

productos.forEach((productoEnArray) => {
  if (productoEnArray.stock > 0) {
    divProducto.innerHTML += `
  <div id="${productoEnArray.id}" class="card bg-light mb-3" style="max-width: 20rem;">
    <div class="nombre card-header">${productoEnArray.nombre}</div>
    <div class="card-body">
      <p class="precio card-text">Precio: $<span>${productoEnArray.precio}</span>.</p>
      <button data-id="${productoEnArray.id}" class="botonAgregar btn btn-info">Agregar al carrito</button>
    </div>
  </div>
`;

    //Btn agregar al carrito
    const btnAgregar = document.querySelectorAll(".botonAgregar");
    btnAgregar.forEach((e) =>
      e.addEventListener("click", (e) => {
        let cardPadre = e.target.parentElement.parentElement;
        agregarAlCarrito(cardPadre);
      })
    );
  }
});

//Agregar al carrito
const agregarAlCarrito = (cardPadre) => {
  let producto = {
    nombre: cardPadre.querySelector(".nombre").textContent,
    precio: Number(cardPadre.querySelector(".precio span").textContent),
    cantidad: 1,
    id: Number(cardPadre.querySelector("button").getAttribute("data-id")),
  };

  let productoEncontrado = carrito.find(
    (element) => element.id === producto.id
  );
  //Operador ternario
  productoEncontrado ? productoEncontrado.cantidad++ : carrito.push(producto);

  mostrarCarrito();
};
//Mostrar carrito
botonMostrarCarrito.addEventListener(`click`, () => {
  sidebar.classList.toggle("active");
});

const mostrarCarrito = () => {
  sidebar.innerHTML = "";
  carrito.forEach((element) => {
    let { nombre, precio, id, stock, cantidad } = element;
    sidebar.innerHTML += `
      <div class="card" id="producto${id}" style="width: 18rem;">        
          <div class="card-body">
            <h5 class="card-title">Nombre: ${nombre}</h5>
            <p class="card-text">Cantidad:${cantidad}</p>            
            <p class="card-text">Precio: $${precio}</p>
            <p class="card-text">Subtotal:${precio * cantidad}</p>
            <button data-id="${id}" class="btn-restar btn btn-danger">-</button>
            <button data-id="${id}" class="btn-borrar btn btn-danger">Borrar</button>
          </div>
    </div>
    `;
  });
  localStorage.setItem("carrito", JSON.stringify(carrito));
};

const restarProducto = (productoRestar) => {
  let productoEncontrado = carrito.find(
    (element) => element.id === Number(productoRestar)
  );
  if (productoEncontrado) {
    productoEncontrado.cantidad--;
    if (productoEncontrado.cantidad === 0) {
      productoEncontrado.cantidad = 1;
    }
  }
  mostrarCarrito();
};

const borrarProducto = (productoBorrar) => {
  carrito = carrito.filter((element) => element.id !== Number(productoBorrar));
  mostrarCarrito();
};

const escucharBotonesSidebar = () => {
  sidebar.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-restar")) {
      restarProducto(e.target.getAttribute("data-id"));
    }
    if (e.target.classList.contains("btn-borrar")) {
      borrarProducto(e.target.getAttribute("data-id"));
    }
  });
};

mostrarCarrito();
escucharBotonesSidebar();
