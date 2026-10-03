const RESULTS_PER_GROUP = 8;

let bundles = null;
let searchToken = 0;

async function loadBundle(path, language) {
    const pagefind = await import(`${path}pagefind.js`);
    await pagefind.options({ excerptLength: 22, ...(language ? { language } : {}) });
    await pagefind.init();
    return pagefind;
}

function loadBundles(dialog) {
    bundles ??= Promise.all([
        loadBundle(dialog.dataset.docsBundle).catch(() => null),
        loadBundle(dialog.dataset.apiBundle, 'en').catch(() => null)
    ]);

    return bundles;
}

async function runSearch(bundle, query) {
    if (!bundle) return [];

    const search = await bundle.debouncedSearch(query, {}, 120);
    if (!search) return null;

    return Promise.all(search.results.slice(0, RESULTS_PER_GROUP).map(result => result.data()));
}

function element(tag, className, children = []) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    node.append(...children);
    return node;
}

function excerpt(html) {
    const node = element('span', 'search-excerpt');
    node.innerHTML = html;
    return node;
}

function renderDocs(item) {
    const link = element('a', 'search-item', [
        element('span', 'search-item-title', [item.meta.title]),
        excerpt(item.excerpt)
    ]);
    link.href = item.url;

    const subResults = (item.sub_results || [])
        .filter(sub => sub.url !== item.url && sub.title !== item.meta.title)
        .slice(0, 3)
        .map(sub => {
            const subLink = element('a', 'search-item search-subitem', [
                element('span', 'search-item-title', [sub.title]),
                excerpt(sub.excerpt)
            ]);
            subLink.href = sub.url;
            return subLink;
        });

    return [link, ...subResults];
}

function renderApi(item) {
    const link = element('a', 'search-item search-item-api', [
        element('span', 'search-item-kind', [item.meta.kind || '']),
        element('span', 'search-item-title', [item.meta.title]),
        excerpt(item.excerpt)
    ]);
    link.href = item.url;
    return [link];
}

function renderGroup(label, items, render) {
    if (!items.length) return null;

    const list = element('div', 'search-group', [element('p', 'search-group-title', [label])]);
    items.forEach(item => list.append(...render(item)));
    return list;
}

function moveSelection(container, delta) {
    const items = [...container.querySelectorAll('.search-item')];
    if (!items.length) return;

    const current = items.findIndex(item => item.classList.contains('is-selected'));
    const next = (current + delta + items.length) % items.length;

    items.forEach(item => item.classList.remove('is-selected'));
    items[next].classList.add('is-selected');
    items[next].scrollIntoView({ block: 'nearest' });
}

export function initSearch() {
    const dialog = document.querySelector('[data-search]');
    if (!dialog) return;

    const input = dialog.querySelector('[data-search-input]');
    const results = dialog.querySelector('[data-search-results]');
    const hint = results.querySelector('[data-search-hint]');
    const labels = results.dataset;

    const open = () => {
        if (dialog.open) return;
        dialog.showModal();
        input.select();
        loadBundles(dialog);
    };

    document.querySelectorAll('[data-search-open]').forEach(button => button.addEventListener('click', open));

    document.addEventListener('keydown', event => {
        const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName);

        if ((event.key === 'k' && (event.ctrlKey || event.metaKey)) || (event.key === '/' && !typing)) {
            event.preventDefault();
            open();
        }
    });

    dialog.querySelector('[data-search-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
        if (event.target === dialog) dialog.close();
    });

    input.addEventListener('keydown', event => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            moveSelection(results, event.key === 'ArrowDown' ? 1 : -1);
        } else if (event.key === 'Enter') {
            const selected = results.querySelector('.search-item.is-selected') || results.querySelector('.search-item');
            if (selected) location.href = selected.href;
        }
    });

    input.addEventListener('input', async () => {
        const query = input.value.trim();
        const token = ++searchToken;

        if (!query) {
            results.replaceChildren(hint);
            return;
        }

        const [docsBundle, apiBundle] = await loadBundles(dialog);
        const [docs, api] = await Promise.all([runSearch(docsBundle, query), runSearch(apiBundle, query)]);

        if (token !== searchToken || docs === null || api === null) return;

        const groups = [
            renderGroup(labels.labelDocs, docs, renderDocs),
            renderGroup(labels.labelApi, api, renderApi)
        ].filter(Boolean);

        results.replaceChildren(...(groups.length ? groups : [element('p', 'search-message', [labels.labelEmpty])]));
        results.querySelector('.search-item')?.classList.add('is-selected');
    });
}
