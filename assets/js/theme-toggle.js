/**
 * theme-toggle.js
 *
 * Applies theme via data-theme attribute on <html>.
 * Defaults to dark mode. Persists preference in localStorage.
 *
 * Exposes window.applyTheme and window.initThemeToggleButton so
 * sidebar-loader.js can call initThemeToggleButton() after the
 * sidebar partial is injected into the DOM.
 */
(function () {
    'use strict';

    function getStoredTheme() {
        try { return localStorage.getItem('theme'); } catch (e) { return null; }
    }

    function getInitialTheme() {
        var stored = getStoredTheme();
        if (stored === 'light' || stored === 'dark') { return stored; }
        // Default: dark mode
        return 'dark';
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        updateToggleButton(theme);
    }

    function updateToggleButton(theme) {
        var btn = document.getElementById('theme-toggle-btn');
        if (!btn) { return; }
        var icon  = btn.querySelector('i');
        var label = btn.querySelector('.theme-toggle-label');
        if (theme === 'dark') {
            // Currently dark — offer switch to light
            if (icon)  { icon.className = 'fas fa-sun'; }
            if (label) { label.textContent = 'Light mode'; }
        } else {
            // Currently light — offer switch to dark
            if (icon)  { icon.className = 'fas fa-moon'; }
            if (label) { label.textContent = 'Dark mode'; }
        }
    }

    function toggleTheme() {
        var current = document.documentElement.getAttribute('data-theme') || 'dark';
        var next = (current === 'dark') ? 'light' : 'dark';
        try { localStorage.setItem('theme', next); } catch (e) {}
        applyTheme(next);
    }

    function initThemeToggleButton() {
        var btn = document.getElementById('theme-toggle-btn');
        if (!btn) { return; }
        // Remove any stale listener before adding (safe on re-injection)
        btn.removeEventListener('click', toggleTheme);
        btn.addEventListener('click', toggleTheme);
        // Sync icon/label to current theme
        var theme = document.documentElement.getAttribute('data-theme') || 'dark';
        updateToggleButton(theme);
    }

    // Apply theme immediately — runs before page content is painted
    var initialTheme = getInitialTheme();
    applyTheme(initialTheme);

    // Expose globally so sidebar-loader.js can call after injection
    window.applyTheme            = applyTheme;
    window.initThemeToggleButton = initThemeToggleButton;

    // Wire up button once the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initThemeToggleButton);
    } else {
        initThemeToggleButton();
    }

}());
