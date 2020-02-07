let autoReloadJson = require ('auto-reload-json');
var chai = require('chai');  
var assert = chai.assert;    // Using Assert style
var expect = chai.expect;    // Using Expect style
var should = chai.should();  // Using Should style

const EC = protractor.ExpectedConditions;
let dataJSONPageInfo = browser.params.dataConfigJSONPageStaticInfo;
let dataJSONPageInfoRead = autoReloadJson(dataJSONPageInfo);

let PO_automationPractice = new browser.params.automationPractice_PO();

beforeEach(async () => {
	await browser.waitForAngularEnabled(false);
});

describe('Testing Automation Practice site', () => {

it('Login Page', async () =>{
	expect(await PO_automationPractice.fn_URLNavigation()).toEqual(dataJSONPageInfoRead.indexPage.pageTitle);
});

it('After Login', async () =>{
	await PO_automationPractice.fn_loginToApplication();
	let elm1 =  await element(by.id("app"));
	let ecWaitForHomePageToLoad = EC.and(EC.visibilityOf(elm1));
	await browser.wait(ecWaitForHomePageToLoad, 70000, 'Timeout: PageLoadError');
	browser.driver.sleep(30000);
	},60000);

it('Click Quick Actions', async () =>{
	let rootElm1 =  await element(by.id("app"));
	let navmenu = await rootElm1.element(by.css_sr("::sr app-common::sr  app-drawer rock-navmenu"));
	let quickActions_elm_All = await navmenu.element(by.css_sr("::sr"));
	let quickActions_elm = await quickActions_elm_All.all(by.css('a[title = "Quick Actions"]')).get(0);

await quickActions_elm.click();
let sku_elm_All = await navmenu.element(by.css_sr("::sr pebble-actions-dropdown::sr"));
let sku_elm = await sku_elm_All.element(by.css('div[title="SKU"]'));
await sku_elm.click();

let sku_landing_Page_elm1 = await rootElm1.all(by.css_sr("::sr #contentViewManager::sr rock-content-view")).get(1);
let sku_landing_Page_elm2 = await sku_landing_Page_elm1.element(by.css_sr("::sr app-business-function::sr #wizardManage::sr rock-entity-create::sr rock-attribute-list::sr "))
//attribute-box attribute-box-3
let sku_landing_Page_elm3 = await sku_landing_Page_elm2.element(by.css('div[name="mdmid"]'));
let sku_mdm_input_elm = sku_landing_Page_elm3;
let ecWaitForSKUPageToLoad= EC.and(EC.visibilityOf(sku_landing_Page_elm3));
await browser.wait(ecWaitForSKUPageToLoad, 20000, 'Timeout: SKU Page Loading Error');

let mdm_Id_Input_Field_Par = await sku_mdm_input_elm.element(by.css_sr("rock-attribute::sr pebble-textbox::sr"))
let mdm_Id_Input_Field = await mdm_Id_Input_Field_Par.element(by.id("textbox"));
await mdm_Id_Input_Field.sendKeys("8798798674");
let itemType_Input_Field_root = await sku_landing_Page_elm2.element(by.css('div[name="itemtype"]'));
let itemType_Input_Field_par = await itemType_Input_Field_root.element(by.css_sr("rock-attribute::sr rock-entity-combo-box::sr pebble-combo-box::sr pebble-collection-container::sr"));
let itemType_Input_Field = await itemType_Input_Field_par.element(by.className("tags-container"));
await itemType_Input_Field.click();
let itemType_InputField_PopOver = await itemType_Input_Field_par.element(by.id("tagPopover"));
let ecWaitForitemType_InputField_PopOverToLoad= EC.and(EC.visibilityOf(itemType_InputField_PopOver));
await browser.wait(ecWaitForitemType_InputField_PopOverToLoad, 20000, 'Timeout: SKU Page Loading Error');
let itemType_Input_Field_search_par = await itemType_Input_Field_root.element(by.css_sr("rock-attribute::sr rock-entity-combo-box::sr pebble-combo-box::sr pebble-collection-container pebble-lov::sr"));
let itemType_Input_Field_search = await itemType_Input_Field_search_par.element(by.id("searchbox"));

browser.driver.sleep(5000);
});
});	