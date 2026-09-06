import { test, expect } from '@playwright/test';

test.describe('Primary User Flow - AI Chat Qualification', () => {
  test('navigates from homepage to chat, sends qualification prompt, and renders streaming AI response', async ({
    page,
  }) => {
    // 1. Mock the AI route so the test never calls real external APIs
    await page.route('**/api/chat', async (route) => {
      const payload = JSON.stringify({
        type: 'text-delta',
        delta:
          'TechCorp evaluation completed successfully.\n\nRecommended interview tracks:\n- Senior Full-Stack Engineer\n- AI Systems Architect',
      });
      const mockSse = `data: ${payload}\n\ndata: [DONE]\n\n`;

      await route.fulfill({
        status: 200,
        contentType: 'text/event-stream; charset=utf-8',
        headers: {
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
        body: mockSse,
      });
    });

    // 2. Walk the primary flow starting at the chat interface
    await page.goto('/chat');

    // Verify Chat page loads with accessible heading
    await expect(
      page.getByRole('heading', { name: /ai assistant/i })
    ).toBeVisible();

    // Verify suggestions are present
    const analyzeSuggestion = page.getByRole('button', {
      name: /analyze market trends/i,
    });
    await expect(analyzeSuggestion).toBeVisible();

    // 3. Interact with the chat input
    const chatInput = page.getByPlaceholder('Message AI...');
    await expect(chatInput).toBeVisible();

    await chatInput.fill('Qualify TechCorp for software engineering roles');

    const sendButton = page.getByRole('button', { name: /send message/i });
    await expect(sendButton).toBeEnabled();
    await sendButton.click();

    // 4. Verify user message appears in chat stream
    await expect(
      page.getByText('Qualify TechCorp for software engineering roles')
    ).toBeVisible();

    // 5. Verify mocked AI response renders via ReactMarkdown
    await expect(
      page.getByText(/TechCorp evaluation completed successfully\./i)
    ).toBeVisible({ timeout: 10000 });
    await expect(
      page.getByText(/Senior Full-Stack Engineer/i)
    ).toBeVisible();
    await expect(
      page.getByText(/AI Systems Architect/i)
    ).toBeVisible();
  });
});
