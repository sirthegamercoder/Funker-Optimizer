document.addEventListener('DOMContentLoaded', function() {
    const singleFileInputWrapper = document.querySelector('.file-input-wrapper');
    const imagePreviewContainer = document.querySelector('.image-preview-container');
    const batchFileInputWrapper = document.querySelector('#batch-modal .file-input-wrapper');
    const toastContainer = document.getElementById('toast-container');
    const notificationCenter = document.getElementById('notification-center');
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
    const processedItems = document.getElementById('processed-items');
    const progressTime = document.getElementById('progress-time');
    const currentFileEl = document.getElementById('current-file');
    const cancelProcessBtn = document.getElementById('cancel-process');
    const batchModal = document.getElementById('batch-modal');
    const batchInputFiles = document.getElementById('batch-input-files');
    const batchFolderName = document.getElementById('batch-folder-name');
    const startBatchBtn = document.getElementById('start-batch');
    const closeBatchModal = document.querySelector('#batch-modal .close');
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    const resetZoomBtn = document.getElementById('reset-zoom-btn');

    let currentImage = null;
    let loadedImages = [];
    let processing = false;
    let cancelRequested = false;
    let currentZoom = 1;
    let progressStartTime = null;
    let progressInterval = null;

    function init() {
        initTheme();
        updateFileInputLabel();
        updateBatchFileInputLabel();
        setupEventListeners();
        checkTouchDevice();
    }

    function setupEventListeners() {
        singleFileInputWrapper.addEventListener('dragover', handleDragOver);
        singleFileInputWrapper.addEventListener('dragleave', handleDragLeave);
        singleFileInputWrapper.addEventListener('drop', handleFileDrop);
        
        batchFileInputWrapper.addEventListener('dragover', handleDragOver);
        batchFileInputWrapper.addEventListener('dragleave', handleDragLeave);
        batchFileInputWrapper.addEventListener('drop', handleBatchFileDrop);
        
        imagePreviewContainer.addEventListener('dragover', handleImageDragOver);
        imagePreviewContainer.addEventListener('dragleave', handleImageDragLeave);
        imagePreviewContainer.addEventListener('drop', handleImageDrop);
        
        inputFile.addEventListener('change', updateFileInputLabel);
        batchInputFiles.addEventListener('change', updateBatchFileInputLabel);

        modifyXmlBtn.addEventListener('click', modifyXml);
        batchProcessBtn.addEventListener('click', () => batchModal.style.display = 'block');
        closeBatchModal.addEventListener('click', () => batchModal.style.display = 'none');
        startBatchBtn.addEventListener('click', batchProcess);
        
        githubRepoBtn.addEventListener('click', () => openUrl('https://github.com/sirthegamercoder/Funker-Optimizer'));
        bugReportBtn.addEventListener('click', () => openUrl('https://github.com/sirthegamercoder/Funker-Optimizer/issues'));
        spritesheetAndXMLGeneratorBtn.addEventListener('click', () => openUrl('https://uncertainprod.github.io/FNF-Spritesheet-XML-generator-Web/'));
        
        clearMessagesBtn.addEventListener('click', clearMessages);
        copyMessagesBtn.addEventListener('click', copyMessages);
        
        loadImageBtn.addEventListener('click', loadImage);
        resizeImageBtn.addEventListener('click', handleResizeImage);

        singleImageTab.addEventListener('click', () => switchTab('single'));
        multipleImageTab.addEventListener('click', () => switchTab('multiple'));

        cancelProcessBtn.addEventListener('click', cancelProcess);

        themeSwitch.addEventListener('change', toggleTheme);

        zoomInBtn.addEventListener('click', () => adjustZoom(0.1));
        zoomOutBtn.addEventListener('click', () => adjustZoom(-0.1));
        resetZoomBtn.addEventListener('click', resetZoom);
        
        document.querySelector('.file-input-button').addEventListener('click', () => inputFile.click());
        document.querySelector('#batch-modal .file-input-button').addEventListener('click', () => batchInputFiles.click());
    }

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

    function toggleTheme() {
        setTheme(themeSwitch.checked ? 'dark' : 'light');
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    }

    function handleDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
    }

    function handleFileDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            inputFile.files = files;
            updateFileInputLabel();
            addMessage(`Dropped file: ${files[0].name}`);
        }
    }

    function handleBatchFileDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            batchInputFiles.files = files;
            updateBatchFileInputLabel();
            addMessage(`Dropped ${files.length} files for batch processing.`);
        }
    }

    function handleImageDragOver(e) {
        e.preventDefault();
        e.stopPropagation(); 
        imagePreviewContainer.classList.add('drag-over');
    }

    function handleImageDragLeave(e) {
        imagePreviewContainer.classList.remove('drag-over');
    }

    async function handleImageDrop(e) {
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
    }

    function updateFileInputLabel() {
        const label = document.querySelector('.file-input-label');
        if (inputFile.files.length > 0) {
            label.textContent = inputFile.files[0].name;
        } else {
            label.textContent = 'No file selected';
        }
    }

    function updateBatchFileInputLabel() {
        const label = document.querySelector('#batch-modal .file-input-label');
        if (batchInputFiles.files.length > 0) {
            label.textContent = `${batchInputFiles.files.length} files selected`;
        } else {
            label.textContent = 'No files selected';
        }
    }

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
        progressBar.style.width = '0%';
        progressText.textContent = '0%';
        processedItems.textContent = `0/${files.length} files`;
        progressTime.textContent = 'Estimating time...';
        
        const zip = new JSZip();
        const folder = zip.folder(outputFolderName);
        let processedCount = 0;
        const totalFiles = files.length;
        const divisionFactor = parseInt(divisionNumber.value) || 2;

        progressStartTime = Date.now();
        startProgressTracking(totalFiles);

        addMessage(`Starting batch processing of ${totalFiles} files with division factor: ${divisionFactor}`);
        showNotification(`Processing ${totalFiles} files...`, 'progress');

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
                processedItems.textContent = `${i + 1}/${totalFiles} files`;
                
                addMessage(`Processed: ${file.name} (${i + 1}/${totalFiles})`);
            } catch (error) {
                showError(`Failed to process ${file.name}: ${error.message}`);
            }
        }

        stopProgressTracking();

        if (cancelRequested) {
            addMessage('Batch processing cancelled by user.', 'info');
            showNotification('Batch processing cancelled', 'info');
            progressModal.style.display = 'none';
            processing = false;
            cancelRequested = false;
            return;
        }

        try {
            currentFileEl.textContent = 'Creating ZIP archive...';
            addMessage('Creating ZIP archive of processed files...');
            showNotification('Creating ZIP archive...', 'progress');
            
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
            showNotification(`Batch processing completed. ${processedCount} files processed.`, 'success');
        } catch (error) {
            showError(`Error creating ZIP file: ${error.message}`);
            showNotification('Error creating ZIP file', 'error');
        } finally {
            progressModal.style.display = 'none';
            processing = false;
            batchModal.style.display = 'none';
        }
    }

    function startProgressTracking(totalItems) {
        let processed = 0;
        
        progressInterval = setInterval(() => {
            if (processed >= totalItems || cancelRequested) {
                stopProgressTracking();
                return;
            }
            
            const elapsedTime = Date.now() - progressStartTime;
            const itemsPerSecond = processed / (elapsedTime / 1000);
            
            if (itemsPerSecond > 0) {
                const remainingItems = totalItems - processed;
                const estimatedSeconds = remainingItems / itemsPerSecond;
                progressTime.textContent = `ETA: ${formatTime(estimatedSeconds)}`;
            }
            
            processed++;
        }, 1000);
    }

    function stopProgressTracking() {
        if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
    }

    function formatTime(seconds) {
        if (seconds < 60) {
            return `${Math.ceil(seconds)}s`;
        } else if (seconds < 3600) {
            return `${Math.floor(seconds / 60)}m ${Math.ceil(seconds % 60)}s`;
        } else {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            return `${hours}h ${minutes}m`;
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

        imageContainer.innerHTML = '';
        const placeholder = document.createElement('div');
        placeholder.className = 'placeholder image-loading';
        placeholder.innerHTML = '<p>Loading image...</p>';
        imageContainer.appendChild(placeholder);

        const reader = new FileReader();
        reader.onload = event => {
            currentImage = new Image();

            const tempImg = new Image();
            tempImg.src = event.target.result;
            tempImg.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = tempImg.width / 4;
                canvas.height = tempImg.height / 4;
                ctx.drawImage(tempImg, 0, 0, canvas.width, canvas.height);
                
                const lowResDataUrl = canvas.toDataURL('image/jpeg', 0.5);

                imageContainer.innerHTML = '';
                const imgElement = document.createElement('img');
                imgElement.src = lowResDataUrl;
                imgElement.style.filter = 'blur(5px)';
                imgElement.style.transition = 'filter 0.5s';
                imageContainer.appendChild(imgElement);

                currentImage.src = event.target.result;
                currentImage.onload = () => {
                    imgElement.src = currentImage.src;
                    imgElement.style.filter = 'none';
                    
                    imageDimensions.textContent = `${currentImage.width}×${currentImage.height}px`;
                    imageSize.textContent = `${formatFileSize(file.size)}`;

                    imageInfo.textContent = file.name;
                    resizeImageBtn.disabled = false;

                    addMessage(`Loaded image: ${file.name}`, 'success');
                    resetZoom();
                };
                
                currentImage.onerror = () => {
                    showError(`Failed to load image: ${file.name}`);
                    imageContainer.innerHTML = '<div class="placeholder"><i class="fas fa-exclamation-triangle"></i><p>Failed to load image</p></div>';
                };
            };
        };
        
        reader.onerror = () => {
            showError(`Failed to read file: ${file.name}`);
            imageContainer.innerHTML = '<div class="placeholder"><i class="fas fa-exclamation-triangle"></i><p>Failed to load image</p></div>';
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

        const notificationId = showNotification(`Loading ${files.length} images...`, 'progress', 0);

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

                updateNotification(notificationId, `Loading images... (${loadedCount}/${files.length})`, 'progress');

            } catch (error) {
                failedFiles.push(`${file.name}: ${error.message}`);
            }
        }

        removeNotification(notificationId);

        imagesCount.textContent = `${loadedCount} image${loadedCount !== 1 ? 's' : ''}`;
        resizeImageBtn.disabled = loadedCount === 0;

        if (loadedCount > 0) {
            imageInfo.textContent = `${loadedCount} image${loadedCount !== 1 ? 's' : ''} loaded`;
            addMessage(`Successfully loaded ${loadedCount}/${files.length} images.`);
            showNotification(`Loaded ${loadedCount} images`, 'success');

            switchTab('multiple');
        } else {
            imageInfo.textContent = 'No images loaded';
            if (placeholder) placeholder.style.display = 'flex';
        }

        if (failedFiles.length > 0) {
            const errorMsg = `Failed to load ${failedFiles.length} image${failedFiles.length !== 1 ? 's' : ''}`;
            showError(errorMsg);
            showNotification(errorMsg, 'error');
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

    function handleResizeImage() {
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

        const notificationId = showNotification('Resizing image...', 'progress');

        requestAnimationFrame(() => {
            ctx.drawImage(currentImage, 0, 0, newWidth, newHeight);
            
            addMessage(`Resizing image to ${percentage}% (${newWidth}×${newHeight})...`);
            
            canvas.toBlob(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `resized_${imageInfo.textContent}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                addMessage(`Resized image saved successfully.`, 'success');
                showNotification('Image resized and downloaded', 'success');

                removeNotification(notificationId);
            }, 'image/png', 0.92);
        });
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
        progressBar.style.width = '0%';
        progressText.textContent = '0%';
        processedItems.textContent = `0/${loadedImages.length} images`;
        progressTime.textContent = 'Estimating time...';
        
        const zip = new JSZip();
        let processedCount = 0;
        const totalImages = loadedImages.length;

        progressStartTime = Date.now();
        startProgressTracking(totalImages);

        addMessage(`Starting batch resize of ${totalImages} images to ${percentage}%...`);
        showNotification(`Resizing ${totalImages} images...`, 'progress');

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
                processedItems.textContent = `${i + 1}/${totalImages} images`;
                
                addMessage(`Resized: ${imgData.file.name} (${i + 1}/${totalImages})`);
            } catch (error) {
                showError(`Failed to resize ${imgData.file.name}: ${error.message}`);
            }
        }

        stopProgressTracking();

        if (cancelRequested) {
            addMessage('Image resizing cancelled by user.', 'info');
            showNotification('Image resizing cancelled', 'info');
            progressModal.style.display = 'none';
            processing = false;
            cancelRequested = false;
            return;
        }

        try {
            currentFileEl.textContent = 'Creating ZIP archive...';
            addMessage('Creating ZIP archive of resized images...');
            showNotification('Creating ZIP archive...', 'progress');
            
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
            showNotification(`Resized ${processedCount} images`, 'success');
        } catch (error) {
            showError(`Error creating ZIP file: ${error.message}`);
            showNotification('Error creating ZIP file', 'error');
        } finally {
            progressModal.style.display = 'none';
            processing = false;
        }
    }

    function adjustZoom(factor) {
        if (!currentImage) return;
        
        currentZoom += factor;
        currentZoom = Math.max(0.1, Math.min(5, currentZoom));
        
        const imgElement = imageContainer.querySelector('img');
        if (imgElement) {
            imgElement.style.transform = `scale(${currentZoom})`;
            imgElement.style.transformOrigin = 'center center';
        }
        
        addMessage(`Zoom: ${Math.round(currentZoom * 100)}%`);
    }

    function resetZoom() {
        currentZoom = 1;
        const imgElement = imageContainer.querySelector('img');
        if (imgElement) {
            imgElement.style.transform = 'scale(1)';
        }
        
        addMessage('Zoom reset to 100%');
    }

    function checkTouchDevice() {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        if (isTouchDevice) {
            document.body.classList.add('touch-device');
        }
    }

    function addMessage(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        messageText.value += `[${timestamp}] ${message}\n`;
        messageText.scrollTop = messageText.scrollHeight;

        showToast(message, type);
    }

    function showError(message) {
        addMessage(`ERROR: ${message}`, 'error');
        showNotification(message, 'error');
    }

    function clearMessages() {
        messageText.value = '';
        addMessage('Messages cleared.');
    }

    function copyMessages() {
        messageText.select();
        document.execCommand('copy');
        addMessage('Messages copied to clipboard.');
        showNotification('Messages copied to clipboard', 'success');
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
            toast.style.animation = 'fadeOut 0.5s forwards';
            toast.addEventListener('animationend', () => {
                toast.remove();
            }, { once: true });
        }, duration);
    }

    function showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.classList.add('notification', type);
        
        const id = 'notification-' + Date.now();
        notification.id = id;
        
        let iconClass = '';
        if (type === 'success') {
            iconClass = 'fas fa-check-circle';
        } else if (type === 'error') {
            iconClass = 'fas fa-times-circle';
        } else if (type === 'warning') {
            iconClass = 'fas fa-exclamation-triangle';
        } else if (type === 'progress') {
            iconClass = 'fas fa-spinner';
        } else {
            iconClass = 'fas fa-info-circle';
        }
        
        notification.innerHTML = `<i class="${iconClass}"></i><span>${message}</span>`;
        
        if (type !== 'progress' && duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }
        
        notificationCenter.appendChild(notification);
        return id;
    }

    function updateNotification(id, message, type = 'info') {
        const notification = document.getElementById(id);
        if (notification) {
            notification.querySelector('span').textContent = message;

            if (type) {
                let iconClass = '';
                if (type === 'success') {
                    iconClass = 'fas fa-check-circle';
                } else if (type === 'error') {
                    iconClass = 'fas fa-times-circle';
                } else if (type === 'warning') {
                    iconClass = 'fas fa-exclamation-triangle';
                } else if (type === 'progress') {
                    iconClass = 'fas fa-spinner';
                } else {
                    iconClass = 'fas fa-info-circle';
                }
                
                notification.querySelector('i').className = iconClass;
            }
        }
    }

    function removeNotification(id) {
        const notification = document.getElementById(id);
        if (notification) {
            notification.style.animation = 'fadeOut 0.5s forwards';
            notification.addEventListener('animationend', () => {
                notification.remove();
            }, { once: true });
        }
    }

    function cancelProcess() {
        cancelRequested = true;
        addMessage('Process cancellation requested...');
        showNotification('Cancelling process...', 'info');
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    init();
});