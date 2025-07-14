document.addEventListener('DOMContentLoaded', function() {
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
    const batchOutputFiles = document.getElementById('batch-output-files');
    const startBatchBtn = document.getElementById('start-batch');
    const closeBatchModal = document.querySelector('#batch-modal .close');

    let currentImage = null;
    let loadedImages = [];
    let processing = false;
    let cancelRequested = false;

    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 
                         (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        setTheme(savedTheme);
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

    function addMessage(message) {
        const timestamp = new Date().toLocaleTimeString();
        messageText.value += `[${timestamp}] ${message}\n`;
        messageText.scrollTop = messageText.scrollHeight;
    }

    function showError(message) {
        addMessage(`ERROR: ${message}`);
    }

    function openUrl(url) {
        window.open(url, '_blank');
    }

function updateFileInputLabel() {
    const label = document.querySelector('.file-input-label');
    if (inputFile.files.length > 0) {
        label.textContent = inputFile.files[0].name;
    } else {
        label.textContent = 'No file selected';
    }
}

document.querySelector('.file-input-button').addEventListener('click', function() {
    inputFile.click();
});

function updateBatchFileInputLabel() {
    const label = document.querySelector('#batch-modal .file-input-label');
    if (batchInputFiles.files.length > 0) {
        label.textContent = `${batchInputFiles.files.length} files selected`;
    } else {
        label.textContent = 'No files selected';
    }
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
        const outputFileName = batchOutputFiles.value.trim() || 'optimized_xml';

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
        const folder = zip.folder(outputFileName);
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
            a.download = `${outputFileName}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            addMessage(`Batch processing completed. ${processedCount}/${totalFiles} files processed.`);
            addMessage(`ZIP archive saved as: ${outputDirName}.zip`);
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

            imagesCount.textContent = `${loadedCount} image${loadedCount !== 1 ? 's' : ''}`;
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
