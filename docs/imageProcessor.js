import { loadImageFile } from './utils.js';

export class ImageProcessor {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.currentImage = null;
        this.loadedImages = [];
        this.currentZoom = 1;
    }

    async loadSingleImage(file) {
        try {
            this.uiManager.showLoadingIndicator(this.uiManager.imageContainer);
            
            const imageData = await loadImageFile(file);
            this.currentImage = imageData.img;
            
            this.uiManager.displaySingleImage(imageData, file);
            this.resetZoom();
            
            this.uiManager.addMessage(`Loaded image: ${file.name}`, 'success');
            return imageData;
        } catch (error) {
            this.uiManager.showErrorIndicator(this.uiManager.imageContainer, 'Failed to load image');
            this.uiManager.showError(`Failed to load image: ${file.name}`);
            throw error;
        }
    }

    async loadMultipleImages(files) {
        this.loadedImages = [];
        let loadedCount = 0;
        let failedFiles = [];

        this.uiManager.multiImageGrid.innerHTML = '';
        const notificationId = this.uiManager.showNotification(`Loading ${files.length} images...`, 'progress', 0);

        for (const file of files) {
            try {
                const imgData = await loadImageFile(file);
                this.loadedImages.push(imgData);
                loadedCount++;

                this.uiManager.updateNotification(notificationId, `Loading images... (${loadedCount}/${files.length})`, 'progress');

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
                this.uiManager.multiImageGrid.appendChild(imgItem);

            } catch (error) {
                failedFiles.push(`${file.name}: ${error.message}`);
            }
        }

        this.uiManager.removeNotification(notificationId);
        this.uiManager.displayMultipleImages(this.loadedImages);

        if (loadedCount > 0) {
            this.uiManager.addMessage(`Successfully loaded ${loadedCount}/${files.length} images.`);
            this.uiManager.showNotification(`Loaded ${loadedCount} images`, 'success');
        }

        if (failedFiles.length > 0) {
            const errorMsg = `Failed to load ${failedFiles.length} image${failedFiles.length !== 1 ? 's' : ''}`;
            this.uiManager.showError(errorMsg);
        }

        return { loaded: loadedCount, failed: failedFiles.length };
    }

    resizeSingleImage(percentage, enableAliasing) {
        if (!this.currentImage) {
            throw new Error('No image loaded to resize.');
        }

        if (percentage <= 0 || percentage > 1000) {
            throw new Error('Percentage must be between 1 and 1000.');
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const newWidth = Math.round(this.currentImage.width * percentage / 100);
        const newHeight = Math.round(this.currentImage.height * percentage / 100);
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        ctx.imageSmoothingEnabled = enableAliasing;
        ctx.imageSmoothingQuality = enableAliasing ? 'high' : 'low';

        return new Promise((resolve) => {
            requestAnimationFrame(() => {
                ctx.drawImage(this.currentImage, 0, 0, newWidth, newHeight);
                
                this.uiManager.addMessage(`Resizing image to ${percentage}% (${newWidth}×${newHeight})...`);
                
                canvas.toBlob(blob => {
                    resolve(blob);
                }, 'image/png', 0.92);
            });
        });
    }

    async resizeMultipleImages(percentage, enableAliasing, onProgress) {
        if (this.loadedImages.length === 0) {
            throw new Error('No images loaded for resizing.');
        }

        if (percentage <= 0 || percentage > 1000) {
            throw new Error('Percentage must be between 1 and 1000.');
        }

        const zip = new JSZip();
        let processedCount = 0;

        for (let i = 0; i < this.loadedImages.length; i++) {
            if (onProgress && onProgress.cancelled) {
                throw new Error('Processing cancelled by user.');
            }

            const imgData = this.loadedImages[i];
            
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                const newWidth = Math.round(imgData.width * percentage / 100);
                const newHeight = Math.round(imgData.height * percentage / 100);
                
                canvas.width = newWidth;
                canvas.height = newHeight;
                
                ctx.imageSmoothingEnabled = enableAliasing;
                ctx.imageSmoothingQuality = enableAliasing ? 'high' : 'low';
                
                ctx.drawImage(imgData.img, 0, 0, newWidth, newHeight);
                
                const blob = await new Promise((resolve, reject) => {
                    if (onProgress && onProgress.cancelled && onProgress.cancelled()) {
                        reject(new Error('Processing cancelled by user.'));
                        return;
                    }
                    
                    canvas.toBlob(resolve, 'image/png', 0.92);
                }).catch(error => {
                    if (error.message === 'Processing cancelled by user.') {
                        throw error;
                    }
                    console.error(`Failed to create blob for ${imgData.file.name}:`, error);
                    return null;
                });

                if (!blob) continue;

                zip.file(`resized_${imgData.file.name}`, blob);
                
                processedCount++;
                
                if (onProgress) {
                    onProgress(i + 1, this.loadedImages.length, imgData.file.name);
                }
            } catch (error) {
                console.error(`Failed to resize ${imgData.file.name}:`, error);
                if (onProgress && onProgress.onError) {
                    onProgress.onError(imgData.file.name, error.message);
                }
            }
        }

        return { zip, processedCount, total: this.loadedImages.length };
    }

    adjustZoom(factor) {
        if (!this.currentImage) return;
        
        this.currentZoom += factor;
        this.currentZoom = Math.max(0.1, Math.min(5, this.currentZoom));
        
        const imgElement = this.uiManager.imageContainer.querySelector('img');
        if (imgElement) {
            imgElement.style.transform = `scale(${this.currentZoom})`;
            imgElement.style.transformOrigin = 'center center';
        }
        
        this.uiManager.addMessage(`Zoom: ${Math.round(this.currentZoom * 100)}%`);
    }

    resetZoom() {
        this.currentZoom = 1;
        const imgElement = this.uiManager.imageContainer.querySelector('img');
        if (imgElement) {
            imgElement.style.transform = 'scale(1)';
        }
        
        this.uiManager.addMessage('Zoom reset to 100%');
    }
}

export default ImageProcessor;