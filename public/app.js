document.addEventListener('DOMContentLoaded', () => {
  const chatMessages = document.getElementById('chat-messages');
  const queryForm = document.getElementById('query-form');
  const queryInput = document.getElementById('query-input');
  const submitBtn = document.getElementById('submit-btn');

  // Function to add a message to the chat
  function addMessage(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    // Process the content based on message type
    if (type === 'ai') {
      // Process the AI response to format it nicely
      processAIResponse(content, messageContent);
    } else {
      // For user messages, just add the text
      const paragraph = document.createElement('p');
      paragraph.textContent = content;
      messageContent.appendChild(paragraph);
    }
    
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to the bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Function to process and format AI responses
  function processAIResponse(content, container) {
    // Split the response by line breaks to process each part
    const lines = content.split('\n');
    let currentParagraph = document.createElement('p');
    
    lines.forEach(line => {
      // Check if line is an Arabic Quranic verse (simplified detection)
      if (/[\u0600-\u06FF]/.test(line) && line.trim().length > 10) {
        // If we have content in the current paragraph, add it first
        if (currentParagraph.textContent.trim()) {
          container.appendChild(currentParagraph);
          currentParagraph = document.createElement('p');
        }
        
        // Create Arabic text block
        const arabicBlock = document.createElement('div');
        arabicBlock.className = 'arabic-text';
        arabicBlock.textContent = line;
        container.appendChild(arabicBlock);
      }
      // Check if line is a source reference
      else if (line.includes('Source:') || line.includes('Reference:') || 
               line.includes('Quran') || line.includes('Hadith') ||
               line.includes('Surah')) {
        // If we have content in the current paragraph, add it first
        if (currentParagraph.textContent.trim()) {
          container.appendChild(currentParagraph);
          currentParagraph = document.createElement('p');
        }
        
        // Create source reference block
        const sourceRef = document.createElement('div');
        sourceRef.className = 'source-reference';
        sourceRef.textContent = line;
        container.appendChild(sourceRef);
      }
      // Regular text line
      else if (line.trim()) {
        currentParagraph.textContent += (currentParagraph.textContent ? '\n' : '') + line;
      }
      // Empty line - create a new paragraph
      else if (currentParagraph.textContent.trim()) {
        container.appendChild(currentParagraph);
        currentParagraph = document.createElement('p');
      }
    });
    
    // Add any remaining paragraph content
    if (currentParagraph.textContent.trim()) {
      container.appendChild(currentParagraph);
    }
  }

  // Function to show loading indicator
  function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message ai loading';
    loadingDiv.id = 'loading-indicator';
    
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('span');
      loadingDiv.appendChild(dot);
    }
    
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Function to hide loading indicator
  function hideLoading() {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
      loadingIndicator.remove();
    }
  }

  // Function to handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    
    const query = queryInput.value.trim();
    if (!query) return;
    
    // Add user message to chat
    addMessage(query, 'user');
    
    // Clear input field
    queryInput.value = '';
    
    // Show loading indicator
    showLoading();
    
    try {
      // Send query to API
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      
      // Hide loading indicator
      hideLoading();
      
      // Add AI response to chat
      addMessage(data.response, 'ai');
    } catch (error) {
      console.error('Error:', error);
      
      // Hide loading indicator
      hideLoading();
      
      // Add error message
      addMessage('Sorry, I encountered an error while processing your request. Please try again later.', 'system');
    }
  }

  // Event listeners
  queryForm.addEventListener('submit', handleSubmit);
}); 