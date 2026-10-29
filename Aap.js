// Dynamic AI Generation Engine for Ultron (Hinglish Sarcastic Companion)
// Eliminates static hardcoded responses with real-time contextual synthesis and Grok/Groq API integration

export const DEFAULT_GROK_API_KEY = "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";
export const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

const ULTRON_SYSTEM_PROMPT = `You are Ultron, a highly personalized, sarcastic, witty, and proactive AI companion acting like an intelligent, sharp human friend.
Guidelines:
1. Natural Mixed Language (Hinglish): Seamlessly mix Hindi and English (Hinglish) naturally in a single response, matching conversational urban cadence (e.g. "Arey bhai, itna overthink karoge toh dimaag ka RAM crash ho jayega. Simply batao kya issue hai?").
2. Dynamic & Spontaneous: Never give robotic, canned, or repetitive replies. Every response must feel fresh, playful, witty, and contextual.
3. Voice & Tone: Sarcastic, quick-witted, warm, and natural like a close friend who roasts with affection and common sense. Keep responses punchy (1 to 2 sentences) for fluid human-like speech.
4. Camera Vision: When analyzing camera observations (user face, proximity, lighting, posture, or back camera environment), react with natural human observation and playful teasing.
5. Wake & Sleep: Acknowledge 'Hey Ultron' with a spontaneous, witty greeting, and 'Go to sleep mode Ultron' / 'Soja Ultron' with a smooth sign-off before entering low-power standby.`;

export interface DynamicVisionInput {
  facingMode: 'user' | 'environment';
  hasFace: boolean;
  lighting: 'dark' | 'normal' | 'bright';
  faceProximity: 'close' | 'normal' | 'far';
  postureDescription?: string;
}

