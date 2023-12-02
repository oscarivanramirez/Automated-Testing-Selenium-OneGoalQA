import { Builder, By, Key, until } from 'selenium-webdriver';
import assert from 'assert';

let driver = await new Builder().forBrowser('chrome').build();


async function addToCartTest() {

  try {
    // 1. Navigate to Amazon and search for a pillow
    await driver.get('https://www.amazon.com');
    await driver.findElement(By.id('twotabsearchtextbox')).sendKeys('pillow', Key.RETURN);
    await driver.wait(until.elementLocated(By.css('[data-component-type="s-search-result"]')), 10000);

    // 2. Click on the first pillow
    const firstPillow = await driver.findElement(By.css('[data-component-type="s-search-result"]'));
    const firstPillowId = await firstPillow.getAttribute('data-asin');
    await firstPillow.click();

    // 3. Add the pillow to cart
    await driver.wait(until.elementLocated(By.id('add-to-cart-button')), 10000);
    await driver.findElement(By.id('add-to-cart-button')).click();
    return firstPillowId

  } catch (error) {
    console.error('Test failed:', error);
  } 
}


async function removeFromCart() {
    try {
        let asin = await addToCartTest();
        await driver.get('https://www.amazon.com/gp/cart/view.html');
        // Wait for the cart to load
        await driver.wait(until.elementLocated(By.id('sc-active-cart')), 10000);

        // Find and click the delete button directly within the item container using ASIN
        const deleteButtonSelector = By.css(`div[data-asin="${asin}"] input[data-action="delete"]`);
        const deleteButton = await driver.findElement(deleteButtonSelector);
        await deleteButton.click();
        console.log('helllo')
        await driver.sleep(3000); // Replace with dynamic wait if possible

        // Wait for the cart to show the empty message
        const emptyCartMessageSelector = By.css("h1.a-spacing-mini.a-spacing-top-base");
        await driver.wait(until.elementLocated(emptyCartMessageSelector), 10000);
        const emptyMessageElement = await driver.findElement(emptyCartMessageSelector);
        const emptyMessageText = await emptyMessageElement.getText();

        if (emptyMessageText.includes("Your Amazon Cart is empty")) {
            console.log(`Cart is now empty. Item with ASIN '${asin}' has been removed.`);
        } else {
            throw new Error("Cart is not empty.");
        }


    } catch (error) {
        console.error('Error during removing item from cart:', error);
    } finally {
        await driver.quit();
    }
}


removeFromCart();
