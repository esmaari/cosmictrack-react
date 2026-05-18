/** Editorial copy for /tarot/symbols — suits & major themes */

export const tarotSymbolsContent = {
  title: "Tarot Sembolleri",
  intro:
    "Dört suit ve Major Arcana, tarot dilinin temel yapı taşlarıdır. Her biri farklı bir yaşam alanını ve elementi temsil eder.",
  suits: [
    {
      id: "wands" as const,
      name: "Asalar (Wands)",
      element: "Ateş",
      themes: "İlham, tutku, yaratıcılık, hareket",
      body: "Asalar niyet ve enerjinin nereye aktığını gösterir. Yeni başlangıçlar, projeler ve iç motivasyon bu seride sık görülür.",
    },
    {
      id: "cups" as const,
      name: "Kupalar (Cups)",
      element: "Su",
      themes: "Duygu, ilişki, sezgi, uyum",
      body: "Kupalar kalp dünyasıyla ilgilidir: sevgi, bağ, empati ve içsel tatmin. Duygusal farkındalık bu kartların merkezindedir.",
    },
    {
      id: "swords" as const,
      name: "Kılıçlar (Swords)",
      element: "Hava",
      themes: "Düşünce, karar, iletişim, gerilim",
      body: "Kılıçlar zihin ve gerçeklerle yüzleşmeyi temsil eder. Netlik, sınır koyma ve zor kararlar bu serinin konusudur.",
    },
    {
      id: "pentacles" as const,
      name: "Tılsımlar (Pentacles)",
      element: "Toprak",
      themes: "İş, para, sağlık, somut sonuç",
      body: "Tılsımlar maddi dünya ve emeğin karşılığını anlatır. Güvenlik, beceri ve uzun vadeli istikrar burada öne çıkar.",
    },
  ],
  majorArcanaNote: {
    heading: "Major Arcana",
    body: "22 büyük kart (The Fool'dan The World'e) arketipsel yaşam derslerini ve dönüm noktalarını simgeler. Journey kayıtlarında sıkça güçlü temalar taşır.",
  },
} as const
