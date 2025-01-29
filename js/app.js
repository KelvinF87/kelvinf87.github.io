document.addEventListener("DOMContentLoaded", () => {
    const imagenpersonage = document.getElementById('imgPersonage');
    const spanDisparo = document.getElementById('spanDisparo');
    const disparoContainer = document.getElementById("disparoContainer");
    // const preguntas = document.getElementById("preguntas");
    // const respuestas = document.getElementById("respuestas");
    const audioDispara = new Audio("sound/disparo.mp3");
    const audioEvalua = new Audio("sound/correct.mp3");

    // const muestraVidas = document.getElementById("muestraVidas");
    const cajaRespuestas = document.querySelector(".caja-respuestas");
    const hPregunta = document.getElementById("hPregunta");
    const btnInicia = document.getElementById("btnInicia");
    const pantallaInicial = document.getElementById("pantallaInicial");
    const pantallaFinal = document.getElementById("pantallaFinal");
    const audioFondo = new Audio("sound/inicio.mp3");
    const nombreGamer = document.getElementById("nombreGamer");
    const btnFinal = document.getElementById("btnFinal");
    const puntos = document.getElementById("puntos");
    const canva = document.querySelector(".canva");
    const conSonido = document.getElementById("conAudio");
    const sinSonido = document.getElementById("sinAudio");
    const h2Conteo = document.getElementById("h2Conteo");
    const balas = document.getElementById("balas");
    const cantBalas = document.getElementById("cantBalas");
    const comprarBalas = document.getElementById("comprarBalas"); // Nuevo botón
    const pirataDisparado = document.getElementById("pirataDisparado");
    let acumuladorTiempo = 0
    let esperaJuego = 1000;
    let conteo = 10;

    // preguntas
    const listaPreguntas = [
        new Preguntas("¿Cuál es la capital de Gran Canaria?", ["Las Palmas de Gran Canaria", "Santa Cruz de Tenerife", "Arrecife", "Puerto del Rosario"], "Las Palmas de Gran Canaria", 1),
        new Preguntas("¿Qué famoso parque natural se encuentra en Gran Canaria?", ["Parque Nacional de Garajonay", "Parque Nacional de Timanfaya", "Parque Nacional del Teide", "Parque Natural de Tamadaba"], "Parque Natural de Tamadaba", 2),
        new Preguntas("¿Cuál es el punto más alto de Gran Canaria?", ["Pico de las Nieves", "Roque Nublo", "Pico del Teide", "Montaña de Tindaya"], "Pico de las Nieves", 3),
        new Preguntas("¿Qué famosa playa se encuentra en el sur de Gran Canaria?", ["Playa de las Canteras", "Playa de Maspalomas", "Playa de Sotavento", "Playa de Famara"], "Playa de Maspalomas", 4),
        new Preguntas("¿Cuál es el aeropuerto principal de Gran Canaria?", ["Aeropuerto de Gran Canaria", "Aeropuerto de Tenerife Sur", "Aeropuerto de Lanzarote", "Aeropuerto de Fuerteventura"], "Aeropuerto de Gran Canaria", 5),
        new Preguntas("¿Qué famoso monumento natural se encuentra en el centro de Gran Canaria?", ["Roque Nublo", "Dunas de Maspalomas", "Charco de San Ginés", "Cueva de los Verdes"], "Roque Nublo", 6),
        new Preguntas("¿Cuál es el principal puerto de Gran Canaria?", ["Puerto de la Luz", "Puerto de Santa Cruz de Tenerife", "Puerto de Los Cristianos", "Puerto de Arrecife"], "Puerto de la Luz", 7),
        new Preguntas("¿Qué famoso jardín botánico se encuentra en Gran Canaria?", ["Jardín Canario", "Jardín de Cactus", "Jardín de Aclimatación de La Orotava", "Palmitos Park"], "Jardín Canario", 8),
        new Preguntas("¿Cuál es el principal centro comercial de Gran Canaria?", ["Centro Comercial Las Arenas", "Centro Comercial Siam Mall", "Centro Comercial El Corte Inglés", "Centro Comercial La Cañada"], "Centro Comercial Las Arenas", 9),
        new Preguntas("¿Qué famoso parque temático se encuentra en Gran Canaria?", ["Loro Parque", "Siam Park", "Palmitos Park", "Aqualand"], "Palmitos Park", 10),
        new Preguntas("¿Qué famoso festival de música se celebra anualmente en Gran Canaria?", ["Festival de Maspalomas", "Festival Internacional de Cine de Las Palmas", "Festival WOMAD", "Carnaval de Las Palmas"], "Festival WOMAD", 11),
        new Preguntas("¿Qué tipo de clima predomina en Gran Canaria?", ["Clima tropical", "Clima desértico", "Clima mediterráneo", "Clima continental"], "Clima tropical", 12),
        new Preguntas("¿Cuál es el nombre del famoso faro ubicado en el sur de Gran Canaria?", ["Faro de Maspalomas", "Faro de Punta de Jandía", "Faro de La Isleta", "Faro de Arinaga"], "Faro de Maspalomas", 13),
        new Preguntas("¿Qué deporte acuático es muy popular en las playas de Gran Canaria?", ["Surf", "Windsurf", "Esquí acuático", "Piragüismo"], "Windsurf", 14),
        new Preguntas("¿Qué famoso escritor canario nació en Gran Canaria?", ["Benito Pérez Galdós", "José Saramago", "Miguel de Unamuno", "Antonio Machado"], "Benito Pérez Galdós", 15),
        new Preguntas("¿Qué tipo de vegetación es característica de las cumbres de Gran Canaria?", ["Laurisilva", "Pinar", "Cardonal-tabaibal", "Sabinar"], "Pinar", 16),
        new Preguntas("¿Qué famoso evento deportivo internacional se celebra en Gran Canaria?", ["Ironman", "Maratón de Gran Canaria", "Vuelta Ciclista a España", "Rally Dakar"], "Ironman", 17),
        new Preguntas("¿Qué isla vecina de Gran Canaria es visible en días claros desde la costa norte?", ["Tenerife", "Fuerteventura", "Lanzarote", "La Gomera"], "Tenerife", 18),
        new Preguntas("¿Qué famoso museo se encuentra en Las Palmas de Gran Canaria?", ["Museo Néstor", "Museo del Prado", "Museo Reina Sofía", "Museo Picasso"], "Museo Néstor", 19),
        new Preguntas("¿Qué producto típico de Gran Canaria es conocido internacionalmente?", ["Queso de Flor", "Miel de Palma", "Ron Arehucas", "Vino Malvasía"], "Ron Arehucas", 20),
    ];

    canva.style.display = "none";
    pantallaInicial.style.display = "flex";
    pantallaFinal.style.display = "none";

    let vidas = new Vidas(listaPreguntas.length);
    mutearSonido();
    conSonido.onclick = () => {
        localStorage.setItem("sonido", 1);
        mutearSonido();
    }
    sinSonido.onclick = () => {
        localStorage.setItem("sonido", 0);
        mutearSonido();
    }


    let controlDisparo = 0;
    function contadorBalas(accion) {
        if (accion == null && controlDisparo == 0) {
            accion = -1;
            controlDisparo++;
        }
        vidas.vidas += accion;
        cantBalas.innerText = vidas.vidas;
        vidas.saveToLocalStorage();
    }

    console.log(balas.innerText);
    const juegoDuracion = 120; // 120 seconds (2 minutes)

    if (localStorage.getItem("miNombre")) {
        nombreGamer.value = localStorage.getItem("miNombre");
    }

    nombreGamer.addEventListener("focus", () => {
        audioFondo.loop = true;
        audioFondo.currentTime[0];
        audioFondo.play(); // Reproduce el audio
    });

    btnInicia.onclick = () => {
        if (nombreGamer.value.length >= 3) {
            if (vidas.vidas !== 0) {
                console.log("hola");
                localStorage.setItem("miNombre", nombreGamer.value);
                pantallaInicial.style.display = "none";
                comprarBalas.style.visibility = "hidden";
                canva.style.display = "block";
                pantallaInicial.style.display = "none";
                pantallaFinal.style.display = "none";
                iniciaJuego();
                movimentos();
                contadorBalas(0);
                audioFondo.pause();
                audioFondo.src = "sound/suspenso.mp3";
                audioFondo.loop = true;
                audioFondo.play();
                tiempo();
            } else {
                alert("Debes comprar balas💣")
            }
        }
    };

    const juego = new Juego(listaPreguntas, juegoDuracion, juegoDuracion);
    juego.shuffleQuestions();

    function iniciaJuego() {
        if (juego.hasEnded()) {
            return;
        }
        cajaRespuestas.innerHTML = "";
        const currentQuestion = juego.getQuestion();
        hPregunta.innerText = currentQuestion.text;
        juego.shuffleRespuesta(); // Mezcla las respuestas de la pregunta actual

        currentQuestion.choices.forEach(choice => {
            const article = document.createElement('article');
            article.innerHTML = `
                <img class="nrespuesta" src="/img/pirata.png" data-id="${choice}" alt=""/>
                <h3>${choice}</h3>
            `;
            cajaRespuestas.appendChild(article);
        });
    }

    function movimentos() {
        document.addEventListener('mousemove', (event) => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const mouseX = event.clientX;
            const mouseY = event.clientY;

            let rotationZ = ((mouseX - centerX) / centerX) * 40;
            imagenpersonage.style.transform = `translate(${rotationZ * 6.5}px, ${mouseY / 2.6}px) rotate(${rotationZ}deg) scale(1.0)`;

            let counttimerDisparo = 0;

            canva.addEventListener("click", (event) => {
                event.preventDefault();

                if (!vidas.hasVidas()) {
                    mostrarPantallaFinal();
                    return;
                }

                const timerDisparo = setInterval(() => {
                    disparoContainer.classList.add("disparado");
                    spanDisparo.style.transform = `translate(${rotationZ * 7.9}px, ${mouseY / 2}px) rotate(${rotationZ}deg) scale(19.5)`;
                    reproducirSonido();
                    counttimerDisparo++;

                    if (counttimerDisparo >= 10) {
                        contadorBalas(null);
                        clearInterval(timerDisparo);
                        disparoContainer.classList.remove("disparado");
                    }
                }, 15);
                controlDisparo = 0;
            });

            const imagen = document.getElementById('mirilla');
            imagen.style.left = event.clientX - 49 + 'px';
            imagen.style.top = event.clientY - 25 + 'px';
        });
    }

    function reproducirSonido() {
        audioDispara.currentTime = 0;
        audioDispara.play();
    }
    function reproducirEvalua(evalua) {
        if (evalua == 1) {
            audioEvalua.src = "/sound/correct.mp3"
        }
        else {
            audioEvalua.src = "/sound/incorrect.mp3"
        }

        audioEvalua.currentTime = 0;
        audioEvalua.play();
    }

    function mutearSonido() {
        audioDispara.volume = localStorage.getItem("sonido");
        audioFondo.volume = localStorage.getItem("sonido");
        audioEvalua.volume = localStorage.getItem("sonido");

        if (localStorage.getItem("sonido") == "1") {
            conSonido.style.background = "red";
            sinSonido.style.background = "#252823";
            sinSonido.style.transition = "0.5s";
        } else {
            sinSonido.style.background = "red";
            conSonido.style.background = "#252823";
            conSonido.style.transition = "0.5s";
        }
    }

    let idtiempo; // Define idtiempo fuera de la función para que sea accesible globalmente

    function tiempo() {
        if (idtiempo) {
            clearInterval(idtiempo); // Detiene el intervalo anterior si existe
        }

        idtiempo = setInterval(() => {
            h2Conteo.innerText = conteo;
            conteo--;
            if (conteo <= 0) {
                clearInterval(idtiempo); // Detiene el intervalo
                proximaPregunta("end time");

            }
        }, esperaJuego);
    }

    const tool = document.querySelector('.tool');
    const mirilla = document.getElementById('mirilla');

    tool.addEventListener('mouseover', () => {
        mirilla.style.display = 'none';
    });

    tool.addEventListener('mouseout', () => {
        mirilla.style.display = 'block';
    });

    cajaRespuestas.addEventListener("click", (event) => {
        if (event.target.classList.contains("nrespuesta")) {
            const respuesta = event.target.getAttribute("data-id");
            proximaPregunta(respuesta);
        }
    });
    let validador = 0
    function proximaPregunta(respuesta) {
        if (respuesta) {
            juego.checkAnswer(respuesta);
            juego.moveToNextQuestion();
            console.log(juego.correctAnswers + " " + juego.currentQuestionIndex + " respuesta " + respuesta);
            // if(respuesta=="end time")clearInterval(idtiempo);
            puntos.innerHTML = `<h2>${(juego.correctAnswers * 10) * acumuladorTiempo}</h2>
            <h3>Cantidad de Fallos</h3>
            <h2>${juego.currentQuestionIndex - juego.correctAnswers}</h2> <h2> Te sobró ${acumuladorTiempo} de tiempo</h2>
            <h3>Gracias por jugar</h3>
            <h2>${nombreGamer.value}</h2>
            `;

            if (validador != juego.correctAnswers) {
                validador = juego.correctAnswers;
                pirataDisparado.style.visibility = "visible"
                acumuladorTiempo += parseInt(h2Conteo.textContent)
                reproducirEvalua(1)
                // console.log("Tiempo Acumulado " + acumuladorTiempo)
                setTimeout(() => {
                    pirataDisparado.style.visibility = "hidden"
                }, 2000);
            } else {
                reproducirEvalua(0)
            }
            // console.log("validador " + validador + " index " + juego.correctAnswers + " teimpo restante= " + h2Conteo.textContent)
            // if((juego.correctAnswers * 10) >= 50){
            //     comprarBalas() 
            //     comprarBalas()
            // }

            conteo = 10;
            tiempo();
            iniciaJuego();
            if (juego.hasEnded()) {
                console.log("Fin del juego ");
                audioFondo.pause();
                audioFondo.src = "sound/final.mp3";
                audioFondo.pause();
                audioDispara.pause();
                audioFondo.play();
                pantallaFinal.style.display = "flex";
                pantallaFinal.style.position = "fixed";
                audioFondo.loop = false;
                canva.style.display = "none";
            }
        }
    }

    function mostrarPantallaFinal() {
        hayVidas(1)
        audioFondo.pause();
        audioFondo.src = "sound/final.mp3";
        audioFondo.pause();
        audioDispara.pause();
        audioFondo.play();
        pantallaFinal.style.display = "flex";
        pantallaFinal.style.position = "fixed";
        audioFondo.loop = false;
        canva.style.display = "none";
    }

    btnFinal.onclick = () => {
        window.location.reload();
    }

    // Función para comprar balas
    comprarBalas.onclick = function comprandoBalas() {
        vidas.vidas += 5; // Aumenta las balas en 5
        cantBalas.innerText = vidas.vidas;
        vidas.saveToLocalStorage();
    }

    hayVidas(esperaJuego)
    function hayVidas(espera) {
        if (vidas.vidas > 0) {
            comprarBalas.style.visibility = "hidden";
        } else {
            comprarBalas.style.visibility = "visible";
            esperaJuego = espera;
        }
    }

});
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/js/sw.js')
            .then((registration) => {
                console.log('Service Worker registrado con éxito:', registration.scope);
            })
            .catch((error) => {
                console.log('Error al registrar el Service Worker:', error);
            });
    });
}