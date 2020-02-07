//'use strict';
const EC = protractor.ExpectedConditions;

const commonHelper = browser.params.commonHelperAbsPath;

let autoReloadJson = require ('auto-reload-json');

let dataJSONPageInfo = browser.params.dataConfigJSONPageStaticInfo;
let dataJSONPageInfoRead = autoReloadJson(dataJSONPageInfo);

var querySelectorAllDeep =  function querySelectorAllDeep(selector, root = document) {
    return _querySelectorDeep(selector, true, root);
}

var querySelectorDeep =  function querySelectorDeep(selector, root = document) {
    return _querySelectorDeep(selector, false, root);
}

var getObject = function getObject(selector, root = document) {
	// split on > for multilevel selector
    const multiLevelSelectors = splitByCharacterUnlessQuoted(selector, '>');
	if (multiLevelSelectors.length == 1) {
		return querySelectorDeep(multiLevelSelectors[0], root);
	} else if (multiLevelSelectors.length == 2) {
		return querySelectorDeep(multiLevelSelectors[1], querySelectorDeep(multiLevelSelectors[0]).root);
	} else if (multiLevelSelectors.length == 3) {
		return querySelectorDeep(multiLevelSelectors[2], querySelectorDeep(multiLevelSelectors[1], querySelectorDeep(multiLevelSelectors[0]).root));
	}
	//can add more level if we need to
	
}

var getAllObject = function getAllObject(selector, root = document) {
    // split on > for multilevel selector
    const multiLevelSelectors = splitByCharacterUnlessQuoted(selector, '>');
    if (multiLevelSelectors.length == 1) {
        return querySelectorAllDeep(multiLevelSelectors[0], root);
    } else if (multiLevelSelectors.length == 2) {
        return querySelectorAllDeep(multiLevelSelectors[1], querySelectorDeep(multiLevelSelectors[0]).root);
    } else if (multiLevelSelectors.length == 3) {
        return querySelectorAllDeep(multiLevelSelectors[2], querySelectorDeep(multiLevelSelectors[1], querySelectorDeep(multiLevelSelectors[0]).root));
    }
    //can add more level if we need to
    
}

function _querySelectorDeep(selector, findMany, root) {
    let lightElement = root.querySelector(selector);

    if (document.head.createShadowRoot || document.head.attachShadow) {
        // no need to do any special if selector matches something specific in light-dom
        if (!findMany && lightElement) {
            return lightElement;
        }

        // split on commas because those are a logical divide in the operation
        const selectionsToMake = splitByCharacterUnlessQuoted(selector, ',');

        return selectionsToMake.reduce((acc, minimalSelector) => {
            // if not finding many just reduce the first match
            if (!findMany && acc) {
                return acc;
            }
            // do best to support complex selectors and split the query
            const splitSelector = splitByCharacterUnlessQuoted(minimalSelector
                    //remove white space at start of selector
                    .replace(/^\s+/g, '')
                    .replace(/\s*([>+~]+)\s*/g, '$1'), ' ')
                // filter out entry white selectors
                .filter((entry) => !!entry);
            const possibleElementsIndex = splitSelector.length - 1;
            const possibleElements = collectAllElementsDeep(splitSelector[possibleElementsIndex], root);
            const findElements = findMatchingElement(splitSelector, possibleElementsIndex, root);
            if (findMany) {
                acc = acc.concat(possibleElements.filter(findElements));
                return acc;
            } else {
                acc = possibleElements.find(findElements);
                return acc;
            }
        }, findMany ? [] : null);


    } else {
        if (!findMany) {
            return lightElement;
        } else {
            return root.querySelectorAll(selector);
        }
    }

}

function findMatchingElement(splitSelector, possibleElementsIndex, root) {
    return (element) => {
        let position = possibleElementsIndex;
        let parent = element;
        let foundElement = false;
        while (parent) {
            const foundMatch = parent.matches(splitSelector[position]);
            if (foundMatch && position === 0) {
                foundElement = true;
                break;
            }
            if (foundMatch) {
                position--;
            }
            parent = findParentOrHost(parent, root);
        }
        return foundElement;
    };

}

function splitByCharacterUnlessQuoted(selector, character) {
    return selector.match(/\\?.|^$/g).reduce((p, c) => {
        if (c === '"' && !p.sQuote) {
            p.quote ^= 1;
            p.a[p.a.length - 1] += c;
        } else if (c === '\'' && !p.quote) {
            p.sQuote ^= 1;
            p.a[p.a.length - 1] += c;

        } else if (!p.quote && !p.sQuote && c === character) {
            p.a.push('');
        } else {
            p.a[p.a.length - 1] += c;
        }
        return p;
    }, { a: [''] }).a;
}


