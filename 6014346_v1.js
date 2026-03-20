const canvas = document.getElementById('miCanvas');
        const ctx = canvas.getContext('2d');
        const height = canvas.height;

        // --- 1. FUNCIÓN REQUERIDA (6 PARÁMETROS) ---
        function esTriangulo(x1, y1, x2, y2, x3, y3) {
            // El área no debe ser cero (puntos no colineales)
            let area = Math.abs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2;
            return area > 0;
        }

        // --- FUNCIONES DE DIBUJO ---

        function drawPoint(ctx, x, y, size) {
        // Math.round asegura que el píxel se pinte en una coordenada entera exacta
        ctx.fillRect(Math.round(x - size/2), Math.round(y - size/2), size, size);
        }

        const toCanvas = (p) => ({ 
            x: p.x, 
            y: canvas.height - p.y 
        });
            
        

        function drawLine(x1, y1, x2, y2, size, method) {
            if (method === "DDA") {
                drawDDA(x1, y1, x2, y2, size);
            } else {
                drawBresenham(x1, y1, x2, y2, size);
            }
        }

        // --- ALGORITMOS DE TRAZADO ---

        function drawDDA(x1, y1, x2, y2, size) {
            let dx = x2 - x1;
            let dy = y2 - y1;
            let steps = Math.max(Math.abs(dx), Math.abs(dy));
            let xInc = dx / steps;
            let yInc = dy / steps;
            let x = x1;
            let y = y1;

            ctx.fillStyle = "black";
            for (let i = 0; i <= steps; i++) {
                drawPoint(ctx, Math.round(x), Math.round(y), size);
                x += xInc;
                y += yInc;
            }
        }

        function drawBresenham(x1, y1, x2, y2, size) {
            let dx = Math.abs(x2 - x1);
            let dy = Math.abs(y2 - y1);
            let sx = (x1 < x2) ? 1 : -1;
            let sy = (y1 < y2) ? 1 : -1;
            let err = dx - dy;

            ctx.fillStyle = "black";
            while (true) {
                drawPoint(ctx, x1, y1, size);
                if (x1 === x2 && y1 === y2) break;
                let e2 = 2 * err;
                if (e2 > -dy) { err -= dy; x1 += sx; }
                if (e2 < dx) { err += dx; y1 += sy; }
            }
        }

        function dibujarEjes() {
            ctx.strokeStyle = "#eee";
            ctx.fillStyle = "#999";
            ctx.font = "10px Arial";
            // Dibujar una cuadrícula simple de referencia
            for(let i=0; i<=canvas.width; i+=50) {
                ctx.fillText(i, i, height - 5); 
                if(i <= height) ctx.fillText(height - i, 5, i);
            }
        }

        function procesar() {
            // Limpiar antes de dibujar
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            dibujarEjes();

            // Obtener valores de los inputs
            const config = ObtenerConfiguracion();
            const p1, p2, p3, grosor, metodo} = config;
        
            const msg = document.getElementById('mensaje');

            // Ejecutar validación
            const esValido = esTriangulo(p1.x1, p1.y1, p2.x2, p2.y2, p3.x3, p3.y3);

            // Convertir coordenadas (Y invertida para canvas)
            const c1 = toCanvas(p1);
            const c2 = toCanvas(p2);
            const c3 = toCanvas(p3);

           if (esValido) {
                msg.innerText = "Verdadero: Es un triángulo.";
                msg.style.color = "green";
                
                // Dibujamos las líneas usando .x y .y
                drawLine(c1.x, c1.y, c2.x, c2.y, grosor, metodo);
                drawLine(c2.x, c2.y, c3.x, c3.y, grosor, metodo);
                drawLine(c3.x, c3.y, c1.x, c1.y, grosor, metodo);

                // Dibujamos etiquetas de texto
                ctx.fillStyle = "blue";
                ctx.font = "12px Arial";
                ctx.fillText(`P1 (${p1.x},${p1.y})`, c1.x + 8, c1.y - 8);
                ctx.fillText(`P2 (${p2.x},${p2.y})`, c2.x + 8, c2.y - 8);
                ctx.fillText(`P3 (${p3.x},${p3.y})`, c3.x + 8, c3.y - 8);
            } else {
                msg.innerText = "Falso: No es un triángulo.";
                msg.style.color = "red";
                // Pintar puntos de error
                ctx.fillStyle = "red";
                drawPoint(ctx, c1.x, c1.y, 6);
                drawPoint(ctx, c2.x, c2.y, 6);
                drawPoint(ctx, c3.x, c3.y, 6);
            }
        

        function limpiar() {
            // Limpia el canvas y el mensaje
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            dibujarEjes();
            document.getElementById('mensaje').innerText = "";
            // Los valores de los inputs permanecen para que el usuario pueda corregirlos
        }

        // Ejecutar cuadrícula al cargar
        dibujarEjes();
        // Nueva funcion de utilidad
        function ObtenerConfiguracion(){
            return{
            p1: { x: parseInt(document.getElementById("x1").value), y : parseInt(document.getElementById("y1").value)},
            p2: { x: parseInt(document.getElementById("x2").value), y : parseInt(document.getElementById("y2").value)},
            p3: { x: parseInt(document.getElementById("x3").value), y : parseInt(document.getElementById("y3").value)},
            grosor: parseInt(document.getElementById("grosor").value),
            metodo: document.getElementById("metodo").value
            }
        }
    