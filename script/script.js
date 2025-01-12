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
            } else if (fileType === 'application/msword' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                const docData = event.target.result;
                geraPDF(docData, fileType);
            } else {
                errorMessage.classList.remove('hidden');
            }
        };
        reader.readAsDataURL(file);
    } else {
        alert('Por favor, selecione um arquivo primeiro.');
    }
});

async function geraPDF(data, fileType) {
    if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // Converte o arquivo .docx para HTML com Mammoth.js
        const arrayBuffer = await fetch(data).then(res => res.arrayBuffer());
        const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
        
        // Insere o HTML em um elemento temporário
        const container = document.createElement('div');
        container.innerHTML = result.value;

        // Estiliza o HTML para uma aparência adequada
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.fontSize = '12px';

        // Converte o conteúdo HTML para PDF
        const options = {
            margin: 10,
            filename: 'converted.pdf',
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(options).from(container).save();
    } else if (fileType === 'image/png' || fileType === 'image/jpeg') {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF("p", "mm", "a4");

        const image = new Image();
        image.src = data;
        image.onload = function () {
            doc.addImage(image, fileType === 'image/png' ? 'PNG' : 'JPEG', 10, 10, 180, 160);
            doc.save('converted.pdf');
        };
        image.onerror = function () {
            alert('Erro ao carregar a imagem. Por favor, tente novamente.');
        };
    } else {
        alert('Formato de arquivo não suportado. Por favor, envie uma imagem ou um arquivo Word.');
    }
}
