/*
 * ここを編集すると、見られる動画・お手伝い・時間を変更できます。
 * 編集したら GitHub に保存（コミット）すると、数分でタブレット側にも反映されます。
 */
window.KIDS_CONFIG = {
  // 画面左上に出るアプリ名
  appName: "おうちどうが",

  // 最初に再生ボタンを押してから、お手伝いタイムになるまでの時間（分）
  limitMinutes: 60,

  // 残り何分でお知らせを出すか（0 にすると出しません）
  warnMinutes: 5,

  // 家族用のパスワード（数字）。お手伝いカードの「おうちの人の かくにん」と
  // おうちの人メニューで入力が必要になります。空欄 "" にするとパスワードなしで確認できます。
  parentPin: "1026",

  // 1回のお手伝いタイムで出すカードの枚数
  choresPerBreak: 3,

  // お手伝いの候補（この中からランダムに選ばれます）
  chores: [
    { emoji: "🧸", text: "おもちゃを かたづける" },
    { emoji: "👟", text: "げんかんの くつを そろえる" },
    { emoji: "🍽️", text: "おさらを だいどころに はこぶ" },
    { emoji: "👕", text: "せんたくものを たたむ" },
    { emoji: "🧽", text: "テーブルを ふく" },
    { emoji: "🗑️", text: "ゴミを ゴミばこに すてる" },
    { emoji: "📚", text: "えほんを ほんだなに もどす" },
    { emoji: "🌱", text: "おはなに みずを あげる" },
    { emoji: "🥢", text: "おはしを ならべる" },
    { emoji: "🛁", text: "おふろの じゅんびを てつだう" }
  ],

  // 見られる動画のリスト
  //   url  : YouTube の URL をそのまま貼り付けてOK（id だけでも可）
  //   title: リストに表示する名前
  //   lang : "ja"（にほんご） / "en"（えいご） / それ以外は「そのた」
  // ※ 下の3本は動作確認用のサンプルです。お子さん用の動画に差し替えてください。
  videos: [
    { url: "https://www.youtube.com/watch?v=XqZsoesa55w", title: "Baby Shark Dance", lang: "en" },
    { url: "https://www.youtube.com/watch?v=yCjJyiqpAuU", title: "Twinkle Twinkle Little Star", lang: "en" },
    { url: "https://www.youtube.com/watch?v=e_04ZrNroTo", title: "Wheels on the Bus", lang: "en" }
  ]
};
