import { Builder, By, Key, until } from 'selenium-webdriver';
import assert from 'assert';
let driver = await new Builder().forBrowser('chrome').build()


async function loginToAmazon() {

    try {
        // Navigate to Amazon
        await driver.get('https://www.amazon.com');

        // Click on the 'Sign in' button
        let signInButton = By.id('nav-link-accountList');
        await driver.wait(until.elementLocated(signInButton), 10000);
        await driver.findElement(signInButton).click();

        // Wait for the email input field to load
        let emailField = By.id('ap_email');
        await driver.wait(until.elementLocated(emailField), 10000);

        // Enter email and click continue
        await driver.findElement(emailField).sendKeys('oir209@nyu.edu');
        let continueButton = By.id('continue');
        await driver.findElement(continueButton).click();

        // Wait for the password input field to load
        let passwordField = By.id('ap_password');
        await driver.wait(until.elementLocated(passwordField), 10000);

        // Enter password
        //Intentionally left with dashes, not actual password
        await driver.findElement(passwordField).sendKeys('-----------');

        // Click the submit button
        let submitButton = By.id('signInSubmit');
        await driver.findElement(submitButton).click();

    } catch (error) {
        console.error('Error occurred:', error);
    } 



}

async function setUpAddressInput() {
    await driver.findElement(By.id('nav-link-accountList')).click();
    await driver.wait(until.elementLocated(By.linkText('Your Addresses')), 10000).click();
    await driver.findElement(By.id('ya-myab-address-add-link')).click();
    console.log('You are ready to add your address')
}



async function fillAddressFormExceptState(street, city, zip, phoneNumber) {        
    await driver.findElement(By.id('address-ui-widgets-enterAddressLine1')).sendKeys(street);
    await driver.findElement(By.id('address-ui-widgets-enterAddressCity')).sendKeys(city);
    await driver.findElement(By.id('address-ui-widgets-enterAddressPostalCode')).sendKeys(zip);
    await driver.findElement(By.id('address-ui-widgets-enterAddressPhoneNumber')).sendKeys(phoneNumber);

    console.log('Youre ready to add state');
}

async function selectStateDropdown(stateValue) {
    // Find all elements with the given selector
    const dropdownTriggers = await driver.findElements(By.css('span[data-action="a-dropdown-button"]'));

    // Click the second dropdown trigger to open the dropdown options
    const stateDropdownTrigger = dropdownTriggers[1];
    await stateDropdownTrigger.click();
    // Wait for the options to become visible
    await driver.wait(until.elementIsVisible(driver.findElement(By.css(`option[value="${stateValue}"]`))), 5000);
    // Click the desired option for the state
    const optionToSelect = await driver.findElement(By.css(`option[value="${stateValue}"]`));
    await optionToSelect.click();


    await driver.actions().sendKeys(Key.ESCAPE).perform();
}



async function clickAddAddressButton() {
    await driver.sleep(2000); // Pauses for 2 seconds for visual verification
    console.log('before clicking the Add Address button');

    // Locating the submit input button and clicking it
    const addButton = await driver.findElement(By.css('input.a-button-input[type="submit"][aria-labelledby="address-ui-widgets-form-submit-button-announce"]'));
    await addButton.click();

    console.log('after clicking the Add Address button');
    await driver.sleep(3000); // Pauses for 3 seconds for visual verification

}



async function assertAddressAdded(expectedAddressLine) {
    await driver.wait(until.elementLocated(By.id('address-ui-widgets-AddressLineOne')), 10000);
    const addressElements = await driver.findElements(By.id('address-ui-widgets-AddressLineOne'));

    // Convert expected values to lowercase for case-insensitive comparison
    const expectedAddressLineLower = expectedAddressLine.toLowerCase();

    // Check if any address matches the expected ones
    let addressFound = false;
    for (let i = 0; i < addressElements.length; i++) {
        const addressText = await addressElements[i].getText();

        if (addressText.toLowerCase().includes(expectedAddressLineLower)){
            addressFound = true;
            break;
        }
    }

    // Assert that the address was found
    assert(addressFound, 'The expected address were not found in the list');
    console.log('Assertion passed: You added new address in');

}

async function addAddressToAmazon() {
    try {
        await loginToAmazon();
        await setUpAddressInput();
        await fillAddressFormExceptState('10237 47th Ave', 'Corona', '11368', '6465059863');
        await selectStateDropdown('NY');
        await clickAddAddressButton();
        await assertAddressAdded('10237 47th Ave');
    } finally {
        await driver.quit();
    }
}

addAddressToAmazon();
