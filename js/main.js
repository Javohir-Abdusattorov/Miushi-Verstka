var load = function (url, onSuccess, onError) {
	var xhr = new XMLHttpRequest(); // XML HTTP so'rov

	xhr.responseType = 'json'; // javob turi: JSON, HTML, XML, GraphQL

	xhr.addEventListener('load', function () {
		if (xhr.status === 200) {
			onSuccess(xhr.response);
		} else {
			onError('Javob statusi: ' + xhr.status + ' ' + xhr.statusText);
		}
	});

	xhr.addEventListener('error', function () {
		onError('Bog\'lanish bilan muammo');
	});

	xhr.addEventListener('timeout', function () {
		onError('So\'rov ' + xhr.timeout + ' ms ichida bajarilishga ulgurmadi.');
	});

	xhr.timeout = 10000;

	xhr.open('GET', url);
	xhr.send();
};

var $ = function (selector) {
	return document.querySelector(selector);
};

var $$ = function (selector) {
	return document.querySelectorAll(selector);
};

var headGlidelide = $('.head__slide .glide__slide').style.width = `${100 / 3}px`;

var menuOpenButton = $('.min__btn');
var menuOpenList = $('.head__menu');
var sectionSiteHead = $('.site__head');
menuOpenList.style.top = `${sectionSiteHead.style.height}px`;

var userName = localStorage.getItem('cabUserName') || prompt('Enter your Username:');
var purchaseCount = localStorage.getItem('cabPurchaseCount') || prompt('Enter how much sushi you buy from us:');

var userNameText = $('.user_name').textContent = userName;
var purchaseCountNumber = $('.purchases_count').textContent = purchaseCount;

localStorage.setItem('cabUserName', userName);
localStorage.setItem('cabPurchaseCount', purchaseCount);

var ESC_KEYCODE = 27;

var cabinetModal = $('.cabinet');
var cabinetModalOpenButton = $('.cabinet-button');
var cabinetModalOpenButtonMax = $('.cabinet-button-max');
var cabinetModalCloseButton = $('.cabinet__close_btn');

var cart = $('.cart');
var cartOpenButton = $('.cart-button');
var cartOpenButtonMax = $('.cart-button-max');

function showCart (cartOpenButton) {
	cartOpenButton.addEventListener('click', function () {
		cart.classList.toggle('cart--show');
	});
}

showCart(cartOpenButton);
showCart(cartOpenButtonMax);

var closeCabinet = function () {
	cabinetModal.classList.remove('cabinet--showen');
}

function showCabinet (openButton) {	
	openButton.addEventListener('click', function () {
		cabinetModal.classList.add('cabinet--showen');

		document.addEventListener('keyup', function (evt) {
			if (evt.keyCode === ESC_KEYCODE) {
				closeCabinet();
			}
		});

		cabinetModalCloseButton.addEventListener('click', closeCabinet);
	});
};

showCabinet(cabinetModalOpenButton);
showCabinet(cabinetModalOpenButtonMax);

menuOpenButton.addEventListener('click', function () {
	menuOpenList.classList.toggle('menu-open');
});

var config = {
	type: 'carousel',
	perView: 4,
    breakpoints: {
      760:{
        perView: 3
      },
      320:{
        perView: 1
      }
    }
}

new Glide('.glide').mount();	
new Glide('.glide-card', config).mount();	
new Glide('.glide-card--roll', config).mount();	
new Glide('.glide-card--pizza', config).mount();	
new Glide('.glide-card--wok', config).mount();	
new Glide('.glide-card--sale', config).mount();	

// ====================================== Functions ======================================== \\

var cards = $$('.card');
var cardTitle = $$('h4.card__title');
var cardCostParaghraph = $$('.card__cost p');
var cardNumberParaghraph = $$('.card__number');
var cardAddButtons = $$('.card__btn');
var cartTemplate = $('#cart_template').content;

var cardData = [];
var cartBuys = [];

var cartSection = $('.cart__purchases');
var purchaseAllCost = $('.purchase__cost--all');
var cartBuysNumber = $('.cart__number');
var minusNumButtton = $$('.card_minus');
var plusNumButtton = $$('.card_plus');

var allcost = 0;

minusNumButtton.forEach(function (button) {
	button.addEventListener('click', function () {
		var number = parseInt(button.nextSibling.nextSibling.textContent, 10);
		if (number <= 1) return;

		number = number - 1;
		button.nextSibling.nextSibling.textContent = number;
	})
});

plusNumButtton.forEach(function (button) {
	button.addEventListener('click', function () {
		var number = parseInt(button.previousSibling.previousSibling.textContent, 10);
		number++;
		button.previousSibling.previousSibling.textContent = number;
	})
});

function createCardData () {
	for (var i = 0; i < cards.length; i++) {
		var cardDataObject = new Object();

		var cardDataCost = parseInt(cardCostParaghraph[i].outerText, 10);
		var cardDataNumber = parseInt(cardNumberParaghraph[i].innerHTML, 10);

		cardDataObject.dataCardTitle = cardTitle[i].outerText;
		cardDataObject.dataCardCost = cardDataCost;
		cardDataObject.dataCardNumber = cardDataNumber;
		cardDataObject.dataCardAllCost = cardDataCost * cardDataNumber;

		cardData.push(cardDataObject);
	};
};

function createCartPurchases (purchaseData) {
	var purchaseFragment = document.createDocumentFragment();

	purchaseData.forEach( function (purchase) {		
		var purchaseClone = document.importNode(cartTemplate, true);

		purchaseClone.querySelector('.purchase__name').textContent = purchase.dataCardTitle;
		purchaseClone.querySelector('.purchase__count').textContent = 'x' + purchase.dataCardNumber;
		purchaseClone.querySelector('.purchase__cost p').textContent = purchase.dataCardAllCost;

		purchaseFragment.appendChild(purchaseClone);
	});

	cartSection.innerHTML = '';
	cartSection.appendChild(purchaseFragment);
};

cardAddButtons.forEach(function (cardButton) {
	var cardButtonId = cardButton.dataset.id;

	for (var i = 0; i < cardAddButtons.length; i++) {
		cardAddButtons[i].dataset.id = i;
	}

	cardButton.addEventListener('click', function () { 
		cardData.length = 0;	
		createCardData();	

		cartBuys.push(cardData[cardButtonId]);

		allcost += cardData[cardButtonId].dataCardAllCost;
		purchaseAllCost.innerHTML = allcost + '<sup>руб.</sup>';
		cartBuysNumber.textContent = cartBuys.length;

		createCartPurchases(cartBuys);
	});
});