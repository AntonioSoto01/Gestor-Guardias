document.addEventListener('DOMContentLoaded', function() {
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get username and password input values
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // Check if username and password are provided
    if (username.trim() === "" || password.trim() === "") {
        document.getElementById("message").innerText = "Por favor, introduce un usuario y contraseña.";
        return;
    }

    // Fetch JSON data
    fetch('users.json')
        .then(response => response.json())
        .then(data => {
            // Check if user exists in the JSON data
            var user = data.find(u => u.username === username && u.password === password);
            if (user) {
                // Redirect user based on user type
                if (user.type === "admin") {
                    window.location.href = "admin.html"; // Redirect to admin page
                } else if (user.type === "profesor") {
                    window.location.href = "profesor.html"; // Redirect to profesor page
                } else {
                    document.getElementById("message").innerText = "Tipo de usuario desconocido.";
                }
            } else {
                document.getElementById("message").innerText = "Credenciales incorrectas. Por favor, inténtalo de nuevo.";
            }
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
            document.getElementById("message").innerText = "Error al obtener los datos. Inténtalo de nuevo más tarde.";
        });
});});