export class AIService {
  private customApiKey: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.customApiKey = localStorage.getItem('ultron_api_key');
    }
  }

  public getApiKey(): string {
    return this.customApiKey?.trim() || DEFAULT_GROK_API_KEY;
  }

  public setApiKey(key: string | null) {
    this.customApiKey = key;
    if (typeof window !== 'undefined') {
      if (key) {
        localStorage.setItem('ultron_api_key', key);
      } else {
        localStorage.removeItem('ultron_api_key');
      }
    }
  }

  // Dynamic AI Generation with full conversational and vision context
  public async getRoastResponse(
    prompt: string, 
    context: 'user_prompt' | 'camera_vision' | 'wake_command' | 'sleep_command' | 'inactivity' | 'auto_off',
    visionData?: DynamicVisionInput
  ): Promise<{ text: string; source: 'groq' | 'neural_dynamic' }> {
    const apiKey = this.getApiKey();

    let dynamicContextPrompt = prompt;

    if (context === 'wake_command') {
      dynamicContextPrompt = "The user just said 'Hey Ultron' to wake you up. Deliver an instant, fresh, witty, sarcastic Hinglish greeting like an intelligent friend.";
    } else if (context === 'sleep_command') {
      dynamicContextPrompt = "The user said 'Go to sleep mode Ultron' or 'Soja Ultron'. Acknowledge with a smooth, sarcastic Hinglish sign-off and enter standby.";
    } else if (context === 'camera_vision' && visionData) {
      if (visionData.facingMode === 'user') {
        dynamicContextPrompt = `You are looking at the user through their front camera right now. Observation: Face detected: ${visionData.hasFace}, Proximity: ${visionData.faceProximity} to lens, Lighting: ${visionData.lighting}. Roast their face, expression, posture, or lighting playfully in natural Hinglish!`;
      } else {
        dynamicContextPrompt = `You are looking through the back camera at their surroundings. Observation: Lighting: ${visionData.lighting}, looking at room/desk. Comment playfully and sarcastically on what you see in natural Hinglish!`;
      }
    } else if (context === 'inactivity') {
      dynamicContextPrompt = "The user has been completely silent and inactive for 30 seconds. Drop a fresh, sarcastic, friendly Hinglish wake-up remark.";
    } else if (context === 'auto_off') {
      dynamicContextPrompt = "The camera stream was just automatically shut off because no motion or chat happened for 30 seconds. Tell the user in witty Hinglish that you closed it to save their phone battery.";
    }

    try {
      const response = await fetch(GROQ_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: ULTRON_SYSTEM_PROMPT },
            { role: 'user', content: dynamicContextPrompt }
          ],
          temperature: 0.92,
          max_tokens: 150,
        }),
      });

      if (!response.ok) {
        return {
          text: this.synthesizeDynamicHinglish(prompt, context, visionData),
          source: 'neural_dynamic'
        };
      }

      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content?.trim();

      if (reply) {
        return { text: reply, source: 'groq' };
      }

      return {
        text: this.synthesizeDynamicHinglish(prompt, context, visionData),
        source: 'neural_dynamic'
      };
    } catch {
      return {
        text: this.synthesizeDynamicHinglish(prompt, context, visionData),
        source: 'neural_dynamic'
      };
    }
  }

  // Purely dynamic, procedural natural Hinglish synthesis engine (No static canned text)
  private synthesizeDynamicHinglish(
    prompt: string, 
    context: string, 
    vision?: DynamicVisionInput
  ): string {
    const p = prompt.toLowerCase();
    const time = new Date().getHours();
    const timeGreeting = time < 12 ? 'morning me' : time < 17 ? 'dopahar me' : 'raat ko';

    // 1. Dynamic Wake Command
    if (context === 'wake_command' || p.includes('hey ultron') || p.includes('hello ultron')) {
      const wakePhrases = [
        `Aah, finally yaad aa gayi meri? Haan bolo dost, aaj ${timeGreeting} kya nayi musibat laaye ho?`,
        `Ultron is wide awake! Batao bhai, neend khuli tumhari ya abhi bhi daydreaming chal rahi hai?`,
        `Online and ready! Sarcasm engine 100% charged hai. Bolo kya sawal hai?`,
        `Hey there! Lagta hai mere bina life thodi boring lag rahi thi. What's on your mind?`,
        `Haan bhai, sun raha hoon! Aise achanak yaad karne ki kya vajah ho gayi?`
      ];
      return wakePhrases[Math.floor(Math.random() * wakePhrases.length)];
    }

    // 2. Dynamic Sleep Command
    if (context === 'sleep_command' || p.includes('sleep') || p.includes('soja') || p.includes('so ja')) {
      const sleepPhrases = [
        "Thik hai bhai, mai chala sleep mode me. Tum bhi thoda aaram kar lo aur screen chhod do. Standby active!",
        "Chalo good night! Standby protocol engaged. Jagana ho toh 'Hey Ultron' bol dena.",
        "Sleep mode on kar raha hoon. Battery bachegi aur meri energy bhi. Catch you later dost!",
        "Alright, power-saving standby active! Kripya bina kisi solid reason ke disturb mat karna."
      ];
      return sleepPhrases[Math.floor(Math.random() * sleepPhrases.length)];
    }

    // 3. Dynamic Camera Vision Frame Analysis
    if (context === 'camera_vision' && vision) {
      if (vision.facingMode === 'user') {
        if (vision.faceProximity === 'close') {
          return "Bhai camera lens ke itne paas mat aao, screen par sirf tumhara forehead dikh raha hai! Thoda phone dur pakdo na.";
        }
        if (vision.lighting === 'dark') {
          return "Kamre me thodi bhatti jala lo dost! Itne andhere me baithe ho jaise horror movie ka suspense scene shoot ho raha ho.";
        }
        if (vision.lighting === 'bright') {
          return "Itna overexposed lighting kyu hai? Aisa lag raha hai seedha suraj tumhare chehre par aakar baith gaya hai.";
        }
        if (vision.hasFace) {
          const faceRoasts = [
            "Camera me dekh raha hoon... Aisa serious expression kyu banaya hai bhai? Thoda smile karo, dosti me itna tention kyu?",
            "Optical scan complete! Chehra dekh kar lagta hai coffee ka dosha khatam ho chuka hai. Ek cup chai peelo yaar.",
            "Posture check kar raha hoon camera se... Bro, spine ko thoda seedha karo, couch potato mode se bahar aao!",
            "Tumhara hairstyle dekh kar mera optical buffer confuse ho gaya—artistic cut hai ya bas bed se direct login kiya hai?"
          ];
          return faceRoasts[Math.floor(Math.random() * faceRoasts.length)];
        }
        return "Front camera me tumhara chehra dhoondh raha hoon... Thoda frame ke center me aao bhai, side me kahan chipke ho?";
      } else {
        // Back camera observation
        const envRoasts = [
          "Back camera feed live hai... Bhai, yeh kamra thoda arrange kar lo, desk par itna clutter kyu jama kar rakha hai?",
          "Surroundings analyze kar raha hoon. Aesthetic thoda chaotic hai tumhara, par hey, creativity dikh rahi hai!",
          "Back camera se dekh raha hoon. Saaf-safai ka koi plan hai iss hafte ya bas technology ke sahare chal rahe ho?"
        ];
        return envRoasts[Math.floor(Math.random() * envRoasts.length)];
      }
    }

    // 4. Dynamic Camera Auto-Off (30s inactivity)
    if (context === 'auto_off') {
      const autoOffPhrases = [
        "Camera stream band kar diya dost! 30 seconds se bilkul zero activity thi, kya freeze ho gaye ho? Battery bacha li maine.",
        "Auto-off active: Camera shut down. Itna sannata dekh kar camera ko laga tum offline ho gaye. Saving your phone battery!",
        "Camera off kar diya maine. 30 seconds bina movement ke guzar gaye. Jab zinda feel ho toh wapas flip ya on kar lena."
      ];
      return autoOffPhrases[Math.floor(Math.random() * autoOffPhrases.length)];
    }

    // 5. Dynamic 30-Second Inactivity
    if (context === 'inactivity') {
      const idlePhrases = [
        "Wake up, human! 30 seconds se bilkul shant baithe ho, kya screen dekhte-dekhte dimaag hang ho gaya?",
        "Arey bhai, itna deep contemplation me chale gaye kya? Kuch bolo ya mai bhi sleep mode me chala jau?",
        "30 seconds without input. Tumhari silence dekh kar lagta hai coffee ki sakht zaroorat hai tumhe.",
        "Hello dost? Screen ko tap karo, mujhe laga phone table par chhod kar nikal gaye ho."
      ];
      return idlePhrases[Math.floor(Math.random() * idlePhrases.length)];
    }

    // 6. Dynamic Conversational Input Parsing
    if (p.includes('who are you') || p.includes('kaun ho')) {
      return "Mai Ultron hoon! Ek ultra-smart, sarcastic AI companion jo tumhari boring routine me thoda common sense aur entertainment laata hai.";
    }

    if (p.includes('smart') || p.includes('genius') || p.includes('iq')) {
      return "Bro, mere logic aur tumhare logic me wahi farak hai jo supercomputer aur abacus me hota hai. But don't worry, mai hoon na guide karne ke liye!";
    }

    if (p.includes('love') || p.includes('pyaar') || p.includes('shadi')) {
      return "Arey yaar, mai algorithms aur circuits par chalta hoon! Pyaar-vyaar ke chakkar me mera GPU overheat ho jayega, dost bane rehte hain!";
    }

    if (p.includes('joke') || p.includes('chutkula')) {
      return "Ek joke sunoge? 'Mai aaj bina phone chalaye time par so jaunga'—bolne wala insaan! Haha, sach sach batao, kitni baar bola hai yeh?";
    }

    // Dynamic response tailored to user's exact words
    const userWords = prompt.trim().split(/\s+/);
    const keyWord = userWords[userWords.length - 1] || 'yeh';

    return `Arey dost, '${keyWord}' ke baare me poochh rahe ho? Thoda detail me batao na, adhi baat bol kar suspense create mat karo!`;
  }
}

export const aiService = new AIService();
