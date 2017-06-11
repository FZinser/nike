const productFilterElement = document.querySelector(".product-filter .wrapper");

const productState = {
	productName: "Chuteiras HyperVenom",
	categories: [
	 {
	 	id: "cano_alto",
	 	content: "Cano alto"
	 },
	 {
	 	id: "cano_baixo",
	 	content: "Cano baixo"
	 },
	 {
	 	id: "campo",
	 	content: "Futebol Campo"
	 },
	 {
	 	id: "society",
	 	content: "Futebol Society"
	 }
	]
};

const singleFilterTemplate = function({id, content}) {
	return `
		<div class="single-filter">
			<input class="check-field" id="${id}" data-filter="${id}" type="checkbox">
			<label class="field-category" for="${id}">${content}</label>
		</div>
	`;
};

const productFilterTemplate = function(productName = "", categories = []) {
	return `
		<span class="product-desc">${productName}:</span>
		${categories.map(function(category){
			return singleFilterTemplate(category)
		}).join('')}
	`;
};

const renderProductFilter = function(wrapper, template = ""){
	wrapper.innerHTML = template;
};

const initProductFilter = function(categories, products, onFilterCallback){
	renderProductFilter(productFilterElement, productFilterTemplate(productState.productName, productState.categories));
	bindFilterEvents([ ...document.querySelectorAll('[data-filter]')], categories, products, onFilterCallback);
};

const bindFilterEvents = function(filterChecks, categories, products, callback) {
	let currentFilters = [];

	const allFiltersButton = document.querySelector('[data-all-filters]');

	allFiltersButton.addEventListener('click', function(e) {
		const changeEvent = document.createEvent('HTMLEvents');
		changeEvent.initEvent('change', true, false);

		filterChecks.forEach(function(check) {
			check.checked = false;
			check.dispatchEvent(changeEvent);
		})
	});

	filterChecks
		.forEach(function(check) {
			check.addEventListener('change', function(e) {
				let id = check.getAttribute('data-filter');

				if (check.checked) {
					currentFilters = currentFilters.concat(id);
				} else {
					currentFilters = currentFilters.filter(item => item !== id);
				}

				let filteredProducts = products.filter(product => {
					if (currentFilters.includes(product.category) || currentFilters.includes(product.type)) {
						return product;
					}
				});

				console.log('Filtros Atuais', currentFilters);

				callback(categories, filteredProducts.length ? filteredProducts : products);
			})
		});
}

module.exports = initProductFilter;
