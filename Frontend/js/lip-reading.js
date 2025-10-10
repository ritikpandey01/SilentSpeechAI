// js/lip-reading.js

class LipReadingEngine {
    constructor() {
        this.isProcessing = false;
        this.faceDetector = null;
        this.landmarkPredictor = null;
        this.lipReadingModel = null;
        this.stream = null;
        this.videoElement = null;
        this.canvasElement = null;
        this.ctx = null;
        
        this.phonemeMapping = {
            'AA': 'a', 'AE': 'a', 'AH': 'a', 'AO': 'o',
            'AW': 'aw', 'AY': 'ay', 'B': 'b', 'CH': 'ch',
            'D': 'd', 'DH': 'th', 'EH': 'e', 'ER': 'er',
            'EY': 'ey', 'F': 'f', 'G': 'g', 'HH': 'h',
            'IH': 'i', 'IY': 'ee', 'JH': 'j', 'K': 'k',
            'L': 'l', 'M': 'm', 'N': 'n', 'NG': 'ng',
            'OW': 'o', 'OY': 'oy', 'P': 'p', 'R': 'r',
            'S': 's', 'SH': 'sh', 'T': 't', 'TH': 'th',
            'UH': 'u', 'UW': 'oo', 'V': 'v', 'W': 'w',
            'Y': 'y', 'Z': 'z', 'ZH': 'zh'
        };

        this.commonPhrases = [
            "hello how are you",
            "thank you very much",
            "i need help please",
            "where is the bathroom",
            "what time is it",
            "my name is",
            "nice to meet you",
            "i dont understand",
            "can you help me",
            "how much does it cost",
            "i would like to order",
            "where can i find",
            "good morning everyone",
            "have a nice day",
            "i love this app"
        ];

        this.init();
    }

    async init() {
        await this.loadModels();
        this.setupCameraElements();
        this.bindEvents();
        console.log('Lip Reading Engine initialized');
    }

