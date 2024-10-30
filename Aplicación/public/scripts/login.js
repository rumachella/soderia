document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value;  //? RESCATAMOS LOS VALORES DE LOS INPUTS
  const password = document.getElementById('password').value;

  try {
    //? SE ENVIAN LOS DATOS AL SERVIDOR 
      const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password }) 
      });

      const result = await response.json();
      //MANEJO DE LAS RESPUESTAS
      if (response.ok) {
          alert('Login exitoso');
          window.location.href = '../html/panel.html';
      } else {
          document.getElementById('error-message').style.display = 'block';
          document.getElementById('error-message').textContent = result.message;
      }
  } catch (error) {
      console.error('Error en la solicitud:', error);
      document.getElementById('error-message').style.display = 'block';
      document.getElementById('error-message').textContent = 'Error en la conexión';
  }
});
