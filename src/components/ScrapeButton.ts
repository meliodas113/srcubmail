/**
 * Component for managing the scrape button functionality
 */

import { ChromeService } from '../services/chromeService';
import { scrapeEmailsFromPage } from '../services/chromeService';

/**
 * Scrape button component for initiating email scraping
 */
export class ScrapeButton {
  private readonly buttonElement: HTMLButtonElement;
  private readonly clipboardButton: HTMLElement;
  private isScraping: boolean = false;

  constructor(buttonId: string, clipboardButtonId: string) {
    const buttonEl = document.getElementById(buttonId);
    const clipboardEl = document.getElementById(clipboardButtonId);

    if (!buttonEl || !(buttonEl instanceof HTMLButtonElement)) {
      throw new Error(`Scrape button element with id '${buttonId}' not found or invalid`);
    }
    if (!clipboardEl) {
      throw new Error(`Clipboard button element with id '${clipboardButtonId}' not found`);
    }

    this.buttonElement = buttonEl;
    this.clipboardButton = clipboardEl;
    this.setupEventListeners();
  }

  /**
   * Sets up event listeners for the button
   */
  private setupEventListeners(): void {
    this.buttonElement.addEventListener('click', () => this.handleScrapeClick());
  }

  /**
   * Handles the scrape button click event
   */
  private async handleScrapeClick(): Promise<void> {
    try {
      if (this.isScraping) {
        return; // Prevent multiple simultaneous scraping operations
      }

      this.setScrapingState(true);
      await this.performEmailScraping();
    } catch (error) {
      console.error('Error during email scraping:', error);
      this.handleScrapingError(error as Error);
    } finally {
      this.setScrapingState(false);
    }
  }

  /**
   * Performs the actual email scraping operation
   */
  private async performEmailScraping(): Promise<void> {
    try {
      // Check permissions first
      const hasPermissions = await ChromeService.checkPermissions();
      if (!hasPermissions) {
        const granted = await ChromeService.requestPermissions();
        if (!granted) {
          throw new Error('Required permissions not granted');
        }
      }

      // Execute the scraping script in the active tab
      await ChromeService.executeScript(scrapeEmailsFromPage);
      
      // Show success state
      this.showSuccessState();
    } catch (error) {
      console.error('Error in performEmailScraping:', error);
      throw error;
    }
  }

  /**
   * Sets the scraping state of the button
   * @param isScraping - Whether scraping is currently in progress
   */
  private setScrapingState(isScraping: boolean): void {
    this.isScraping = isScraping;
    
    if (isScraping) {
      this.buttonElement.disabled = true;
      this.buttonElement.textContent = 'Scraping...';
      this.buttonElement.classList.add('scraping');
    } else {
      this.buttonElement.disabled = false;
      this.buttonElement.textContent = 'Scrape';
      this.buttonElement.classList.remove('scraping');
    }
  }

  /**
   * Shows the success state after successful scraping
   */
  private showSuccessState(): void {
    try {
      this.buttonElement.classList.add('success');
      this.buttonElement.textContent = 'Success!';
      
      // Reset button state after a delay
      setTimeout(() => {
        this.buttonElement.classList.remove('success');
        this.buttonElement.textContent = 'Scrape';
      }, 2000);
    } catch (error) {
      console.error('Error showing success state:', error);
    }
  }

  /**
   * Handles scraping errors
   * @param error - The error that occurred
   */
  private handleScrapingError(error: Error): void {
    try {
      this.buttonElement.classList.add('error');
      this.buttonElement.textContent = 'Error!';
      
      // Show error message
      const errorEvent = new CustomEvent('scrapingError', {
        detail: { message: error.message }
      });
      document.dispatchEvent(errorEvent);
      
      // Reset button state after a delay
      setTimeout(() => {
        this.buttonElement.classList.remove('error');
        this.buttonElement.textContent = 'Scrape';
      }, 3000);
    } catch (resetError) {
      console.error('Error handling scraping error:', resetError);
    }
  }

  /**
   * Shows the clipboard button when emails are found
   */
  showClipboardButton(): void {
    try {
      this.clipboardButton.style.display = 'flex';
    } catch (error) {
      console.error('Error showing clipboard button:', error);
    }
  }

  /**
   * Hides the clipboard button
   */
  hideClipboardButton(): void {
    try {
      this.clipboardButton.style.display = 'none';
    } catch (error) {
      console.error('Error hiding clipboard button:', error);
    }
  }

  /**
   * Enables the scrape button
   */
  enable(): void {
    try {
      this.buttonElement.disabled = false;
      this.buttonElement.classList.remove('disabled');
    } catch (error) {
      console.error('Error enabling scrape button:', error);
    }
  }

  /**
   * Disables the scrape button
   */
  disable(): void {
    try {
      this.buttonElement.disabled = true;
      this.buttonElement.classList.add('disabled');
    } catch (error) {
      console.error('Error disabling scrape button:', error);
    }
  }

  /**
   * Gets the current scraping state
   * @returns boolean indicating if scraping is in progress
   */
  getScrapingState(): boolean {
    return this.isScraping;
  }

  /**
   * Sets the button text
   * @param text - Text to display on the button
   */
  setButtonText(text: string): void {
    try {
      this.buttonElement.textContent = text;
    } catch (error) {
      console.error('Error setting button text:', error);
    }
  }
}
