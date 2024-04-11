let getCurrentTabUrl = async function () {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}


let init = async function () {
    let tab = await getCurrentTabUrl();
    let url = new URL(tab.url);

    document.getElementById('go-favro').addEventListener('click', function (event) {
        event.preventDefault();
        chrome.tabs.update(tab.id, {url: 'https://favro.com'});
    });

    document.getElementById('text-capitalize').addEventListener('click', function (event) {
        event.preventDefault();
        document.getElementById('issue').innerText = capitalize(document.getElementById('issue').innerText);
    });

    document.getElementById('text-upper').addEventListener('click', function (event) {
        event.preventDefault();
        document.getElementById('issue').innerText = document.getElementById('issue').innerText.toUpperCase();
    });

    document.getElementById('text-lower').addEventListener('click', function (event) {
        event.preventDefault();
        document.getElementById('issue').innerText = document.getElementById('issue').innerText.toLowerCase();
    });


    if (url.host !== 'favro.com') {
        showNoFavro();
        return;
    }

    let card = url.searchParams.get('card');

    if (!card) {
        showNoFavro();
        return;
    }

    showFavro();

    document.getElementById('issue').innerText = card.toUpperCase();

    /*
    document.getElementById('text').value = slugify(
        document.getElementsByClassName('popup-userfield js-input card-details-title js-card-details-title')[0].value
    );
     */

    document.getElementById('form').addEventListener('submit', function (event) {
        let type = document.getElementById('type').value;
        let branch = document.getElementById('issue').innerText;
        let text = slugify(document.getElementById('text').value);

        let checkout = 'git checkout -b ' + (type ? type + '/' : '') + (branch) + (text ? '-' + text : '');

        document.getElementById('checkout').style.display = 'block';
        document.getElementById('checkout').innerText = checkout;

        navigator.clipboard.writeText(checkout);

        event.preventDefault();
    });
}

let showNoFavro = function () {
    document.getElementById('no-card').style.display = 'block';
    document.getElementById('card').style.display = 'none';
};

let showFavro = function () {
    document.getElementById('no-card').style.display = 'none';
    document.getElementById('card').style.display = 'block';
}

let slugify = str =>
    str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

init();

let capitalize = str =>
    str && str[0].toUpperCase() + str.slice(1).toLowerCase();
