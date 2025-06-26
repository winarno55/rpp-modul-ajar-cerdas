
// Helper to escape HTML special characters
function escapeHtml(text: string): string {
    return text.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/"/g, '&quot;')
               .replace(/'/g, '&#039;');
}

// Helper to convert inline markdown (bold, italic) to HTML spans
function parseInlineMarkdownToHtmlSpans(text: string): string {
    let html = escapeHtml(text); // Escape HTML first

    // Regex for bold and italic:
    // \*\*(.*?)\*\* matches **bold text** (non-greedy)
    // \*(.*?)\* matches *italic text* (non-greedy)
    // Using lookarounds to avoid matching mid-word asterisks or asterisks adjacent to punctuation if they are part of it.
    // (?<!\w) means "not preceded by a word character"
    // (?!\s) means "not followed by whitespace" (for opening)
    // (?<!\s) means "not preceded by whitespace" (for closing)
    // (?!\w) means "not followed by a word character"
    html = html.replace(/(?<!\w)\*\*(?!\s)(.+?)(?<!\s)\*\*(?!\w)/g, '<strong>$1</strong>');
    html = html.replace(/(?<!\w)\*(?!\s)(.+?)(?<!\s)\*(?!\w)/g, '<em>$1</em>');
    
    // Simpler fallbacks if the above are too restrictive or for more common markdown variations
    // Ensure these don't double-wrap by checking if <strong> or <em> is already there (unlikely due to escaping)
    html = html.replace(/\*\*(.*?)\*\*/g, (match, p1) => {
        // A basic check to avoid double-encoding if somehow already processed (though escapeHtml should prevent this)
        if (p1.includes('<strong>') || p1.includes('&lt;strong&gt;')) return match;
        return `<strong>${p1}</strong>`;
    });
    html = html.replace(/\*(.*?)\*/g, (match, p1) => {
        if (p1.includes('<em>') || p1.includes('&lt;em&gt;')) return match;
        return `<em>${p1}</em>`;
    });
    
    return html;
}


// Function to convert a single Markdown table block to an HTML table string
function parseSingleMarkdownTableToHtml(tableMarkdown: string): string {
    const lines = tableMarkdown.split('\n').map(l => l.trim()).filter(line => line.startsWith('|') && line.endsWith('|'));
    if (lines.length === 0) return `<p>${parseInlineMarkdownToHtmlSpans(tableMarkdown)}</p>`; // Not a table

    let html = '<table>\n'; 

    const headerLine = lines.shift();
    let hasHeader = false;
    if (headerLine) {
        const headerCellsContent = headerLine.split('|').slice(1, -1).map(s => s.trim());
        // Check if next line is a separator, or if this is the only line and has content
        const isNextLineSeparator = lines.length > 0 && lines[0].match(/^\|\s*:?---+\s*:?(\s*\|\s*:?---+\s*:?)*\s*\|$/);
        
        if (isNextLineSeparator || (headerCellsContent.some(c => c.length > 0) && lines.length === 0) ) {
            html += '<thead>\n<tr>\n';
            headerCellsContent.forEach(cell => {
                html += `<th>${parseInlineMarkdownToHtmlSpans(cell)}</th>\n`; 
            });
            html += '</tr>\n</thead>\n';
            hasHeader = true;
        } else {
            // Not a header, put it back to be processed as a body row
            lines.unshift(headerLine);
        }
    }
    
    // Remove separator line if present
    if (lines.length > 0 && lines[0].match(/^\|\s*:?---+\s*:?(\s*\|\s*:?---+\s*:?)*\s*\|$/)) {
        lines.shift(); 
        if (!hasHeader && lines.length === 0) return `<p>${parseInlineMarkdownToHtmlSpans(tableMarkdown)}</p>`; // Separator without header or body
    } else if (hasHeader && lines.length === 0) {
        // Header only table
        html += '<tbody></tbody>\n</table>\n';
        return html;
    } else if (!hasHeader && lines.length > 0) {
        // No clear header and no separator, likely not a well-formed markdown table according to common conventions.
        // Or, it's a table without a formal header row. Treat all as body.
    } else if (!hasHeader && lines.length === 0 && !headerLine) { // Empty input
        return '';
    } else if (!hasHeader && lines.length === 0 && headerLine && !headerLine.split('|').slice(1,-1).join("").trim()){ // only | | |
        return '';
    }


    html += '<tbody>\n';
    let rowCount = 0;
    lines.forEach(line => {
        const bodyCellsContent = line.split('|').slice(1, -1);
        if (bodyCellsContent.join("").trim() === "") return; // Skip empty rows like | | |

        html += '<tr>\n';
        bodyCellsContent.forEach(cell => {
            html += `<td>${parseInlineMarkdownToHtmlSpans(cell.trim())}</td>\n`; 
        });
        html += '</tr>\n';
        rowCount++;
    });

    html += '</tbody>\n</table>\n';
    
    // If no header was formally identified AND no body rows were actually produced, it's not a table.
    if (!hasHeader && rowCount === 0) {
       return tableMarkdown.split('\n').map(line => `<p>${parseInlineMarkdownToHtmlSpans(line)}</p>`).join('\n');
    }
    return html;
}

export function cleanMarkdownContent(markdown: string): string {
    let lines = markdown.split('\n');
    let startIndex = 0;

    const judulMarker = "[JUDUL RPP/MODUL AJAR:";
    const sectionAMarker = "A. INFORMASI UMUM";
    const unwantedPreamblePhrases = [
        "Tentu, sebagai ahli", 
        "Tentu, berikut adalah", 
        "Tentu, Bapak/Ibu Guru", // Catches variations including the user's example
        "Berikut adalah drafnya:",
        "Berikut adalah rancangan RPP/Modul Ajar",
        "Berikut rancangan Modul Ajar",
        "saya tidak perlu itu",
        "langsung saja pada RPP/MODUL AJAR",
        "---" 
    ];
    const genericRppHeaderRegex = /^RPP\/MODUL AJAR\s*.*?:?\s*$/i;

    let judulLineIndex = -1;
    let sectionALineIndex = -1;

    for (let i = 0; i < lines.length; i++) {
        const currentLineTrimmed = lines[i].trim();
        if (currentLineTrimmed.includes(judulMarker)) {
            judulLineIndex = i;
            break; 
        }
        if (sectionALineIndex === -1 && currentLineTrimmed.startsWith(sectionAMarker)) {
            sectionALineIndex = i;
        }
    }
    
    if (judulLineIndex !== -1) {
        startIndex = judulLineIndex;
    } else if (sectionALineIndex !== -1) {
        let potentialTitleIndex = -1;
        for (let i = sectionALineIndex - 1; i >= 0; i--) {
            const lineToCheck = lines[i].trim();
            if (lineToCheck.length === 0) continue; 

            const isUnwanted = unwantedPreamblePhrases.some(phrase => lineToCheck.toLowerCase().includes(phrase.toLowerCase())) || 
                               genericRppHeaderRegex.test(lineToCheck);
            
            if (!isUnwanted) {
                potentialTitleIndex = i; 
                break;
            } else if (genericRppHeaderRegex.test(lineToCheck) || lineToCheck.toLowerCase().includes("langsung saja pada")) {
                break;
            }
        }
        startIndex = (potentialTitleIndex !== -1) ? potentialTitleIndex : sectionALineIndex;
    } else {
        for (let i = 0; i < lines.length; i++) {
            const currentLineTrimmed = lines[i].trim();
            if (currentLineTrimmed.length === 0) {
                startIndex = i + 1; 
                continue;
            }
            const isUnwanted = unwantedPreamblePhrases.some(phrase => currentLineTrimmed.toLowerCase().includes(phrase.toLowerCase())) ||
                               genericRppHeaderRegex.test(currentLineTrimmed);
            if (!isUnwanted) {
                startIndex = i;
                break;
            } else {
                startIndex = i + 1; 
            }
        }
    }
    
    if (startIndex >= lines.length) {
      return "<p>Tidak ada konten RPP yang dapat ditampilkan. Respons AI mungkin hanya berisi pendahuluan.</p>";
    }

    const finalLinesToParse = lines.slice(startIndex);
    if (finalLinesToParse.length === 0 || finalLinesToParse.every(line => line.trim() === "")) {
         return "<p>Tidak ada konten RPP yang dapat ditampilkan setelah pembersihan pendahuluan.</p>";
    }
    return finalLinesToParse.join('\n');
}


// Main function to convert Markdown text to an HTML string
export function markdownToHtml(markdown: string): string {
    const cleanedMarkdown = cleanMarkdownContent(markdown);
    if (cleanedMarkdown.startsWith("<p>")) { // If cleaning returned an error message
        return cleanedMarkdown;
    }

    let lines = cleanedMarkdown.split('\n');
    let htmlOutput = '';
    let inListType: 'ul' | 'ol' | null = null;
    let listLevel = 0; 
    let tableLinesBuffer: string[] = [];

    function closeOpenList(targetLevel = -1) { 
        while (inListType && listLevel >= targetLevel) {
            htmlOutput += (inListType === 'ul' ? '</ul>\n' : '</ol>\n');
            listLevel--;
            if (listLevel < 0) {
              inListType = null;
              listLevel = 0; 
            }
        }
        if (targetLevel === -1) { 
          inListType = null;
          listLevel = 0;
        }
    }

    function flushTableBuffer() {
        if (tableLinesBuffer.length > 0) {
            htmlOutput += parseSingleMarkdownTableToHtml(tableLinesBuffer.join('\n'));
            tableLinesBuffer = [];
        }
    }

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]; 

        if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
            closeOpenList(); 
            tableLinesBuffer.push(line);
            if (i === lines.length - 1) flushTableBuffer(); 
            continue;
        } else if (tableLinesBuffer.length > 0) {
            flushTableBuffer();
        }

        const headingMatch = line.trim().match(/^(#{1,6})\s+(.*)/);
        if (headingMatch) {
            closeOpenList();
            const level = headingMatch[1].length;
            const content = parseInlineMarkdownToHtmlSpans(headingMatch[2].trim());
            htmlOutput += `<h${level}>${content}</h${level}>\n`;
            continue;
        }
        
        const listItemMatch = line.match(/^(\s*)([\*\-\+]|\d+\.)\s+(.*)/);
        if (listItemMatch) {
            const indentSpace = listItemMatch[1].length;
            const marker = listItemMatch[2];
            const content = listItemMatch[3].trim();
            const currentLevel = Math.max(0, Math.floor(indentSpace / 2)); // Ensure non-negative level

            const newListType = marker.match(/\d+\./) ? 'ol' : 'ul';

            if (currentLevel < listLevel || (currentLevel === listLevel && inListType !== newListType && inListType)) {
                 closeOpenList(currentLevel);
            }
            
            if (!inListType || currentLevel > listLevel || (inListType !== newListType)) {
                htmlOutput += newListType === 'ul' ? '<ul>\n' : '<ol>\n';
                inListType = newListType;
                listLevel = currentLevel;
            }
            
            htmlOutput += `  <li>${parseInlineMarkdownToHtmlSpans(content)}</li>\n`;
            continue;
        }

        closeOpenList();

        if (line.trim().length > 0) {
            htmlOutput += `<p>${parseInlineMarkdownToHtmlSpans(line.trim())}</p>\n`;
        } else {
             if (htmlOutput.length > 0 && !htmlOutput.endsWith('<br />\n') && !htmlOutput.endsWith('</ol>\n') && !htmlOutput.endsWith('</ul>\n') && !htmlOutput.endsWith('</table>\n') && !htmlOutput.match(/<\/h[1-6]>\n$/) ) {
                 htmlOutput += '<br />\n';
             }
        }
    }
    closeOpenList(); 
    flushTableBuffer(); 

    return htmlOutput;
}

