/**
 * Type definitions for the Srcubmail Chrome extension
 */

export interface EmailScrapingResult {
  emails: string[];
}

export interface ChromeMessage {
  emails: string[];
}

export interface EmailListItem {
  email: string;
  isUnique: boolean;
}

export interface ScrapingOptions {
  includeDuplicates: boolean;
  filterPattern?: RegExp;
}

export interface ClipboardOptions {
  separator: string;
  includeHeaders: boolean;
}

export interface ExtensionConfig {
  name: string;
  version: string;
  description: string;
  author: string;
  permissions: string[];
}
