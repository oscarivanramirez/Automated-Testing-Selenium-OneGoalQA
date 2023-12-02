import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';

async function amazonLoginTest() {
    let driver = await new Builder().forBrowser('chrome').build();

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

        // Wait for the account name to appear as an indication of successful login
        let accountName = By.id('nav-link-accountList-nav-line-1'); // This ID might change, ensure to use the correct one
        await driver.wait(until.elementLocated(accountName), 10000);

        // Assertion to verify if the account name is displayed
        let accountNameElement = await driver.findElement(accountName);
        let isAccountNameVisible = await accountNameElement.isDisplayed();
        assert.strictEqual(isAccountNameVisible, true, 'Account name is not visible, login might have failed');
        console.log('Assertion passed: You are logged in');


    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        await driver.quit();
    }
}

amazonLoginTest();
