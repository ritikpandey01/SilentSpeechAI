// js/main.js

// App main functionality
class SilentSpeechApp {
    constructor() {
        this.isRecording = false;
        this.translatedText = '';
        this.confidenceLevel = 0;
        this.currentEmotion = 'neutral';
        this.suggestions = [];
        this.history = [];
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadHistory();
        this.setupMockData();
        console.log('Silent Speech Translator initialized');
    }

    bindEvents() {
        // Start/Stop speaking button
        const startBtn = document.getElementById('startSpeaking');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.toggleRecording());
        }

        // Translation action buttons
        this.setupActionButtons();
        
        // Suggestion chips
        this.setupSuggestionChips();
        
        // Navigation active states
        this.setupNavigation();

        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
    }

    setupActionButtons() {
        // Speak output button
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-primary')) {
                const btn = e.target.closest('.btn-primary');
                if (btn.textContent.includes('Speak Output')) {
                    this.speakOutput();
                }
            }

            // Copy text button
            if (e.target.closest('.btn-secondary')) {
                const btn = e.target.closest('.btn-secondary');
                if (btn.textContent.includes('Copy Text')) {
                    this.copyToClipboard();
                }
            }

            // Save button
            if (e.target.closest('.btn-secondary')) {
                const btn = e.target.closest('.btn-secondary');
                if (btn.textContent.includes('Save')) {
                    this.saveToHistory();
                }
            }
        });
    }

    setupSuggestionChips() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.suggestion-chip')) {
                const chip = e.target.closest('.suggestion-chip');
                this.useSuggestion(chip.textContent);
            }
        });
    }

    setupNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Space bar to start/stop recording
            if (e.code === 'Space' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                this.toggleRecording();
            }

            // Escape to stop recording
            if (e.code === 'Escape' && this.isRecording) {
                this.stopRecording();
            }

            // Ctrl+C to copy text
            if (e.ctrlKey && e.code === 'KeyC') {
                this.copyToClipboard();
            }
        });
    }

    toggleRecording() {
        if (this.isRecording) {
            this.stopRecording();
        } else {
            this.startRecording();
        }
    }

    startRecording() {
        this.isRecording = true;
        this.updateUIForRecording(true);
        
        // Simulate lip reading process
        this.simulateLipReading();
        
        // Add haptic feedback (if available)
        this.triggerHapticFeedback('start');
        
        console.log('Recording started...');
    }

    stopRecording() {
        this.isRecording = false;
        this.updateUIForRecording(false);
        
        // Add haptic feedback
        this.triggerHapticFeedback('stop');
        
        console.log('Recording stopped');
    }

    updateUIForRecording(recording) {
        const startBtn = document.getElementById('startSpeaking');
        const recordingIndicator = document.querySelector('.recording-indicator');
        
        if (startBtn) {
            if (recording) {
                startBtn.innerHTML = '<i class="fas fa-stop"></i><span>Stop Speaking</span>';
                startBtn.style.background = 'var(--error-color)';
            } else {
                startBtn.innerHTML = '<i class="fas fa-microphone"></i><span>Start Speaking</span>';
                startBtn.style.background = 'var(--primary-color)';
            }
        }

        if (recordingIndicator) {
            recordingIndicator.style.display = recording ? 'flex' : 'none';
        }
    }

    simulateLipReading() {
        // Mock lip reading simulation
        const phrases = [
            "Hello, how can I help you today?",
            "I need assistance with this project",
            "Where is the nearest restroom?",
            "Thank you for your help",
            "Can you speak more slowly please?",
            "I would like to order some food"
        ];

        const emotions = ['happy', 'sad', 'neutral', 'surprised', 'angry'];
        const emotionIcons = {
            'happy': 'fa-smile',
            'sad': 'fa-frown',
            'neutral': 'fa-meh',
            'surprised': 'fa-surprise',
            'angry': 'fa-angry'
        };

        // Simulate processing delay
        setTimeout(() => {
            const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
            const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
            const randomConfidence = Math.floor(Math.random() * 30) + 70; // 70-100%

            this.updateTranslation(randomPhrase, randomConfidence, randomEmotion);
            this.generateSuggestions(randomPhrase);
            
            // Add to history
            this.addToHistory(randomPhrase, randomEmotion, randomConfidence);
            
        }, 2000);
    }

    updateTranslation(text, confidence, emotion) {
        this.translatedText = text;
        this.confidenceLevel = confidence;
        this.currentEmotion = emotion;

        // Update DOM
        const translatedElement = document.querySelector('.translated-text');
        const confidenceBar = document.querySelector('.confidence-fill');
        const confidenceValue = document.querySelector('.confidence-value');
        const emotionTag = document.querySelector('.emotion-tag');

        if (translatedElement) {
            translatedElement.textContent = `"${text}"`;
        }

        if (confidenceBar) {
            confidenceBar.style.width = `${confidence}%`;
            
            // Update color based on confidence
            if (confidence >= 80) {
                confidenceBar.style.background = 'linear-gradient(90deg, var(--success-color), #34d399)';
            } else if (confidence >= 60) {
                confidenceBar.style.background = 'linear-gradient(90deg, var(--warning-color), #fbbf24)';
            } else {
                confidenceBar.style.background = 'linear-gradient(90deg, var(--error-color), #f87171)';
            }
        }

        if (confidenceValue) {
            confidenceValue.textContent = `${confidence}%`;
        }

        if (emotionTag) {
            const emotionIcon = emotionIcons[emotion] || 'fa-meh';
            emotionTag.innerHTML = `<i class="fas ${emotionIcon}"></i>${this.capitalizeFirst(emotion)}`;
        }

        // Trigger success haptic feedback
        this.triggerHapticFeedback('success');
    }

    generateSuggestions(baseText) {
        const suggestionMap = {
            "hello": ["Hello there!", "Hi, how are you?", "Good morning!"],
            "help": ["I need help with...", "Can you assist me?", "I require assistance"],
            "thank": ["Thank you very much", "Thanks a lot", "I appreciate your help"],
            "where": ["Where is the...", "Can you direct me to...", "I'm looking for..."],
            "food": ["I'd like to order food", "I'm hungry", "What's on the menu?"]
        };

        let newSuggestions = [];
        
        // Find relevant suggestions based on text
        Object.keys(suggestionMap).forEach(key => {
            if (baseText.toLowerCase().includes(key)) {
                newSuggestions = [...newSuggestions, ...suggestionMap[key]];
            }
        });

        // Add some default suggestions
        if (newSuggestions.length === 0) {
            newSuggestions = [
                "I need help with...",
                "Where is the...", 
                "Thank you",
                "Can you please...",
                "I want to..."
            ];
        }

        this.suggestions = newSuggestions.slice(0, 6);
        this.updateSuggestionsUI();
    }

    updateSuggestionsUI() {
        const suggestionsGrid = document.querySelector('.suggestions-grid');
        if (!suggestionsGrid) return;

        suggestionsGrid.innerHTML = '';
        this.suggestions.forEach(suggestion => {
            const chip = document.createElement('div');
            chip.className = 'suggestion-chip';
            chip.textContent = suggestion;
            chip.title = `Click to use: ${suggestion}`;
            suggestionsGrid.appendChild(chip);
        });
    }

    useSuggestion(suggestion) {
        this.updateTranslation(suggestion, 95, 'happy');
        this.triggerHapticFeedback('light');
    }

    speakOutput() {
        if (!this.translatedText) {
            this.showAlert('No text to speak', 'warning');
            return;
        }

        // Check if browser supports speech synthesis
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(this.translatedText);
            
            // Set voice properties based on emotion
            utterance.rate = 0.8;
            utterance.pitch = 1;
            utterance.volume = 1;

            if (this.currentEmotion === 'happy') {
                utterance.rate = 1.0;
                utterance.pitch = 1.2;
            } else if (this.currentEmotion === 'sad') {
                utterance.rate = 0.7;
                utterance.pitch = 0.8;
            }

            speechSynthesis.speak(utterance);
            this.triggerHapticFeedback('speak');
            
            console.log('Speaking:', this.translatedText);
        } else {
            this.showAlert('Text-to-speech not supported in your browser', 'warning');
        }
    }

    copyToClipboard() {
        if (!this.translatedText) {
            this.showAlert('No text to copy', 'warning');
            return;
        }

        navigator.clipboard.writeText(this.translatedText).then(() => {
            this.showAlert('Text copied to clipboard!', 'success');
            this.triggerHapticFeedback('success');
        }).catch(() => {
            this.showAlert('Failed to copy text', 'error');
        });
    }

    saveToHistory() {
        if (!this.translatedText) {
            this.showAlert('No text to save', 'warning');
            return;
        }

        const historyItem = {
            id: Date.now(),
            text: this.translatedText,
            emotion: this.currentEmotion,
            confidence: this.confidenceLevel,
            timestamp: new Date().toLocaleString(),
            starred: false
        };

        this.history.unshift(historyItem);
        this.saveHistory();
        this.showAlert('Translation saved to history!', 'success');
        this.triggerHapticFeedback('success');
    }

    addToHistory(text, emotion, confidence) {
        const historyItem = {
            id: Date.now(),
            text: text,
            emotion: emotion,
            confidence: confidence,
            timestamp: new Date().toLocaleString(),
            starred: false
        };

        this.history.unshift(historyItem);
        
        // Keep only last 100 items
        if (this.history.length > 100) {
            this.history = this.history.slice(0, 100);
        }
        
        this.saveHistory();
    }

    saveHistory() {
        localStorage.setItem('silentSpeechHistory', JSON.stringify(this.history));
    }

    loadHistory() {
        const saved = localStorage.getItem('silentSpeechHistory');
        if (saved) {
            this.history = JSON.parse(saved);
        }
    }

    triggerHapticFeedback(type) {
        // Simple vibration pattern simulation
        const patterns = {
            'start': [100],
            'stop': [50],
            'success': [50, 50, 50],
            'error': [200],
            'light': [30],
            'speak': [20, 40, 20]
        };

        if (navigator.vibrate && patterns[type]) {
            navigator.vibrate(patterns[type]);
        }
    }

    showAlert(message, type = 'info') {
        // Remove existing alerts
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <i class="fas fa-${this.getAlertIcon(type)}"></i>
            ${message}
            <button class="alert-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add some styles for the alert
        alert.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 1001;
            min-width: 300px;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(alert);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alert.parentElement) {
                alert.remove();
            }
        }, 5000);
    }

    getAlertIcon(type) {
        const icons = {
            'success': 'check-circle',
            'warning': 'exclamation-triangle',
            'error': 'exclamation-circle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Utility method to get app stats
    getStats() {
        return {
            totalTranslations: this.history.length,
            averageConfidence: this.history.length > 0 ? 
                this.history.reduce((acc, item) => acc + item.confidence, 0) / this.history.length : 0,
            favoriteEmotion: this.getMostCommonEmotion()
        };
    }

    getMostCommonEmotion() {
        if (this.history.length === 0) return 'neutral';
        
        const emotionCount = {};
        this.history.forEach(item => {
            emotionCount[item.emotion] = (emotionCount[item.emotion] || 0) + 1;
        });
        
        return Object.keys(emotionCount).reduce((a, b) => 
            emotionCount[a] > emotionCount[b] ? a : b
        );
    }
}

// Add CSS for alerts
const alertStyles = `
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.alert-close {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    margin-left: auto;
    padding: 0.25rem;
    border-radius: 4px;
}

.alert-close:hover {
    background: rgba(255, 255, 255, 0.1);
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = alertStyles;
document.head.appendChild(styleSheet);

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.silentSpeechApp = new SilentSpeechApp();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SilentSpeechApp;
}