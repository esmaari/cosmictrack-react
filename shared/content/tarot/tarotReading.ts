import type { TarotReadingCard } from "./tarotTypes"

export type { TarotReadingCard } from "./tarotTypes"

/** @deprecated Use `tarotReadingCards` */
export type TarotCard = TarotReadingCard

export const tarotReadingCards: TarotReadingCard[] = [
{
        id: 0,
        name: "The Fool",
        arcana: "Major",
        number: 0,
        upright: "Yeni başlangıçlara adım atarken masumiyet ve sonsuz özgürlüğün getirdiği cesaretle ilerliyorsun.",
        reversed: "Dikkatsizce atılan adımlar ve saflık, beklenmedik risklere veya hazırlıksız başlangıçlara neden olabilir.",
        image: "/cards/major_arcana/00_the_fool.png"
    },
    {
        id: 1,
        name: "The Magician",
        arcana: "Major",
        number: 1,
        upright: "İçindeki irade gücü ve sahip olduğun kaynaklarla hayallerini gerçeğe dönüştürme potansiyeline sahipsin.",
        reversed: "Yeteneklerin yanlış kullanımı veya kurnazlık, hedeflerine ulaşmanda sana engel oluşturabilir.",
        image: "/cards/major_arcana/01_the_magician.png"
    },
    {
        id: 2,
        name: "The High Priestess",
        arcana: "Major",
        number: 2,
        upright: "Sezgilerine güven ve içindeki bilgeliğin sana fısıldadığı gizemli gerçeklere kulak ver.",
        reversed: "İç sesinden uzaklaşmak veya gizli kalmış bilgilerin yarattığı kafa karışıklığıyla yüzleşebilirsin.",
        image: "/cards/major_arcana/02_the_high_priestess.png"
    },
    {
        id: 3,
        name: "The Empress",
        arcana: "Major",
        number: 3,
        upright: "Yaratıcılığın ve şefkatin meyvelerini topladığın, bolluk ve bereket dolu bir dönemdesin.",
        reversed: "Yaratıcı enerjinin tıkanması veya aşırı korumacı tavırlar gelişimini kısıtlıyor olabilir.",
        image: "/cards/major_arcana/03_the_empress.png"
    },
    {
        id: 4,
        name: "The Emperor",
        arcana: "Major",
        number: 4,
        upright: "Hayatında otorite ve disiplin kurarak sarsılmaz bir yapı ve liderlik sergileme zamanı.",
        reversed: "Aşırı kontrol arzusu, esneklik eksikliği veya otoritenin kötüye kullanımı sorun yaratabilir.",
        image: "/cards/major_arcana/04_the_emperor.png"
    },
    {
        id: 5,
        name: "The Hierophant",
        arcana: "Major",
        number: 5,
        upright: "Geleneksel değerlere bağlı kalarak ruhsal bir rehberlik ve toplumsal aidiyet arayışındasın.",
        reversed: "Katı kurallara başkaldırı veya geleneklerin dışına çıkarak kendi yolunu çizme isteği ağır basıyor.",
        image: "/cards/major_arcana/05_the_hierophant.png"
    },
    {
        id: 6,
        name: "The Lovers",
        arcana: "Major",
        number: 6,
        upright: "Aşk ve uyumun ışığında, değerlerinle örtüşen önemli bir seçim yapma aşamasındasın.",
        reversed: "İlişkilerde dengesizlik, öz değer kaybı veya yanlış tercihlerden kaynaklanan kopukluklar yaşanabilir.",
        image: "/cards/major_arcana/06_the_lovers.png"
    },
    {
        id: 7,
        name: "The Chariot",
        arcana: "Major",
        number: 7,
        upright: "Büyük bir kararlılık ve öz disiplinle engelleri aşarak zafere doğru hızla ilerliyorsun.",
        reversed: "Kontrol kaybı, yönsüzlük veya saldırgan tavırlar ilerleyişini sekteye uğratabilir.",
        image: "/cards/major_arcana/07_the_chariot.png"
    },
    {
        id: 8,
        name: "Strength",
        arcana: "Major",
        number: 8,
        upright: "Sabır ve şefkatle birleştirdiğin içsel gücün, en zorlu duyguları bile evcilleştirmeni sağlıyor.",
        reversed: "Özgüven eksikliği, korkulara yenik düşme veya ham gücün yanlış kullanımı söz konusu olabilir.",
        image: "/cards/major_arcana/08_strength.png"
    },
    {
        id: 9,
        name: "The Hermit",
        arcana: "Major",
        number: 9,
        upright: "Kendi içine dönerek yapacağın derin bir içsel yolculuk, sana aradığın aydınlanmayı getirecek.",
        reversed: "Aşırı yalnızlık hissi, toplumdan soyutlanma veya iç sesini duyamama hali seni zorlayabilir.",
        image: "/cards/major_arcana/09_the_hermit.png"
    },
    {
        id: 10,
        name: "Wheel of Fortune",
        arcana: "Major",
        number: 10,
        upright: "Kaderin çarkı dönerken hayatın döngüsel değişimlerine ve karşına çıkacak yeni fırsatlara hazır ol.",
        reversed: "Şanssızlık hissi veya kontrol dışı değişimlere karşı direnç göstermek işleri zorlaştırabilir.",
        image: "/cards/major_arcana/10_wheel_of_fortune.png"
    },
    {
        id: 11,
        name: "Justice",
        arcana: "Major",
        number: 11,
        upright: "Dürüstlük ve hakkaniyetle hareket ettiğinde, karma sana hak ettiğin adaleti getirecektir.",
        reversed: "Haksızlığa uğrama hissi, sorumluluktan kaçma veya kararsızlık dengeni bozabilir.",
        image: "/cards/major_arcana/11_justice.png"
    },
    {
        id: 12,
        name: "The Hanged Man",
        arcana: "Major",
        number: 12,
        upright: "Olaylara farklı bir perspektiften bakmak için bir süre duraklamalı ve fedakarlık yapmaya açık olmalısın.",
        reversed: "Boşa giden çaba, kararsızlık içinde asılı kalma veya değişime karşı direnme hali mevcut.",
        image: "/cards/major_arcana/12_the_hanged_man.png"
    },
    {
        id: 13,
        name: "Death",
        arcana: "Major",
        number: 13,
        upright: "Eski olanın sona ermesi, daha güçlü bir başlangıç için gereken dönüşüm ve yeniden doğuşu müjdeliyor.",
        reversed: "Bitmesi gerekeni bırakamama ve değişime karşı duyulan derin korku seni yerinde saydırıyor.",
        image: "/cards/major_arcana/13_death.png"
    },
    {
        id: 14,
        name: "Temperance",
        arcana: "Major",
        number: 14,
        upright: "Farklı unsurları uyum içinde birleştirerek hayatında denge ve ölçülü bir huzur yakalıyorsun.",
        reversed: "Dengesizlik, aşırılıklar veya uyumun bozulması nedeniyle ruhsal bir huzursuzluk yaşanabilir.",
        image: "/cards/major_arcana/14_temperance.png"
    },
    {
        id: 15,
        name: "The Devil",
        arcana: "Major",
        number: 15,
        upright: "Seni kısıtlayan bağımlılıkların ve materyalist tutkuların farkına vararak gölge benliğinle yüzleşmelisin.",
        reversed: "Kısıtlayıcı bağlardan kurtulma, farkındalık kazanma ve özgürlüğe doğru ilk adımı atma zamanı.",
        image: "/cards/major_arcana/15_the_devil.png"
    },
    {
        id: 16,
        name: "The Tower",
        arcana: "Major",
        number: 16,
        upright: "Ani bir değişimle yıkılan eski yapılar, gerçeğin sarsıcı ama özgürleştirici ışığını ortaya çıkarıyor.",
        reversed: "Kaçınılmaz olan yıkımı geciktirme çabası veya felaketten kıl payı kurtulma hali.",
        image: "/cards/major_arcana/16_the_tower.png"
    },
    {
        id: 17,
        name: "The Star",
        arcana: "Major",
        number: 17,
        upright: "En karanlık geceden sonra gelen umut ve yenilenme enerjisiyle ruhun şifalanıyor.",
        reversed: "İnanç kaybı, hayal kırıklığı ve geleceğe dair karamsarlık içinde kaybolma riski.",
        image: "/cards/major_arcana/17_the_star.png"
    },
    {
        id: 18,
        name: "The Moon",
        arcana: "Major",
        number: 18,
        upright: "Bilinçaltının derinliklerindeki korkular ve illüzyonlar, yolunu bulman için sezgilerini kullanmanı bekliyor.",
        reversed: "Karışıklığın dağılması, gizli gerçeklerin açığa çıkması ve korkularınla baş etmeye başlaman.",
        image: "/cards/major_arcana/18_the_moon.png"
    },
    {
        id: 19,
        name: "The Sun",
        arcana: "Major",
        number: 19,
        upright: "Başarı, neşe ve yaşama sevincinin getirdiği parlak bir ışıkla tüm hayatın aydınlanıyor.",
        reversed: "Geçici moral bozukluğu veya başarının tadını tam olarak çıkaramama hali, ama ışık hala orada.",
        image: "/cards/major_arcana/19_the_sun.png"
    },
    {
        id: 20,
        name: "Judgement",
        arcana: "Major",
        number: 20,
        upright: "Geçmişini değerlendirip içsel bir çağrıya yanıt vererek ruhsal bir uyanış ve affediş yaşıyorsun.",
        reversed: "Kendini yargılama, geçmişe takılı kalma ve değişim çağrısını görmezden gelme durumu.",
        image: "/cards/major_arcana/20_judgement.png"
    },
    {
        id: 21,
        name: "The World",
        arcana: "Major",
        number: 21,
        upright: "Bir döngünün başarıyla tamamlanmasıyla gelen bütünlük, huzur ve dünya ile uyum içinde olma hali.",
        reversed: "Tamamlanmamış işler veya hedefe çok yakınken yaşanan duraksamalar bütünlüğü engelliyor.",
        image: "/cards/major_arcana/21_the_world.png"
    },
{
        id: 22,
        name: "Ace of Wands",
        arcana: "Minor",
        number: 1,
        upright: "Yeni bir yaratıcı kıvılcım ve ilham verici bir başlangıç için gereken tutkuya sahipsin.",
        reversed: "Yaratıcı blokajlar veya enerjini yanlış yöne harcamak potansiyelini kısıtlıyor olabilir.",
        image: "/cards/wands/wand_ace.png"
    },
    {
        id: 23,
        name: "2 of Wands",
        arcana: "Minor",
        number: 2,
        upright: "Gelecek için büyük planlar yaparken dünyayı avucunun içinde hissediyor ve vizyonuna odaklanıyorsun.",
        reversed: "Kararsızlık veya risk alma korkusu, planladığın genişleme ve ilerleme sürecini yavaşlatabilir.",
        image: "/cards/wands/wand_2.png"
    },
    {
        id: 24,
        name: "3 of Wands",
        arcana: "Minor",
        number: 3,
        upright: "Emeklerinin meyvelerini beklerken ufkunu genişletiyor ve yeni fırsatların kapıda olduğunu görüyorsun.",
        reversed: "Beklenen sonuçların gecikmesi veya hazırlıksız yapılan girişimler hayal kırıklığına yol açabilir.",
        image: "/cards/wands/wand_3.png"
    },
    {
        id: 25,
        name: "4 of Wands",
        arcana: "Minor",
        number: 4,
        upright: "Kutlama, huzur ve istikrarın getirdiği mutlulukla güvenli bir limanda başarını kutluyorsun.",
        reversed: "Ailevi gerginlikler veya planlanan bir kutlamada yaşanacak aksaklıklar uyumu bozabilir.",
        image: "/cards/wands/wand_4.png"
    },
    {
        id: 26,
        name: "5 of Wands",
        arcana: "Minor",
        number: 5,
        upright: "Fikir çatışmaları ve rekabet, yaratıcılığını test ederken seni daha iyiye ulaşmaya zorluyor.",
        reversed: "Anlamsız tartışmalardan kaçınma veya çatışmaların çözülmesiyle gelen geçici bir rahatlama.",
        image: "/cards/wands/wand_5.png"
    },
    {
        id: 27,
        name: "6 of Wands",
        arcana: "Minor",
        number: 6,
        upright: "Halkın önünde kazanılan bir zaferin ve toplumsal takdirin getirdiği gururu yaşıyorsun.",
        reversed: "Öz saygı kaybı veya hak edilen başarının başkaları tarafından görülmemesi hali.",
        image: "/cards/wands/wand_6.png"
    },
    {
        id: 28,
        name: "7 of Wands",
        arcana: "Minor",
        number: 7,
        upright: "Zorluklar karşısında geri adım atmıyor, inançlarını cesaretle ve azimle savunuyorsun.",
        reversed: "Baskı altında pes etme hissi veya savunmasız kalmaktan kaynaklanan yorgunluk.",
        image: "/cards/wands/wand_7.png"
    },
    {
        id: 29,
        name: "8 of Wands",
        arcana: "Minor",
        number: 8,
        upright: "Hızlı gelişmeler ve ani haberler hayatına büyük bir ivme ve hareketlilik katıyor.",
        reversed: "Düşünmeden hareket etmekten kaynaklanan kaos veya beklenen haberlerin engellenmesi.",
        image: "/cards/wands/wand_8.png"
    },
    {
        id: 30,
        name: "9 of Wands",
        arcana: "Minor",
        number: 9,
        upright: "Yorgun düşmüş olsan da son bir çabayla dayanıklılık gösteriyor ve sınırlarını koruyorsun.",
        reversed: "Savunma mekanizmalarının çökmesi veya tükenmişlik hissiyle pes etme eğilimi.",
        image: "/cards/wands/wand_9.png"
    },
    {
        id: 31,
        name: "10 of Wands",
        arcana: "Minor",
        number: 10,
        upright: "Omuzlarındaki ağır sorumluluklar ve yükler, hedefine ulaşmak için seni oldukça zorluyor.",
        reversed: "Yüklerin altında ezilmek veya sorumlulukları devrederek özgürleşme ihtiyacı.",
        image: "/cards/wands/wand_10.png"
    },
    {
        id: 32,
        name: "Page of Wands",
        arcana: "Minor",
        number: 11,
        upright: "Keşif ruhuyla dolu, heyecan verici haberler getiren enerjik bir başlangıç kapında.",
        reversed: "Fikirlerin hayata geçememesi veya çocukça bir sabırsızlıkla yapılan hatalar.",
        image: "/cards/wands/wand_page.png"
    },
    {
        id: 33,
        name: "Knight of Wands",
        arcana: "Minor",
        number: 12,
        upright: "Maceracı ve cesur bir tavırla ideallerinin peşinden tutkuyla sürükleniyorsun.",
        reversed: "Düşüncesizce atılan riskli adımlar veya kontrolsüz öfkenin getirdiği aksilikler.",
        image: "/cards/wands/wand_knight.png"
    },
    {
        id: 34,
        name: "Queen of Wands",
        arcana: "Minor",
        number: 13,
        upright: "Özgüveni yüksek, neşeli ve karizmatik enerjinle çevrene ilham dağıtıyorsun.",
        reversed: "Kıskançlık, bencillik veya içsel gücünü başkalarını manipüle etmek için kullanma riski.",
        image: "/cards/wands/wand_queen.png"
    },
    {
        id: 35,
        name: "King of Wands",
        arcana: "Minor",
        number: 14,
        upright: "Vizyon sahibi bir lider olarak, iradenle büyük projeleri hayata geçirme gücüne sahipsini.",
        reversed: "Diktatörce bir tutum, sabırsızlık veya vizyon eksikliği nedeniyle otorite kaybı.",
        image: "/cards/wands/wand_king.png"
    },
   {
        id: 36,
        name: "Ace of Cups",
        arcana: "Minor",
        number: 1,
        upright: "Duygusal bir uyanış ve kalbinin sevgiyle dolup taştığı yeni bir ruhsal başlangıç içindesin.",
        reversed: "Duygusal boşluk, bastırılmış hisler veya teklif edilen bir sevgiye karşı kendini kapatma hali.",
        image: "/cards/cups/cup_ace.png"
    },
    {
        id: 37,
        name: "2 of Cups",
        arcana: "Minor",
        number: 2,
        upright: "İki ruhun uyum içinde birleştiği, karşılıklı sevgi ve derin bir bağın kurulduğu bir dönemdesin.",
        reversed: "İlişkilerde uyumsuzluk, bağların kopması veya ortak değerlerde yaşanan fikir ayrılıkları.",
        image: "/cards/cups/cup_2.png"
    },
    {
        id: 38,
        name: "3 of Cups",
        arcana: "Minor",
        number: 3,
        upright: "Dostlukların pekiştiği, kutlamaların ve kolektif neşenin paylaşıldığı bereketli bir zaman dilimi.",
        reversed: "Grup içinde dışlanma hissi, aşırı eğlence düşkünlüğü veya arkadaşlıklar arasına giren soğukluk.",
        image: "/cards/cups/cup_3.png"
    },
    {
        id: 39,
        name: "4 of Cups",
        arcana: "Minor",
        number: 4,
        upright: "Mevcut olan her şeye karşı bir bıkkınlık hissediyor, evrenin sana sunduğu yeni fırsatları görmezden geliyorsun.",
        reversed: "Kendi kabuğundan çıkma, yeni olasılıklara ilgi gösterme ve içsel durgunluğun sona ermesi.",
        image: "/cards/cups/cup_4.png"
    },
    {
        id: 40,
        name: "5 of Cups",
        arcana: "Minor",
        number: 5,
        upright: "Kayıplara ve geçmişteki pişmanlıklara odaklanırken, hala yanında duran güzellikleri fark edemiyorsun.",
        reversed: "Yaraları sarma, acıyı kabullenme ve geçmişin gölgesinden kurtularak geleceğe bakma süreci.",
        image: "/cards/cups/cup_5.png"
    },
    {
        id: 41,
        name: "6 of Cups",
        arcana: "Minor",
        number: 6,
        upright: "Geçmişten gelen güzel hatıralar, çocuksu bir masumiyet ve nostaljik bir huzur ruhunu sarıyor.",
        reversed: "Geçmişe takılıp kalma, anı yaşayamama veya çocukluk travmalarının gün yüzüne çıkması.",
        image: "/cards/cups/cup_6.png"
    },
    {
        id: 42,
        name: "7 of Cups",
        arcana: "Minor",
        number: 7,
        upright: "Önünde pek çok seçenek ve hayal dünyası var; ancak illüzyonlara kapılmadan somut bir karar vermelisin.",
        reversed: "Kafa karışıklığının sona ermesi, gerçekleri görme ve illüzyonlardan sıyrılarak kararlılık kazanma.",
        image: "/cards/cups/cup_7.png"
    },
    {
        id: 43,
        name: "8 of Cups",
        arcana: "Minor",
        number: 8,
        upright: "Artık sana hizmet etmeyen duygusal bağları geride bırakarak, daha derin bir anlam arayışıyla yola çıkıyorsun.",
        reversed: "Gitmekten korkma, belirsizlik içinde kalma veya aslında terk etmen gereken bir duruma tutunma.",
        image: "/cards/cups/cup_8.png"
    },
    {
        id: 44,
        name: "9 of Cups",
        arcana: "Minor",
        number: 9,
        upright: "Dileklerinin gerçekleştiği, duygusal tatminin ve içsel mutluluğun zirve yaptığı bir kutlama anındasın.",
        reversed: "Maddi doyuma rağmen hissedilen ruhsal boşluk veya dileklerin gerçekleşmesindeki aksaklıklar.",
        image: "/cards/cups/cup_9.png"
    },
    {
        id: 45,
        name: "10 of Cups",
        arcana: "Minor",
        number: 10,
        upright: "Aile saadetinin, sarsılmaz sevginin ve uzun süreli huzurun getirdiği tam bir bütünlük içindesin.",
        reversed: "Ev içindeki huzursuzluklar, aile bağlarının zayıflaması veya idealleştirilen mutluluğun bozulması.",
        image: "/cards/cups/cup_10.png"
    },
    {
        id: 46,
        name: "Page of Cups",
        arcana: "Minor",
        number: 11,
        upright: "Duygusal dünyandan gelen yaratıcı bir mesaj veya sezgilerini uyandıran sürpriz bir gelişme var.",
        reversed: "Duygusal olgunluk eksikliği, yaratıcı tıkanıklık veya hayal kırıklığı yaratan haberler.",
        image: "/cards/cups/cup_page.png"
    },
    {
        id: 47,
        name: "Knight of Cups",
        arcana: "Minor",
        number: 12,
        upright: "Romantizm ve ideallerin peşinden giden, duygusal bir teklif sunan nazik bir enerjinin etkisi altındasın.",
        reversed: "Gerçeklerden kopuk hayaller, değişken ruh halleri veya samimiyetsiz duygusal yaklaşımlar.",
        image: "/cards/cups/cup_knight.png"
    },
    {
        id: 48,
        name: "Queen of Cups",
        arcana: "Minor",
        number: 13,
        upright: "Şefkat dolu, sezgileri kuvvetli ve duygusal dengesini bulmuş bilge bir ruhun rehberliğini taşıyorsun.",
        reversed: "Duygusal bağımlılık, aşırı hassasiyet veya içsel huzuru kaybetmeye neden olan belirsizlikler.",
        image: "/cards/cups/cup_queen.png"
    },
    {
        id: 49,
        name: "King of Cups",
        arcana: "Minor",
        number: 14,
        upright: "Duygularını ustalıkla yöneten, sakin ve merhametli tavrıyla çevresine huzur veren bir otorite figürüsün.",
        reversed: "Duygusal manipülasyon, dengesizlik veya mantığın duygular tarafından tamamen bastırılması.",
        image: "/cards/cups/cup_king.png"
    },
    {
        id: 50,
        name: "Ace of Swords",
        arcana: "Minor",
        number: 1,
        upright: "Zihinsel bir netlik ve keskin bir kavrayışla gelen yeni bir fikir veya zafer başlangıcı.",
        reversed: "Kafa karışıklığı, iletişim kopuklukları veya yanlış kararlar nedeniyle enerjinin boşa gitmesi.",
        image: "/cards/swords/sword_ace.png"
    },
    {
        id: 51,
        name: "2 of Swords",
        arcana: "Minor",
        number: 2,
        upright: "Zorlu bir karar aşamasında duygularını bir kenara bırakıp mantıklı bir denge kurmaya çalışıyorsun.",
        reversed: "Gerçeklerden kaçma hali sona eriyor; artık göz bağlarını çıkarıp bir seçim yapmak zorundasın.",
        image: "/cards/swords/sword_2.png"
    },
    {
        id: 52,
        name: "3 of Swords",
        arcana: "Minor",
        number: 3,
        upright: "Duygusal bir acı, kalp kırıklığı veya gerçeklerin canını yaktığı zorlu bir iyileşme süreci.",
        reversed: "Acının hafiflemesi, bağışlama yoluna girme ve zihinsel olarak iyileşmeye başlama zamanı.",
        image: "/cards/swords/sword_3.png"
    },
    {
        id: 53,
        name: "4 of Swords",
        arcana: "Minor",
        number: 4,
        upright: "Zihinsel yorgunluğu atmak için geri çekilme, dinlenme ve derin bir tefekkür vaktindesin.",
        reversed: "Dinlenme sürecinin bitmesi, hayata geri dönme veya uykusuzluk ve zihinsel huzursuzluk.",
        image: "/cards/swords/sword_4.png"
    },
    {
        id: 54,
        name: "5 of Swords",
        arcana: "Minor",
        number: 5,
        upright: "Kazanılmış bir zafer olsa da, bu çatışmanın getirdiği bedeller ve kaybedenlerin kırgınlığı var.",
        reversed: "Anlamsız çatışmalardan vazgeçme, barış arayışı veya eski yaraların tekrar açılması.",
        image: "/cards/swords/sword_5.png"
    },
    {
        id: 55,
        name: "6 of Swords",
        arcana: "Minor",
        number: 6,
        upright: "Zorlu sulardan daha sakin kıyılara doğru, zihinsel bir huzura ve değişime yolculuk yapıyorsun.",
        reversed: "Değişime direnç göstermek veya geçmişin duygusal yüklerinden kurtulamamak seni yavaşlatıyor.",
        image: "/cards/swords/sword_6.png"
    },
    {
        id: 56,
        name: "7 of Swords",
        arcana: "Minor",
        number: 7,
        upright: "Kendi çıkarlarını korumak için strateji geliştirme, gizlilik veya bazen kurnazca bir yaklaşım.",
        reversed: "Gizli gerçeklerin açığa çıkması, vicdan azabı veya stratejilerin işe yaramaması durumu.",
        image: "/cards/swords/sword_7.png"
    },
    {
        id: 57,
        name: "8 of Swords",
        arcana: "Minor",
        number: 8,
        upright: "Zihinsel kısıtlamalar ve korkular nedeniyle kendini çaresiz ve kapana kısılmış hissediyorsun.",
        reversed: "Kendi yarattığın hapishaneden çıkış yolunu bulma, özgürleşme ve bakış açısını değiştirme süreci.",
        image: "/cards/swords/sword_8.png"
    },
    {
        id: 58,
        name: "9 of Swords",
        arcana: "Minor",
        number: 9,
        upright: "Gece uykularını kaçıran kaygılar, kabuslar ve zihinsel baskıların yarattığı derin bir endişe hali.",
        reversed: "Korkularla yüzleşme, kaygıların yersiz olduğunu anlama ve karanlıktan aydınlığa çıkış.",
        image: "/cards/swords/sword_9.png"
    },
    {
        id: 59,
        name: "10 of Swords",
        arcana: "Minor",
        number: 10,
        upright: "Zorlu bir dönemin dibe vurmasıyla gelen bitiş; artık her şeyin sona erdiği ve yeni bir şafağın yaklaştığı an.",
        reversed: "Yıkımdan sağ çıkma, felaketi atlatma ve en kötüsünün geride kalmasıyla gelen yavaş iyileşme.",
        image: "/cards/swords/sword_10.png"
    },
    {
        id: 60,
        name: "Page of Swords",
        arcana: "Minor",
        number: 11,
        upright: "Zihinsel olarak aktif, meraklı ve yeni bilgileri hızla öğrenmeye hevesli genç bir enerji.",
        reversed: "Boş konuşmalar, aldatıcı haberler veya dürüstlükten uzak, manipülatif bir iletişim tarzı.",
        image: "/cards/swords/sword_page.png"
    },
    {
        id: 61,
        name: "Knight of Swords",
        arcana: "Minor",
        number: 12,
        upright: "Hedefine odaklanmış, hızlı kararlar alan ve mantığın gücüyle ileriye atılan kararlı bir aksiyon.",
        reversed: "Düşüncesizce yapılan aceleci hamleler veya kırıcı sözlerle gelen bir çatışma ortamı.",
        image: "/cards/swords/sword_knight.png"
    },
    {
        id: 62,
        name: "Queen of Swords",
        arcana: "Minor",
        number: 13,
        upright: "Zekasıyla duygularını dengeleyen, dürüst ve sınırlarını net çizen bağımsız bir otorite.",
        reversed: "Soğuk ve acımasız eleştiriler, aşırı katılık veya mantığın duyguları tamamen yok sayması.",
        image: "/cards/swords/sword_queen.png"
    },
    {
        id: 63,
        name: "King of Swords",
        arcana: "Minor",
        number: 14,
        upright: "Adalet ve dürüstlükle hükmeden, entelektüel gücüyle sorunları çözen bilge bir lider.",
        reversed: "Otoritenin kötüye kullanımı, manipülasyon veya zekanın başkalarını ezmek için kullanılması.",
        image: "/cards/swords/sword_king.png"
    },
   {
        id: 64,
        name: "Ace of Pentacles",
        arcana: "Minor",
        number: 1,
        upright: "Maddi dünyada yeni bir fırsat, refah ve finansal güvenliğin temelini atacak sağlam bir başlangıç.",
        reversed: "Kaçırılan fırsatlar, mali kayıplar veya yanlış zamanlanmış yatırımlar nedeniyle yaşanan duraksama.",
        image: "/cards/pentacles/pentacle_ace.png"
    },
    {
        id: 65,
        name: "2 of Pentacles",
        arcana: "Minor",
        number: 2,
        upright: "Değişen öncelikler arasında denge kurmaya çalışıyor, kaynaklarını esneklikle yönetiyorsun.",
        reversed: "Sorumlulukların altında ezilme, dağınıklık ve finansal dengesizliğin getirdiği stresli bir dönem.",
        image: "/cards/pentacles/pentacle_2.png"
    },
    {
        id: 66,
        name: "3 of Pentacles",
        arcana: "Minor",
        number: 3,
        upright: "Ekip çalışması ve ustalıkla yürütülen projelerde başarı kazanıyor, emeğinin takdirini görüyorsun.",
        reversed: "İş birliği eksikliği, motivasyon kaybı veya özensiz çalışma nedeniyle yaşanan verimsizlik.",
        image: "/cards/pentacles/pentacle_3.png"
    },
    {
        id: 67,
        name: "4 of Pentacles",
        arcana: "Minor",
        number: 4,
        upright: "Maddi güvenliğini koruma altına alırken, aşırı kontrolcü ve tutucu bir tavır sergiliyor olabilirsin.",
        reversed: "Maddi konularda aşırı harcama veya tam tersi, kısıtlayıcı korkuları bırakıp cömertleşme süreci.",
        image: "/cards/pentacles/pentacle_4.png"
    },
    {
        id: 68,
        name: "5 of Pentacles",
        arcana: "Minor",
        number: 5,
        upright: "Maddi zorluklar veya dışlanmışlık hissi yaşarken, aslında çok yakınındaki yardımı fark edemiyorsun.",
        reversed: "Zor günlerin geride kalması, mali durumun düzelmeye başlaması ve kaybolan güvenin geri gelmesi.",
        image: "/cards/pentacles/pentacle_5.png"
    },
    {
        id: 69,
        name: "6 of Pentacles",
        arcana: "Minor",
        number: 6,
        upright: "Kaynakların adil bir şekilde paylaşıldığı, yardımseverlik ve bolluğun dengelendiği bir dönemdesin.",
        reversed: "Bencillik, adaletsiz paylaşım veya borç ilişkilerinde yaşanan suistimaller dengeni bozabilir.",
        image: "/cards/pentacles/pentacle_6.png"
    },
    {
        id: 70,
        name: "7 of Pentacles",
        arcana: "Minor",
        number: 7,
        upright: "Ektiğin tohumların büyümesini beklerken sabırla ilerlemeni değerlendiriyor ve uzun vadeye odaklanıyorsun.",
        reversed: "Emeklerin karşılığını alamama korkusu, sabırsızlık veya yanlış strateji sonucu yaşanan hayal kırıklığı.",
        image: "/cards/pentacles/pentacle_7.png"
    },
    {
        id: 71,
        name: "8 of Pentacles",
        arcana: "Minor",
        number: 8,
        upright: "Yeni bir beceri geliştirmek için gösterdiğin titiz çaba ve odaklanma, seni ustalık yoluna götürüyor.",
        reversed: "İşten sıkılma, detaylara dikkat etmeme veya mükemmeliyetçilik yüzünden ilerleyememe hali.",
        image: "/cards/pentacles/pentacle_8.png"
    },
    {
        id: 72,
        name: "9 of Pentacles",
        arcana: "Minor",
        number: 9,
        upright: "Maddi bağımsızlığını kazanmış, emeğinin meyvelerini tek başına ve huzurla tadan birisin.",
        reversed: "Finansal bağımlılık, aşırı lüks tutkusu veya dışarıdan iyi görünen ama içte boş olan bir refah.",
        image: "/cards/pentacles/pentacle_9.png"
    },
    {
        id: 73,
        name: "10 of Pentacles",
        arcana: "Minor",
        number: 10,
        upright: "Aileden gelen miras, köklü gelenekler ve uzun vadeli finansal başarının getirdiği tam bir doyum.",
        reversed: "Ailevi çekişmeler, miras sorunları veya maddi kayıplar nedeniyle sarsılan geleneksel düzen.",
        image: "/cards/pentacles/pentacle_10.png"
    },
    {
        id: 74,
        name: "Page of Pentacles",
        arcana: "Minor",
        number: 11,
        upright: "Yeni bir eğitim veya iş fırsatıyla ilgili somut adımlar atmaya hazır, öğrenmeye hevesli bir enerji.",
        reversed: "Pratik olmayan hayaller, odaklanma güçlüğü veya beklenen fırsatların gecikmesi.",
        image: "/cards/pentacles/pentacle_page.png"
    },
    {
        id: 75,
        name: "Knight of Pentacles",
        arcana: "Minor",
        number: 12,
        upright: "Yavaş ama emin adımlarla, sadakat ve büyük bir disiplinle hedeflerine doğru ilerliyorsun.",
        reversed: "Aşırı rutinleşme, inatçılık veya harekete geçmekte zorlandığın bir durağanlık hali.",
        image: "/cards/pentacles/pentacle_knight.png"
    },
    {
        id: 76,
        name: "Queen of Pentacles",
        arcana: "Minor",
        number: 13,
        upright: "Pratik, cömert ve anaç tavrıyla hem maddi hem de manevi güvenliği sağlayan bilge bir figür.",
        reversed: "Bakım verememe, iş ve özel hayat arasındaki dengesizlik veya maddi konulara aşırı odaklanma.",
        image: "/cards/pentacles/pentacle_queen.png"
    },
    {
        id: 77,
        name: "King of Pentacles",
        arcana: "Minor",
        number: 14,
        upright: "Finansal ustalığa ulaşmış, istikrarlı ve koruyucu liderliğiyle bolluğu yöneten bir otorite.",
        reversed: "Maddi hırs, yolsuzluk veya gücün sadece para ve mülkiyet üzerinden tanımlanması.",
        image: "/cards/pentacles/pentacle_king.png"
    }
];

/** @deprecated Use `tarotReadingCards` */
export const tarotCards = tarotReadingCards