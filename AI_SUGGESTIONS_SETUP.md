# AI-Powered Contact Form Suggestions

Your contact form now includes AI-powered suggestions! Here's how it works and how to enhance it further.

## 🤖 **Current AI Features**

### **Smart Context-Aware Suggestions:**
- **Project Context**: When you type "project", AI suggests project-related responses
- **Hiring Context**: When you type "hire", AI suggests availability and pricing responses  
- **Technical Context**: When you type "web" or "mobile", AI suggests technical capabilities
- **Collaboration Context**: When you type "collaborate", AI suggests partnership responses

### **AI Toggle Button:**
- **🤖 AI ON/OFF** button in the message field
- **Visual feedback** with orange highlighting when AI is active
- **Loading spinner** when AI is generating suggestions
- **Automatic triggering** every 10 characters when typing

## 🔧 **How to Use:**

1. **Enable AI**: Click the "🤖 AI OFF" button to turn it "🤖 AI ON"
2. **Start typing**: Write at least 15 characters in your message
3. **Watch AI work**: See "🤖 AI generating..." with a loading spinner
4. **Get smart suggestions**: AI analyzes your message and provides contextual suggestions
5. **Click to add**: Suggestions are added to your existing message

## 🚀 **Upgrade to Real AI APIs**

### **Option 1: OpenAI Integration**

Replace the `generateSmartSuggestions` function with:

```javascript
const generateSmartSuggestions = async (message: string): Promise<string[]> => {
  const response = await fetch('/api/openai-suggestions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      message,
      context: "professional contact form for a full-stack developer portfolio"
    })
  });
  
  const data = await response.json();
  return data.suggestions;
};
```

**Backend API (`/api/openai-suggestions`):**
```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  const { message, context } = req.body;
  
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are helping complete a professional contact form message for a full-stack developer. 
                 Generate 3-5 short, professional sentence completions that could naturally follow the user's message.
                 Focus on: project inquiries, collaboration, hiring, technical discussions.
                 Keep responses under 15 words each.`
      },
      {
        role: "user", 
        content: `Complete this message professionally: "${message}"`
      }
    ],
    max_tokens: 150,
    temperature: 0.7,
  });
  
  const suggestions = completion.choices[0].message.content
    .split('\n')
    .filter(s => s.trim())
    .slice(0, 5);
    
  res.json({ suggestions });
}
```

### **Option 2: Claude AI Integration**

```javascript
const generateSmartSuggestions = async (message: string): Promise<string[]> => {
  const response = await fetch('/api/claude-suggestions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  
  const data = await response.json();
  return data.suggestions;
};
```

### **Option 3: Local AI (Privacy-First)**

Use browser-based AI models:

```javascript
// Install: npm install @xenova/transformers
import { pipeline } from '@xenova/transformers';

const generateSmartSuggestions = async (message: string): Promise<string[]> => {
  const generator = await pipeline('text-generation', 'Xenova/gpt2');
  
  const results = await generator(message, {
    max_new_tokens: 20,
    num_return_sequences: 3,
    temperature: 0.7,
  });
  
  return results.map(r => r.generated_text.replace(message, '').trim());
};
```

## 📊 **Environment Variables**

Add to your `.env` file:

```env
# OpenAI
OPENAI_API_KEY=your_openai_api_key_here

# Claude (Anthropic)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Enable/disable AI features
VITE_AI_SUGGESTIONS_ENABLED=true
```

## 🎯 **Current Smart Suggestions**

The AI currently provides context-aware suggestions for:

- **Project inquiries**: Timeline, requirements, budget discussions
- **Hiring**: Availability, rates, portfolio requests
- **Technical**: Web development, mobile apps, full-stack capabilities
- **Design**: UI/UX, user experience, modern interfaces
- **Collaboration**: Teamwork, communication, partnerships

## 🔄 **How It Works Now**

1. **Type 15+ characters** → AI analyzes context
2. **Every 10 characters** → AI updates suggestions
3. **Context detection** → Finds keywords like "project", "hire", "web"
4. **Smart filtering** → Removes duplicates and irrelevant suggestions
5. **Professional tone** → All suggestions maintain professional language

## 🚀 **Next Steps**

1. **Test the current AI**: Enable AI mode and try typing different contexts
2. **Choose an AI provider**: OpenAI, Claude, or local models
3. **Set up API keys**: Add your chosen AI service credentials
4. **Replace the function**: Update `generateSmartSuggestions` with real AI
5. **Deploy and enjoy**: Smart, context-aware contact form suggestions!

The AI suggestions make your contact form more engaging and help visitors express their needs more clearly!
