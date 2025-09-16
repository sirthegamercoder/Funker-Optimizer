(function initThemeImmediately() {
    const savedTheme = localStorage.getItem('theme');
    let theme;
    
    if (savedTheme) {
        theme = savedTheme;
    } else {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        theme = isDark ? 'dark' : 'light';
    }

    document.documentElement.setAttribute('data-theme', theme);
    document.body.classList.toggle('dark-mode', theme === 'dark');

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.content = theme === 'dark' ? '#2d3748' : '#4a6bff';
    }
})();

import JSZip from 'jszip';
import UIManager from './uiManager.js';
import XMLProcessor from './xmlProcessor.js';
import ImageProcessor from './imageProcessor.js';
import { formatTime } from './utils.js';

document.addEventListener('DOMContentLoaded', function() {
    const uiManager = new UIManager();
    const xmlProcessor = new XMLProcessor(uiManager);
    const imageProcessor = new ImageProcessor(uiManager);

    const singleFileInputWrapper = document.querySelector('.file-input-wrapper');
    const imagePreviewContainer = document.querySelector('.image-preview-container');
    const batchFileInputWrapper = document.querySelector('#batch-modal .file-input-wrapper');
    const inputFile = document.getElementById('input-file');
    const outputFile = document.getElementById('output-file');
    const divisionNumber = document.getElementById('division-number');
    const batchProcessBtn = document.getElementById('batch-process');
    const modifyXmlBtn = document.getElementById('modify-xml');
    const githubRepoBtn = document.getElementById('github-repo');
    const bugReportBtn = document.getElementById('bug-report');
    const spritesheetAndXMLGeneratorBtn = document.getElementById('spritesheet-and-xml-generator');
    const clearMessagesBtn = document.getElementById('clear-messages');
    const copyMessagesBtn = document.getElementById('copy-messages');
    const loadImageBtn = document.getElementById('load-image');
    const resizeImageBtn = document.getElementById('resize-image');
    const aliasingCheckbox = document.getElementById('aliasing');
    const resizePercentage = document.getElementById('resize-percentage');
    const singleImageTab = document.querySelector('[data-tab="single"]');
    const multipleImageTab = document.querySelector('[data-tab="multiple"]');
    const themeSwitch = document.getElementById('theme-switch');
    const cancelProcessBtn = document.getElementById('cancel-process');
    const batchModal = document.getElementById('batch-modal');
    const batchInputFiles = document.getElementById('batch-input-files');
    const batchFolderName = document.getElementById('batch-folder-name');
    const startBatchBtn = document.getElementById('start-batch');
    const closeBatchModal = document.querySelector('#batch-modal .close');
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    const resetZoomBtn = document.getElementById('reset-zoom-btn');

    let processing = false;
    let cancelRequested = false;
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
        
        clearMessagesBtn.addEventListener('click', () => uiManager.clearMessages());
        copyMessagesBtn.addEventListener('click', () => uiManager.copyMessages());
        
        loadImageBtn.addEventListener('click', loadImage);
        resizeImageBtn.addEventListener('click', handleResizeImage);

        singleImageTab.addEventListener('click', () => switchTab('single'));
        multipleImageTab.addEventListener('click', () => switchTab('multiple'));

        cancelProcessBtn.addEventListener('click', cancelProcess);

        themeSwitch.addEventListener('change', toggleTheme);

        zoomInBtn.addEventListener('click', () => imageProcessor.adjustZoom(0.1));
        zoomOutBtn.addEventListener('click', () => imageProcessor.adjustZoom(-0.1));
        resetZoomBtn.addEventListener('click', () => imageProcessor.resetZoom());
        
        document.querySelector('.file-input-button').addEventListener('click', () => inputFile.click());
        document.querySelector('#batch-modal .file-input-button').addEventListener('click', () => batchInputFiles.click());
    }

    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        let theme;
        
        if (savedTheme) {
            theme = savedTheme;
        } else {
            theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        setTheme(theme);

        if (!savedTheme) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                if (!localStorage.getItem('theme')) {
                    setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.classList.toggle('dark-mode', theme === 'dark');
        if (themeSwitch) {
            themeSwitch.checked = theme === 'dark';
        }
        localStorage.setItem('theme', theme);

        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.content = theme === 'dark' ? '#2d3748' : '#4a6bff';
        }

        window.dispatchEvent(new CustomEvent('themeChanged', { detail: theme }));
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
            uiManager.addMessage(`Dropped file: ${files[0].name}`);
        }
    }

    function handleBatchFileDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            batchInputFiles.files = files;
            updateBatchFileInputLabel();
            uiManager.addMessage(`Dropped ${files.length} files for batch processing.`);
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
            uiManager.addMessage(`Dropped single image: ${files[0].name}`);
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
            uiManager.addMessage(`Dropped ${files.length} images for processing.`);
        } else {
            uiManager.showError('Dropped files are not valid image files.');
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
        
        const singleImageContainer = document.getElementById('single-image-container');
        const multipleImagesContainer = document.getElementById('multiple-images-container');
        
        singleImageContainer.classList.toggle('active', tabName === 'single');
        multipleImagesContainer.classList.toggle('active', tabName === 'multiple');
    }

    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }

    async function modifyXml() {
        const file = inputFile.files[0];
        const outputFileName = outputFile.value.trim() || 'output.xml';
        const divisionFactor = parseInt(divisionNumber.value) || 2;

        if (!file) {
            uiManager.showError('Please select an input XML file.');
            return;
        }

        if (divisionFactor <= 0) {
            uiManager.showError('Division factor must be a positive number.');
            return;
        }

        uiManager.addMessage(`Starting XML modification with division factor: ${divisionFactor}`);

        try {
            uiManager.showProgressModal();
            
            const result = await xmlProcessor.processSingleXML(file, divisionFactor, outputFileName);
            
            if (cancelRequested) {
                uiManager.addMessage('Processing cancelled by user.', 'info');
                cancelRequested = false;
                return;
            }

            const url = URL.createObjectURL(result.blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = outputFileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            uiManager.addMessage(`Successfully processed ${result.processed}/${result.total} elements.`, 'success');
            uiManager.addMessage(`Modified file saved as: ${outputFileName}`, 'success');
        } catch (error) {
            uiManager.showError(`Error processing XML: ${error.message}`);
        } finally {
            uiManager.hideProgressModal();
        }
    }

    async function batchProcess() {
        const files = batchInputFiles.files;
        const outputFolderName = batchFolderName.value.trim() || 'optimized_xml';
        const divisionFactor = parseInt(divisionNumber.value) || 2;

        if (files.length === 0) {
            uiManager.showError('Please select at least one XML file.');
            return;
        }

        processing = true;
        cancelRequested = false;
        
        uiManager.showProgressModal();
        uiManager.updateProgress(0, 0, files.length, 'Starting batch processing...');
        
        startProgressTracking(files.length);

        uiManager.addMessage(`Starting batch processing of ${files.length} files with division factor: ${divisionFactor}`);
        const notificationId = uiManager.showNotification(`Processing ${files.length} files...`, 'progress');

        try {
            const result = await xmlProcessor.processBatchXML(
                files, 
                divisionFactor, 
                outputFolderName,
                {
                    onProgress: (processed, total, currentFile) => {
                        const progress = Math.round(processed / total * 100);
                        uiManager.updateProgress(progress, processed, total, `Processing: ${currentFile}`);
                    },
                    onError: (fileName, error) => {
                        uiManager.showError(`Failed to process ${fileName}: ${error}`);
                    },
                    cancelled: () => cancelRequested
                }
            );

            if (cancelRequested) {
                uiManager.addMessage('Batch processing cancelled by user.', 'info');
                uiManager.showNotification('Batch processing cancelled', 'info');
                cancelRequested = false;
                return;
            }

            uiManager.updateProgress(100, files.length, files.length, 'Creating ZIP archive...');
            uiManager.addMessage('Creating ZIP archive of processed files...');
            uiManager.updateNotification(notificationId, 'Creating ZIP archive...', 'progress');
            
            const zipContent = await result.zip.generateAsync({ type: 'blob' }, metadata => {
                const progress = Math.round(metadata.percent);
                uiManager.updateProgress(progress, files.length, files.length);
            });
            
            const url = URL.createObjectURL(zipContent);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${outputFolderName}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            uiManager.addMessage(`Batch processing completed. ${result.processedCount}/${result.total} files processed.`, 'success');
            uiManager.addMessage(`ZIP archive saved as: ${outputFolderName}.zip`, 'success');
            uiManager.showNotification(`Batch processing completed. ${result.processedCount} files processed.`, 'success');
        } catch (error) {
            if (error.message !== 'Processing cancelled by user.') {
                uiManager.showError(`Error during batch processing: ${error.message}`);
                uiManager.showNotification('Error during batch processing', 'error');
            }
        } finally {
            stopProgressTracking();
            uiManager.hideProgressModal();
            processing = false;
            batchModal.style.display = 'none';
            uiManager.removeNotification(notificationId);
        }
    }

    function startProgressTracking(totalItems) {
        progressStartTime = Date.now();
        
        progressInterval = setInterval(() => {
            if (cancelRequested) {
                stopProgressTracking();
                return;
            }

            const progressText = document.getElementById('processed-items').textContent;
            const match = progressText.match(/(\d+)\/(\d+)/);
            
            if (match) {
                const processed = parseInt(match[1]);
                const total = parseInt(match[2]);
                
                if (processed >= total) {
                    stopProgressTracking();
                    return;
                }
                
                const elapsedTime = Date.now() - progressStartTime;
                const itemsPerSecond = processed / (elapsedTime / 1000);
                
                if (itemsPerSecond > 0) {
                    const remainingItems = total - processed;
                    const estimatedSeconds = remainingItems / itemsPerSecond;
                    document.getElementById('progress-time').textContent = `ETA: ${formatTime(estimatedSeconds)}`;
                }
            }
        }, 1000);
    }

    function stopProgressTracking() {
        if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
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

    async function loadSingleImageFromEvent(e) {
        const file = e.target.files[0];
        if (!file) return;

        try {
            await imageProcessor.loadSingleImage(file);
            resizeImageBtn.disabled = false;
            switchTab('single');
        } catch (error) {
            resizeImageBtn.disabled = true;
        }
    }

    async function loadMultipleImagesFromEvent(e) {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        try {
            const result = await imageProcessor.loadMultipleImages(files);
            resizeImageBtn.disabled = result.loaded === 0;
            
            if (result.loaded > 0) {
                switchTab('multiple');
            }
        } catch (error) {
            resizeImageBtn.disabled = true;
        }
    }

    async function handleResizeImage() {
        const percentage = parseFloat(resizePercentage.value);
        
        if (isNaN(percentage)) {
            uiManager.showError('Please enter a valid percentage.');
            return;
        }
        
        if (percentage <= 0 || percentage > 1000) {
            uiManager.showError('Percentage must be between 1 and 1000.');
            return;
        }
        
        const enableAliasing = aliasingCheckbox.checked;
        
        if (singleImageTab.classList.contains('active')) {
            await resizeSingleImage(percentage, enableAliasing);
        } else if (multipleImageTab.classList.contains('active')) {
            await resizeMultipleImages(percentage, enableAliasing);
        } else {
            uiManager.showError('No images loaded to resize.');
        }
    }

    async function resizeSingleImage(percentage, enableAliasing) {
        try {
            const notificationId = uiManager.showNotification('Resizing image...', 'progress');
            
            const blob = await imageProcessor.resizeSingleImage(percentage, enableAliasing);
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `resized_${uiManager.imageInfo.textContent}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            uiManager.addMessage(`Resized image saved successfully.`, 'success');
            uiManager.showNotification('Image resized and downloaded', 'success');
            uiManager.removeNotification(notificationId);
        } catch (error) {
            uiManager.showError(`Error resizing image: ${error.message}`);
        }
    }

    async function resizeMultipleImages(percentage, enableAliasing) {
        processing = true;
        cancelRequested = false;
        
        uiManager.showProgressModal();
        uiManager.updateProgress(0, 0, imageProcessor.loadedImages.length, 'Starting image resizing...');
        
        startProgressTracking(imageProcessor.loadedImages.length);

        uiManager.addMessage(`Starting batch resize of ${imageProcessor.loadedImages.length} images to ${percentage}%...`);
        const notificationId = uiManager.showNotification(`Resizing ${imageProcessor.loadedImages.length} images...`, 'progress');

        try {
            const result = await imageProcessor.resizeMultipleImages(
                percentage,
                enableAliasing,
                {
                    onProgress: (processed, total, currentFile) => {
                        const progress = Math.round(processed / total * 100);
                        uiManager.updateProgress(progress, processed, total, `Processing: ${currentFile}`);
                    },
                    onError: (fileName, error) => {
                        uiManager.showError(`Failed to resize ${fileName}: ${error}`);
                    },
                    cancelled: () => cancelRequested
                }
            );

            if (cancelRequested) {
                uiManager.addMessage('Image resizing cancelled by user.', 'info');
                uiManager.showNotification('Image resizing cancelled', 'info');
                cancelRequested = false;
                return;
            }

            uiManager.updateProgress(100, imageProcessor.loadedImages.length, imageProcessor.loadedImages.length, 'Creating ZIP archive...');
            uiManager.addMessage('Creating ZIP archive of resized images...');
            uiManager.updateNotification(notificationId, 'Creating ZIP archive...', 'progress');
            
            const zipContent = await result.zip.generateAsync({ type: 'blob' }, metadata => {
                const progress = Math.round(metadata.percent);
                uiManager.updateProgress(progress, imageProcessor.loadedImages.length, imageProcessor.loadedImages.length);
            });
            
            const url = URL.createObjectURL(zipContent);
            const a = document.createElement('a');
            a.href = url;
            a.download = `resized_images.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            uiManager.addMessage(`Batch resize completed. ${result.processedCount}/${result.total} images processed.`);
            uiManager.showNotification(`Resized ${result.processedCount} images`, 'success');
        } catch (error) {
            if (error.message !== 'Processing cancelled by user.') {
                uiManager.showError(`Error during batch resize: ${error.message}`);
                uiManager.showNotification('Error during batch resize', 'error');
            }
        } finally {
            stopProgressTracking();
            uiManager.hideProgressModal();
            processing = false;
            uiManager.removeNotification(notificationId);
        }
    }

    function checkTouchDevice() {
        const isTouchDevice = 'ontouchstart' in window || 
                            navigator.maxTouchPoints > 0 || 
                            navigator.msMaxTouchPoints > 0;
        
        if (isTouchDevice) {
            document.body.classList.add('touch-device');

            document.querySelector('.touch-actions').style.display = 'flex';

            document.querySelectorAll('.file-input-wrapper, .image-preview-container').forEach(element => {
                element.addEventListener('touchstart', function() {
                    this.classList.add('touch-active');
                });
                
                element.addEventListener('touchend', function() {
                    this.classList.remove('touch-active');
                });
            });
        }
    }

    function openUrl(url) {
        window.open(url, '_blank');
    }

    function cancelProcess() {
        cancelRequested = true;
        uiManager.addMessage('Process cancellation requested...');
        uiManager.showNotification('Cancelling process...', 'info');
    }

    init();
});