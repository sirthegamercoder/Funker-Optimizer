export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
};

export const formatTime = (seconds) => {
    if (seconds < 60) {
        return `${Math.ceil(seconds)}s`;
    } else if (seconds < 3600) {
        return `${Math.floor(seconds / 60)}m ${Math.ceil(seconds % 60)}s`;
    } else {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    }
};

export const validateXmlStructure = (xmlDoc) => {
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
};

export const loadImageFile = (file) => {
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
};