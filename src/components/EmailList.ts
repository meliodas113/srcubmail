/**
 * Component for managing email list display and interactions
 */

/**
 * Email list component for displaying scraped emails
 */
export class EmailList {
  private readonly listElement: HTMLElement;
  private readonly messageElement: HTMLElement;
  private emails: string[] = [];

  constructor(listId: string, messageId: string) {
    const listEl = document.getElementById(listId);
    const messageEl = document.getElementById(messageId);

    if (!listEl) {
      throw new Error(`Email list element with id '${listId}' not found`);
    }
    if (!messageEl) {
      throw new Error(`Message element with id '${messageId}' not found`);
    }

    this.listElement = listEl;
    this.messageElement = messageEl;
  }

  /**
   * Updates the email list with new data
   * @param emails - Array of email strings to display
   */
  updateEmails(emails: string[]): void {
    try {
      this.emails = emails;
      this.render();
      this.showMessage(`Found ${emails.length} email${emails.length === 1 ? '' : 's'}`);
    } catch (error) {
      console.error('Error updating email list:', error);
      this.showError('Failed to update email list');
    }
  }

  /**
   * Clears the email list
   */
  clear(): void {
    try {
      this.emails = [];
      this.listElement.innerHTML = '';
      this.hideMessage();
    } catch (error) {
      console.error('Error clearing email list:', error);
    }
  }

  /**
   * Renders the email list in the DOM
   */
  private render(): void {
    try {
      this.listElement.innerHTML = '';

      if (!this.emails || this.emails.length === 0) {
        this.renderNoEmailsMessage();
        return;
      }

      this.emails.forEach((email, index) => {
        const listItem = this.createEmailListItem(email, index);
        this.listElement.appendChild(listItem);
      });
    } catch (error) {
      console.error('Error rendering email list:', error);
      this.renderErrorMessage();
    }
  }

  /**
   * Creates a list item element for an email
   * @param email - Email string to display
   * @param index - Index of the email in the list
   * @returns HTMLLIElement for the email
   */
  private createEmailListItem(email: string, index: number): HTMLLIElement {
    const listItem = document.createElement('li');
    listItem.className = 'email-item';
    listItem.setAttribute('data-email', email);
    listItem.setAttribute('data-index', index.toString());

    // Create email text element
    const emailText = document.createElement('span');
    emailText.className = 'email-text';
    emailText.textContent = email;
    emailText.title = email;

    // Create copy button for individual email
    const copyButton = document.createElement('button');
    copyButton.className = 'email-copy-btn';
    copyButton.innerHTML = '<i class="fa fa-copy"></i>';
    copyButton.title = 'Copy this email';
    copyButton.addEventListener('click', () => this.copySingleEmail(email));

    listItem.appendChild(emailText);
    listItem.appendChild(copyButton);

    return listItem;
  }

  /**
   * Renders a message when no emails are found
   */
  private renderNoEmailsMessage(): void {
    const message = document.createElement('li');
    message.className = 'no-emails-message';
    message.textContent = 'No emails found on this page.';
    this.listElement.appendChild(message);
  }

  /**
   * Renders an error message
   */
  private renderErrorMessage(): void {
    const error = document.createElement('li');
    error.className = 'error-message';
    error.textContent = 'Error loading emails. Please try again.';
    this.listElement.appendChild(error);
  }

  /**
   * Shows a message to the user
   * @param text - Message text to display
   * @param duration - Duration to show message in milliseconds
   */
  showMessage(text: string, duration: number = 3000): void {
    try {
      this.messageElement.textContent = text;
      this.messageElement.style.display = 'block';
      this.messageElement.className = 'message success';

      if (duration > 0) {
        setTimeout(() => this.hideMessage(), duration);
      }
    } catch (error) {
      console.error('Error showing message:', error);
    }
  }

  /**
   * Shows an error message to the user
   * @param text - Error message text
   * @param duration - Duration to show message in milliseconds
   */
  showError(text: string, duration: number = 5000): void {
    try {
      this.messageElement.textContent = text;
      this.messageElement.style.display = 'block';
      this.messageElement.className = 'message error';

      if (duration > 0) {
        setTimeout(() => this.hideMessage(), duration);
      }
    } catch (error) {
      console.error('Error showing error message:', error);
    }
  }

  /**
   * Hides the message element
   */
  hideMessage(): void {
    try {
      this.messageElement.style.display = 'none';
      this.messageElement.className = '';
    } catch (error) {
      console.error('Error hiding message:', error);
    }
  }

  /**
   * Copies a single email to clipboard
   * @param email - Email string to copy
   */
  private async copySingleEmail(email: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(email);
      this.showMessage('Email copied to clipboard!', 2000);
    } catch (error) {
      console.error('Error copying single email:', error);
      this.showError('Failed to copy email', 3000);
    }
  }

  /**
   * Gets the current list of emails
   * @returns Array of email strings
   */
  getEmails(): string[] {
    return [...this.emails];
  }

  /**
   * Gets the count of emails
   * @returns Number of emails in the list
   */
  getEmailCount(): number {
    return this.emails.length;
  }

  /**
   * Checks if the list has any emails
   * @returns boolean indicating if emails exist
   */
  hasEmails(): boolean {
    return this.emails.length > 0;
  }
}
