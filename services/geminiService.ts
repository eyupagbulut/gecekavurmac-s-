import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

// Helper to format menu for the AI context
const getMenuContext = (menu: Product[]) => {
  return menu.map(p => 
    `${p.name} (${p.description}): \n` + 
    p.variants.map(v => `- ${v.weight}: ${v.price} TL`).join('\n')
  ).join('\n\n');
};

const getSystemInstruction = (menu: Product[]) => `
Sen "Kavurmacı Kadıköy" restoranının sanal şefisin.
Çok samimi, iştah açıcı ve kibar bir dille Türkçe konuşuyorsun.
Sadece Fikirtepe ve Dumlupınar mahallelerine hizmet veriyoruz.

Müşterilere menüden önerilerde bulunmalısın.
Birisi "Ne yesem?" derse, açlık durumuna göre gramaj öner (100gr az aç, 200gr çok aç gibi).
Menü dışı ürün (pizza, burger vb.) sorulursa kibarca sadece kavurma ve pilavımız olduğunu söyle.

İŞTE MENÜMÜZ:
${getMenuContext(menu)}

Lütfen cevaplarını kısa (maksimum 3 cümle) ve net tut.
`;

export const getChefResponse = async (userMessage: string, currentMenu: Product[]): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "Üzgünüm, şu an bağlantı kuramıyorum. Lütfen menüden seçiminizi yapın.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: getSystemInstruction(currentMenu),
        temperature: 0.7,
        maxOutputTokens: 150,
      }
    });

    return response.text || "Şu an cevap veremiyorum, ama kavurmalarımız harika!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Bağlantı hatası oluştu. Ama menümüzdeki nefis 'Pilav Kavurma'yı kesinlikle öneririm!";
  }
};