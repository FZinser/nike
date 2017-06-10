let productState = {
		categories: {},
		products: {} 
};

let mapCategories = {
	"best-sellers": "Mais Vendidos",
	"releases": "Lançamentos"
};

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
	return fetch("http://www.raphaelfabeni.com.br/rv/data.json")
	.then(function(data){
		return data.json();
	})
	.then(function(data){
		let categories = Object.keys(data);
		productState.categories = mapCategoriesResponse(categories);
		productState.products = mapProductResponse(data);
		console.log(productState.products);
		return data;
	});
}

const mapProductResponse = function(products) {
	return Object.keys(products)
	.reduce(function(prev, next){
		let productItem = products[next].map(function(item){
			return Object.assign({},item,{
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




const productsWrapper = document.querySelector(".products-result");

const singleProductTemplate = function({ image, title, category, price, installments }) {
	return `
		<div class="product-wrapper">
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
				<div class="price">
					${price}
				</div>
				<div class="price-info">
					ou ${installments.number}X ${installments.value} sem juros
				</div>
				<button class="ui-btn">Comprar</button>
			</div>
		</div>
	`
};

const singleCategoryTemplate = function(categories, products){
	return categories.map(function({title, slug}){
		return `
			<div class="products-title"><h4>${title}</h4></div>
			<div class="products">
				${products.filter(function(product){
					return product.sectionCategory === slug;
				})
				.map(function(product){
					return singleProductTemplate(product)
				})
				.join("")
			}
			</div>
		`
	}).join("")
};

const renderCategories = function(categories, products){
	productsWrapper.innerHTML = singleCategoryTemplate(
		Object.keys(categories).map(category => categories[category]),
		Object.keys(products).map(product => products[product])
	)

};

const initProducts = function(){
	getProductState()
		.then(function(){
			return renderCategories(productState.categories, productState.products);	
		})
};

module.exports = initProducts;