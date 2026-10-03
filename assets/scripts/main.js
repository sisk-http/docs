import { initSearch } from './search.js';

const root = document.documentElement;
const darkQuery = matchMedia('(prefers-color-scheme: dark)');

function applyTheme(preference) {
    const dark = preference === 'dark' || (preference === 'auto' && darkQuery.matches);
    root.dataset.theme = dark ? 'dark' : 'light';
    root.dataset.themePreference = preference;
}

function flashLabel(button, label) {
    const target = button.querySelector('span') || button;
    const original = target.textContent;
    target.textContent = label;
    button.classList.add('is-done');

    setTimeout(() => {
        target.textContent = original;
        button.classList.remove('is-done');
    }, 1600);
}

document.querySelectorAll('[data-theme-set]').forEach(button => {
    button.addEventListener('click', () => {
        localStorage.setItem('theme', button.dataset.themeSet);
        applyTheme(button.dataset.themeSet);
        button.closest('details').open = false;
    });
});

darkQuery.addEventListener('change', () => applyTheme(root.dataset.themePreference || 'auto'));

document.addEventListener('click', event => {
    document.querySelectorAll('details[data-menu][open]').forEach(menu => {
        if (!menu.contains(event.target)) menu.open = false;
    });
});

document.querySelectorAll('[data-lang-link]').forEach(link => {
    link.addEventListener('click', () => {
        if (location.hash) link.href = link.href.split('#')[0] + location.hash;
    });
});

const navToggle = document.querySelector('[data-nav-toggle]');
navToggle?.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(open));
});

document.querySelector('.sidebar [aria-current="page"]')?.scrollIntoView({ block: 'center' });

document.querySelectorAll('[data-copy-code]').forEach(button => {
    button.addEventListener('click', async () => {
        const code = button.closest('.code-block').querySelector('pre code');
        await navigator.clipboard.writeText(code.innerText.replace(/\n$/, ''));
        button.classList.add('is-done');
        setTimeout(() => button.classList.remove('is-done'), 1600);
    });
});

document.querySelectorAll('[data-copy-link]').forEach(button => {
    button.addEventListener('click', async () => {
        await navigator.clipboard.writeText(location.href.split('#')[0]);
        flashLabel(button, button.dataset.copiedLabel);
    });
});

document.querySelectorAll('[data-copy-markdown]').forEach(button => {
    button.addEventListener('click', async () => {
        const response = await fetch(button.dataset.copyMarkdown);
        await navigator.clipboard.writeText(await response.text());
        flashLabel(button, button.dataset.copiedLabel);
    });
});

const tocLinks = [...document.querySelectorAll('[data-toc] a')];
if (tocLinks.length) {
    const headings = tocLinks
        .map(link => document.getElementById(decodeURIComponent(link.hash.slice(1))))
        .filter(Boolean);

    const observer = new IntersectionObserver(entries => {
        const visible = entries.filter(entry => entry.isIntersecting);
        if (!visible.length) return;

        const id = visible[0].target.id;
        tocLinks.forEach(link => link.classList.toggle('is-active', decodeURIComponent(link.hash.slice(1)) === id));
    }, { rootMargin: '-80px 0px -70% 0px' });

    headings.forEach(heading => observer.observe(heading));
}

initSearch();
