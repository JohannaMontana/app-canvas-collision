const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Obtener las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "EEF7FF";

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.text = text;
        this.speed = speed;
        this.dx = Math.random() * 4 - 2; // Velocidad inicial en dirección x
        this.dy = Math.random() * 4 - 2; // Velocidad inicial en dirección y
        this.collided = false; // Bandera para indicar si ha ocurrido una colisión
    }

    draw(context) {
        context.beginPath();
        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);
        context.lineWidth = 2;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    update(context, otherCircles) {
        this.draw(context);

        // Verificar colisión con otros círculos
        for (let i = 0; i < otherCircles.length; i++) {
            if (this !== otherCircles[i]) {
                let dx = otherCircles[i].posX - this.posX;
                let dy = otherCircles[i].posY - this.posY;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < this.radius + otherCircles[i].radius) {
                    // Colisión detectada con al menos un círculo
                    this.color = "red";
                    otherCircles[i].color = "red";
                    this.collided = true; // Marcar la colisión
                    // Calcular la nueva dirección (dx, dy) para el rebote
                    let normalX = dx / distance; // Componente x del vector normal
                    let normalY = dy / distance; // Componente y del vector normal
                    let dotProduct = this.dx * normalX + this.dy * normalY; // Producto punto
                    this.dx -= 2 * dotProduct * normalX; // Componente x de la nueva dirección
                    this.dy -= 2 * dotProduct * normalY; // Componente y de la nueva dirección
                    // Ajustar posiciones para evitar que los círculos se queden pegados
                    let overlap = this.radius + otherCircles[i].radius - distance;
                    let adjustX = overlap * normalX * 0.5;
                    let adjustY = overlap * normalY * 0.5;
                    this.posX -= adjustX;
                    this.posY -= adjustY;
                    otherCircles[i].posX += adjustX;
                    otherCircles[i].posY += adjustY;
                }
            }
        }

        // Verificar y ajustar posición si el círculo está a punto de salir de la pantalla
        if ((this.posX + this.radius) > window_width || (this.posX - this.radius) < 0) {
            this.dx = -this.dx;
        }

        if ((this.posY - this.radius) < 0 || (this.posY + this.radius) > window_height) {
            this.dy = -this.dy;
        }

        // Restaurar el color azul si no hay colisión en este paso de actualización
        if (!this.collided) {
            this.color = "blue"; //color
        }

        // Restablecer la bandera de colisión para el próximo paso de actualización
        this.collided = false;

        this.posX += this.dx;
        this.posY += this.dy;
    }
}

let circles = [];

// Generar 10 círculos aleatorios dentro de la ventana
for (let i = 0; i < 10; i++) {
    let randomX = Math.random() * (window_width - 2 * 100) + 100; // Ajuste para asegurar que no estén demasiado cerca del borde
    let randomY = Math.random() * (window_height - 2 * 100) + 100; // Ajuste para asegurar que no estén demasiado cerca del borde
    let randomRadius = Math.floor(Math.random() * 100 + 30);
    let speed = 4.5; // Aumentamos la velocidad en 2 unidades
    circles.push(new Circle(randomX, randomY, randomRadius, "blue", `${i}`, speed)); //color
}

let updateCircles = function () {
    requestAnimationFrame(updateCircles);
    ctx.clearRect(0, 0, window_width, window_height);
    for (let i = 0; i < circles.length; i++) {
        circles[i].update(ctx, circles);
    }
};

updateCircles();
