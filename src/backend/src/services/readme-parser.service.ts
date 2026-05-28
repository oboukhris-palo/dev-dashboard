/** Maximum characters for a repository description */
const MAX_DESCRIPTION_LENGTH = 200;

/** ATX-style header regex (lines starting with one or more #) */
const HEADER_PATTERN = /^#{1,6}\s+/;

/**
 * README Parser Service
 *
 * Responsible for extracting and cleaning human-readable descriptions
 * from raw README.md file content.
 *
 * @epic REPO-001 - Repository Discovery & Scanning
 * @story REPO-001-US-002 - Extract Repository Metadata
 * @layer Layer 2 - Core Services
 */
export class ReadmeParserService {

  /**
   * Full pipeline: extract first paragraph and strip markdown.
   * Returns empty string when content is absent.
   *
   * @param content - Raw README.md text
   * @returns Plain-text description truncated to 200 characters
   */
  parseDescription(content: string): string {
    if (!content) return '';

    const paragraph = this.extractFirstParagraph(content);
    if (!paragraph) return '';

    const plain = this.stripMarkdown(paragraph);
    return plain.length > MAX_DESCRIPTION_LENGTH
      ? plain.substring(0, MAX_DESCRIPTION_LENGTH)
      : plain;
  }

  /**
   * Extract the first non-header, non-empty paragraph block from markdown.
   *
   * Algorithm:
   *  1. Split text by blank lines (double newline or more)
   *  2. Skip blocks that are purely ATX headers (# …)
   *  3. Return the first remaining block with content
   *
   * @param content - Raw markdown text
   * @returns First paragraph text or empty string
   */
  extractFirstParagraph(content: string): string {
    if (!content) return '';

    const blocks = content.split(/\n{2,}/);

    for (const block of blocks) {
      const trimmed = block.trim();
      if (!trimmed) continue;

      // Check every line in the block — skip blocks that are all headers
      const lines = trimmed.split('\n');
      const nonHeaderLines = lines.filter(line => !HEADER_PATTERN.test(line.trim()) && line.trim().length > 0);

      if (nonHeaderLines.length > 0) {
        return nonHeaderLines.join(' ');
      }
    }

    return '';
  }

  /**
   * Strip common markdown formatting from a text string, returning plain text.
   *
   * Supported patterns:
   *  - **bold** and __bold__ → bold
   *  - *italic* and _italic_ → italic
   *  - `inline code` → inline code
   *  - [link text](url) → link text
   *  - # ATX headers → header text
   *
   * @param text - Markdown-formatted string
   * @returns Plain text with formatting removed
   */
  stripMarkdown(text: string): string {
    if (!text) return '';

    return text
      // Remove ATX headers (# ## ### …)
      .replace(/^#{1,6}\s+/gm, '')
      // Bold (**text** or __text__)
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/__(.+?)__/g, '$1')
      // Italic (*text* or _text_)
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/_(.+?)_/g, '$1')
      // Inline code (`code`)
      .replace(/`(.+?)`/g, '$1')
      // Links [text](url)
      .replace(/\[(.+?)\]\(.+?\)/g, '$1')
      .trim();
  }
}
