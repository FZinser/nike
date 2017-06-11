const initProductFilter = require("./product-filter.js");
const Peppermint = require('../vendors/carousel.js');

let productState = {
		categories: {},
		products: {}
};

const mapCategories = {
	"best-sellers": "Mais Vendidos",
	"releases": "Lançamentos"
};

const endPoint = "http://www.raphaelfabeni.com.br/rv/data.json";

const productColumns = {
	'desktop': {
		width: 1149,
		columns: 2
	},

	'tablet': {
		width: 720,
		columns: 4
	},

	'mobile': {
		width: 360,
		columns: 8
	},
};

const productsWrapper = document.querySelector(".products-result");

const mapCategoriesResponse = function(categories) {
	return categories.reduce(function(prev, next, index) {
 		prev[next] = {
 			title: mapCategories[next],
 			slug: next
 		};
 		return prev;
	}, {});
};

const getProductState = function() {
	return fetch(endPoint)
	.then(function(data){
		return data.json();
	})
	.then(function(data){
		let categories = Object.keys(data);
		productState.categories = mapCategoriesResponse(categories);
		productState.products = mapProductResponse(data);
		return data;
	});
}

const mapProductResponse = function(products) {
	return Object.keys(products)
	.reduce(function(prev, next){
		let productItem = products[next].map(function(item){
			return Object.assign({},item,{
				highTop: item['high-top'],
				type: `cano_${item['high-top'] ? 'alto' : 'baixo'}`,
				sectionCategory: next
			})
		})
		return prev.concat(productItem)
	},[])
	.reduce(function(prev, next, index){
		prev[index] = next
		return prev
	},{})
};

const singleProductTemplate = function({ image, title, category, price, installments, highTop }) {
	return `
		<div class="single-product">
			<div class="banner">
				<img src="${image}">
			</div>
			<div class="customizer">
				<span class="desc">Personalize</span>
			</div>
			<div class="description">
				${title}
			</div>
			<div class="category">
				${`Cano ${ highTop ? 'Alto' : 'Baixo'}`}
			</div>
			<div class="price">
				R$ ${price}
			</div>
			<div class="price-info">
				ou ${installments.number}X ${installments.value} sem juros
			</div>
			<button class="ui-btn">Comprar</button>
		</div>
	`
};

const singleCategoryTemplate = function(categories, products){
	return categories.map(function({title, slug}){
		return `
			<div class="single-category">
				<div class="products-title"><h4>${title}</h4></div>
				<div class="products carousel clearfix">
					${products.filter(function(product){
						return product.sectionCategory === slug;
					})
					.map(function(product, index, arr){
						return `
							${singleProductTemplate(product)}
						`
					})
					.join("")
				}
				</div>
			</div>
		`
	}).join("")
};

const renderCategories = function(categories, products){
	productsWrapper.innerHTML = singleCategoryTemplate(
		categories,
		products
	);

	// [ ...productsWrapper.querySelectorAll('.products') ]
	// 	.forEach(function(product) {
	// 		Peppermint(product, {
	// 			dots: true
	// 		});
	// 	})
};

const initProducts = function(){
	getProductState()
		.then(function(){
			let products = Object.keys(productState.products).map(product => productState.products[product]),
					categories = Object.keys(productState.categories).map(category => productState.categories[category]);

			initProductFilter(categories, products, renderCategories);
			renderCategories(categories, products);
		})
};

module.exports = {
	initProducts,
	productState,
	renderCategories
};
