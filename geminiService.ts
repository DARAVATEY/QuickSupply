
import { GoogleGenAI, Type } from "@google/genai";
import { Supplier } from "./types";

const MODEL_NAME = 'gemini-3-flash-preview';

export class GeminiService {
  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateSupplierProfile(basicData: {
    name: string;
    location: string;
    industry: string;
    category: string;
    capacity: string;
  }): Promise<Partial<Supplier>> {
    try {
      const ai = this.getAI();
      const prompt = `
        A new supplier is registering on QuickSupply (Cambodia B2B).
        Name: ${basicData.name}
        Location: ${basicData.location}
        Industry: ${basicData.industry}
        Category: ${basicData.category}
        Annual Capacity: ${basicData.capacity}

        Task: Generate a professional B2B factory profile.
        Return a JSON object with:
        1. "description": A high-quality 3-paragraph company bio highlighting quality, location, and export readiness.
        2. "certifications": Array of 2-3 realistic certifications for this industry (e.g., ISO 9001, GOTS, OEKO-TEX).
        3. "establishedYear": A realistic year (e.g., between 2000 and 2023).
        4. "employeeCount": A realistic range (e.g., "50-100", "500+").
        5. "factorySize": A realistic size in sqm (e.g., "2,500 sqm").
        6. "businessType": A professional classification (e.g., "Manufacturer", "Direct Exporter").
      `;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              description: { type: Type.STRING },
              certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
              establishedYear: { type: Type.INTEGER },
              employeeCount: { type: Type.STRING },
              factorySize: { type: Type.STRING },
              businessType: { type: Type.STRING }
            },
            required: ["description", "certifications", "establishedYear", "employeeCount", "factorySize", "businessType"]
          }
        }
      });

      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Gemini Generation Error:", error);
      return {
        description: `Verified manufacturer in ${basicData.location} specializing in ${basicData.category}. Committed to quality and international standards.`,
        certifications: ["ISO 9001"],
        establishedYear: 2020,
        employeeCount: "50+",
        factorySize: "1,000 sqm",
        businessType: "Manufacturer"
      };
    }
  }

  async getSupplierAdvice(query: string, availableSuppliers: Supplier[]): Promise<{ text: string; links: any[] }> {
    try {
      const ai = this.getAI();
      const supplierData = JSON.stringify(availableSuppliers);
      const prompt = `
        User is looking for suppliers in Cambodia. 
        Context of our internal database: ${supplierData}
        
        User Query: "${query}"
        
        Instructions:
        1. If a match exists in our database, highlight them.
        2. Use Google Search to find more real-time information or additional reputable suppliers in Cambodia that aren't in our list.
        3. Provide helpful advice on sourcing from Cambodia (taxes, shipping, reliability).
        4. Be professional and encouraging.
      `;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "I'm sorry, I couldn't process that request.";
      const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title || 'Related Source',
        uri: chunk.web?.uri || '#'
      })) || [];

      return { text, links };
    } catch (error) {
      console.error("Gemini API Error:", error);
      return { text: "Error connecting to AI. Please try again later.", links: [] };
    }
  }

  async getSupplierResponse(message: string, supplier: Supplier): Promise<string> {
    try {
      const ai = this.getAI();
      const productNames = supplier.products.map(p => p.name).join(', ');
      const prompt = `
        You are the Sales and Export Manager for "${supplier.name}" based in ${supplier.location}, Cambodia.
        Your company profile: ${supplier.description}
        Your products: ${productNames}
        
        A potential international buyer has sent you this message: "${message}"
        
        Instructions:
        1. Reply as the owner/manager of the factory. 
        2. Be professional, polite, and eager to do business.
        3. Mention specific details about your products or location if relevant.
        4. Keep the response concise (2-3 paragraphs max).
        5. Do not mention you are an AI.
      `;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
      });

      return response.text || "Thank you for your inquiry. Our team will get back to you shortly.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Thank you for your message. We have received your inquiry and will respond as soon as possible.";
    }
  }

  async matchSuppliers(requirements: string, suppliers: Supplier[]): Promise<{ ids: string[], analysis: { name: string, reason: string }[] }> {
    try {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `Given these supplier profiles: ${JSON.stringify(suppliers)} 
                   And these user requirements: "${requirements}"
                   Analyze the requirements and select the top 3 matching suppliers.
                   Return a JSON object with:
                   1. "ids": an array of the IDs of the top 3 matching suppliers.
                   2. "analysis": an array of exactly 3 objects (or fewer if less than 3 match), each containing:
                      - "name": The name of the supplier.
                      - "reason": A one-sentence specific reason why this supplier is a great fit.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              ids: { type: Type.ARRAY, items: { type: Type.STRING } },
              analysis: { 
                type: Type.ARRAY, 
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    reason: { type: Type.STRING }
                  },
                  required: ["name", "reason"]
                }
              }
            },
            required: ["ids", "analysis"]
          }
        }
      });

      const result = JSON.parse(response.text || '{"ids": [], "analysis": []}');
      return result;
    } catch {
      return { ids: [], analysis: [] };
    }
  }
}

export const geminiService = new GeminiService();
