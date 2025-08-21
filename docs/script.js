document.addEventListener('DOMContentLoaded', function() {
    const singleFileInputWrapper = document.querySelector('.file-input-wrapper');
    const imagePreviewContainer = document.querySelector('.image-preview-container');
    const batchFileInputWrapper = document.querySelector('#batch-modal .file-input-wrapper');
    const toastContainer = document.getElementById('toast-container');
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

    singleFileInputWrapper.addEventListener('dragover', (e) => {
        e.preventDefault();
        singleFileInputWrapper.classList.add('drag-over');
    });
    singleFileInputWrapper.addEventListener('dragleave', () => {
        singleFileInputWrapper.classList.remove('drag-over');
    });
    singleFileInputWrapper.addEventListener('drop', (e) => {
        e.preventDefault();
        singleFileInputWrapper.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            inputFile.files = files;
            updateFileInputLabel();
            addMessage(`Dropped file: ${files[0].name}`);
        }
    });

    batchFileInputWrapper.addEventListener('dragover', (e) => {
        e.preventDefault();
        batchFileInputWrapper.classList.add('drag-over');
    });
    batchFileInputWrapper.addEventListener('dragleave', () => {
        batchFileInputWrapper.classList.remove('drag-over');
    });
    batchFileInputWrapper.addEventListener('drop', (e) => {
        e.preventDefault();
        batchFileInputWrapper.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            batchInputFiles.files = files;
            updateBatchFileInputLabel();
            addMessage(`Dropped ${files.length} files for batch processing.`);
        }
    });

    imagePreviewContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation(); 
        imagePreviewContainer.classList.add('drag-over');
    });

    imagePreviewContainer.addEventListener('dragleave', () => {
        imagePreviewContainer.classList.remove('drag-over');
    });

    imagePreviewContainer.addEventListener('drop', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        imagePreviewContainer.classList.remove('drag-over');
        const files = e.dataTransfer.files;

        if (files.length === 0) return;

        if (files.length === 1 && files[0].type.startsWith('image/')) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(files[0]);
            const input = document.createElement('input');
            input.type = 'file';
            input.files = dataTransfer.files;
            const event = new Event('change');
            Object.defineProperty(event, 'target', { value: input, writable: false });
            loadSingleImageFromEvent(event);
            addMessage(`Dropped single image: ${files[0].name}`);
        } else if (files.length > 0 && Array.from(files).every(file => file.type.startsWith('image/'))) {
            const dataTransfer = new DataTransfer();
            Array.from(files).forEach(file => dataTransfer.items.add(file));
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.files = dataTransfer.files;
            const event = new Event('change');
            Object.defineProperty(event, 'target', { value: input, writable: false });
            await loadMultipleImagesFromEvent(event);
            addMessage(`Dropped ${files.length} images for processing.`);
        } else {
            showError('Dropped files are not valid image files.');
        }
    });

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
    resizePercentage.disabled = false;
    const percentage = parseFloat(resizePercentage.value);
    resizePercentage.disabled = true;

        if (isNaN(percentage)) {
        showError('Please enter a valid percentage.');
        return;
    }
    
    if (percentage <= 0 || percentage > 1000) {
        showError('Percentage must be between 1 and 1000.');
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

    function addMessage(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        messageText.value += `[${timestamp}] ${message}\n`;
        messageText.scrollTop = messageText.scrollHeight;

        showToast(message, type);
    }

    function showError(message) {
        addMessage(`ERROR: ${message}`, 'error');
    }

    function openUrl(url) {
        window.open(url, '_blank');
    }

    function showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.classList.add('toast', type);

        let iconClass = '';
        if (type === 'success') {
            iconClass = 'fas fa-check-circle';
        } else if (type === 'error') {
            iconClass = 'fas fa-times-circle';
        } else {
            iconClass = 'fas fa-info-circle';
        }

        toast.innerHTML = `<i class="${iconClass}"></i><span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.5s forwards'; // Trigger fade out animation
            toast.addEventListener('animationend', () => {
                toast.remove();
        }, { once: true });
    }, duration);
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

    function validateXmlStructure(xmlDoc) {
        const errors = [];

    
    const rootElement = xmlDoc.documentElement;
    if (!rootElement || rootElement.nodeName !== 'TextureAtlas') {
        errors.push("Root element must be 'TextureAtlas'.");
    }

    const subTextures = xmlDoc.getElementsByTagName('SubTexture');
    if (subTextures.length === 0) {
        errors.push("No 'SubTexture' elements found.");
    } else {
        for (let i = 0; i < subTextures.length; i++) {
            const subTexture = subTextures[i];
            const name = subTexture.getAttribute('name');
            const x = subTexture.getAttribute('x');
            const y = subTexture.getAttribute('y');
            const width = subTexture.getAttribute('width');
            const height = subTexture.getAttribute('height');

            if (!name) errors.push(`SubTexture at index ${i} is missing 'name' attribute.`);
            if (!x || isNaN(parseInt(x))) errors.push(`SubTexture '${name || 'unknown'}' has invalid or missing 'x' attribute.`);
            if (!y || isNaN(parseInt(y))) errors.push(`SubTexture '${name || 'unknown'}' has invalid or missing 'y' attribute.`);
            if (!width || isNaN(parseInt(width))) errors.push(`SubTexture '${name || 'unknown'}' has invalid or missing 'width' attribute.`);
            if (!height || isNaN(parseInt(height))) errors.push(`SubTexture '${name || 'unknown'}' has invalid or missing 'height' attribute.`);

        }
    }

    return errors;
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
                    throw new Error("Invalid XML file (parsing error).");
                }

                const validationErrors = validateXmlStructure(xmlDoc);
                if (validationErrors.length > 0) {
                    throw new Error("XML structure validation failed:\n" + validationErrors.join('\n'));
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
                    addMessage('Processing cancelled by user.', 'info');
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

                addMessage(`Successfully processed ${processed}/${total} elements.`, 'success');
                addMessage(`Modified file saved as: ${outputFileName}`, 'success');
            } catch (error) {
                showError(`Error processing XML: ${error.message}`);
            }
        };
        reader.onerror = () => {
            showError('Error reading the XML file.');
            reader.abort();
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
                    throw new Error("Invalid XML file (parsing error).");
                }

                const validationErrors = validateXmlStructure(xmlDoc);
                if (validationErrors.length > 0) {
                    throw new Error("XML structure validation failed:\n" + validationErrors.join('\n'));
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
                progressBar.style.width = `${progress}%`;
                progressText.textContent = `${progress}%`;
                
                addMessage(`Processed: ${file.name} (${i + 1}/${totalFiles})`);
            } catch (error) {
                showError(`Failed to process ${file.name}: ${error.message}`);
            }
        }

        if (cancelRequested) {
            addMessage('Batch processing cancelled by user.', 'info');
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
                progressBar.style.width = `${progress}%`;
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
            
            addMessage(`Batch processing completed. ${processedCount}/${totalFiles} files processed.`, 'success');
            addMessage(`ZIP archive saved as: ${outputFolderName}.zip`, 'success');
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
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = loadSingleImageFromEvent;
            input.click();
        } else {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.accept = 'image/*';
            input.onchange = loadMultipleImagesFromEvent;
            input.click();
        }
    }

    function loadSingleImageFromEvent(e) {
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

                addMessage(`Loaded image: ${file.name} (...)`, 'success');

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
    }

    async function loadMultipleImagesFromEvent(e) {
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

        if (percentage <= 0 || percentage > 1000) {
        showError('Percentage must be between 1 and 1000.');
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
            
            addMessage(`Resized image saved successfully.`, 'success');
        }, 'image/png', 0.92);
    }

    async function resizeMultipleImages(percentage) {
        if (loadedImages.length === 0) {
            showError('No images loaded for resizing.');
            return;
        }

        if (percentage <= 0 || percentage > 1000) {
        showError('Percentage must be between 1 and 1000.');
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
                progressBar.style.width = `${progress}%`;
                progressText.textContent = `${progress}%`;
                
                addMessage(`Resized: ${imgData.file.name} (${i + 1}/${totalImages})`);
            } catch (error) {
                showError(`Failed to resize ${imgData.file.name}: ${error.message}`);
            }
        }

        if (cancelRequested) {
            addMessage('Image resizing cancelled by user.', 'info');
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
                progressBar.style.width = `${progress}%`;
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