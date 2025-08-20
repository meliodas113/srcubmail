/**
 * Utility functions for clipboard operations
 */

import { ClipboardOptions } from '../types';

/**
 * Default clipboard configuration
 */
export const DEFAULT_CLIPBOARD_OPTIONS: ClipboardOptions = {
  separator: ',',
  includeHeaders: false,
};

/**
 * Copies text to clipboard using modern Clipboard API with fallback
 * @param text - Text to copy to clipboard
 * @returns Promise resolving to boolean indicating success
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid text provided for clipboard');
    }

    // Try modern Clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback to execCommand for older browsers
    return copyToClipboardFallback(text);
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
}

/**
 * Fallback clipboard method using execCommand
 * @param text - Text to copy to clipboard
 * @returns boolean indicating success
 */
function copyToClipboardFallback(text: string): boolean {
  try {
    const textArea = document.createElement('textarea');

    // Configure textarea for copying
    textArea.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 2em;
      height: 2em;
      padding: 0;
      border: none;
      outline: none;
      boxShadow: none;
      background: transparent;
      opacity: 0;
      z-index: -1;
    `;

    textArea.value = text;
    document.body.appendChild(textArea);

    // Select and copy
    textArea.focus();
    textArea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    return successful;
  } catch (error) {
    console.error('Fallback clipboard copy failed:', error);
    return false;
  }
}

/**
 * Formats emails for clipboard with custom options
 * @param emails - Array of email strings
 * @param options - Clipboard formatting options
 * @returns Formatted string ready for clipboard
 */
export function formatEmailsForClipboard(
  emails: string[],
  options: Partial<ClipboardOptions> = {}
): string {
  if (!Array.isArray(emails) || emails.length === 0) {
    return '';
  }

  const config = { ...DEFAULT_CLIPBOARD_OPTIONS, ...options };
  const uniqueEmails = [...new Set(emails)];

  let result = '';

  if (config.includeHeaders) {
    result += `Emails found (${uniqueEmails.length}):\n`;
  }

  result += uniqueEmails.join(config.separator);

  return result;
}

/**
 * Attempts to copy emails to clipboard with user feedback
 * @param emails - Array of email strings
 * @param options - Clipboard options
 * @returns Promise resolving to success status and message
 */
export async function copyEmailsToClipboard(
  emails: string[],
  options: Partial<ClipboardOptions> = {}
): Promise<{ success: boolean; message: string }> {
  try {
    if (!Array.isArray(emails) || emails.length === 0) {
      return {
        success: false,
        message: 'No emails to copy',
      };
    }

    const formattedText = formatEmailsForClipboard(emails, options);
    const success = await copyToClipboard(formattedText);

    if (success) {
      const count = emails.length;
      return {
        success: true,
        message: `${count} email${count === 1 ? '' : 's'} copied to clipboard!`,
      };
    } else {
      return {
        success: false,
        message: 'Failed to copy to clipboard. Please try again.',
      };
    }
  } catch (error) {
    console.error('Error in copyEmailsToClipboard:', error);
    return {
      success: false,
      message: 'An error occurred while copying to clipboard.',
    };
  }
}
