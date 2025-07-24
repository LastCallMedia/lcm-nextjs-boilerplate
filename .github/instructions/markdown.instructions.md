---
applyTo: "*.md"
---

# Copilot Markdown Documentation Instructions

## Purpose

Help Copilot write documentation that is easy for newcomers to read. Use clear language and short sentences.

## How to Write

- **Use Simple Words:**  
  Avoid complex terms. Explain any technical words.

- **Short Sentences:**  
  Break information into small, easy steps.

- **Explain What and Why:**  
  Tell what the code does and why it is useful.

- **Show Examples:**  
  Add code samples to help understanding.

- **List Inputs and Outputs:**  
  For functions, describe the parameters and what is returned.

- **Use Headings and Lists:**  
  Organize content with section titles and bullet points.

- **Highlight Notes:**  
  Use "Note:" for important tips.

## Example

```markdown
## getUser Function

Gets a user by their ID.

- **id:** The user's unique ID.
- **Returns:** The user object, or null if not found.


**Example:**
```typescript
const user = getUser("abc123");
```
```