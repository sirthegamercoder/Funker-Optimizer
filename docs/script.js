document.addEventListener('DOMContentLoaded', function() {
    const translations = {
    en: {
        title: "Funker' Optimizer",
        xmlProcessor: "XML Processor",
        inputXmlFile: "Input XML File:",
        outputFileName: "Output File Name:",
        divisionFactor: "Division Factor:",
        modifyXml: "Modify XML",
        batchProcess: "Batch Process",
        quickLinks: "Quick Links",
        githubRepo: "GitHub Repo",
        bugReport: "Bug Report",
        spritesheetGenerator: "Spritesheet and XML Generator",
        messages: "Messages",
        clear: "Clear",
        copy: "Copy",
        imageProcessor: "Image Processor",
        loadImage: "Load Image",
        resize: "Resize",
        aliasing: "Anti-aliasing",
        resizePercentage: "Resize %:",
        noImageLoaded: "No image loaded",
        singleImage: "Single Image",
        multipleImages: "Multiple Images",
        processingFiles: "Processing Files",
        cancel: "Cancel",
        batchOptions: "Batch Process Options",
        selectXmlFiles: "Select XML Files:",
        folderName: "Folder Name:",
        startProcessing: "Start Processing",
        noFileSelected: "No file selected",
        filesSelected: "files selected",
        chooseFile: "Choose file...",
        chooseFiles: "Choose files...",
        images: "images",
        image: "image",
        errorPrefix: "ERROR"
    },
    es: {
        title: "Optimizador Funker'",
        xmlProcessor: "Procesador XML",
        inputXmlFile: "Archivo XML de entrada:",
        outputFileName: "Nombre del archivo de salida:",
        divisionFactor: "Factor de división:",
        modifyXml: "Modificar XML",
        batchProcess: "Proceso por lotes",
        quickLinks: "Enlaces rápidos",
        githubRepo: "Repositorio GitHub",
        bugReport: "Reportar error",
        spritesheetGenerator: "Generador de Spritesheet y XML",
        messages: "Mensajes",
        clear: "Limpiar",
        copy: "Copiar",
        imageProcessor: "Procesador de imágenes",
        loadImage: "Cargar imagen",
        resize: "Redimensionar",
        aliasing: "Anti-aliasing",
        resizePercentage: "Redimensionar %:",
        noImageLoaded: "No hay imagen cargada",
        singleImage: "Imagen única",
        multipleImages: "Imágenes múltiples",
        processingFiles: "Procesando archivos",
        cancel: "Cancelar",
        batchOptions: "Opciones de proceso por lotes",
        selectXmlFiles: "Seleccionar archivos XML:",
        folderName: "Nombre de carpeta:",
        startProcessing: "Iniciar procesamiento",
        noFileSelected: "Ningún archivo seleccionado",
        filesSelected: "archivos seleccionados",
        chooseFile: "Seleccionar archivo...",
        chooseFiles: "Seleccionar archivos...",
        images: "imágenes",
        image: "imagen",
        errorPrefix: "ERROR"
    },
    fr: {
        title: "Optimiseur Funker'",
        xmlProcessor: "Traitement XML",
        inputXmlFile: "Fichier XML d'entrée:",
        outputFileName: "Nom du fichier de sortie:",
        divisionFactor: "Facteur de répartition:",
        modifyXml: "Modifier le XML",
        batchProcess: "Processus par lots",
        quickLinks: "Liens Rapides",
        githubRepo: "Répertoire GitHub",
        bugReport: "Rapport de bogues",
        spritesheetGenerator: "Générateur de feuilles de calcul et de XML",
        messages: "Les messages",
        clear: "Clair",
        copy: "Copie",
        imageProcessor: "Traitement d'images",
        loadImage: "Chargement de l'image",
        resize: "Redimensionner",
        aliasing: "Anticrénelage",
        resizePercentage: "Redimensionner %:",
        noImageLoaded: "Aucune image chargée",
        singleImage: "Une seule image",
        multipleImages: "Plusieurs images",
        processingFiles: "Traitement des dossiers",
        cancel: "Annuler",
        batchOptions: "Options de traitement par lots",
        selectXmlFiles: "Sélectionner les fichiers XML:",
        folderName: "Nom du dossier:",
        startProcessing: "Début du traitement",
        noFileSelected: "Aucun fichier sélectionné",
        filesSelected: "fichiers sélectionnés",
        chooseFile: "Choisir un fichier...",
        chooseFiles: "Choisir des fichiers...",
        images: "images",
        image: "image",
        errorPrefix: "ERREUR"
    },
    ptBR: {
        title: "Otimizador do Funker'",
        xmlProcessor: "Processador de XML",
        inputXmlFile: "Arquivo XML de entrada:",
        outputFileName: "Nome do arquivo de saída:",
        divisionFactor: "Fator de divisão:",
        modifyXml: "Modificar XML",
        batchProcess: "Processo em lote",
        quickLinks: "Links Rápidos",
        githubRepo: "Repositório do GitHub",
        bugReport: "Relatório de Bugs",
        spritesheetGenerator: "Gerador de XML e planilha de sprites",
        messages: "Recados",
        clear: "Limpo",
        copy: "Copiar",
        imageProcessor: "Processador de imagens",
        loadImage: "Carregar Imagem",
        resize: "Redimensionamento",
        aliasing: "Suavização de serrilhado",
        resizePercentage: "Redimensionamento %:",
        noImageLoaded: "Nenhuma imagem carregada",
        singleImage: "Imagem única",
        multipleImages: "Várias imagens",
        processingFiles: "Processamento de arquivos",
        cancel: "Cancelar",
        batchOptions: "Opções de processo em lote",
        selectXmlFiles: "Selecionar arquivos XML:",
        folderName: "Nome da pasta:",
        startProcessing: "Iniciar processamento",
        noFileSelected: "Nenhum arquivo selecionado",
        filesSelected: "arquivos selecionados",
        chooseFile: "Escolher arquivo...",
        chooseFiles: "Escolher arquivos...",
        images: "imagens",
        image: "imagem",
        errorPrefix: "ERRO"
    },
    it: {
        title: "Ottimizzatore Funker'",
        xmlProcessor: "Processore XML",
        inputXmlFile: "File XML in ingresso:",
        outputFileName: "Nome del file di uscita:",
        divisionFactor: "Fattore di Divisione:",
        modifyXml: "Modifica XML",
        batchProcess: "Processo in lotti",
        quickLinks: "Collegamenti rapidi",
        githubRepo: "GitHub Repo",
        bugReport: "Rapporto bug",
        spritesheetGenerator: "Generatore di fogli di testo e XML",
        messages: "Messaggi",
        clear: "Libero",
        copy: "Copiare",
        imageProcessor: "Processore d'immagine",
        loadImage: "Caricare l'immagine",
        resize: "Ridimensiona",
        aliasing: "Anti-alias",
        resizePercentage: "Ridimensiona %:",
        noImageLoaded: "Nessuna immagine caricata",
        singleImage: "Immagine singola",
        multipleImages: "Immagini multiple",
        processingFiles: "Elaborazione dei file",
        cancel: "Annullamento",
        batchOptions: "Opzioni del processo batch",
        selectXmlFiles: "Selezionare i file XML:",
        folderName: "Nome della cartella:",
        startProcessing: "Avvio dell'elaborazione",
        noFileSelected: "Nessun file selezionato",
        filesSelected: "file selezionati",
        chooseFile: "Scegli file...",
        chooseFiles: "Scegli files...",
        images: "immagini",
        image: "immagine",
        errorPrefix: "ERRORE"
    },
    de: {
        title: "Funker' Optimierer",
        xmlProcessor: "XML Prozessor",
        inputXmlFile: "Input XML Datei:",
        outputFileName: "Name der Ausgabedatei:",
        divisionFactor: "Teilung Faktor:",
        modifyXml: "XML ändern",
        batchProcess: "Batch Prozess",
        quickLinks: "Kurzlinks",
        githubRepo: "GitHub Repositorium",
        bugReport: "Fehler Bericht",
        spritesheetGenerator: "Spritesheet und XML Generatoren",
        messages: "Nachrichten",
        clear: "Klar",
        copy: "Kopieren",
        imageProcessor: "Bildprozessor",
        loadImage: "Bild laden",
        resize: "Größe ändern",
        aliasing: "Kantenglättung",
        resizePercentage: "Größe ändern %:",
        noImageLoaded: "Kein Bild geladen",
        singleImage: "Einzelnes Bild",
        multipleImages: "Mehrere Abbildungen",
        processingFiles: "Bearbeitung von Dateien",
        cancel: "Abbrechen",
        batchOptions: "Stapelverarbeitungsoptionen",
        selectXmlFiles: "XML Dateien auswählen:",
        folderName: "Name des Ordners:",
        startProcessing: "Beginn der Bearbeitung",
        noFileSelected: "Keine Datei gewählt",
        filesSelected: "ausgewählte Dateien",
        chooseFile: "Datei auswählen...",
        chooseFiles: "Dateien auswählen...",
        images: "Bilder",
        image: "Bild",
        errorPrefix: "FEHLER"
    }
};

    const inputFile = document.getElementById('input-file');
    const outputFile = document.getElementById('output-file');
    const divisionNumber = document.getElementById('division-number');
    const batchProcessBtn = document.getElementById('batch-process');
    const modifyXmlBtn = document.getElementById('modify-xml');
    const githubRepoBtn = document.getElementById('github-repo');
    const bugReportBtn = document.getElementById('bug-report');
    const spritesheetAndXMLGeneratorBtn = document.getElementById('spritesheet-and-xml-generator');
    const messageText = document.getElementById('message-text');
    const clearMessagesBtn = document.getElementById('clear-messages');
    const copyMessagesBtn = document.getElementById('copy-messages');
    const loadImageBtn = document.getElementById('load-image');
    const resizeImageBtn = document.getElementById('resize-image');
    const aliasingCheckbox = document.getElementById('aliasing');
    const resizePercentage = document.getElementById('resize-percentage');
    const imageInfo = document.getElementById('image-info');
    const imageContainer = document.getElementById('image-container');
    const multiImageGrid = document.getElementById('multi-image-grid');
    const singleImageTab = document.querySelector('[data-tab="single"]');
    const multipleImageTab = document.querySelector('[data-tab="multiple"]');
    const singleImageContainer = document.getElementById('single-image-container');
    const multipleImagesContainer = document.getElementById('multiple-images-container');
    const imageDimensions = document.getElementById('image-dimensions');
    const imageSize = document.getElementById('image-size');
    const imagesCount = document.getElementById('images-count');
    const themeSwitch = document.getElementById('theme-switch');
    const progressModal = document.getElementById('progress-modal');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const currentFileEl = document.getElementById('current-file');
    const cancelProcessBtn = document.getElementById('cancel-process');
    const batchModal = document.getElementById('batch-modal');
    const batchInputFiles = document.getElementById('batch-input-files');
    const batchFolderName = document.getElementById('batch-folder-name');
    const startBatchBtn = document.getElementById('start-batch');
    const closeBatchModal = document.querySelector('#batch-modal .close');

    let currentImage = null;
    let loadedImages = [];
    let processing = false;
    let cancelRequested = false;
    let currentLanguage = localStorage.getItem('language') || 'en';

    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 
                         (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        setTheme(savedTheme);
    }

    document.getElementById('language-select').addEventListener('change', function() {
    updateLanguage(this.value);
});

function updateLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    const t = translations[lang];
    
    document.querySelector('h1').innerHTML = `<i class="fas fa-tools"></i>${t.title}`;
    document.querySelectorAll('h2')[0].innerHTML = `<i class="fas fa-file-code"></i>${t.xmlProcessor}`;
    document.querySelectorAll('h2')[1].innerHTML = `<i class="fas fa-link"></i>${t.quickLinks}`;
    document.querySelectorAll('h2')[2].innerHTML = `<i class="fas fa-comment-alt"></i>${t.messages}`;
    document.querySelectorAll('h2')[3].innerHTML = `<i class="fas fa-image"></i>${t.imageProcessor}`;
    
    document.querySelector('label[for="input-file"]').innerHTML = `<i class="fas fa-file-upload"></i>${t.inputXmlFile}`;
    document.querySelector('label[for="output-file"]').innerHTML = `<i class="fas fa-file-export"></i>${t.outputFileName}`;
    document.querySelector('label[for="division-number"]').innerHTML = `<i class="fas fa-divide"></i>${t.divisionFactor}`;
    document.getElementById('modify-xml').innerHTML = `<i class="fas fa-edit"></i>${t.modifyXml}`;
    document.getElementById('batch-process').innerHTML = `<i class="fas fa-tasks"></i>${t.batchProcess}`;
    document.getElementById('github-repo').innerHTML = `<i class="fab fa-github"></i>${t.githubRepo}`;
    document.getElementById('bug-report').innerHTML = `<i class="fas fa-bug"></i>${t.bugReport}`;
    document.getElementById('spritesheet-and-xml-generator').innerHTML = `<i class="fas fa-table"></i>${t.spritesheetGenerator}`;
    document.getElementById('clear-messages').innerHTML = `<i class="fas fa-trash-alt"></i>${t.clear}`;
    document.getElementById('copy-messages').innerHTML = `<i class="fas fa-copy"></i>${t.copy}`;
    document.getElementById('load-image').innerHTML = `<i class="fas fa-folder-open"></i>${t.loadImage}`;
    document.getElementById('resize-image').innerHTML = `<i class="fas fa-expand-alt"></i>${t.resize}`;
    document.querySelector('label[for="aliasing"]').innerHTML = `<i class="fas fa-magic"></i>${t.aliasing}`;
    document.querySelector('label[for="resize-percentage"]').textContent = `${t.resizePercentage}`;
    document.querySelectorAll('.placeholder p').forEach(el => el.textContent = t.noImageLoaded);
    document.querySelector('[data-tab="single"]').textContent = t.singleImage;
    document.querySelector('[data-tab="multiple"]').textContent = t.multipleImages;
    document.querySelector('#progress-modal h3').innerHTML = `<i class="fas fa-spinner fa-spin"></i>${t.processingFiles}`;
    document.getElementById('cancel-process').innerHTML = `<i class="fas fa-times"></i>${t.cancel}`;
    document.querySelector('#batch-modal h3').innerHTML = `<i class="fas fa-tasks"></i>${t.batchOptions}`;
    document.querySelector('label[for="batch-input-files"]').innerHTML = `<i class="fas fa-file-upload"></i>${t.selectXmlFiles}`;
    document.querySelector('label[for="batch-folder-name"]').innerHTML = `<i class="fas fa-folder"></i>${t.folderName}`;
    document.getElementById('start-batch').innerHTML = `<i class="fas fa-play"></i>${t.startProcessing}`;
    document.querySelector('.file-input-button').innerHTML = `<i class="fas fa-folder-open"></i>${t.chooseFile}`;
    document.querySelector('#batch-modal .file-input-button').innerHTML = `<i class="fas fa-folder-open"></i>${t.chooseFiles}`;

    if (loadedImages.length > 0) {
        const count = loadedImages.length;
        imagesCount.textContent = `${count} ${count !== 1 ? t.images : t.image}`;
        
    updateFileInputLabels();

    }   
}

function updateFileInputLabels() {
    const t = translations[currentLanguage];
    const singleFileLabel = document.querySelector('.file-input-label');
    const batchFileLabel = document.querySelector('#batch-modal .file-input-label');
    
    if (inputFile.files.length > 0) {
        singleFileLabel.textContent = inputFile.files[0].name;
    } else {
        singleFileLabel.textContent = t.noFileSelected;
    }
    
    if (batchInputFiles.files.length > 0) {
        batchFileLabel.textContent = `${batchInputFiles.files.length} ${t.filesSelected}`;
    } else {
        batchFileLabel.textContent = t.noFileSelected;
    }
}

    function setTheme(theme) {
        document.body.classList.toggle('dark-mode', theme === 'dark');
        themeSwitch.checked = theme === 'dark';
        localStorage.setItem('theme', theme);
    }

    themeSwitch.addEventListener('change', () => {
        setTheme(themeSwitch.checked ? 'dark' : 'light');
    });

    inputFile.addEventListener('change', updateFileInputLabel);
    batchInputFiles.addEventListener('change', updateBatchFileInputLabel);
    
    modifyXmlBtn.addEventListener('click', modifyXml);
    batchProcessBtn.addEventListener('click', () => batchModal.style.display = 'block');
    closeBatchModal.addEventListener('click', () => batchModal.style.display = 'none');
    startBatchBtn.addEventListener('click', batchProcess);
    
    githubRepoBtn.addEventListener('click', () => openUrl('https://github.com/sirthegamercoder/Funker-Optimizer'));
    bugReportBtn.addEventListener('click', () => openUrl('https://github.com/sirthegamercoder/Funker-Optimizer/issues'));
    spritesheetAndXMLGeneratorBtn.addEventListener('click', () => openUrl('https://uncertainprod.github.io/FNF-Spritesheet-XML-generator-Web/'));
    
    clearMessagesBtn.addEventListener('click', () => {
        messageText.value = '';
        addMessage('Messages cleared.');
    });
    
    copyMessagesBtn.addEventListener('click', () => {
        messageText.select();
        document.execCommand('copy');
        addMessage('Messages copied to clipboard.');
    });
    
    loadImageBtn.addEventListener('click', loadImage);
    resizeImageBtn.addEventListener('click', () => {
        const percentage = parseInt(resizePercentage.value);
        if (isNaN(percentage) || percentage <= 0) {
            showError('Please enter a valid percentage.');
            return;
        }
        
        if (singleImageTab.classList.contains('active') && currentImage) {
            resizeSingleImage(percentage);
        } else if (multipleImageTab.classList.contains('active') && loadedImages.length > 0) {
            resizeMultipleImages(percentage);
        } else {
            showError('No images loaded to resize.');
        }
    });
    
    singleImageTab.addEventListener('click', () => switchTab('single'));
    multipleImageTab.addEventListener('click', () => switchTab('multiple'));
    
    cancelProcessBtn.addEventListener('click', () => {
        cancelRequested = true;
        addMessage('Process cancellation requested...');
    });

    initTheme();
    updateFileInputLabel();
    updateBatchFileInputLabel();
    updateLanguage(currentLanguage);

function addMessage(message) {
    const timestamp = new Date().toLocaleTimeString();
    messageText.value += `[${timestamp}] ${message}\n`;
    messageText.scrollTop = messageText.scrollHeight;
}

function showError(message) {
    addMessage(`${translations[currentLanguage].errorPrefix || 'ERROR'}: ${message}`);
}

    function openUrl(url) {
        window.open(url, '_blank');
    }

function updateFileInputLabel() {
    updateFileInputLabels();
}

document.querySelector('.file-input-button').addEventListener('click', function() {
    inputFile.click();
});

function updateBatchFileInputLabel() {
    updateFileInputLabels();
}

document.querySelector('#batch-modal .file-input-button').addEventListener('click', function() {
    batchInputFiles.click();
});

    function switchTab(tabName) {
        singleImageTab.classList.toggle('active', tabName === 'single');
        multipleImageTab.classList.toggle('active', tabName === 'multiple');
        singleImageContainer.classList.toggle('active', tabName === 'single');
        multipleImagesContainer.classList.toggle('active', tabName === 'multiple');
    }

    function modifyXml() {
        const file = inputFile.files[0];
        const outputFileName = outputFile.value.trim() || 'output.xml';
        const divisionFactor = parseInt(divisionNumber.value) || 2;

        if (!file) {
            showError('Please select an input XML file.');
            return;
        }

        if (divisionFactor <= 0) {
            showError('Division factor must be a positive number.');
            return;
        }

        addMessage(`Starting XML modification with division factor: ${divisionFactor}`);

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(e.target.result, 'text/xml');
                
                if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
                    throw new Error("Invalid XML file");
                }

                const subTextures = xmlDoc.getElementsByTagName('SubTexture');
                const total = subTextures.length;
                let processed = 0;

                addMessage(`Found ${total} SubTexture elements to process...`);

                for (let subTexture of subTextures) {
                    if (cancelRequested) break;

                    const attributes = ['x', 'y', 'width', 'height', 'frameX', 'frameY', 'frameWidth', 'frameHeight'];
                    attributes.forEach(attr => {
                        const value = subTexture.getAttribute(attr);
                        if (value !== null) {
                            subTexture.setAttribute(attr, Math.floor(parseInt(value) / divisionFactor).toString());
                        }
                    });

                    processed++;
                }

                if (cancelRequested) {
                    addMessage('Processing cancelled by user.');
                    cancelRequested = false;
                    return;
                }

                const serializer = new XMLSerializer();
                const modifiedXml = serializer.serializeToString(xmlDoc);
                
                const blob = new Blob([modifiedXml], { type: 'text/xml' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = outputFileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                addMessage(`Successfully processed ${processed}/${total} elements.`);
                addMessage(`Modified file saved as: ${outputFileName}`);
            } catch (error) {
                showError(`Error processing XML: ${error.message}`);
            }
        };
        reader.onerror = () => {
            showError('Error reading the XML file.');
        };
        reader.readAsText(file);
    }

    async function batchProcess() {
        const files = batchInputFiles.files;
        const outputFolderName = batchFolderName.value.trim() || 'optimized_xml';

        if (files.length === 0) {
            showError('Please select at least one XML file.');
            return;
        }

        processing = true;
        cancelRequested = false;
        progressModal.style.display = 'block';
        progressBar.parentElement.style.width = '0%';
        progressText.textContent = '0%';
        
        const zip = new JSZip();
        const folder = zip.folder(outputFolderName);
        let processedCount = 0;
        const totalFiles = files.length;
        const divisionFactor = parseInt(divisionNumber.value) || 2;

        addMessage(`Starting batch processing of ${totalFiles} files with division factor: ${divisionFactor}`);

        for (let i = 0; i < files.length; i++) {
            if (cancelRequested) break;

            const file = files[i];
            currentFileEl.textContent = `Processing: ${file.name}`;
            
            try {
                const content = await readFileAsText(file);
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(content, 'text/xml');
                
                if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
                    throw new Error("Invalid XML file");
                }

                const subTextures = xmlDoc.getElementsByTagName('SubTexture');
                for (let subTexture of subTextures) {
                    const attributes = ['x', 'y', 'width', 'height', 'frameX', 'frameY', 'frameWidth', 'frameHeight'];
                    attributes.forEach(attr => {
                        const value = subTexture.getAttribute(attr);
                        if (value !== null) {
                            subTexture.setAttribute(attr, Math.floor(parseInt(value) / divisionFactor).toString());
                        }
                    });
                }

                const serializer = new XMLSerializer();
                const modifiedXml = serializer.serializeToString(xmlDoc);
                folder.file(file.name, modifiedXml);
                
                processedCount++;
                const progress = Math.round((i + 1) / totalFiles * 100);
                progressBar.parentElement.style.width = `${progress}%`;
                progressText.textContent = `${progress}%`;
                
                addMessage(`Processed: ${file.name} (${i + 1}/${totalFiles})`);
            } catch (error) {
                showError(`Failed to process ${file.name}: ${error.message}`);
            }
        }

        if (cancelRequested) {
            addMessage('Batch processing cancelled by user.');
            progressModal.style.display = 'none';
            processing = false;
            cancelRequested = false;
            return;
        }

        try {
            currentFileEl.textContent = 'Creating ZIP archive...';
            addMessage('Creating ZIP archive of processed files...');
            
            const zipContent = await zip.generateAsync({ type: 'blob' }, metadata => {
                const progress = Math.round(metadata.percent);
                progressBar.parentElement.style.width = `${progress}%`;
                progressText.textContent = `${progress}%`;
            });
            
            const url = URL.createObjectURL(zipContent);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${outputFolderName}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            addMessage(`Batch processing completed. ${processedCount}/${totalFiles} files processed.`);
            addMessage(`ZIP archive saved as: ${outputFolderName}.zip`);
        } catch (error) {
            showError(`Error creating ZIP file: ${error.message}`);
        } finally {
            progressModal.style.display = 'none';
            processing = false;
            batchModal.style.display = 'none';
        }
    }

    function readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    function loadImage() {
        const isSingle = confirm('Load a single image (OK) or multiple images (Cancel)?');
        
        if (isSingle) {
            loadSingleImage();
        } else {
            loadMultipleImages();
        }
    }

    function loadSingleImage() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = event => {
                currentImage = new Image();
                currentImage.src = event.target.result;
                currentImage.onload = () => {
                    imageContainer.innerHTML = '';
                    const imgElement = document.createElement('img');
                    imgElement.src = event.target.result;
                    imageContainer.appendChild(imgElement);
                    
                    imageDimensions.textContent = `${currentImage.width}×${currentImage.height}px`;
                    imageSize.textContent = `${formatFileSize(file.size)}`;
                    
                    imageInfo.textContent = file.name;
                    resizeImageBtn.disabled = false;
                    
                    addMessage(`Loaded image: ${file.name} (${currentImage.width}×${currentImage.height}, ${formatFileSize(file.size)})`);
                    
                    switchTab('single');
                };
                currentImage.onerror = () => {
                    showError(`Failed to load image: ${file.name}`);
                };
            };
            reader.onerror = () => {
                showError(`Failed to read file: ${file.name}`);
            };
            reader.readAsDataURL(file);
        };
        
        input.click();
    }

    function loadMultipleImages() {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = 'image/*';
        
        input.onchange = async e => {
            const files = Array.from(e.target.files);
            if (files.length === 0) return;

            loadedImages = [];
            let loadedCount = 0;
            let failedFiles = [];
            
            multiImageGrid.innerHTML = '';
            
            const placeholder = multipleImagesContainer.querySelector('.placeholder');
            if (placeholder) placeholder.style.display = 'none';

            for (const file of files) {
                try {
                    const imgData = await loadImageFile(file);
                    loadedImages.push(imgData);
                    loadedCount++;
                    
                    const imgItem = document.createElement('div');
                    imgItem.className = 'multi-image-item';
                    
                    const imgElement = document.createElement('img');
                    imgElement.src = imgData.url;
                    imgElement.alt = file.name;
                    
                    const fileName = document.createElement('div');
                    fileName.className = 'file-name';
                    fileName.textContent = file.name;
                    
                    imgItem.appendChild(imgElement);
                    imgItem.appendChild(fileName);
                    multiImageGrid.appendChild(imgItem);
                    
                } catch (error) {
                    failedFiles.push(`${file.name}: ${error.message}`);
                }
            }

            imagesCount.textContent = `${loadedCount} ${loadedCount !== 1 ? t.images : t.image}`;
            resizeImageBtn.disabled = loadedCount === 0;
            
            if (loadedCount > 0) {
                imageInfo.textContent = `${loadedCount} image${loadedCount !== 1 ? 's' : ''} loaded`;
                addMessage(`Successfully loaded ${loadedCount}/${files.length} images.`);
                
                switchTab('multiple');
            } else {
                imageInfo.textContent = 'No images loaded';
                if (placeholder) placeholder.style.display = 'flex';
            }
            
            if (failedFiles.length > 0) {
                const errorMsg = `Failed to load ${failedFiles.length} image${failedFiles.length !== 1 ? 's' : ''}:\n${failedFiles.join('\n')}`;
                showError(errorMsg);
            }
        };
        
        input.click();
    }

    function loadImageFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = event => {
                const img = new Image();
                img.onload = () => {
                    resolve({
                        file,
                        url: event.target.result,
                        img,
                        width: img.width,
                        height: img.height,
                        size: file.size
                    });
                };
                img.onerror = () => reject(new Error('Image loading failed'));
                img.src = event.target.result;
            };
            reader.onerror = () => reject(new Error('File reading failed'));
            reader.readAsDataURL(file);
        });
    }

    function resizeSingleImage(percentage) {
        if (!currentImage) {
            showError('No image loaded to resize.');
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const newWidth = Math.round(currentImage.width * percentage / 100);
        const newHeight = Math.round(currentImage.height * percentage / 100);
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        ctx.imageSmoothingEnabled = aliasingCheckbox.checked;
        ctx.imageSmoothingQuality = aliasingCheckbox.checked ? 'high' : 'low';
        
        ctx.drawImage(currentImage, 0, 0, newWidth, newHeight);
        
        addMessage(`Resizing image to ${percentage}% (${newWidth}×${newHeight})...`);
        
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${imageInfo.textContent}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            addMessage(`Resized image saved successfully.`);
        }, 'image/png', 0.92);
    }

    async function resizeMultipleImages(percentage) {
        if (loadedImages.length === 0) {
            showError('No images loaded for resizing.');
            return;
        }

        processing = true;
        cancelRequested = false;
        progressModal.style.display = 'block';
        progressBar.parentElement.style.width = '0%';
        progressText.textContent = '0%';
        
        const zip = new JSZip();
        let processedCount = 0;
        const totalImages = loadedImages.length;

        addMessage(`Starting batch resize of ${totalImages} images to ${percentage}%...`);

        for (let i = 0; i < loadedImages.length; i++) {
            if (cancelRequested) break;

            const imgData = loadedImages[i];
            currentFileEl.textContent = `Processing: ${imgData.file.name}`;
            
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                const newWidth = Math.round(imgData.width * percentage / 100);
                const newHeight = Math.round(imgData.height * percentage / 100);
                
                canvas.width = newWidth;
                canvas.height = newHeight;
                
                ctx.imageSmoothingEnabled = aliasingCheckbox.checked;
                ctx.imageSmoothingQuality = aliasingCheckbox.checked ? 'high' : 'low';
                
                ctx.drawImage(imgData.img, 0, 0, newWidth, newHeight);
                
                const blob = await new Promise(resolve => {
                    canvas.toBlob(resolve, 'image/png', 0.92);
                });
                
                zip.file(`resized_${imgData.file.name}`, blob);
                
                processedCount++;
                const progress = Math.round((i + 1) / totalImages * 100);
                progressBar.parentElement.style.width = `${progress}%`;
                progressText.textContent = `${progress}%`;
                
                addMessage(`Resized: ${imgData.file.name} (${i + 1}/${totalImages})`);
            } catch (error) {
                showError(`Failed to resize ${imgData.file.name}: ${error.message}`);
            }
        }

        if (cancelRequested) {
            addMessage('Image resizing cancelled by user.');
            progressModal.style.display = 'none';
            processing = false;
            cancelRequested = false;
            return;
        }

        try {
            currentFileEl.textContent = 'Creating ZIP archive...';
            addMessage('Creating ZIP archive of resized images...');
            
            const zipContent = await zip.generateAsync({ type: 'blob' }, metadata => {
                const progress = Math.round(metadata.percent);
                progressBar.parentElement.style.width = `${progress}%`;
                progressText.textContent = `${progress}%`;
            });
            
            const url = URL.createObjectURL(zipContent);
            const a = document.createElement('a');
            a.href = url;
            a.download = `resized_images.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            addMessage(`Batch resize completed. ${processedCount}/${totalImages} images processed.`);
        } catch (error) {
            showError(`Error creating ZIP file: ${error.message}`);
        } finally {
            progressModal.style.display = 'none';
            processing = false;
        }
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
});