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
    // Крок 1: Відкриваємо сторінку товару
    await page.goto('https://academybugs.com/store/blue-tshirt/');

    // Крок 2: Натискаємо кнопку "ADD TO CART"
    await page.getByRole('button', { name: 'ADD TO CART' }).click();

    // Крок 3: Перевіряємо, що нас перекинуло на сторінку кошика
    await expect(page).toHaveURL(/.*my-cart/, { timeout: 10000 });

    // Крок 4: Перевіряємо, що у кошику є товар "Blue Tshirt"
    const productInCart = page.locator('a.ec_cartitem_title', { hasText: 'Blue Tshirt' }).first();
    await expect(productInCart).toBeVisible({ timeout: 15000 });
  });

  // ТЕСТ #3: ПЕРЕВІРКА ЗМІНИ ВАЛЮТИ НА СТОРІНЦІ ТОВАРУ
  test('Зміна валюти на сторінці товару DNK Yellow Shoes', async ({ page }) => {
  // Крок 1: Відкриваємо сторінку товару
  await page.goto('https://academybugs.com/store/dnk-yellow-shoes/');

  // Крок 2: Перевіряємо, що ціна відображається
  const priceLocator = page.locator('#ec_final_price_5_1');
  await expect(priceLocator).toBeVisible();

  // Крок 3: Зберігаємо початкову ціну
  const initialPrice = await priceLocator.textContent();

  // Крок 4: Вибраємо будь яку валюту (для прикладу EUR)
  const currencySelect = page.locator('#ec_currency_conversion');
  await currencySelect.selectOption('EUR');

  // Крок 5: Перевіряємо, що ціна змінилась
  await expect(priceLocator).not.toHaveText(initialPrice);
});

  // ТЕСТ #4: ПЕРЕВІРКА КОРЕКТНОСТІ ВІДОБРАЖЕННЯ КНОПКИ "RETURN TO STORE" У КОШИКУ
  test('Перевірка коректності відображення кнопки “Return to Store” у кошику', async ({ page }) => {
    // Крок 1: Відкрити сторінку товару
    await page.goto('https://academybugs.com/store/dnk-yellow-shoes/');

    const cartWidgetButton = page.locator('.ec_cart_widget_button');

    // Крок 2: Наводимо курсор на контейнер кошика
    await cartWidgetButton.hover();

    // Крок 3: CHECKOUT повинен стати видимим, після чого клікаємо на нього
    const checkoutButton = page.locator('.ec_cart_widget_minicart_checkout_button');
    await checkoutButton.waitFor({ state: 'visible', timeout: 5000 });
    await checkoutButton.click();

    // Крок 4: Видаляємо всі товари по одному
    let deleteButtons = page.locator('.ec_cartitem_delete');
    while (await deleteButtons.count() > 0) {
      await deleteButtons.first().click();
      await deleteButtons.first().waitFor({ state: 'detached' });
      deleteButtons = page.locator('.ec_cartitem_delete');
    }

    // Крок 5: Знаходимо кнопку
    const returnToStoreBtn = page.locator('a.ec_cart_empty_button.academy-bug');

    // Крок 6: Чекаємо появи кнопки
    await returnToStoreBtn.waitFor({ state: 'visible', timeout: 15000 });

    // Крок 7: Очищаємо текст кнопки від зайвих пробілів перетворивши декілька послідовних пробілів в один та порівнюємо з очікуваним значенням
    const buttonText = (await returnToStoreBtn.textContent()).replace(/\s+/g, ' ').trim();
    expect(buttonText).toBe('RETURN TO STORE');

    // Крок 8: Перевіряємо, що кнопка видима
    await expect(returnToStoreBtn).toBeVisible();
  },{ timeout: 60000 });


  // ТЕСТ #5: ПЕРЕВІРКА НЕДОСТУПНОСТІ КНОПОК ПРИ ЗМІНІ ВАЛЮТИ
  test('Перевірка недоступності кнопок при зміні валюти', async ({ page }) => {
    // Крок 1: Відкриваємо сторінку товару
    await page.goto('https://academybugs.com/store/dnk-yellow-shoes/');

    // Крок 2: Знаходимо кнопку ADD TO CART
    const addToCartBtn = page.locator('input[type="submit"][value="ADD TO CART"]');

   // Крок 3: Знаходимо кнопку + для збільшення кількості товару
    const countBtn = page.locator('input[type="button"][value="+"]');

    // Крок 4: Вибираємо валюту (наприклад EUR)
    const currencySelect = page.locator('#ec_currency_conversion');
    await currencySelect.selectOption('EUR');

    // Крок 5: Перевіряємо, що кнопки **недоступні** протягом 5 секунд
    await expect(addToCartBtn).toBeDisabled({ timeout: 5000 });
    await expect(countBtn).toBeDisabled({ timeout: 5000 });
  });
});
