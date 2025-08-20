/**
 * Service layer for Chrome extension API interactions
 */

import { ChromeMessage, EmailScrapingResult } from '../types';
import { extractEmailsFromHTML } from '../utils/emailUtils';

/**
 * Chrome extension service for managing tabs and messaging
 */
export class ChromeService {
  /**
   * Gets the currently active tab
   * @returns Promise resolving to the active tab
   */
  static async getActiveTab(): Promise<chrome.tabs.Tab> {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab || !tab.id) {
        throw new Error('No active tab found');
      }

      return tab;
    } catch (error) {
      console.error('Error getting active tab:', error);
      throw new Error('Failed to get active tab');
    }
  }

  /**
   * Executes a script in the active tab
   * @param func - Function to execute in the tab context
   * @returns Promise resolving to execution results
   */
  static async executeScript<T>(func: () => T): Promise<T[]> {
    try {
      const tab = await this.getActiveTab();

      if (!tab.id) {
        throw new Error('Tab ID not available');
      }

      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func,
      });

      return results.map(result => result.result as T);
    } catch (error) {
      console.error('Error executing script:', error);
      throw new Error('Failed to execute script in tab');
    }
  }

  /**
   * Sends a message to the background script
   * @param message - Message to send
   * @returns Promise resolving to the response
   */
  static async sendMessage<T>(message: ChromeMessage): Promise<T> {
    try {
      return await chrome.runtime.sendMessage(message);
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message to background script');
    }
  }

  /**
   * Sets up a message listener for the extension
   * @param callback - Function to handle incoming messages
   * @returns Function to remove the listener
   */
  static addMessageListener(
    callback: (message: ChromeMessage, sender: chrome.runtime.MessageSender) => void
  ): () => void {
    const listener = (request: ChromeMessage, sender: chrome.runtime.MessageSender) => {
      try {
        callback(request, sender);
      } catch (error) {
        console.error('Error in message listener:', error);
      }
    };

    chrome.runtime.onMessage.addListener(listener);

    // Return function to remove listener
    return () => chrome.runtime.onMessage.removeListener(listener);
  }

  /**
   * Checks if the extension has necessary permissions
   * @returns Promise resolving to boolean indicating if permissions are granted
   */
  static async checkPermissions(): Promise<boolean> {
    try {
      const permissions = await chrome.permissions.getAll();
      const requiredPermissions = ['activeTab', 'scripting'];

      return requiredPermissions.every(permission =>
        permissions.permissions?.includes(permission as any)
      );
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    }
  }

  /**
   * Requests necessary permissions if not already granted
   * @returns Promise resolving to boolean indicating if permissions were granted
   */
  static async requestPermissions(): Promise<boolean> {
    try {
      const hasPermissions = await this.checkPermissions();

      if (hasPermissions) {
        return true;
      }

      const granted = await chrome.permissions.request({
        permissions: ['activeTab', 'scripting'],
      });

      return granted;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }
}

/**
 * Content script function for scraping emails from the current page
 * This function runs in the context of the web page
 * @returns Promise resolving to EmailScrapingResult
 */
export async function scrapeEmailsFromPage(): Promise<EmailScrapingResult> {
  try {
    // Get the page content
    const pageContent = document.body.innerHTML;

    // Extract emails using the utility function
    const result = await extractEmailsFromHTML(pageContent, {
      includeDuplicates: false,
    });

    // Send results back to the popup
    chrome.runtime.sendMessage({ emails: result.emails });

    return result;
  } catch (error) {
    console.error('Error scraping emails from page:', error);

    // Send empty result on error
    chrome.runtime.sendMessage({ emails: [] });

    return { emails: [] };
  }
}
