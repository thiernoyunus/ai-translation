import OpenAI from "openai";
import { checkEnvironment } from "./utils.js";

// Initialize OpenAI client with environment variables

const aiUrl = new URL(process.env.AI_URL, window.location.origin).toString();

const openai = new OpenAI({
    apiKey: process.env.AI_KEY,
    baseURL: aiUrl,
    dangerouslyAllowBrowser: true,
});

checkEnvironment();

const btn = document.getElementById('btn')
const translationHeading = document.getElementById('translation-heading')
const translationContainer = document.getElementById('translation-container')
const translationResult = document.getElementById('translation-result')
const textArea = document.getElementById('text')
let isTranslated = false

btn.addEventListener('click', async() => {
    if(isTranslated) {
        textArea.value = '';
        textArea.readOnly = false;
        btn.textContent='Translate';
        isTranslated = false;
        translationHeading.textContent = 'Select language 👇'
        translationContainer.style.display = 'block'
        translationResult.innerHTML = ''
        return;
    }
    const text = document.getElementById('text').value
    const selectedLanguage = document.querySelector('input[name="language"]:checked')
    if(selectedLanguage){
        textArea.readOnly = true
        btn.textContent = 'Translating ...'
        
        const response = await openai.responses.create({
            model: process.env.AI_MODEL,
            input: [
                {
                    role: "system",
                    content: `Your are a translator. Your job is to translate a text from one language into another. 
                    ALways return plain text, no markdown, no html, no special characters, no emojis, no anything else.
                    If the user mentioned to give the translation for a specific gender, then do so. 
                    If not, just default to the male gender, give the translation, then add any extra words or any sentences.
                    Example: 
                    User:"Hello, how are you? Answer: مرحبا, كيف حالك؟"
                    User:"My best friend" Answer: صديقي المفضل
                    User:"My best friend to a female" Answer: صديقتي المفضلة
                    User:"My best friend to a male" Answer: صديقي المفضل
                    `
                },
                {
                    role: "user",
                    content: `translate ${text} to ${selectedLanguage.value}`
                },
            ]
        });

        translationHeading.textContent = `Your translation 👇`
        translationContainer.style.display = 'none'
        translationResult.innerHTML = `<h2 class="translation-result-text">${response.output_text}</h2>`
        btn.textContent = 'Start over'
        isTranslated = true;
    } else {
        console.log('No language selected')
    }
})
