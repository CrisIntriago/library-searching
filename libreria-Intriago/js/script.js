(function ($) {

  "use strict";

  // product quantity
  var initProductQty = function () {

    $('.product-qty').each(function () {

      var $el_product = $(this);
      var quantity = 0;

      $el_product.find('.quantity-right-plus').click(function (e) {
        e.preventDefault();
        var quantity = parseInt($el_product.find('#quantity').val());
        $el_product.find('#quantity').val(quantity + 1);
      });

      $el_product.find('.quantity-left-minus').click(function (e) {
        e.preventDefault();
        var quantity = parseInt($el_product.find('#quantity').val());
        if (quantity > 0) {
          $el_product.find('#quantity').val(quantity - 1);
        }
      });

    });

  }

  $(document).ready(function () {

    /* Video */
    var $videoSrc;
    $('.play-btn').click(function () {
      $videoSrc = $(this).data("src");
    });

    $('#myModal').on('shown.bs.modal', function (e) {

      $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
    })

    $('#myModal').on('hide.bs.modal', function (e) {
      $("#video").attr('src', $videoSrc);
    })

    var swiper = new Swiper(".main-swiper", {
      speed: 800,
      loop: true,
      pagination: {
        el: ".main-slider-pagination",
        clickable: true,
      },
    });

    var swiper = new Swiper(".product-swiper", {
      speed: 800,
      spaceBetween: 20,
      navigation: {
        nextEl: ".product-carousel-next",
        prevEl: ".product-carousel-prev",
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        480: {
          slidesPerView: 2,
        },
        900: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        1200: {
          slidesPerView: 5,
          spaceBetween: 20,
        }
      },
    });

    var swiper = new Swiper(".testimonial-swiper", {
      speed: 800,
      navigation: {
        nextEl: ".testimonial-arrow-next",
        prevEl: ".testimonial-arrow-prev",
      },
    });

    var swiper = new Swiper(".product-swiper2", {
      speed: 800,
      spaceBetween: 20,
      navigation: {
        nextEl: ".product-carousel-next2",
        prevEl: ".product-carousel-prev2",
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        480: {
          slidesPerView: 2,
        },
        900: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        1200: {
          slidesPerView: 5,
          spaceBetween: 20,
        }
      },
    });

    var thumb_slider = new Swiper(".thumb-swiper", {
      slidesPerView: 1,
    });
    var large_slider = new Swiper(".large-swiper", {
      spaceBetween: 10,
      effect: 'fade',
      thumbs: {
        swiper: thumb_slider,
      },
    });

    initProductQty();

  }); // End of a document ready

})(jQuery);

var parser = new DOMParser();

export default async function fetchData() {

  let librosData = localStorage.getItem("librosData");
  let imagenesData = localStorage.getItem("imagenesData");

  if (librosData == null && imagenesData == null) {

    try {
      let resultado1 = await fetch("https://raw.githubusercontent.com/DAWMFIEC/DAWM-apps/datos/bookstore-books.xml")

      // Anteponga await a la conversión de la variable resultado a texto
      let librosData = await resultado1.text()
      let resultado2 = await fetch("https://raw.githubusercontent.com/DAWMFIEC/DAWM-apps/datos/bookstore-images.json")

      let imagenesData = await resultado2.text()

      const xml = parser.parseFromString(librosData, 'application/xml');
      const jsonObject = JSON.parse(imagenesData);
      let books = xml.querySelectorAll('book')

      localStorage.setItem("librosData", librosData);
      localStorage.setItem("imagenesData", imagenesData);

      cargarLibros(librosData, imagenesData);

    }
    catch (error) {
      console.error('Error fetching data:', error);
    }

  } else {

    //Si está almacenado en el localStorage
    cargarLibros(librosData, imagenesData);

  }

  listaXML();

}

function listaXML() {
  if (localStorage.getItem("listaXML")== null) {
      let librosData = localStorage.getItem("librosData");
      let imagenesData = localStorage.getItem("imagenesData");
      const xml = parser.parseFromString(librosData, 'application/xml');
      let books = xml.querySelectorAll('book');
      let lista = [];


      for (let i = 0; i < books.length; i++) {
        let book = books[i]
        let codigo = book.querySelector('ISBN') ? book.querySelector('ISBN').textContent : 'fasd'
        let añoPublicacion = book.querySelector('Year-Of-Publication') ? book.querySelector('Year-Of-Publication').textContent : 'fasd'
        let autorLibro = book.querySelector('Book-Author') ? book.querySelector('Book-Author').textContent : 'dsaf'
        let nombreLibro = book.querySelector('Book-Title') ? book.querySelector('Book-Title').textContent : 'afds'

        lista.push({
          "codigo": codigo,
          "añoPublicacion": añoPublicacion,
          "autorLibro": autorLibro,
          "nombreLibro": nombreLibro
        })
      }
      localStorage.setItem("listaXML",JSON.stringify(lista));
  }
}

function cargarLibro(imagen, autorLibro, añoPublicacion, nombreLibro) {
  let element = document.getElementById("aquiLibros");
  let plantilla = `
                <div class="col-lg-2 mb-2 text-center">
                  <div class="card border-0 rounded-0">
                    <div class="card-image">
                      <img src=${imagen} alt="blog-img" class="img-fluid">
                    </div>
                  </div>
                  <div class="card-body text-capitalize">
                    <div class="card-meta fs-6">
                      <span class="meta-date"> ${autorLibro} </span>
                      <span class="meta-category">/ <a href="blog.html"> ${añoPublicacion} </a></span>
                    </div>
                    <h4 class="card-title">
                      <a href="buy.html"> ${nombreLibro} </a>
                    </h4>
                  </div>
                </div>`;
  element.innerHTML += plantilla;
}



function cargarLibros(librosData, imagenesData) {

  const xml = parser.parseFromString(librosData, 'application/xml');
  const jsonObject = JSON.parse(imagenesData);
  let books = xml.querySelectorAll('book');

  for (let i = 0; i < books.length; i++) {

    let book = books[i];
    let añoPublicacion = book.querySelector('Year-Of-Publication') ? book.querySelector('Year-Of-Publication').textContent : 'fasd'
    let autorLibro = book.querySelector('Book-Author') ? book.querySelector('Book-Author').textContent : 'dsaf'
    let nombreLibro = book.querySelector('Book-Title') ? book.querySelector('Book-Title').textContent : 'afds'
    let imagen = jsonObject[i]['Image-URL-M'];

    cargarLibro(imagen, autorLibro, añoPublicacion, nombreLibro);

  }
}


// Para buscar usaré la libreria fuse.js


function buscar(input) {

  if (input.value !== '') {

    lista= localStorage.getItem("listaXML");
    console.log(lista);
    console.log("Usted buscó: " + input.value);


    const options = {
      includeScore: false,
      // Search in `author` and in `tags` array
      keys: ['autorLibro', 'nombreLibro', 'añoPublicacion']
    }

    const fuse = new Fuse(lista, options)
    console.log("Resultados de la búsqueda: ")
    console.log(fuse.search(input.value));

  }



}

var button = document.getElementsByClassName('btn border-2')[0];
var input = document.getElementsByClassName('form-control border-0 p-0')[0];

// Add an event listener to the button
button.addEventListener('click', function () {
  buscar(input);
});



