//sdk d azure para traducir y genera voz
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
//voces q usaremos para el idioma escogido
const voiceMap = {
    "en": "en-US-AriaNeural",    
    "ja": "ja-JP-NanamiNeural",  
    "ru": "ru-RU-SvetlanaNeural" 
};
//FUNCION PARA LA TRADUCCION, ESTA ES LA Q HAY Q IMPORTA
//recibimos el audio, el idioma d origen y el idioma al que queremos traducir
export const translateAudio = (audioFile, sourceLanguage = "es-MX", targetLanguage) => {
    return new Promise((resolve, reject) => {
        //las credenciales 
        const speechKey = import.meta.env.VITE_AZURE_SPEECH_KEY;
        const speechRegion = import.meta.env.VITE_AZURE_SPEECH_REGION;
// por si no hay nada
        if (!speechKey || !speechRegion) {
            return reject(new Error("Faltan las credenciales de Azure en .env"));
        }
//configuramos la traduccion y el reconocimiento del audio con las llaves que tenemos 
        const translationConfig = sdk.SpeechTranslationConfig.fromSubscription(speechKey, speechRegion);
        //le decimos el idioma del udio
        translationConfig.speechRecognitionLanguage = sourceLanguage;
        //el idoma al q traducir
        translationConfig.addTargetLanguage(targetLanguage);
// se convierte el auido 
        const audioInputConfig = sdk.AudioConfig.fromWavFileInput(audioFile);
        //se crea el reconocedor de la traduccion
        const recognizer = new sdk.TranslationRecognizer(translationConfig, audioInputConfig);
//instruccines para el reconomineot y la traduccion
        recognizer.recognizeOnceAsync(
            (result) => {
                if (result.reason === sdk.ResultReason.TranslatedSpeech) {
                    //se tiene el texto traducido
                    const translatedText = result.translations.get(targetLanguage);
                    //configuracion del speech 
                    const speechConfig = sdk.SpeechConfig.fromSubscription(speechKey, speechRegion);
                    //se elige la voz segun el idoma q se escoja, o default la vox en inlges
                    speechConfig.speechSynthesisVoiceName = voiceMap[targetLanguage] || "en-US-AriaNeural";
                    //se creae el sintetizador d ela voz
                    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, null);
                    //se le da el texto para que lo diga
                    synthesizer.speakTextAsync(
                        translatedText,
                        (synthResult) => {
                            if (synthResult.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                                //se crea un blob con el audio generado para poder reproducirlo o descargarlo
                                const audioBlob = new Blob([synthResult.audioData], { type: "audio/wav" });
                                resolve({
                                    texto: translatedText,
                                    audioBlob: audioBlob
                                });
                            } else {
                                reject(new Error("Se tradujo el texto, pero falló la generación de voz."));
                            }
                            synthesizer.close();
                        },
                        (err) => {
                            reject(new Error(`Error en síntesis: ${err}`));
                            synthesizer.close();
                        }
                    );

                } else {
                    reject(new Error("No se pudo reconocer o traducir el audio."));
                }
                recognizer.close();
            },
            (error) => {
                reject(new Error(`Error en reconocimiento: ${error}`));
                recognizer.close();
            }
        );
    });
};