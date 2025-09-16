import { formatFileSize } from './utils.js';

export class UIManager {
    constructor() {
        this.toastContainer = document.getElementById('toast-container');
        this.notificationCenter = document.getElementById('notification-center');
        this.messageText = document.getElementById('message-text');
        this.progressModal = document.getElementById('progress-modal');
        this.progressBar = document.getElementById('progress-bar');
        this.progressText = document.getElementById('progress-text');
        this.processedItems = document.getElementById('processed-items');
        this.progressTime = document.getElementById('progress-time');
        this.currentFileEl = document.getElementById('current-file');
        this.imageInfo = document.getElementById('image-info');
        this.imageDimensions = document.getElementById('image-dimensions');
        this.imageSize = document.getElementById('image-size');
        this.imagesCount = document.getElementById('images-count');
        this.imageContainer = document.getElementById('image-container');
        this.multiImageGrid = document.getElementById('multi-image-grid');
    }

    addMessage(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        this.messageText.value += `[${timestamp}] ${message}\n`;
        this.messageText.scrollTop = this.messageText.scrollHeight;

        this.showToast(message, type);
    }

    showError(message) {
        this.addMessage(`ERROR: ${message}`, 'error');
        this.showNotification(message, 'error');
    }

    clearMessages() {
        this.messageText.value = '';
        this.addMessage('Messages cleared.');
    }

    copyMessages() {
        this.messageText.select();
        document.execCommand('copy');
        this.addMessage('Messages copied to clipboard.');
        this.showNotification('Messages copied to clipboard', 'success');
    }

    showToast(message, type = 'info', duration = 3000) {
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
        this.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.5s forwards';
            toast.addEventListener('animationend', () => {
                toast.remove();
            }, { once: true });
        }, duration);
    }

    showNotification(message, type = 'info', duration = 5000) {
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
                this.removeNotification(id);
            }, duration);
        }
        
        this.notificationCenter.appendChild(notification);
        return id;
    }

    updateNotification(id, message, type = 'info') {
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

    removeNotification(id) {
        const notification = document.getElementById(id);
        if (notification) {
            notification.style.animation = 'fadeOut 0.5s forwards';
            notification.addEventListener('animationend', () => {
                notification.remove();
            }, { once: true });
        }
    }

    updateProgress(progress, processed, total, currentFile = '') {
        this.progressBar.style.width = `${progress}%`;
        this.progressText.textContent = `${progress}%`;
        this.processedItems.textContent = `${processed}/${total} items`;
        if (currentFile) {
            this.currentFileEl.textContent = currentFile;
        }
    }

    showProgressModal() {
        this.progressModal.style.display = 'block';
        this.updateProgress(0, 0, 0, 'Preparing files...');
        document.body.style.overflow = 'hidden';
    }

    hideProgressModal() {
        this.progressModal.style.display = 'none';
        document.body.style.overflow = '';
    }

    updateImageInfo(file, isMultiple = false, count = 0, imageData = null) {
        if (isMultiple) {
            this.imageInfo.textContent = `${count} image${count !== 1 ? 's' : ''} loaded`;
            this.imagesCount.textContent = `${count} image${count !== 1 ? 's' : ''}`;
        } else if (file && imageData) {
            this.imageInfo.textContent = file.name;
            this.imageDimensions.textContent = `${imageData.width}×${imageData.height}px`;
            this.imageSize.textContent = `${formatFileSize(file.size)}`;
        } else {
            this.imageInfo.textContent = 'No image loaded';
            this.imageDimensions.textContent = '-';
            this.imageSize.textContent = '-';
        }
    }

    displaySingleImage(imageData, file) {
        this.imageContainer.innerHTML = '';
        const imgElement = document.createElement('img');
        imgElement.src = imageData.url;
        this.imageContainer.appendChild(imgElement);
        this.updateImageInfo(file, false, 0, imageData);
    }

    displayMultipleImages(imagesData) {
        this.multiImageGrid.innerHTML = '';
        
        imagesData.forEach(imgData => {
            const imgItem = document.createElement('div');
            imgItem.className = 'multi-image-item';

            const imgElement = document.createElement('img');
            imgElement.src = imgData.url;
            imgElement.alt = imgData.file.name;

            const fileName = document.createElement('div');
            fileName.className = 'file-name';
            fileName.textContent = imgData.file.name;

            imgItem.appendChild(imgElement);
            imgItem.appendChild(fileName);
            this.multiImageGrid.appendChild(imgItem);
        });
        
        this.updateImageInfo(null, true, imagesData.length);
    }

    showLoadingIndicator(container) {
        container.innerHTML = '';
        const placeholder = document.createElement('div');
        placeholder.className = 'placeholder image-loading';
        placeholder.innerHTML = '<p>Loading image...</p>';
        container.appendChild(placeholder);
    }

    showErrorIndicator(container, message) {
        container.innerHTML = `<div class="placeholder"><i class="fas fa-exclamation-triangle"></i><p>${message}</p></div>`;
    }
}

export default UIManager;