const { test, expect } = require('@playwright/test');

test.describe('Фінальний набір тестів для AcademyBugs.com', () => {

  // ТЕСТ #1: УСПІШНИЙ ПЕРЕХІД НА СТОРІНКУ ТОВАРУ
  test('Перевірка успішного переходу на сторінку товару', async ({ page }) => {
    // Крок 1: Відкриваємо сторінку зі списком усіх товарів
    await page.goto('https://academybugs.com/find-bugs/');

    // Крок 2: Знаходимо перше посилання на товар "DNK Yellow Shoes" і клікаємо на нього
    await page.getByRole('link', { name: 'DNK Yellow Shoes' }).first().click();

    // Крок 3: Перевіряємо, що ми опинилися на правильній сторінці
    const pageTitle = page.locator('h1').first();
    await expect(pageTitle).toHaveText('DNK Yellow Shoes');
  });

  // ТЕСТ #2: ДОДАВАННЯ ТОВАРУ В КОШИК
  test('Перевірка додавання товару в кошик', async ({ page }) => {
    // Відкриваємо сторінку товару
    await page.goto('https://academybugs.com/store/blue-tshirt/');

    // Натискаємо кнопку "ADD TO CART"
    await page.getByRole('button', { name: 'ADD TO CART' }).click();

    // Перевіряємо, що нас перекинуло на сторінку кошика
    await expect(page).toHaveURL(/.*my-cart/, { timeout: 10000 });

    // Перевіряємо, що у кошику є товар "Blue Tshirt"
    const productInCart = page.locator('a.ec_cartitem_title', { hasText: 'Blue Tshirt' }).first();
    await expect(productInCart).toBeVisible({ timeout: 15000 });
  });

  // ТЕСТ #3: ПЕРЕВІРКА ЗМІНИ ВАЛЮТИ НА СТОРІНЦІ ТОВАРУ
  test('Зміна валюти на сторінці товару DNK Yellow Shoes', async ({ page }) => {
  // 1. Відкрити сторінку товару
  await page.goto('https://academybugs.com/store/dnk-yellow-shoes/');

  // 2. Локатор ціни та перевірка видимості
  const priceLocator = page.locator('#ec_final_price_5_1');
  await expect(priceLocator).toBeVisible();

  // 3. Зберегти початкову ціну
  const initialPrice = await priceLocator.textContent();

  // 4. Вибрати валюту EUR
  const currencySelect = page.locator('#ec_currency_conversion');
  await currencySelect.selectOption('EUR');

  // 5. Перевірити, що ціна змінилась
  await expect(priceLocator).not.toHaveText(initialPrice);
});

test('Перевірка коректності відображення кнопки “Return to Store” у кошику', async ({ page }) => {
  // 1. Відкрити сайт
  await page.goto('https://academybugs.com/store/dnk-yellow-shoes/');

  const cartWidgetButton = page.locator('.ec_cart_widget_button');

  // Навести курсор на контейнер кошика
  await cartWidgetButton.hover();

  // CHECKOUT повинен стати видимим
  const checkoutButton = page.locator('.ec_cart_widget_minicart_checkout_button');
  await checkoutButton.waitFor({ state: 'visible', timeout: 5000 });
  await checkoutButton.click();

  // Видалити всі товари по одному
  let deleteButtons = page.locator('.ec_cartitem_delete');
  while (await deleteButtons.count() > 0) {
    await deleteButtons.first().click();
    await deleteButtons.first().waitFor({ state: 'detached' });
    deleteButtons = page.locator('.ec_cartitem_delete');
  }

  // Знову наведення, щоб кнопка RETURN TO STORE з’явилася
  await cartWidgetButton.hover();

  // Знайти кнопку
  const returnToStoreBtn = page.locator('a.ec_cart_empty_button.academy-bug');

  // Дочекатися появи кнопки
  await returnToStoreBtn.waitFor({ state: 'visible', timeout: 15000 });

  // Очистити текст кнопки від зайвих пробілів
  const buttonText = (await returnToStoreBtn.textContent()).replace(/\s+/g, ' ').trim();
  expect(buttonText).toBe('RETURN TO STORE');

  // Перевірити, що кнопка видима
  await expect(returnToStoreBtn).toBeVisible();
},{ timeout: 60000 });


});