    async loadModels() {
        // Simulate loading AI models
        console.log('Loading lip reading models...');
        
        // Mock face detection model
        this.faceDetector = {
            detect: async (video) => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve([{
                            box: { x: 100, y: 100, width: 200, height: 200 },
                            confidence: 0.95
                        }]);
                    }, 100);
                });
            }
        };

        // Mock landmark prediction model
        this.landmarkPredictor = {
            predict: async (face) => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        const landmarks = [];
                        for (let i = 0; i < 68; i++) {
                            landmarks.push({
                                x: Math.random() * 200 + 100,
                                y: Math.random() * 200 + 100
                            });
                        }
                        resolve(landmarks);
                    }, 50);
                });
            }
        };

        // Mock lip reading model
        this.lipReadingModel = {
            predict: async (lipSequence) => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        const randomPhrase = this.commonPhrases[
                            Math.floor(Math.random() * this.commonPhrases.length)
                        ];
                        const confidence = Math.random() * 0.3 + 0.7; // 0.7-1.0
                        
                        resolve({
                            text: randomPhrase,
                            confidence: confidence,
                            phonemes: this.generatePhonemes(randomPhrase),
                            emotion: this.detectEmotion(lipSequence)
                        });
                    }, 500);
                });
            }
        };

        console.log('All models loaded successfully');
    }

    setupCameraElements() {
        // Create video element for camera feed
        this.videoElement = document.createElement('video');
        this.videoElement.autoplay = true;
        this.videoElement.playsInline = true;
        this.videoElement.style.display = 'none';

        // Create canvas for processing
        this.canvasElement = document.createElement('canvas');
        this.canvasElement.style.display = 'none';
        this.ctx = this.canvasElement.getContext('2d');

        document.body.appendChild(this.videoElement);
        document.body.appendChild(this.canvasElement);
    }

    bindEvents() {
        // Listen for start/stop recording events
        document.addEventListener('startLipReading', () => this.start());
        document.addEventListener('stopLipReading', () => this.stop());
    }

    async start() {
        if (this.isProcessing) return;

        try {
            await this.initializeCamera();
            this.isProcessing = true;
            this.startProcessing();
            
            // Dispatch event
            this.dispatchEvent('lipReadingStarted', { success: true });
            console.log('Lip reading started');
            
        } catch (error) {
            console.error('Failed to start lip reading:', error);
            this.dispatchEvent('lipReadingError', { error: error.message });
        }
    }

    async stop() {
        this.isProcessing = false;
        
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }

        this.dispatchEvent('lipReadingStopped', {});
        console.log('Lip reading stopped');
    }

    async initializeCamera() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user'
                },
                audio: false
            });

            this.videoElement.srcObject = this.stream;
            
            // Set canvas size to match video
            this.videoElement.onloadedmetadata = () => {
                this.canvasElement.width = this.videoElement.videoWidth;
                this.canvasElement.height = this.videoElement.videoHeight;
            };

            await this.videoElement.play();

        } catch (error) {
            throw new Error(`Camera access denied: ${error.message}`);
        }
    }

    async startProcessing() {
        if (!this.isProcessing) return;

        try {
            // Detect face
            const faces = await this.faceDetector.detect(this.videoElement);
            
            if (faces.length > 0) {
                const face = faces[0];
                
                // Draw face bounding box (for visualization)
                this.drawFaceBox(face);
                
                // Predict facial landmarks
                const landmarks = await this.landmarkPredictor.predict(face);
                
                // Extract lip region
                const lipRegion = this.extractLipRegion(landmarks);
                
                // Draw lip landmarks (for visualization)
                this.drawLipLandmarks(landmarks);
                
                // Process lip movement
                const result = await this.processLipMovement(lipRegion);
                
                // Dispatch result
                if (result && result.confidence > 0.6) {
                    this.dispatchEvent('lipReadingResult', result);
                }
            } else {
                this.dispatchEvent('faceNotDetected', {});
            }

            // Continue processing
            if (this.isProcessing) {
                requestAnimationFrame(() => this.startProcessing());
            }

        } catch (error) {
            console.error('Processing error:', error);
            this.dispatchEvent('lipReadingError', { error: error.message });
        }
    }

    drawFaceBox(face) {
        const cameraContainer = document.querySelector('.camera-preview');
        if (!cameraContainer) return;

        let faceBox = cameraContainer.querySelector('.face-box');
        if (!faceBox) {
            faceBox = document.createElement('div');
            faceBox.className = 'face-box';
            faceBox.style.cssText = `
                position: absolute;
                border: 2px solid #00ff00;
                background: rgba(0, 255, 0, 0.1);
                pointer-events: none;
                z-index: 10;
            `;
            cameraContainer.appendChild(faceBox);
        }

        // Convert coordinates to container space
        const containerRect = cameraContainer.getBoundingClientRect();
        const scaleX = containerRect.width / this.videoElement.videoWidth;
        const scaleY = containerRect.height / this.videoElement.videoHeight;

        faceBox.style.width = `${face.box.width * scaleX}px`;
        faceBox.style.height = `${face.box.height * scaleY}px`;
        faceBox.style.left = `${face.box.x * scaleX}px`;
        faceBox.style.top = `${face.box.y * scaleY}px`;
    }

    drawLipLandmarks(landmarks) {
        const cameraContainer = document.querySelector('.camera-preview');
        if (!cameraContainer) return;

        // Lip landmarks are typically indices 48-67
        const lipIndices = Array.from({length: 20}, (_, i) => i + 48);
        
        let lipCanvas = cameraContainer.querySelector('.lip-canvas');
        if (!lipCanvas) {
            lipCanvas = document.createElement('canvas');
            lipCanvas.className = 'lip-canvas';
            lipCanvas.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 20;
            `;
            cameraContainer.appendChild(lipCanvas);
        }

        const ctx = lipCanvas.getContext('2d');
        const containerRect = cameraContainer.getBoundingClientRect();
        
        lipCanvas.width = containerRect.width;
        lipCanvas.height = containerRect.height;

        // Clear previous frame
        ctx.clearRect(0, 0, lipCanvas.width, lipCanvas.height);

        // Draw lip points
        ctx.fillStyle = '#ff0066';
        lipIndices.forEach(index => {
            if (landmarks[index]) {
                const x = (landmarks[index].x / this.videoElement.videoWidth) * lipCanvas.width;
                const y = (landmarks[index].y / this.videoElement.videoHeight) * lipCanvas.height;
                
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, 2 * Math.PI);
                ctx.fill();
            }
        });

        // Draw lip contour
        ctx.strokeStyle = '#ff0066';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        lipIndices.forEach((index, i) => {
            if (landmarks[index]) {
                const x = (landmarks[index].x / this.videoElement.videoWidth) * lipCanvas.width;
                const y = (landmarks[index].y / this.videoElement.videoHeight) * lipCanvas.height;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
        });
        
        // Close the lip contour
        const firstIndex = lipIndices[0];
        if (landmarks[firstIndex]) {
            const x = (landmarks[firstIndex].x / this.videoElement.videoWidth) * lipCanvas.width;
            const y = (landmarks[firstIndex].y / this.videoElement.videoHeight) * lipCanvas.height;
            ctx.lineTo(x, y);
        }
        
        ctx.stroke();
    }

    extractLipRegion(landmarks) {
        // Lip landmarks indices (simplified)
        const lipIndices = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67];
        
        const lipPoints = lipIndices.map(index => landmarks[index]);
        
        // Calculate bounding box for lip region
        const xs = lipPoints.map(p => p.x);
        const ys = lipPoints.map(p => p.y);
        
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        
        return {
            points: lipPoints,
            boundingBox: {
                x: minX,
                y: minY,
                width: maxX - minX,
                height: maxY - minY
            }
        };
    }

    async processLipMovement(lipRegion) {
        // Capture current frame for processing
        this.ctx.drawImage(this.videoElement, 0, 0);
        
        // Extract lip region from canvas
        const lipImage = this.ctx.getImageData(
            lipRegion.boundingBox.x,
            lipRegion.boundingBox.y,
            lipRegion.boundingBox.width,
            lipRegion.boundingBox.height
        );

        // Simulate lip movement analysis
        const movementFeatures = this.analyzeLipMovement(lipImage, lipRegion.points);
        
        // Use AI model to predict speech
        const prediction = await this.lipReadingModel.predict(movementFeatures);
        
        return prediction;
    }

    analyzeLipMovement(lipImage, lipPoints) {
        // Simulate feature extraction from lip movement
        const features = {
            mouthOpenness: this.calculateMouthOpenness(lipPoints),
            lipWidth: this.calculateLipWidth(lipPoints),
            lipHeight: this.calculateLipHeight(lipPoints),
            movementIntensity: Math.random() * 100,
            symmetry: Math.random() * 100
        };

        return features;
    }

    calculateMouthOpenness(points) {
        // Simplified mouth openness calculation
        const upperLip = points[13].y; // Middle upper lip point
        const lowerLip = points[17].y; // Middle lower lip point
        
        return Math.abs(lowerLip - upperLip);
    }

    calculateLipWidth(points) {
        // Left and right corner points
        const leftCorner = points[0];
        const rightCorner = points[6];
        
        return Math.abs(rightCorner.x - leftCorner.x);
    }

    calculateLipHeight(points) {
        // Top and bottom middle points
        const topMiddle = points[12];
        const bottomMiddle = points[16];
        
        return Math.abs(bottomMiddle.y - topMiddle.y);
    }

    generatePhonemes(text) {
        // Simple phoneme mapping for demonstration
        const words = text.toLowerCase().split(' ');
        const phonemes = [];
        
        words.forEach(word => {
            for (let char of word) {
                const phoneme = this.charToPhoneme(char);
                if (phoneme) {
                    phonemes.push(phoneme);
                }
            }
            phonemes.push(' '); // Space between words
        });
        
        return phonemes.filter(p => p !== ' ');
    }

    charToPhoneme(char) {
        const mapping = {
            'a': 'AA', 'b': 'B', 'c': 'K', 'd': 'D',
            'e': 'EH', 'f': 'F', 'g': 'G', 'h': 'HH',
            'i': 'IH', 'j': 'JH', 'k': 'K', 'l': 'L',
            'm': 'M', 'n': 'N', 'o': 'AO', 'p': 'P',
            'q': 'K', 'r': 'R', 's': 'S', 't': 'T',
            'u': 'UH', 'v': 'V', 'w': 'W', 'x': 'K S',
            'y': 'Y', 'z': 'Z'
        };
        
        return mapping[char] || null;
    }

    detectEmotion(lipSequence) {
        // Simple emotion detection based on lip movement patterns
        const emotions = ['happy', 'sad', 'surprised', 'neutral', 'angry'];
        const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        
        // In real implementation, this would analyze lip curvature, speed, etc.
        return randomEmotion;
    }

    dispatchEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }

    // Utility methods
    getLipReadingStats() {
        return {
            isActive: this.isProcessing,
            frameRate: 30,
            modelLoaded: !!this.lipReadingModel,
            cameraActive: !!this.stream
        };
    }

    // Method to simulate specific phrases for testing
    simulateSpecificPhrase(phrase) {
        const confidence = Math.random() * 0.2 + 0.8; // 0.8-1.0
        
        const result = {
            text: phrase,
            confidence: confidence,
            phonemes: this.generatePhonemes(phrase),
            emotion: this.detectEmotion()
        };
        
        this.dispatchEvent('lipReadingResult', result);
        return result;
    }

    // Cleanup method
    destroy() {
        this.stop();
        
        if (this.videoElement) {
            this.videoElement.remove();
        }
        
        if (this.canvasElement) {
            this.canvasElement.remove();
        }
        
        console.log('Lip Reading Engine destroyed');
    }
}

// Initialize lip reading engine
let lipReadingEngine = null;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        lipReadingEngine = new LipReadingEngine();
        window.lipReadingEngine = lipReadingEngine;
        
        // Listen for lip reading events
        document.addEventListener('lipReadingResult', (event) => {
            const { text, confidence, emotion } = event.detail;
            
            // Update the main app
            if (window.silentSpeechApp) {
                window.silentSpeechApp.updateTranslation(text, Math.round(confidence * 100), emotion);
            }
        });

        document.addEventListener('lipReadingError', (event) => {
            console.error('Lip Reading Error:', event.detail.error);
            
            if (window.silentSpeechApp) {
                window.silentSpeechApp.showAlert('Lip reading error: ' + event.detail.error, 'error');
            }
        });

        document.addEventListener('faceNotDetected', () => {
            if (window.silentSpeechApp) {
                window.silentSpeechApp.showAlert('Please position your face in the frame', 'warning');
            }
        });

    } catch (error) {
        console.error('Failed to initialize Lip Reading Engine:', error);
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LipReadingEngine;
}