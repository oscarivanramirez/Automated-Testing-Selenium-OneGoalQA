import { Builder, By, Key, until } from 'selenium-webdriver';

// Set up the WebDriver instance
const driver = new Builder().forBrowser('chrome').build();

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
        await driver.findElement(passwordField).sendKeys('------------');

        // Click the submit button
        let submitButton = By.id('signInSubmit');
        await driver.findElement(submitButton).click();

    } catch (error) {
        console.error('Error occurred:', error);
    } 



}



async function logoutAmazonAccount() {
    try {
        console.log('before signout');
        // Hover over the "Accounts & Lists" element
        const accountsAndLists = await driver.findElement(By.id('nav-link-accountList'));
        await driver.actions().move({ origin: accountsAndLists }).perform();

        // Wait for the sign-out link to be present
        const signOutLinkSelector = By.id('nav-item-signout');
        await driver.wait(until.elementLocated(signOutLinkSelector), 10000);
        const signOutLink = await driver.findElement(signOutLinkSelector);

        // Additional check: ensure the sign-out link is displayed and enabled
        if (await signOutLink.isDisplayed() && await signOutLink.isEnabled()) {
            await signOutLink.click();
        } else {
            throw new Error('Sign-out link is not clickable.');
        }
        // Wait for a moment to allow the logout process to complete
        await driver.sleep(2000);


        // Wait for the page to load and check for "Sign in" header
        const signInHeader = await driver.wait(until.elementLocated(By.css('h1.a-spacing-small')), 10000);
        const headerText = await signInHeader.getText();

        if (headerText.includes('Sign in')) {
            console.log('Logged out successfully.');
        } else {
            throw new Error('Logout failed.');
        }
    } catch (error) {
        console.error('An error occurred during logout:', error);
    }
}



async function main() {
    try {
        await loginToAmazon();
        await logoutAmazonAccount();
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await driver.quit();
    }
}

main();

