document.getElementById('startButton').addEventListener('click', function() {
    // Verifica si el navegador soporta getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        document.getElementById('message').textContent = "Tu navegador no soporta acceso a la cámara.";
        return;
    }

    // Inicializa Quagga
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#video'),
            constraints: {
                width: 300,
                height: 200,
                facingMode: "environment" // Usa la cámara trasera
            }
        },
        decoder: {
            readers: ["ean_reader"] // Configura Quagga para leer códigos EAN-13
        },
        locate: true // Habilita la detección de la región del código de barras
    }, function(err) {
        if (err) {
            console.error("Error al inicializar Quagga:", err);
            document.getElementById('message').textContent = "Error al iniciar el escáner.";
            return;
        }
        console.log("Quagga inicializado correctamente.");
        Quagga.start();
    });

    // Escucha eventos de detección
    Quagga.onDetected(function(result) {
        const code = result.codeResult.code;
        console.log("Código detectado:", code);
        document.getElementById('message').textContent = `Código detectado: ${code}`;
        checkAndInsertCode(code);
    });
});

function checkAndInsertCode(code) {
    const apiKey = 'AIzaSyBh7oM0B0zrEx0OE1oRQ4JdLjZVJjaJyd4';
    const spreadsheetId = '1sBSNY5lx_v59JSAZVxBCy6WvDj5KGjYNL-YMZPk-2GA';
    const range = 'Sheet1!C:C'; // Columna C

    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        const values = data.values;
        if (values && values.flat().includes(code)) {
            document.getElementById('message').textContent = 'Código ya ingresado: ' + code;
        } else {
            insertCode(code);
        }
    })
    .catch(error => {
        console.error('Error al verificar el código:', error);
        document.getElementById('message').textContent = 'Error al verificar el código.';
    });
}

function insertCode(code) {
    const apiKey = 'AIzaSyBh7oM0B0zrEx0OE1oRQ4JdLjZVJjaJyd4';
    const spreadsheetId = '1sBSNY5lx_v59JSAZVxBCy6WvDj5KGjYNL-YMZPk-2GA';
    const range = 'Sheet1!C:C'; // Columna C

    const valueRange = {
        values: [[code]]
    };

    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=RAW&key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(valueRange)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('message').textContent = 'Código ingresado: ' + code;
    })
    .catch(error => {
        console.error('Error al insertar el código:', error);
        document.getElementById('message').textContent = 'Error al insertar el código.';
    });
}
