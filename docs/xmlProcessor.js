import JSZip from 'jszip';
import { validateXmlStructure, readFileAsText } from './utils.js';

export class XMLProcessor {
    constructor(uiManager) {
        this.uiManager = uiManager;
    }

    processSingleXML(file, divisionFactor, outputFileName) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => {
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
                    
                    const blob = new Blob([modifiedXml], { type: 'text/xml' });
                    resolve({ blob, total, processed: total });
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => {
                reject(new Error('Error reading the XML file.'));
                reader.abort();
            };
            reader.readAsText(file);
        });
    }

    async processBatchXML(files, divisionFactor, outputFolderName, onProgress) {
        const zip = new JSZip();
        const folder = zip.folder(outputFolderName);
        let processedCount = 0;

        for (let i = 0; i < files.length; i++) {
            if (onProgress && onProgress.cancelled) {
                throw new Error('Processing cancelled by user.');
            }

            const file = files[i];
            
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
                
                if (onProgress) {
                    onProgress(i + 1, files.length, file.name);
                }
            } catch (error) {
                console.error(`Failed to process ${file.name}:`, error);
                if (onProgress && onProgress.onError) {
                    onProgress.onError(file.name, error.message);
                }
            }
        }

        return { zip, processedCount, total: files.length };
    }
}

export default XMLProcessor;