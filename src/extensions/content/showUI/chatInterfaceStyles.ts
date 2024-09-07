export const containerStyle = `
  position: fixed !important;
  bottom: 20px !important;
  right: 20px !important;
  z-index: 2147483647 !important;
  width: 350px !important;
  height: 400px !important; 
  background-color: white !important;
  border-radius: 8px !important;
  overflow: hidden !important;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
`;

export const chatInterfaceStyles = `
  #ai-chat-interface-container,
  #ai-chat-interface-container * {
    all: revert;
    box-sizing: border-box !important;
  }
  #ai-chat-interface-container {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif !important;
    font-size: 14px !important;
    line-height: 1.5 !important;
    color: #333 !important;
  }
  #ai-chat-interface-container h2 {
    font-size: 18px !important;
    font-weight: 600 !important;
    margin: 0 !important;
    padding: 15px !important;
    border-bottom: 1px solid #eee !important;
  }
  #ai-chat-interface-container .messages-container {
    height: calc(100% - 120px) !important;
    overflow-y: auto !important;
    padding: 15px !important;
  }
  #ai-chat-interface-container .message {
    max-width: 80% !important;
    padding: 10px 15px !important;
    border-radius: 18px !important;
    margin-bottom: 10px !important;
    word-wrap: break-word !important;
    display: inline-block !important;
  }
  #ai-chat-interface-container .message-container {
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-start !important;
  }
  #ai-chat-interface-container .message-container.user {
    align-items: flex-end !important;
  }
  #ai-chat-interface-container .message.user {
    background-color: #007bff !important;
    color: white !important;
  }
  #ai-chat-interface-container .message.ai {
    background-color: #f0f0f0 !important;
    color: black !important;
  }
  #ai-chat-interface-container .input-container {
    padding: 15px !important;
    border-top: 1px solid #eee !important;
  }
  #ai-chat-interface-container input {
    width: calc(100% - 70px) !important;
    padding: 10px !important;
    border: 1px solid #ddd !important;
    border-radius: 20px !important;
    font-size: 14px !important;
  }
  #ai-chat-interface-container button {
    width: 60px !important;
    padding: 10px !important;
    background-color: #007bff !important;
    color: white !important;
    border: none !important;
    border-radius: 20px !important;
    font-size: 14px !important;
    cursor: pointer !important;
  }
`;