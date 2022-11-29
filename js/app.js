if(navigator.serviceWorker){
    navigator.serviceWorker.register("/foto/sw.js")
}


const btnCamara = document.getElementById("btnCamara")
const btnCapturar = document.getElementById("btnCapturar")

const video = document.getElementById("video")
const foto = document.getElementById("foto")
const fotosText = document.getElementById("fotos")

const imgCard = document.getElementById("imgCard")
const arrayImg = []
var camara;

btnCamara.addEventListener('click', ()=>{
    console.log("abrir camara");
    camara = new Camera(video)
    camara.power()
})

btnCapturar.addEventListener('click', () =>{

    let picture = camara.takePhoto() 
    camara.off()

    arrayImg.push(picture)
    pintarFotos()
})


const pintarFotos = () =>{
    let html = ""
    console.log(arrayImg.length);
    fotosText.innerHTML = "Numero de fotos : " + `${arrayImg.length}` 

    arrayImg.map(img =>{
        html += `<div class="carousel-item active">
        <img src=${img} class="d-block w-100" alt="...">
      </div>`

    })
    
    console.log(html);

    imgCard.innerHTML = html

}
