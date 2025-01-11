document.getElementById('customButton').addEventListener('click', function() {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function() {
    const fileInput = document.getElementById('fileInput');
    const fileLabel = document.getElementById('fileLabel');
    const errorMessage = document.getElementById('errorMessage');
    const file = fileInput.files[0];
    if (file) {
        fileLabel.textContent = `Arquivo selecionado: ${file.name}`;
        errorMessage.classList.add('hidden');
    } else {
        fileLabel.textContent = 'Nenhum arquivo selecionado';
    }
});

document.getElementById('convertButton').addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const errorMessage = document.getElementById('errorMessage');
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const fileType = file.type;
            if (fileType === 'image/png' || fileType === 'image/jpeg') {
                const imgData = event.target.result;
                geraPDF(imgData, fileType);
            } else {
                errorMessage.classList.remove('hidden');
            }
        };
        reader.readAsDataURL(file);
    } else {
        alert('Por favor, selecione um arquivo primeiro.');
    }
});

function geraPDF(imgData, fileType) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "mm", "a4");
    const image = new Image();
    image.src = imgData;
    image.onload = function() {
        doc.addImage(image, fileType === 'image/png' ? 'PNG' : 'JPEG', 10, 10, 180, 160);
        doc.save('converted.pdf');
    };
    image.onerror = function() {
        alert('Erro ao carregar a imagem. Por favor, tente novamente.');
    };
}