  import './Home.css'
  import imgSubir from '../../assets/nube-subir.png';
  import imgVideo from '../../assets/video.png'
  import { useState, useRef } from 'react';
  import { translateAudio } from '../../services/azureTranslator';

  const Home = () => {

    const [idioma, setIdioma] = useState("");
    const [archivoSubido, setArchivoSubido] = useState(false); 
    const [ruta, setRuta] = useState(imgSubir);
    const [mensaje, setMensaje] = useState("Arrastra tu audio aquí o haz click para buscar");
    const refSubir = useRef(null);
    const refInput = useRef();
    const [file, setFile] = useState(null);
    const [audioTraducido, setAudioTraducido] = useState(null);
    const [traducido, setTraducido] = useState(false);


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
      if(file.type.startsWith("audio/")){
        //Me espero a ver como funciona el pase del video a la API para entonces manipular el archivo
        refSubir.current.style.border = "none";
        setArchivoSubido(true);
        setRuta(imgVideo);
        setMensaje("Audio cargado correctamente");
        setFile(file);
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
        setFile(file);
        setMensaje("Audio  cargado correctamente");
      }else{
        setArchivoSubido(false);
        alert("Formato no valido o error al cargar el audio, intentalo de nuevo");
      }
    }
  }

/*Función asincrona fetch para conexión a la ruta convert de la API local para convertir el audio a formato wav*/
const convertirAWav = async (file) => {
  const formData = new FormData();
  formData.append("audio", file);

    const res = await fetch("/convert",  {
      method: "POST",
      body: formData
    });

    const audiofinal = await res.blob();

    return new File([audiofinal], "audio.wav", { type: "audio/wav" });
  };



const handleSubir = async () => {
  if (archivoSubido && idioma !== "") {
      const idiomaMap = {"Ingles": "en","Japones": "ja", "Ruso": "ru", "Español": "es"};
      const wavFile = await convertirAWav(file);
      const result = await translateAudio(wavFile,"es-MX",idiomaMap[idioma]);
      /*Audio traducido*/
      setAudioTraducido(result.audioBlob);
      setTraducido(true);
      console.log(result.texto);
      } else {
      alert("Asegurate de adjuntar un audio y seleccionar un idioma");
    }
  };

  return (
    <>
      {
        !traducido 
        ? 
        (
          <div className='container'>
            <h2 style={{color: '#F8FAFC'}}>Audio Translator</h2>
            <div className='subirVideo' onDragOver={(e) => handleDragOver(e)} onDragLeave={() => handleDragLeave()} onDrop={(e) => handleDrop(e)} ref={refSubir} onClick={() => {handleClick()}}>
              <p style={{color: '#F8FAFC'}}>{mensaje}</p>
              <img src={ruta}/>
            </div>
            <input type='file' accept='audio/*' ref={refInput} style={{display: 'none'}} onChange={(e) => {handleOnChange(e)}} />
            <p style={{color: '#9fabbb', fontSize: '12px'}}>Opciones de traducción<br></br>
              ¡Rompe las barreras del idioma!
            </p>
            <div className='containerBotones'>
              <button className='botonConfig' onClick={() => handleIdioma("Ingles")}>Ingles</button>
              <button className='botonConfig' onClick={() => handleIdioma("Japones")}>Japones</button>
              <button className='botonConfig' onClick={() => handleIdioma("Ruso")}>Ruso</button>
              <button className='botonConfig' onClick={() => handleIdioma("Español")}>Español</button>
            </div>
            <button className='botonSubir' onClick={() => handleSubir()}>Subir audio y traducir</button>
          </div>
        )
        : 
        (
          <div className='container'>
            <div className="containerTitle">
              <p style={{fontSize: 30, fontWeight: 'bold'}}>Resultados</p>
            </div>
            <div className='containerAudio'>
              <p style={{fontSize: 20, fontWeight: 'bold'}}>Original</p>
              <audio controls src={URL.createObjectURL(file)} style={{width: '80%', height: '35%'}}></audio>
            </div>
            <div className='containerAudio'>
              <p style={{fontSize: 20, fontWeight: 'bold'}}>Traducido</p>
              <audio controls src={audioTraducido} style={{width: '80%', height: '35%'}}></audio>
            </div>
            <button className='botonVolver'>Regresar</button>
          </div>
        )
      }
    </>
  )
}

  export default Home;