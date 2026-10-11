/*
 * ここを編集すると、見られる動画・お手伝い・時間を変更できます。
 * 編集したら GitHub に保存（コミット）すると、数分でタブレット側にも反映されます。
 */
window.KIDS_CONFIG = {
  // 画面左上に出るアプリ名
  appName: "おうちどうが",

  // 最初に再生ボタンを押してから、チャレンジタイムになるまでの時間（分）
  limitMinutes: 60,

  // 残り何分でお知らせを出すか（0 にすると出しません）
  warnMinutes: 5,

  // 家族用のパスワード（数字）。チャレンジカードの「おうちの人の かくにん」と
  // おうちの人メニューで入力が必要になります。空欄 "" にするとパスワードなしで確認できます。
  parentPin: "1026",

  // 1回のチャレンジタイムで出すカードの枚数
  choresPerBreak: 3,

  // チャレンジの候補（この中からランダムに選ばれます）。お手伝い以外もOK
  chores: [
    { emoji: "🧸", text: "おもちゃを かたづける" },
    { emoji: "👟", text: "げんかんの くつを そろえる" },
    { emoji: "🍽️", text: "おさらを だいどころに はこぶ" },
    { emoji: "👕", text: "せんたくものを たたむ" },
    { emoji: "🧽", text: "テーブルを ふく" },
    { emoji: "🗑️", text: "ゴミを ゴミばこに すてる" },
    { emoji: "📚", text: "えほんを ほんだなに もどす" },
    { emoji: "👩", text: "ママの おてつだいを する" },
    { emoji: "👵", text: "ばあばの おてつだいを する" },
    { emoji: "👴", text: "じいじの かたを もむ" },
    { emoji: "🧹", text: "おそうじを する" },
    { emoji: "💗", text: "かりんちゃんの おせわを する" },
    { emoji: "🍵", text: "おちゃを のむ" },
    { emoji: "🍪", text: "おかしを たべる" },
    { emoji: "🖍️", text: "えを かく" },
    { emoji: "📖", text: "ほんを よむ" },
    { emoji: "🦢", text: "おりがみを する" },
    { emoji: "🎈", text: "かりんちゃんと あそぶ" }
  ],


  // 見られる動画のリスト
  //   url  : YouTube の URL をそのまま貼り付けてOK（id だけでも可）
  //   title: リストに表示する名前
  //   lang : "ja"（にほんご） / "en"（えいご） / それ以外は「そのた」
  videos: [
    { url: "https://www.youtube.com/watch?v=4bMOTTJqGgM", title: "Baby Shark Doo Doo Doo 60 Min", lang: "en" },
    { url: "https://www.youtube.com/watch?v=mnmUByAF4gs", title: "パウ・パトロール のりものレスキュー名場面集", lang: "ja" },
    { url: "https://www.youtube.com/watch?v=CgIWoTsnnds", title: "お弁当を持ってピクニックに行くよ！ アニメキッズ", lang: "ja" },
    { url: "https://www.youtube.com/watch?v=5ztstz5-p5Q", title: "アンパンマンとバスボールで水遊び🫧バスボムを全部まぜたら何色になるかな？", lang: "ja" },
    { url: "https://www.youtube.com/watch?v=XVzOsABmDMk", title: "寝ている時に地震が来たらどうする？寒い時の地震にそなえよう！", lang: "ja" },
    { url: "https://www.youtube.com/watch?v=lgksiWXmnDo", title: "Baby Shark Hide'n Seek and Stories", lang: "en" },
    { url: "https://www.youtube.com/watch?v=S8Osy67vQIM", title: "The Wolf and the Seven Little Goats + More", lang: "en" },
    { url: "https://www.youtube.com/watch?v=aTnljqHzazY", title: "Will Baby Shark Defeat Halloween Mosquitoes?", lang: "en" },
    { url: "https://www.youtube.com/watch?v=9N02CFbHhu8", title: "Baby Shark with Bebefinn! 🦈", lang: "en" },
    { url: "https://www.youtube.com/watch?v=7wXMgupUNzI", title: "[TOP5] 😨Roar! Dino Special🦖", lang: "en" },
    { url: "https://www.youtube.com/watch?v=28wZnI5VKC8", title: "[TOP 5⭐️] Ten on a Mat, Walking Walking & Baby Shark 2", lang: "en" },
    { url: "https://www.youtube.com/watch?v=stoUSZXE_Eg", title: "Bebefinn Heroes vs. Mosquito Villain🦟⚔️🦸‍♂️ Go, Bebefinn Heroes!⚡️", lang: "en" },
    { url: "https://www.youtube.com/watch?v=MIubdGokg_Y", title: "Rain or Snow? Learn Weather Songs with Bebefinn Nursery Rhymes", lang: "en" },
    { url: "https://www.youtube.com/watch?v=2QkySENx6fU", title: "The Restaurant Play Song 🍕🍔", lang: "en" },
    { url: "https://www.youtube.com/watch?v=MLVl0ZogK_k", title: "Welcome to Minjee's New Channel!", lang: "en" },
    { url: "https://www.youtube.com/watch?v=R0zwyX2La5w", title: "Bebe Ay! Bebefinn Song and More to Sing Along", lang: "en" },
    { url: "https://www.youtube.com/watch?v=b9cwFaiLzmc", title: "BEST Good Morning Baby Shark and Dinosaurs!", lang: "en" },
    { url: "https://www.youtube.com/watch?v=LdmDeKY9a30", title: "Baby Car Vroom and More Car Songs for Kids", lang: "en" },
    { url: "https://www.youtube.com/watch?v=scsheW0G5rE" },
    { url: "https://www.youtube.com/watch?v=Oijqs9PXTgw" },
    { url: "https://www.youtube.com/watch?v=tdzFViW-tEA" },
    { url: "https://www.youtube.com/watch?v=ndTer7VgcBM" },
    { url: "https://www.youtube.com/watch?v=gNczMuZYQkQ" },
    { url: "https://www.youtube.com/watch?v=2y5H1htGDFw", title: "アンパンマンミュージアム全国5ヶ所まとめ！どーこだ？ぱいきんまん・コキンちゃん・だだんだんをさがせ！【総集編・100分】", lang: "ja" },
    { url: "https://www.youtube.com/watch?v=3aaz18BCAxs", title: "【最新】横浜アンパンマンこどもミュージアムでばいきんまんはどーこだ？抱っこばかりのしーちゃん…素敵なお姉ちゃんになれるかな？", lang: "ja" },
    { url: "https://www.youtube.com/watch?v=bT5lAjbcw9Q", title: "Chumbala Cachumbala Dance + More", lang: "en" },
    { url: "https://www.youtube.com/watch?v=QHNptc9hGk0", title: "Roar! Learn Colors with Skeleton Dinosaur🦖 15min", lang: "en" },
    { url: "https://www.youtube.com/watch?v=5WfxDqWboOw", title: "[BEST] ☠️ Spooky Skeletons Special", lang: "en" },
    { url: "https://www.youtube.com/watch?v=ltvRLOH3XkA", title: "🌋Baby Shark's Volcano Adventure!", lang: "en" },
    { url: "https://www.youtube.com/watch?v=hRVov6WIJTY", title: "👻 Boo! NEW Halloween Songs for Kids", lang: "en" },
    { url: "https://www.youtube.com/watch?v=7muxnzQZS28", title: "Bebefinn ABC Song + more nursery rhymes", lang: "en" },
    { url: "https://www.youtube.com/watch?v=95UDVcUMa3M", title: "Learn Safety Rules Together with Bebefinn!", lang: "en" },
    { url: "https://www.youtube.com/watch?v=z0YAh7KVvL0", title: "Good Morning Song & More! ☀️", lang: "en" },
    { url: "https://www.youtube.com/watch?v=GC_mV1IpjWA", title: "Under the Sea (The Little Mermaid)", lang: "en" },
    { url: "https://www.youtube.com/watch?v=SXKlJuO07eM", title: "Part of Your World (The Little Mermaid)", lang: "en" },
    { url: "https://www.youtube.com/watch?v=7mputCb4vas", title: "リトル・マーメイド Part Of Your World （英語字幕付き）", lang: "en" },
    { url: "https://www.youtube.com/watch?v=UXKe2QNdxYU", title: "アラジン A Whole New World 英語字幕付き", lang: "en" }
  ]
};
