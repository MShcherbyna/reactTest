var xhr         = new XMLHttpRequest();
var url         = 'https://ec-test-react.herokuapp.com/';
var itemUrl     = url + 'api/v1/items';
var picturesUrl = url + 'api/v1/pictures';
var empty       = 'img/empty.png';
var count       = 0;
var vinCounter  = 0;
var allCouple   = 0;
var timeoutId;
var elemOld;

function getAjax(url) {
    xhr.open('GET', url, false);
    xhr.send();

    if (xhr.status != 200) {
        alert( xhr.status + ': ' + xhr.statusText );
    } else {
        return xhr.responseText;
    }
}

function showSameImages(elemOld, elem) {
    vinCounter++;
    
    if ((vinCounter + 1) <= allCouple) {
        elemOld.style.display = 'none';
        elemOld.nextElementSibling.style.display = '';
        elem.style.display = 'none';
        elem.nextElementSibling.style.display = '';

        clearTimeout(timeoutId);
        count = 0;
        elemOld = undefined;
    } else {
        elemOld.style.display = 'none';
        elemOld.nextElementSibling.style.display = '';
        elem.style.display = 'none';
        elem.nextElementSibling.style.display = '';

        setTimeout(function() {
            alert("You win !!!");
            location.reload();
        }, 500);
    }
}

function openImage(e) {
    var elem = e.target;

    if (count < 2) {
        if(elemOld != undefined && (elemOld.dataset.id == elem.dataset.id)) {
            showSameImages(elemOld, elem);
            elemOld = undefined;
        } else if(elem.dataset.id !== 'empty') {
            elem.style.display = 'none';
            elem.nextElementSibling.style.display = '';
            count++;
            elemOld = elem;

            timeoutId = setTimeout(function() {
                elem.style.display = '';
                elem.nextElementSibling.style.display = 'none';

                if (count < 2) {elemOld = undefined;}

                count--;
            }, 1500);
        } else {
            elem.style.display = 'none';
            elem.nextElementSibling.style.display = '';

            setTimeout(function() {
                elem.style.display = '';
                elem.nextElementSibling.style.display = 'none';
            }, 1500);
        }
    }
}

function appendField(field, contWidth) {
    var container = document.querySelector('.container');

    container.style.width = contWidth*100+'px';

    field.sort(function(a, b){
        return Math.random() - 0.5;
    });

    field.forEach(function(item, i, arr) {
        container.appendChild(item);
    });
}

function duplicate(count, items) {
    var res = [];

    for(var i = 0; i < count; i++) {
        res = res.concat(items);
    }
    return res;
}

function createField(size, imgs) {
    var cell  = size.width * size.height;
    var field = [];
    allCouple = Math.floor(cell/2);

    if (cell < (imgs.length*2)) {
        var imgs = imgs.splice(0, Math.floor(cell/2));

        imgs = imgs.concat(imgs);
        imgs.push('empty');
    } else {
        var baseCouple      = imgs.concat(imgs);
        var coupleCount     = Math.floor(cell/(imgs.length*2));
        var restCoupleCount = (cell%(imgs.length*2))/2;
        var restCouple      = imgs;
        
        restCouple = restCouple.splice(0, restCoupleCount);
        restCouple = restCouple.concat(restCouple);
        imgs       = duplicate(coupleCount, baseCouple);
        imgs       = imgs.concat(restCouple);

        if (cell%2)  imgs.push('empty');
    }

    for(var i = 0; i < cell; i++) {
        var shirt = new Image();
        var img   = new Image();
        var div   = document.createElement('div');

        div.className       = "choose-img";

        shirt.src           = 'img/shirt.jpg';
        shirt.dataset.id    = imgs[i] !== 'empty' ? 'img_' + imgs[i].replace(/\D+/g,"") : 'empty';
        shirt.src           = 'img/shirt.jpg';

        img.src             = imgs[i] !== 'empty' ? (url + imgs[i]) : empty;
        img.style.display   = 'none';
        
        shirt.addEventListener( "click" , openImage);

        div.appendChild(shirt);
        div.appendChild(img);

        field.push(div);
    }

    appendField(field, size.width);
}

function main() {
    var size = JSON.parse(getAjax(itemUrl));
    var imgs = JSON.parse(getAjax(picturesUrl));

    createField(size,imgs);
}

(function(){
    main();
})();