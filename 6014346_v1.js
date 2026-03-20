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
            // Dibuja el píxel/punto con el grosor indicado
            ctx.fillRect(x - size/2, y - size/2, size, size);
        }

        function canvasToCartesiana(p, height) {
            // Invierte el eje Y para que se comporte como un plano cartesiano visual
            return [p.x, height - p.y];
        }

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
            const x1 = parseInt(document.getElementById('x1').value);
            const y1 = parseInt(document.getElementById('y1').value);
            const x2 = parseInt(document.getElementById('x2').value);
            const y2 = parseInt(document.getElementById('y2').value);
            const x3 = parseInt(document.getElementById('x3').value);
            const y3 = parseInt(document.getElementById('y3').value);
            
            const size = parseInt(document.getElementById('grosor').value);
            const metodo = document.getElementById('metodo').value;
            const msg = document.getElementById('mensaje');

            // Ejecutar validación
            const esValido = esTriangulo(x1, y1, x2, y2, x3, y3);

            // Convertir coordenadas (Y invertida para canvas)
            const c1 = canvasToCartesiana({x:x1, y:y1}, height);
            const c2 = canvasToCartesiana({x:x2, y:y2}, height);
            const c3 = canvasToCartesiana({x:x3, y:y3}, height);

            if (esValido) {
                msg.innerText = "Verdadero: Es un triángulo.";
                msg.style.color = "green";
                
                // Trazar las 3 líneas con el grosor (size) y método elegido
                drawLine(c1[0], c1[1], c2[0], c2[1], size, metodo);
                drawLine(c2[0], c2[1], c3[0], c3[1], size, metodo);
                drawLine(c3[0], c3[1], c1[0], c1[1], size, metodo);

                // Dibujar etiquetas de texto solicitadas
                ctx.fillStyle = "blue";
                ctx.font = "12px Arial";
                ctx.fillText(`x1,y1 (${x1},${y1})`, c1[0] + 8, c1[1] - 8);
                ctx.fillText(`x2,y2 (${x2},${y2})`, c2[0] + 8, c2[1] - 8);
                ctx.fillText(`x3,y3 (${x3},${y3})`, c3[0] + 8, c3[1] - 8);
            } else {
                msg.innerText = "Falso: No es un triángulo (puntos colineales).";
                msg.style.color = "red";
                // Pintar solo los puntos para ver el error
                ctx.fillStyle = "red";
                drawPoint(ctx, c1[0], c1[1], 6);
                drawPoint(ctx, c2[0], c2[1], 6);
                drawPoint(ctx, c3[0], c3[1], 6);
            }
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