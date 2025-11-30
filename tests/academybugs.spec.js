const { test, expect } = require('@playwright/test');

test.describe('Фінальний набір тестів для AcademyBugs.com', () => {

  //ТЕСТ #1: УСПІШНИЙ ПЕРЕХІД НА СТОРІНКУ ТОВАРУ 
  
test('Перевірка успішного переходу на сторінку товару', async ({ page }) => {
   
 // Крок 1: Відкриваємо сторінку зі списком усіх товарів
    await page.goto('https://academybugs.com/find-bugs/');

    // Крок 2: Знаходимо посилання на товар "DNK Yellow Shoes" і клікаємо на нього
    await page.getByRole('link', { name: 'DNK Yellow Shoes' }).click();

    // Крок 3: Перевіряємо, що ми опинилися на правильній сторінці.
    // Очікуємо, що ПЕРШИЙ заголовок <h1> на новій сторінці буде містити потрібний текст.
    const pageTitle = page.locator('h1').first();
    await expect(pageTitle).toHaveText('DNK Yellow Shoes');
  });

  // ТЕСТ #2: ДОДАВАННЯ ТОВАРУ В КОШИК (зверніть увагу, що лише для прикладу наведене додавання зовсім іншого товару)
  test('Перевірка додавання товару в кошик', async ({ page }) => {
    // Крок 1: Відкриваємо сторінку товару "Blue Tshirt"
    await page.goto('https://academybugs.com/store/blue-tshirt/');

    // Крок 2: Натискаємо на кнопку "ADD TO CART".
    await page.getByRole('button', { name: 'ADD TO CART' }).click();

    // Крок 3: Перевіряємо, що нас перекинуло на сторінку кошика.
    await expect(page).toHaveURL(/.*my-cart/);

    // Крок 4: Перевіряємо, що на сторінці кошика є посилання з точною назвою товару.
    const productInCart = page.getByRole('link', { name: 'Blue Tshirt' });
    await expect(productInCart).toBeVisible();
  });

});
