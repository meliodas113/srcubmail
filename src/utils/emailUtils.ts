/**
 * Utility functions for email processing and validation
 */

import { EmailScrapingResult, ScrapingOptions } from '../types';

/**
 * Regular expression for matching email addresses
 * Supports international domains and various email formats
 */
export const EMAIL_REGEX = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi;

/**
 * Enhanced email regex with stricter validation
 */
export const STRICT_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Extracts emails from HTML content using regex matching
 * @param htmlContent - The HTML content to search for emails
 * @param options - Scraping configuration options
 * @returns Promise resolving to EmailScrapingResult
 */
export async function extractEmailsFromHTML(
  htmlContent: string,
  options: ScrapingOptions = { includeDuplicates: false }
): Promise<EmailScrapingResult> {
  try {
    if (!htmlContent || typeof htmlContent !== 'string') {
      throw new Error('Invalid HTML content provided');
    }

    const matches = htmlContent.match(EMAIL_REGEX);
    let emails: string[] = [];

    if (matches) {
      // Clean and validate emails
      emails = matches
        .map((email) => email.trim().toLowerCase())
        .filter((email) => STRICT_EMAIL_REGEX.test(email));

      // Remove duplicates if requested
      if (!options.includeDuplicates) {
        emails = [...new Set(emails)];
      }

      // Apply custom filter if provided
      if (options.filterPattern) {
        emails = emails.filter((email) => options.filterPattern!.test(email));
      }
    }

    return { emails };
  } catch (error) {
    console.error('Error extracting emails:', error);
    return { emails: [] };
  }
}

/**
 * Validates if a string is a valid email address
 * @param email - Email string to validate
 * @returns boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }
  return STRICT_EMAIL_REGEX.test(email.trim());
}

/**
 * Removes duplicate emails while preserving order
 * @param emails - Array of email strings
 * @returns Array with duplicates removed
 */
export function removeDuplicateEmails(emails: string[]): string[] {
  if (!Array.isArray(emails)) {
    return [];
  }
  
  const seen = new Set<string>();
  return emails.filter((email) => {
    const normalized = email.toLowerCase().trim();
    if (seen.has(normalized)) {
      return false;
    }
    seen.add(normalized);
    return true;
  });
}

/**
 * Formats emails for display with optional metadata
 * @param emails - Array of email strings
 * @param includeCount - Whether to include count in result
 * @returns Formatted string representation
 */
export function formatEmailsForDisplay(
  emails: string[],
  includeCount: boolean = true
): string {
  if (!Array.isArray(emails) || emails.length === 0) {
    return 'No emails found';
  }

  const uniqueEmails = removeDuplicateEmails(emails);
  const count = uniqueEmails.length;
  
  if (includeCount) {
    return `${count} email${count === 1 ? '' : 's'} found:\n${uniqueEmails.join('\n')}`;
  }
  
  return uniqueEmails.join('\n');
}
