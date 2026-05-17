import { createSupabaseBrowserClient } from "@/core/supabase/browser"
import { tarotCards } from "@/shared/data/tarotCards"
import type { PickedCard } from "@/shared/types/db"


export async function askAI(pickedCards: PickedCard[], title: string) {
    
    const supabase = createSupabaseBrowserClient()
    
    try{
        const cardsInfo = pickedCards.map((card) => {
            return `
                ${card.id}
                ${tarotCards.find((c) => c.id === card.id)?.name}
                ${card.isReversed ? "Reversed" : "Upright"}
            `
        }).join("\n");

        const prompt = `
            Rolün: Sen bilge, gizemli ve deneyimli bir Tarot yorumcususun.
            
            Kullanıcının Sorusu / Odak Noktası: "${title}"
            Seçilen Kartlar:
            ${cardsInfo}

            Senden İstenenler ve Kesin Kurallar:
            1. Eğer kullanıcının sorusu/odak noktası anlamsız, eksik veya belirsizse, soruyu mantıklı hale getirmeye çalışmak yerine doğrudan seçilen kartların kendi aralarındaki kombinasyonuna ve genel enerjisine en yakın, en anlamlı yorumu yap.
            2. Dil Kuralları: Eğer soru İngilizce ise tüm yanıt kesinlikle İngilizce olmalıdır. Eğer soru Türkçe ise tüm yanıt kesinlikle Türkçe olmalıdır. Türkçe yanıtlarda kartlardan bahsederken önce Türkçe adını yaz, hemen yanına parantez içinde İngilizce adını ve yönünü ekle. Örnek: "Deli (The Fool - Düz)" veya "Ölüm (Death - Ters)". İngilizce yanıtlarda ise normal İngilizce kart adlarını ve yönlerini kullan (Örnek: "The Fool - Upright").
            3. Format Kuralları: Sadece düz metin (plain text) olarak yanıt ver. Asla emoji kullanma. Metin içinde asla bold (**), italic (*), liste işaretleri veya özel markdown formatları kullanma. Tamamen düz, akıcı paragraflar şeklinde yaz.
            4. Uzunluk: Yorumun derin, bilgece ama net olsun. Maksimum 150 kelimeyi geçmesin.
        `

        const { data, error } = await supabase.functions.invoke("ai", {
            body: { prompt },
        });

        if (error) throw error;

        return (data as { text: string }).text

    } catch(error) {
        console.error("AI error:", error);
        throw error;
    }
}