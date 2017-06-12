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

const checkScreenSize = function(screenSize) {
	const breakPoints = {
		desktop: {
			innerWidth: 1150,
			itemsPerPage: 4
		},
		tablet: {
			innerWidth: 720,
			itemsPerPage: 2
		},
		mobile: {
			innerWidth: 360,
			itemsPerPage: 1
		}
	};

	const breakPoint = Object.keys(breakPoints)
		.find(function(screen) {
			let breakPoint = breakPoints[screen];

			return breakPoint.innerWidth <= screenSize && breakPoint;
		});

	return breakPoints[breakPoint].itemsPerPage;
}

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
		let filteredProducts = products.filter(function(product){
			return product.sectionCategory === slug;
		});

		let itemsPerPage = checkScreenSize(window.innerWidth);

		let fourts = [];

		while(filteredProducts.length) {
			fourts.push(filteredProducts.splice(0, itemsPerPage));
		}

		return `
			<div class="single-category">
				<div class="products-title"><h4>${title}</h4></div>
				<div class="products carousel clearfix">
					${
					fourts.map(function(group){
						return `
							<div class="row">
								${
									group.map(function(product) {
										return singleProductTemplate(product)
									}).join("")
								}
							</div>
						`
					}).join("")
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

	[ ...productsWrapper.querySelectorAll('.products') ]
		.forEach(function(product) {
			Peppermint(product, {
				dots: true
			});
		});
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
