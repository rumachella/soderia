function generarRecibo() {
    const cantidadRecibida = document.getElementById('cantidadRecibida').value;
    const nombreCliente = document.getElementById('nombreCliente').value;
    const concepto = document.getElementById('concepto').value;
    const contraprestacion = document.getElementById('contraprestacion').value;
    const firma = document.getElementById('firma').innerText;
    const aclaracion = document.getElementById('aclaracion').innerText;
  
    const fechaHoy = new Date().toLocaleDateString('es-AR');
  
    const ventanaRecibo = window.open('', '', 'width=400,height=500');
    ventanaRecibo.document.open();
    ventanaRecibo.document.write(`
        <html>
        <head>
            <title>Recibo</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
                .receipt { 
                    border: 1px solid #000; 
                    padding: 20px; 
                    width: 400px; 
                    height:400px;
                    margin: auto;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                }
                .receipt .field p {
                    margin: 0;
                    text-decoration: underline;
                }
                .receipt h2 { 
                    text-align: center; 
                    margin: 0 0 20px 0;
                }
                .receipt .field { 
                    display: flex; 
                    justify-content: space-between; 
                    margin-bottom: 10px; 
                }
                .receipt .field label { 
                    font-weight: bold; 
                    text-align: left; 
                }
                .receipt .field p { 
                    margin: 0; 
                }
                .receipt .bottom-fields {
                    margin-top: auto; 
                }
                .receipt .receipt-button { 
                    display: block; 
                    margin-top: 20px; 
                }
                @media print {
                    .receipt .receipt-button {
                        display: none;
                    }
                }
            </style>
        </head>
        <body>
            <div class="receipt">
                <h2>Recibo de pago</h2>
                <div class="field">
                    <label>Cantidad Recibida:</label>
                    <p>${cantidadRecibida} ARS$</p>
                </div>
                <div class="field">
                    <label>Recibimos de:</label>
                    <p>${nombreCliente}</p>
                </div>
                <div class="field">
                    <label>En concepto de:</label>
                    <p>${concepto}</p>
                </div>
                <div class="field">
                    <label>Contraprestación:</label>
                    <p>${contraprestacion}</p>
                </div>
                <div class="bottom-fields">
                    <div class="field">
                        <label>Firma:</label>
                        <p>${firma}</p>
                    </div>
                    <div class="field">
                        <label>Aclaración:</label>
                        <p>${aclaracion}</p>
                    </div>
                    <div class="field">
                        <label>Fecha:</label>
                        <p>${fechaHoy}</p>
                    </div>
                </div>
                <button class="receipt-button" onclick="window.print()">Imprimir</button>
            </div>
        </body>
        </html>
    `);
    ventanaRecibo.document.close();
  }
