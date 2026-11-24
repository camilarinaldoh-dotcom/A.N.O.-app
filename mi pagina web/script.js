
const SPACE_ID = "8q0d67aurs1l";
const ACCESS_TOKEN = "FrdCNQg4cgF7woNC3gWvF7IrSG7tNNi6CFrmtYsrA_M";
const CONTENT_TYPE = "app";


const URL = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/master/entries?access_token=${ACCESS_TOKEN}&content_type=${CONTENT_TYPE}&include=2`;

function buscarImagen(assets, id) {
  const asset = assets.find((a) => a.sys.id === id);
  if (!asset) return null;
  return {
    url: "https:" + asset.fields.file.url, // la URL viene sin "https:"
    titulo: asset.fields.title || "Imagen de A.N.O.",
  };
}

async function cargarContenido() {
  try {
    const respuesta = await fetch(URL);
    const datos = await respuesta.json();

    const entrada = datos.items[0].fields;
    const assets = (datos.includes && datos.includes.Asset) || [];

    document.getElementById("nombre").textContent = entrada.nombre;
    document.getElementById("descripcion").textContent = entrada.descripcion;

    const listaFunc = document.getElementById("funcionalidades");
    listaFunc.innerHTML = "";
    (entrada.funcionalidades || []).forEach((texto) => {
      const li = document.createElement("li");
      li.textContent = texto;
      listaFunc.appendChild(li);
    });

    const campoImagen = entrada.imagen || entrada.image;
    if (campoImagen) {
      const img = buscarImagen(assets, campoImagen.sys.id);
      if (img) {
        document.getElementById("imagen").src = img.url;
        document.getElementById("imagen").alt = img.titulo;
      }
    }


    document.getElementById("problema").textContent = entrada.problema || "";

   
    const galeria = document.getElementById("galeria");
    galeria.innerHTML = "";
    (entrada.galeria || []).forEach((item) => {
      const img = buscarImagen(assets, item.sys.id);
      if (img) {
        const etiqueta = document.createElement("img");
        etiqueta.src = img.url;
        etiqueta.alt = img.titulo;
        galeria.appendChild(etiqueta);
      }
    });


    const guia = document.getElementById("guia");
    guia.innerHTML = "";
    (entrada.guia || []).forEach((paso) => {
      const li = document.createElement("li");
      li.textContent = paso;
      guia.appendChild(li);
    });

   
    if (entrada.enlaceFigma) {
      document.getElementById("enlace-figma").href = entrada.enlaceFigma;
    }
  } catch (error) {
    console.error("No se pudo cargar el contenido de Contentful:", error);
  }
}

cargarContenido();