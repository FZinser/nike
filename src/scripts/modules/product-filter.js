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
	 	id: "futebol_campo", 
	 	content: "Futebol Campo"
	 },
	 {
	 	id: "futebol_society", 
	 	content: "Futebol Society"
	 }
	]
};

const singleFilterTemplate = function({id, content}) {
	return `
		<div class="single-filter">
			<input class="check-field" id="${id}" type="checkbox">
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

const initProductFilter = function(){
	renderProductFilter(productFilterElement, productFilterTemplate(productState.productName, productState.categories));	
};

module.exports = initProductFilter;