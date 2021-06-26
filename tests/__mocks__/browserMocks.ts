// Mock Browser API's which are not supported by JSDOM, e.g. ServiceWorker, LocalStorage

// Mock canvas
import 'jest-canvas-mock';

/* 
// Mocks localStorage
const localStorageMock = (function() {
	let store = {};

	return {
		getItem: (key) => store[key] || null,
		setItem: (key, value) => store[key] = value.toString(),
		clear: () => store = {}
	};

})();

Object.defineProperty(window, 'localStorage', {
	value: localStorageMock
}); */
