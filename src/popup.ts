/**
 * Main popup script for the Srcubmail Chrome extension
 * Orchestrates all components and manages the extension's main functionality
 */

import { ChromeService } from './services/chromeService';
import { EmailList } from './components/EmailList';
import { ScrapeButton } from './components/ScrapeButton';
import { copyEmailsToClipboard } from './utils/clipboardUtils';
import { ChromeMessage } from './types';

/**
 * Main popup application class
 */
class PopupApp {
  private emailList!: EmailList;
  private scrapeButton!: ScrapeButton;
  private clipboardButton!: HTMLElement;
  private messageElement!: HTMLElement;
  private removeMessageListener: (() => void) | null = null;

  constructor() {
    this.initializeComponents();
    this.setupEventListeners();
    this.setupMessageListener();
  }

  /**
   * Initializes all UI components
   */
  private initializeComponents(): void {
    try {
      // Initialize email list component
      this.emailList = new EmailList('email-list', 'message-text');

      // Initialize scrape button component
      this.scrapeButton = new ScrapeButton('scrape-emails', 'clipboard-btn');

      // Get references to other elements
      this.clipboardButton = document.getElementById('clipboard-btn')!;
      this.messageElement = document.getElementById('message-text')!;

      // Set initial state
      this.clipboardButton.style.display = 'none';
      this.messageElement.style.display = 'none';
    } catch (error) {
      console.error('Error initializing components:', error);
      this.showErrorMessage('Failed to initialize extension. Please reload.');
    }
  }

  /**
   * Sets up event listeners for user interactions
   */
  private setupEventListeners(): void {
    try {
      // Clipboard button click handler
      this.clipboardButton.addEventListener('click', () => this.handleClipboardClick());

      // Error event listener for scraping errors
      document.addEventListener('scrapingError', (event: Event) => {
        const customEvent = event as CustomEvent;
        this.showErrorMessage(customEvent.detail.message);
      });
    } catch (error) {
      console.error('Error setting up event listeners:', error);
    }
  }

  /**
   * Sets up Chrome message listener for communication with content scripts
   */
  private setupMessageListener(): void {
    try {
      this.removeMessageListener = ChromeService.addMessageListener((message: ChromeMessage) =>
        this.handleChromeMessage(message)
      );
    } catch (error) {
      console.error('Error setting up message listener:', error);
    }
  }

  /**
   * Handles incoming Chrome messages from content scripts
   * @param message - The message received from Chrome
   */
  private handleChromeMessage(message: ChromeMessage): void {
    try {
      if (!message || !Array.isArray(message.emails)) {
        console.warn('Invalid message format received:', message);
        return;
      }

      const emails = message.emails;

      // Update the email list display
      this.emailList.updateEmails(emails);

      // Show/hide clipboard button based on results
      if (emails.length > 0) {
        this.scrapeButton.showClipboardButton();
      } else {
        this.scrapeButton.hideClipboardButton();
      }
    } catch (error) {
      console.error('Error handling Chrome message:', error);
      this.showErrorMessage('Error processing scraped emails');
    }
  }

  /**
   * Handles clipboard button click to copy all emails
   */
  private async handleClipboardClick(): Promise<void> {
    try {
      const emails = this.emailList.getEmails();

      if (emails.length === 0) {
        this.showErrorMessage('No emails to copy');
        return;
      }

      // Show loading state
      this.clipboardButton.classList.add('copying');
      this.clipboardButton.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';

      // Copy emails to clipboard
      const result = await copyEmailsToClipboard(emails, {
        separator: ', ',
        includeHeaders: true,
      });

      // Show result message
      if (result.success) {
        this.showSuccessMessage(result.message);
      } else {
        this.showErrorMessage(result.message);
      }
    } catch (error) {
      console.error('Error handling clipboard click:', error);
      this.showErrorMessage('Failed to copy emails to clipboard');
    } finally {
      // Reset clipboard button state
      this.clipboardButton.classList.remove('copying');
      this.clipboardButton.innerHTML = '<i class="fa fa-clipboard"></i>';
    }
  }

  /**
   * Shows a success message to the user
   * @param message - Success message text
   */
  private showSuccessMessage(message: string): void {
    try {
      this.messageElement.textContent = message;
      this.messageElement.style.display = 'block';
      this.messageElement.className = 'message success';

      // Auto-hide after 3 seconds
      setTimeout(() => {
        this.messageElement.style.display = 'none';
        this.messageElement.className = '';
      }, 3000);
    } catch (error) {
      console.error('Error showing success message:', error);
    }
  }

  /**
   * Shows an error message to the user
   * @param message - Error message text
   */
  private showErrorMessage(message: string): void {
    try {
      this.messageElement.textContent = message;
      this.messageElement.style.display = 'block';
      this.messageElement.className = 'message error';

      // Auto-hide after 5 seconds
      setTimeout(() => {
        this.messageElement.style.display = 'none';
        this.messageElement.className = '';
      }, 5000);
    } catch (error) {
      console.error('Error showing error message:', error);
    }
  }

  /**
   * Cleans up resources when the popup is closed
   */
  public cleanup(): void {
    try {
      if (this.removeMessageListener) {
        this.removeMessageListener();
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}

/**
 * Initialize the popup application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  try {
    const app = new PopupApp();

    // Cleanup when popup is unloaded
    window.addEventListener('beforeunload', () => {
      app.cleanup();
    });
  } catch (error) {
    console.error('Error initializing popup app:', error);

    // Show error message to user
    const messageElement = document.getElementById('message-text');
    if (messageElement) {
      messageElement.textContent = 'Failed to initialize extension. Please reload.';
      messageElement.style.display = 'block';
      messageElement.className = 'message error';
    }
  }
});

// Export for potential testing
export { PopupApp };
