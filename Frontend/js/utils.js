// js/utils.js

class Utils {
    constructor() {
        this.debugMode = true;
    }

    // ===== STORAGE UTILITIES =====
    
    setItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    getItem(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    }

    removeItem(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }

    clearStorage() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }

    // ===== DATE & TIME UTILITIES =====
    
    formatDate(date = new Date()) {
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    formatTime(date = new Date()) {
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    formatDateTime(date = new Date()) {
        return `${this.formatDate(date)} ${this.formatTime(date)}`;
    }

    getRelativeTime(timestamp) {
        const now = new Date();
        const diffMs = now - new Date(timestamp);
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        
        return this.formatDate(new Date(timestamp));
    }

    // ===== STRING UTILITIES =====
    
    capitalizeFirst(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    capitalizeWords(str) {
        if (!str) return '';
        return str.replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    truncateText(text, maxLength = 100) {
        if (!text || text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }

    removeExtraSpaces(str) {
        return str.replace(/\s+/g, ' ').trim();
    }

    generateId(prefix = 'id') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // ===== NUMBER UTILITIES =====
    
    formatNumber(num) {
        return new Intl.NumberFormat('en-IN').format(num);
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    randomFloat(min, max, decimals = 2) {
        const rand = Math.random() * (max - min) + min;
        return parseFloat(rand.toFixed(decimals));
    }

    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    // ===== ARRAY UTILITIES =====
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    uniqueArray(array, key = null) {
        if (key) {
            const seen = new Set();
            return array.filter(item => {
                const value = item[key];
                return seen.has(value) ? false : seen.add(value);
            });
        }
        return [...new Set(array)];
    }

    groupBy(array, key) {
        return array.reduce((groups, item) => {
            const group = item[key];
            groups[group] = groups[group] || [];
            groups[group].push(item);
            return groups;
        }, {});
    }

    sortBy(array, key, order = 'asc') {
        return [...array].sort((a, b) => {
            const aVal = a[key];
            const bVal = b[key];
            
            if (order === 'desc') {
                return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
            }
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        });
    }

    // ===== OBJECT UTILITIES =====
    
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj);
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        
        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = this.deepClone(obj[key]);
            }
        }
        return cloned;
    }

    mergeObjects(target, source) {
        const merged = this.deepClone(target);
        
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (this.isObject(merged[key]) && this.isObject(source[key])) {
                    merged[key] = this.mergeObjects(merged[key], source[key]);
                } else {
                    merged[key] = this.deepClone(source[key]);
                }
            }
        }
        
        return merged;
    }

    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    }

    // ===== DOM UTILITIES =====
    
    $(selector) {
        const elements = document.querySelectorAll(selector);
        return elements.length === 1 ? elements[0] : elements;
    }

    createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        
        // Set attributes
        for (const [key, value] of Object.entries(attributes)) {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'textContent') {
                element.textContent = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else {
                element.setAttribute(key, value);
            }
        }
        
        // Append children
        if (Array.isArray(children)) {
            children.forEach(child => {
                if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child));
                } else if (child instanceof Node) {
                    element.appendChild(child);
                }
            });
        }
        
        return element;
    }

    showElement(selector) {
        const element = this.$(selector);
        if (element) element.style.display = '';
        return element;
    }

    hideElement(selector) {
        const element = this.$(selector);
        if (element) element.style.display = 'none';
        return element;
    }

    toggleElement(selector) {
        const element = this.$(selector);
        if (element) {
            element.style.display = element.style.display === 'none' ? '' : 'none';
        }
        return element;
    }

    addClass(selector, className) {
        const elements = this.$(selector);
        if (elements.length) {
            elements.forEach(el => el.classList.add(className));
        } else if (elements.classList) {
            elements.classList.add(className);
        }
    }

    removeClass(selector, className) {
        const elements = this.$(selector);
        if (elements.length) {
            elements.forEach(el => el.classList.remove(className));
        } else if (elements.classList) {
            elements.classList.remove(className);
        }
    }

    // ===== EVENT UTILITIES =====
    
    on(event, selector, handler) {
        document.addEventListener(event, (e) => {
            if (e.target.matches(selector)) {
                handler(e);
            }
        });
    }

    once(event, element, handler) {
        const onceHandler = (e) => {
            handler(e);
            element.removeEventListener(event, onceHandler);
        };
        element.addEventListener(event, onceHandler);
    }

    triggerEvent(element, eventName, detail = {}) {
        const event = new CustomEvent(eventName, { detail });
        element.dispatchEvent(event);
    }

    // ===== VALIDATION UTILITIES =====
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    isEmpty(value) {
        if (value === null || value === undefined) return true;
        if (typeof value === 'string') return value.trim() === '';
        if (Array.isArray(value)) return value.length === 0;
        if (typeof value === 'object') return Object.keys(value).length === 0;
        return false;
    }

    // ===== NETWORK UTILITIES =====
    
    async fetchWithTimeout(url, options = {}, timeout = 10000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    async mockApiCall(data, delay = 1000, success = true) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (success) {
                    resolve({
                        success: true,
                        data: data,
                        timestamp: new Date().toISOString()
                    });
                } else {
                    reject({
                        success: false,
                        error: 'Mock API error',
                        timestamp: new Date().toISOString()
                    });
                }
            }, delay);
        });
    }

    // ===== DEBUG UTILITIES =====
    
    log(message, data = null) {
        if (this.debugMode) {
            console.log(`[${this.formatTime()}] ${message}`, data || '');
        }
    }

    error(message, error = null) {
        console.error(`[${this.formatTime()}] ERROR: ${message}`, error || '');
    }

    warn(message, data = null) {
        console.warn(`[${this.formatTime()}] WARNING: ${message}`, data || '');
    }

    // ===== PERFORMANCE UTILITIES =====
    
    measurePerformance(name, fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        
        this.log(`Performance [${name}]: ${(end - start).toFixed(2)}ms`);
        return result;
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ===== EXPORT UTILITIES =====
    
    exportToJSON(data, filename = 'data.json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        this.downloadBlob(blob, filename);
    }

    exportToCSV(data, filename = 'data.csv') {
        if (!data.length) return;
        
        const headers = Object.keys(data[0]);
        const csv = [
            headers.join(','),
            ...data.map(row => headers.map(header => {
                const value = row[header];
                return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
            }).join(','))
        ].join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        this.downloadBlob(blob, filename);
    }

    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Create global instance
const utils = new Utils();

// Make available globally
window.utils = utils;

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
}