function findParentOrHost(element, root) {
    const parentNode = element.parentNode;
    return (parentNode && parentNode.host && parentNode.nodeType === 11) ? parentNode.host : parentNode === root ? null : parentNode;
}


function collectAllElementsDeep(selector = null, root) {
    const allElements = [];

    const findAllElements = function(nodes) {
        for (let i = 0, el; el = nodes[i]; ++i) {
            allElements.push(el);
            // If the element has a shadow root, dig deeper.
            if (el.shadowRoot) {
                findAllElements(el.shadowRoot.querySelectorAll('*'));
            }
        }
    };

    findAllElements(root.querySelectorAll('*'));

    return selector ? allElements.filter(el => el.matches(selector)) : allElements;
}

const automationPractice_PO = function () {

//Elements in the page
let elm_loginPage_email = element(by.name("email"));
let elm_loginPage_password = element(by.name("password"));
let elm_loginPage_submitButton = element(by.className("auth0-lock-submit"));

let elm_homePage_userDashboard = element(by.id("mainTitle"));
let elm_homePage_quickActions = element(by.id("buttonTextBox"));
let elm_homePage_quickActions_SKUSelection = element(by.css('[class = "actionitem-with-icon"][title= "SKU"]'));


let elm_IndexPage_signInButton = element(by.css('[class = "login"][title = "Log in to your customer account"]'));
let elm_IndexPage_searchBox = element(by.id('search_query_top'));
let elm_IndexPage_searchButton = element(by.name('submit_search'));
let elm_IndexPage_WomenCategory = element(by.linkText('Women'));
let elm_IndexPage_DressesCategory = element(by.linkText('Dresses'));
let elm_IndexPage_TShirtsCategory = element(by.linkText('T-shirts'));

let elm_WomenCatPage_Landing = element(by.cssContainingText('.cat-name','Women'));
let elm_DressesCatPage_Landing = element(by.cssContainingText('.cat-name','Dresses'));
let elm_TShirtsCatPage_Landing = element(by.cssContainingText('.cat-name','T-shirts'));

let elm_TopsSubCatSelection = element(by.xpath('//a[@title = "Tops" and @class = "img"]'));
let elm_TopsSubCatPage_Landing = element(by.cssContainingText('.cat-name','Tops'));

let elm_TopsFirstItemSelection = element (by.xpath('//a[@title = "Faded Short Sleeve T-shirts" and @class = "product-name"]'));
let elm_TopsFirstItemAddQuantity = element (by.name('qty'));
let elm_TopsFirstItemTextValidation = element (by.cssContainingText('.pb-center-column.col-xs-12.col-sm-4 > h1','Faded Short Sleeve T-shirts'));

let elm_TopsFirstItemAddToCart = element (by.xpath('//button[@name = "Submit"]'));

let elm_searchPage_searchText = element(by.css('.lighter'));
let elm_searchCount = element(by.css('[class = "heading-counter"]'));

let elm_addToCart = element.all (by.css('[title="Add to cart"]')).get(0);
let elm_successAddedToCart = element (by.css('.layer_cart_product.col-xs-12.col-md-6 > h2'));
let elm_proceedToCheckOut = element(by.css('[title="Proceed to checkout"][class="btn btn-default button button-medium"]'));
let elm_ContinueShopping = element(by.css('[title="Continue shopping"][class="continue btn btn-default button exclusive-medium"]'));

let elm_AddedCartItem = element(by.id('product_5_19_0_0'));
let elm_cartValue = element (by.css('[class ="ajax_cart_quantity unvisible"]'));
let elm_cartTitle = element(by.id('cart_title'));
let elm_cartProductName = element(by.css('[class = "product-name"]'));
let elm_ContinueShoppingFromCheckoutPage = element(by.css('[title="Continue shopping"][class="button-exclusive btn btn-default"]'));
let elm_cartButton = element(by.css('[title="View my shopping cart"]'));
let elm_cartDeleteButton = element(by.css('[class = "icon-trash"]'));
let elm_cartAlertWarning = element (by.css('.alert.alert-warning')); 

let elm_cartAlert_CloseButton = element(by.css('[class = "cross"][title = "Close window"]'));

let elm_search_sort = element(by.id('selectProductSort'));
let elm_search_SelectionOfItemRowValue = element(by.css('.product_list.row.list'));

let elm_CreateAccountButton = element(by.css('[class="icon-user left"]'));
let elm_emailText = element(by.id('email_create'));
let elm_CreateAccountError = element(by.id('create_account_error'));
let elm_signInButton =  element(by.id('SubmitLogin'));
let elm_EmailText =  element(by.id('email'));
let elm_PasswordText =  element(by.id('passwd'));
let elm_signInError = element.all (by.css('.alert.alert-danger')).get(0);

let elm_homePage_shadowRoot1_middleContainer = $('#middle-container');
let elm_homePage_shadowRoot1_userDashboard = $('#mainTitle');
let elm1 =  element(by.id("app"));





//Expected Conditions
let ecWaitForLoginPageToLoad = EC.and (EC.visibilityOf(elm_loginPage_email), 
	EC.elementToBeClickable(elm_loginPage_submitButton));

let ecWaitForHomePageToLoad = EC.and(EC.visibilityOf(elm1));

	let ecWaitForIndexPageToLoad = EC.and(EC.visibilityOf(elm_IndexPage_searchBox),
	EC.elementToBeClickable(elm_IndexPage_signInButton));

let ecWaitForSearchDisplay = EC.and(EC.visibilityOf(elm_searchCount));

let ecWaitForAddedToCart = EC.and(EC.visibilityOf(elm_successAddedToCart),
	EC.elementToBeClickable(elm_ContinueShopping));

let ecWaitForCheckout = EC.and(EC.visibilityOf(elm_cartTitle));

let ecWaitForCartAlert = EC.and(EC.visibilityOf(elm_cartAlertWarning));

let ecWaitForCategorySelection = EC.and(EC.visibilityOf(elm_WomenCatPage_Landing));

let ecWaitForSubCategorySelection = EC.and(EC.visibilityOf(elm_TopsSubCatPage_Landing));

let ecWaitForSubCategoryFirstItemTextValidation = EC.and(EC.visibilityOf(elm_TopsFirstItemTextValidation));

let ecWaitForFirstItemAfterSort = EC.and(EC.visibilityOf(elm_TopsFirstItemSelection));

let ecWaitForCreateAccountButton = EC.and(EC.visibilityOf(elm_CreateAccountButton));

let ecWaitForCreateAccountError = EC.and(EC.visibilityOf(elm_CreateAccountError));

let ecWaitForSignInAccountError = EC.and(EC.visibilityOf(elm_signInError));


//Functions to use
this.fn_URLNavigation = async () => {
    await browser.get(dataJSONPageInfoRead.indexPage.pageURL);

    for (var i=1; i<100 ; i++){
        browser.sleep(3000);
    if(!(EC.visibilityOf(elm_loginPage_email))){
        await browser.navigate(dataJSONPageInfoRead.indexPage.pageURL);
            }
    else{
                break;
    }
    }
	await browser.wait(ecWaitForLoginPageToLoad, 20000, 'Timeout: PageLoadError');
	return browser.getTitle();
};

this.fn_loginToApplication = async () => {
	await elm_loginPage_email.sendKeys(dataJSONPageInfoRead.indexPage.email);
	await elm_loginPage_password.sendKeys(dataJSONPageInfoRead.indexPage.password);
	await elm_loginPage_submitButton.click();

//	await console.log(querySelectorAllDeep(elm_homePage_shadowRoot1_userDashboard, elm_homePage_shadowRoot1_middleContainer));
//	await browser.wait(ecWaitForCreateAccountError, 20000, 'Timeout: Validation Error');	
//	return elm_CreateAccountError.getText();
};



this.fn_SearchwithValidText = async () => {
	await elm_IndexPage_searchBox.sendKeys(dataJSONPageInfoRead.indexPage.searchTextValid);
	await elm_IndexPage_searchButton.click();
	await browser.wait(ecWaitForSearchDisplay, 20000, 'Timeout: Search Result Error');
  	await elm_searchPage_searchText.getText().then(async (text) => 
 		await text.trim() === dataJSONPageInfoRead.indexPage.searchTextValid);
  	return elm_searchPage_searchText.isPresent();
};

this.fn_AddItemToCart = async () => {
  	await browser.actions().mouseMove(elm_addToCart).perform();
  	await elm_addToCart.click();
  	await browser.wait(ecWaitForAddedToCart, 20000, 'Timeout: Unable to Add to Cart');
	await elm_proceedToCheckOut.click();
	await browser.wait(ecWaitForCheckout, 20000, 'Timeout: Checkout Page');
	return elm_AddedCartItem.isPresent();
};

this.fn_SearchwithInvalidText = async () => {
	await elm_IndexPage_searchBox.clear();
	await elm_IndexPage_searchBox.sendKeys(dataJSONPageInfoRead.indexPage.searchTextInvalid);
	await elm_IndexPage_searchButton.click();
	await browser.wait(ecWaitForSearchDisplay, 20000, 'Timeout: Search Result Error');
  	await elm_searchCount.getText().then(async (text) => 
 		await text.trim() === dataJSONPageInfoRead.indexPage.noResult);
  	return elm_searchCount.getText();
};

this.fn_RemoveItemFromCart = async () => {
  	await elm_cartButton.click();
	await browser.wait(ecWaitForCheckout, 20000, 'Timeout: Checkout Page');
	await elm_cartDeleteButton.click();
	await browser.wait(ecWaitForCartAlert, 20000, 'Timeout: Checkout Page');
	return elm_cartAlertWarning.getText();
};

this.fn_CategorySelection = async () => {
	await elm_IndexPage_WomenCategory.click();
	await browser.wait(ecWaitForCategorySelection, 20000, 'Timeout: Category Selection Error');
};

this.fn_SubCategorySelection = async () => {
	await elm_TopsSubCatSelection.click();
	await browser.wait(ecWaitForSubCategorySelection, 20000, 'Timeout: Sub Category Selection Error');
};

this.fn_SubCategoryFirstItemSelection = async () => {
	await elm_TopsFirstItemSelection.click();
	await browser.wait(ecWaitForSubCategoryFirstItemTextValidation, 20000, 'Timeout: Item under Sub Category Selection Error');	
};

this.fn_SubCategoryFirstItemAddToCart = async () => {
	await elm_TopsFirstItemAddQuantity.clear();
	await elm_TopsFirstItemAddQuantity.sendKeys('2');
	await elm_TopsFirstItemAddToCart.click();
	await browser.wait(ecWaitForAddedToCart, 20000, 'Timeout: Unable to Add to Cart');
  	return elm_successAddedToCart.isPresent();
};

this.fn_dropDownSelectionToSortItems = async () => {
	await elm_cartAlert_CloseButton.click();
	await elm_IndexPage_searchBox.sendKeys(dataJSONPageInfoRead.indexPage.searchTextValidSort);
	await elm_IndexPage_searchButton.click();
	await browser.wait(ecWaitForSearchDisplay, 20000, 'Timeout: Search Result Error');
  	await elm_searchPage_searchText.getText().then(async (text) => 
 		await text.trim() === dataJSONPageInfoRead.indexPage.searchTextValid);
  	await commonHelper.selectDropDownByValue(elm_search_sort, dataJSONPageInfoRead.indexPage.sortValuePriceLow);
  	await browser.wait(ecWaitForFirstItemAfterSort, 20000, 'Timeout: Sorting Error');
  	return elm_TopsFirstItemSelection.isPresent();
};

this.fn_CreateAccountErrorWithoutEmail = async () => {
	await elm_IndexPage_signInButton.click();
	await browser.wait(ecWaitForCreateAccountButton, 20000, 'Timeout: Login Button Error');	
	await elm_CreateAccountButton.click();
	await browser.wait(ecWaitForCreateAccountError, 20000, 'Timeout: Validation Error');	
	return elm_CreateAccountError.getText();
};

this.fn_CreateAccountErrorWithInvalidEmail = async () => {
	await elm_IndexPage_signInButton.click();
	await browser.wait(ecWaitForCreateAccountButton, 20000, 'Timeout: Login Button Error');	
	await elm_emailText.sendKeys(dataJSONPageInfoRead.indexPage.invalidEmailAddress);
	await elm_CreateAccountButton.click();
	await browser.wait(ecWaitForCreateAccountError, 20000, 'Timeout: Validation Error');	
	return elm_CreateAccountError.getText();
};

this.fn_SignInvalidationForAuthenticationError = async () => {
	await elm_IndexPage_signInButton.click();
	await browser.wait(ecWaitForCreateAccountButton, 20000, 'Timeout: Login Button Error');	
	await elm_EmailText.sendKeys(dataJSONPageInfoRead.indexPage.email);
	await elm_PasswordText.sendKeys(dataJSONPageInfoRead.indexPage.password);
	await elm_signInButton.click();
	await browser.wait(ecWaitForSignInAccountError, 20000, 'Timeout: Validation Error');	
	return elm_signInError.getText();
};

};
module.exports = automationPractice_PO;