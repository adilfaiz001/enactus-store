import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { themeSettings, text } from '../lib/settings';
import MetaTags from '../components/metaTags';
import ProductList from '../components/productList';
import ProductFilter from '../components/productFilter';
import Sort from '../components/sort';
import CategoryBreadcrumbs from '../components/categoryBreadcrumbs';
import * as helper from '../lib/helper';

const getFilterAttributesSummary = productFilter => {
	let attributesSummary = '';
	if (productFilter.attributes) {
		Object.keys(productFilter.attributes).forEach(attributeKey => {
			const attributeName = attributeKey.replace('attributes.', '');
			const attributeValue = productFilter.attributes[attributeKey];
			const attributeValueFormatted = Array.isArray(attributeValue)
				? attributeValue.join(', ')
				: attributeValue;
			attributesSummary += `. ${attributeName}: ${attributeValueFormatted}`;
		});
	}
	return attributesSummary;
};

const getFilterPriceSummary = (productFilter, settings) => {
	let priceSummary = '';
	if (productFilter.priceFrom > 0 && productFilter.priceTo > 0) {
		const priceFrom = helper.formatCurrency(productFilter.priceFrom, settings);
		const priceTo = helper.formatCurrency(productFilter.priceTo, settings);
		priceSummary = `. ${text.price}: ${priceFrom} - ${priceTo}`;
	}
	return priceSummary;
};

const CategoryHero = ({ categoryDetails, categories }) => (
	<section className="hero is-light">
		<div className="hero-body">
			<div className="container">
				{themeSettings.show_category_breadcrumbs && (
					<CategoryBreadcrumbs
						currentCategory={categoryDetails}
						categories={categories}
					/>
				)}
				<h1 className="category-title">{categoryDetails.name}</h1>
				<div
					className="category-description is-hidden-mobile content"
					dangerouslySetInnerHTML={{ __html: categoryDetails.description }}
				/>
			</div>
		</div>
	</section>
);

CategoryHero.propTypes = {
	categoryDetails: PropTypes.shape({}).isRequired,
	categories: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

const CategoryContainer = props => {
	const {
		setSort,
		addCartItem,
		loadMoreProducts,
		getJSONLD,
		state,
		state: {
			products,
			categoryDetails,
			settings,
			productFilter,
			productsHasMore,
			categories,
			loadingProducts,
			loadingMoreProducts
		}
	} = props;

	const filterAttributesSummary = getFilterAttributesSummary(productFilter);
	const filterPriceSummary = getFilterPriceSummary(productFilter, settings);

	const pageTitle =
		categoryDetails.meta_title && categoryDetails.meta_title.length > 0
			? categoryDetails.meta_title
			: categoryDetails.name;
	const title = `${pageTitle}${filterAttributesSummary}${filterPriceSummary}`;

	const jsonld = getJSONLD(state);

	const showFilter = themeSettings.show_product_filter;

	var form_state = {
		name : null,
		teamName: null,
		department: null,
		size: null
	};

	const handleName = (e) => {
		form_state.name = e.target.value;
	}
	const handleTeamName = (e) => {
		form_state.teamName = e.target.value;
	}
	const handleDepartment = (e) => {
		form_state.department = e.target.value;
	}
	const handleSize = (e) => {
		let {size,value} = e.target;
		form_state.size = value;
	}

	
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(form_state);
	}


	return (
		<Fragment>
			<MetaTags
				title={title}
				description={categoryDetails.meta_description}
				canonicalUrl={categoryDetails.url}
				imageUrl={categoryDetails.image}
				ogType="product.group"
				ogTitle={categoryDetails.name}
				ogDescription={categoryDetails.meta_description}
				jsonld={jsonld}
			/>

			<CategoryHero categoryDetails={categoryDetails} categories={categories} />

			<section className="section section-category">
				<div className="container">

					<div className="columns">

						{showFilter === true && (
							<div className="column is-one-quarter left-sidebar is-mobile-hidden">
								<ProductFilter {...props} />
							</div>
						)}
						
						{(pageTitle === 'Clothing') ?  (
							<div className='column design-tshirt flex'>

								<div className='tshirt-form flex'>
									<h1>Enactus JMI Team T-Shirt</h1>
									<form onSubmit={(e) => handleSubmit(e)} className='flex'>
										<label htmlFor='name'></label>
										<input type='text' id='name' placeholder='Name' onChange={(e) => handleName(e)} />
										<label htmlFor='department'></label>
										<input type='text' id='department' placeholder='Department' onChange={(e) => handleDepartment(e)} />
										<select id="size" name="size" placeholder='Size' onChange={(e) => handleSize(e)} >
											<option value="sm">Small(S)</option>
											<option value="m">Medium(M)</option>
											<option value="l">Large(L)</option>
											<option value="xl">Extra Large(XL)</option>
											<option value="xxl">Double Extra Large(XXL)</option>
										</select>
										<button>Conform Order</button>
									</form>
								</div>

								<div className='tshirt-form flex'>
									<h1>Customised JMI Hoodie</h1>
									<form onSubmit={(e) => handleSubmit(e)} className='flex'>
										<label htmlFor='teamName'></label>
										<input type='text' id='teamName' placeholder='Team Name' />
										<label htmlFor='department'></label>
										<input type='text' id='department' placeholder='Department/Faculty'/>
										<select id="size" name="size">
											<option value="sm">Small(S)</option>
											<option value="m">Medium(M)</option>
											<option value="l">Large(L)</option>
											<option value="xl">Extra Large(XL)</option>
											<option value="xxl">Double Extra Large(XXL)</option>
										</select>
										<button>Conform Order</button>
									</form>
								</div>

							</div>
								):
								null
						}
						

						<div className="column">
							<div className="columns is-hidden-mobile">
								<div className="column" />
								<div className="column is-5">
									<Sort
										defaultSort={settings.default_product_sorting}
										currentSort={productFilter.sort}
										setSort={setSort}
									/>
								</div>
							</div>
							<ProductList
								products={products}
								addCartItem={addCartItem}
								settings={settings}
								loadMoreProducts={loadMoreProducts}
								hasMore={productsHasMore}
								loadingProducts={loadingProducts}
								loadingMoreProducts={loadingMoreProducts}
							/>
						</div>
					</div>
				</div>
			</section>
		</Fragment>
	);
};

CategoryContainer.propTypes = {
	setSort: PropTypes.func.isRequired,
	addCartItem: PropTypes.func.isRequired,
	loadMoreProducts: PropTypes.func.isRequired,
	getJSONLD: PropTypes.func.isRequired,
	state: PropTypes.shape({
		settings: PropTypes.shape({}),
		products: PropTypes.arrayOf(PropTypes.shape({})),
		productFilter: PropTypes.shape({}),
		productsHasMore: PropTypes.bool,
		categoryDetails: PropTypes.shape({}),
		categories: PropTypes.arrayOf(PropTypes.shape({})),
		loadingProducts: PropTypes.bool,
		loadingMoreProducts: PropTypes.bool
	}).isRequired
};

export default CategoryContainer;