// Function to convert Markdown to Plain Text
export function markdownToPlainText(rawMarkdown: string): string {
    const cleanedMarkdown = cleanMarkdownContent(rawMarkdown);
    if (cleanedMarkdown.startsWith("<p>Tidak ada konten")) { // Error from cleanMarkdownContent
        return cleanedMarkdown.replace(/<p>/g, '').replace(/<\/p>/g, ''); // Return plain error message
    }

    let text = cleanedMarkdown;

    // Remove HTML tags that might be generated by error messages or simple structures
    text = text.replace(/<[^>]+>/g, ''); 

    // Process tables: remove separator lines and convert cell separators to spaces
    const lines = text.split('\n');
    const processedLines = lines.map(line => {
        const trimmedLine = line.trim();
        // Check for table separator line (e.g., |---|---| or |:---|:---|)
        if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|') && trimmedLine.match(/^\|\s*[:\-\s|]+\s*\|$/)) {
            return ''; // Remove separator line
        }
        // For other table lines, remove leading/trailing pipes and replace inner pipes with spaces
        if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
            return trimmedLine.slice(1, -1).replace(/\|/g, '  ').trim();
        }
        return line;
    }).filter(line => line !== null); // Remove null lines if any intermediate step produced them

    text = processedLines.join('\n');

    // Headings: remove '#'
    text = text.replace(/^#{1,6}\s+/gm, '');

    // Bold and Italic: remove '**' and '*'
    text = text.replace(/\*\*(.*?)\*\*/g, '$1');
    text = text.replace(/\*(.*?)\*/g, '$1');
    
    // Strikethrough (if used)
    text = text.replace(/~~(.*?)~~/g, '$1');

    // Blockquotes: remove '>'
    text = text.replace(/^>\s+/gm, '');

    // List items: remove '  *', '- ', '1. ' etc.
    text = text.replace(/^\s*([\*\-\+]|\d+\.)\s+/gm, '');

    // Horizontal rules
    text = text.replace(/^\s*(\*\*\*|---|___)\s*$/gm, '');
    
    // Links: extract text part [text](url) -> text
    text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
    // Images: extract alt text ![alt](url) -> alt
    text = text.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '$1');

    // Remove potential markdown code blocks (```) or inline code (`)
    text = text.replace(/```[\s\S]*?```/g, '');
    text = text.replace(/`([^`]+)`/g, '$1');

    // Normalize multiple newlines to a maximum of two (one blank line)
    text = text.replace(/\n{3,}/g, '\n\n');

    // Trim leading/trailing whitespace from the whole text
    text = text.trim();

    return text;
}
