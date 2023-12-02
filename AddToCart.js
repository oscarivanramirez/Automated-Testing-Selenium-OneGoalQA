import { Builder, By, Key, until } from 'selenium-webdriver';
import assert from 'assert';

async function addToCartTest() {
    let driver = await new Builder().forBrowser('chrome').build();

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

    // Navigate to the cart and confirm the same pillow was added
    await driver.get('https://www.amazon.com/gp/cart/view.html');
    await driver.wait(until.elementLocated(By.css('[data-name="Active Items"]')), 10000);

    // Find all active items in the cart
    const activeItems = await driver.findElements(By.css('[data-itemtype="active"]'));
    let isPillowInCart = false;
    console.log('Pillow added',firstPillowId)
    for (let item of activeItems) {
        const itemAsin = await item.getAttribute('data-asin');
        console.log('Item in cart:', itemAsin);
        if (itemAsin === firstPillowId) {
            isPillowInCart = true;
            break;
        }
    }

    // Use assert to confirm the same pillow was added
    assert.strictEqual(isPillowInCart, true, 'The pillow ID in the cart does not match the selected pillow.');
    console.log('Assertion passed: Pillow is in the cart');


  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await driver.quit();
  }
}

addToCartTest();
