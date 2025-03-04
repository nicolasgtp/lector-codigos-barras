document.getElementById('startButton').addEventListener('click', function() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        document.getElementById('message').textContent = "Tu navegador no soporta acceso a la cámara.";
        return;
    }

    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#video'),
            constraints: {
                width: 300,
                height: 200,
                facingMode: "environment"
            }
        },
        decoder: {
            readers: ["ean_reader"]
        }
    }, function(err) {
        if (err) {
            console.error("Error al inicializar Quagga:", err);
            document.getElementById('message').textContent = "Error al iniciar el escáner.";
            return;
        }
        console.log("Quagga inicializado correctamente.");
        Quagga.start();
    });

    Quagga.onDetected(function(result) {
        const code = result.codeResult.code;
        console.log("Código detectado:", code);
        document.getElementById('message').textContent = `Código detectado: ${code}`;
        checkAndInsertCode(code);
    });
});
