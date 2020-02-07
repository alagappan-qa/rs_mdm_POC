let autoReloadJson = require ('auto-reload-json');
let XLSX = require('xlsx');
let workbook = XLSX.readFile('./extFiles/inputData.xlsx');
var chai = require('chai');  
var assert = chai.assert;    // Using Assert style

let worksheet1 = workbook.Sheets.Quick_Actions;
let worksheet2 = workbook.Sheets.SKU_Creation;

const EC = protractor.ExpectedConditions;
let dataJSONPageInfo = browser.params.dataConfigJSONPageStaticInfo;
let dataJSONPageInfoRead = autoReloadJson(dataJSONPageInfo);

let PO_automationPractice = new browser.params.automationPractice_PO();

// let sheet2arr = function(sheet){
// 	let result = [];
// 	let row;
// 	let rowNum;
// 	let colNum;
// 	let range = XLSX.utils.decode_range(sheet['!ref']);
// 	for(rowNum = range.s.r; rowNum <= range.e.r; rowNum++){
// 	   row = [];
// 		for(colNum=range.s.c; colNum<=range.e.c; colNum++){
// 			let nextCell = sheet[
// 			  XLSX.utils.encode_cell({r: rowNum, c: colNum})
// 		   ];
// 		   if( typeof nextCell === 'undefined' ){
// 			  row.push(void 0);
// 		   } else row.push(nextCell.w);
// 		}
// 		result.push(row);
// 	}
// 	return result;
//  };

beforeEach(async () => {
	await browser.waitForAngularEnabled(false);
});

describe('Testing Automation Practice site', () => {

it('Login Page', async () =>{
	// console.log("worksheet1",sheet2arr(worksheet1));
	// console.log("worksheet2",sheet2arr(worksheet2));

	// console.log("Type of worksheet1",typeof(sheet2arr(worksheet1)));
	// console.log("Type of worksheet2",typeof(sheet2arr(worksheet2)));

	// let length_sheet1= sheet2arr(worksheet1).length;
	// let length_sheet2= sheet2arr(worksheet2).length;

	// console.log("worksheet1Length",length_sheet1);
	// console.log("worksheet2Length",length_sheet2);


	// for(let i=0; i<length_sheet1;i++){
	// 	let worksheet1_Array = JSON.stringify(sheet2arr(worksheet1)[i]);
	// 	console.log("worksheet1-1",JSON.stringify(sheet2arr(worksheet1)[i]));
	// }
	// for(let j=0; j<length_sheet2;j++){
	// 	let worksheet2_Array = JSON.stringify(sheet2arr(worksheet2)[j]);
	// 	console.log("worksheet2-1",JSON.stringify(sheet2arr(worksheet2)[j]));
	// }

	// for(let i=0; i<length_sheet1;i++){
	// 	console.log("worksheet1-1Values", worksheet1_Array[i]);
	// }
	// for(let j=0; i<length_sheet2;j++){
	// 	console.log("worksheet2-1Values", worksheet2_Array[j]);
	// }

	let sheet_name_list = workbook.SheetNames;
		sheet_name_list.forEach(function(y) { /* iterate through sheets */
			var worksheet = workbook.Sheets[y];
			for (let z in worksheet) {
				/* all keys that do not begin with "!" correspond to cell addresses */
				if(z[0] === '!') continue;
				console.log(y + "!" + z + "=" + JSON.stringify(worksheet[z].v));
			}
		});

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

//class = "menuIcon page-title-icon"]
//let quickActions_elm = await rootElm1(by.css_sr("::sr app-common::sr  app-drawer rock-navmenu::sr [title=\"Quick Actions\"]]"));
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