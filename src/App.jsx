import './App.css'
import imgSubir from '../src/assets/nube-subir.png';
import imgVideo from '../src/assets/video.png'
import { useState, useRef} from 'react';

function App() {

  const [idioma, setIdioma] = useState("");
  const [archivoSubido, setArchivoSubido] = useState(false); 
  const [ruta, setRuta] = useState(imgSubir);
  const [mensaje, setMensaje] = useState("Arrastra tu video aquí o haz click para buscar");
  const refSubir = useRef(null);
  const refInput = useRef();

  const handleIdioma = (newIdioma) => {
    setIdioma(newIdioma);
    //Solo se usa para usar la variable en algo por ahora, en futuros cambios se usara para seleccionar el lenguaje apropiado 
    console.log(idioma)
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    if(archivoSubido == false){
      refSubir.current.style.backgroundColor = "#b3a1ea";
    }
  }
  const handleDragLeave = () => {
    if(archivoSubido == false){
      refSubir.current.style.backgroundColor = "#0F172A";
    }
  }

  const handleDrop = (e) => {
    if(archivoSubido == false){
      e.preventDefault();
      refSubir.current.style.backgroundColor = "#0F172A";
      const files = e.dataTransfer.files;
      const file = files[0];
      if(file.type == "video/mp4"){
        //Me espero a ver como funciona el pase del video a la API para entonces manipular el archivo
        refSubir.current.style.border = "none";
        setArchivoSubido(true);
        setRuta(imgVideo);
        setMensaje("Video cargado correctamente");
      }
      else{
        alert("Formato no valido, intentalo de nuevo");
        setArchivoSubido(false);
      }
    }
  }
  
  const handleClick = () => {
    refInput.current.click();
  }

  const handleOnChange = (e) => {
    if(archivoSubido == false){
      e.preventDefault();
      const files = e.target.files;
      const file = files[0];
      if(file){
        refSubir.current.style.border = "none";
        setArchivoSubido(true);
        setRuta(imgVideo);
        setMensaje("Video cargado correctamente");
      }else{
        setArchivoSubido(false);
        alert("Formato no valido o error al cargar el video, intentalo de nuevo");
      }
    }
  }

  const handleSubir = () => {
    if(archivoSubido && idioma != ""){
      alert("En proceso de traducción");
    }else{
      alert("Asegurate de adjuntar un video y seleccionar un idioma")
    }
  }

  return (
    <>
      <div className='container'>
        <h2 style={{color: '#F8FAFC'}}>Video Translator</h2>
        <div className='subirVideo' onDragOver={(e) => handleDragOver(e)} onDragLeave={() => handleDragLeave()} onDrop={(e) => handleDrop(e)} ref={refSubir} onClick={() => {handleClick()}}>
          <p style={{color: '#F8FAFC'}}>{mensaje}</p>
          <img src={ruta}/>
        </div>
        <input type='file' accept='video/*' ref={refInput} style={{display: 'none'}} onChange={(e) => {handleOnChange(e)}} />
        <p style={{color: '#9fabbb', fontSize: '12px'}}>Opciones de traducción<br></br>
          ¡Rompe las barreras del idioma!
        </p>
        <div className='containerBotones'>
          <button className='botonConfig' onClick={() => handleIdioma("Ingles")}>Ingles</button>
          <button className='botonConfig' onClick={() => handleIdioma("Japones")}>Japones</button>
          <button className='botonConfig' onClick={() => handleIdioma("Ruso")}>Ruso</button>
          <button className='botonConfig' onClick={() => handleIdioma("Español")}>Español</button>
        </div>
        <button className='botonSubir' onClick={() => handleSubir()}>Subir video y traducir</button>
      </div>
    </>
  )
}

export default App
