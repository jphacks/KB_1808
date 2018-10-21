# Temp Coaster

[![Temp Coaster!](image.png)](https://www.youtube.com/watch?v=??????????)

## 製品概要
### Temp × Tech
#### 『温度を視覚的に』

せっかく淹れたコーヒーを、冷める前に教えてくれるデバイス。
集中して忘れていても、温め直すあなたの手間を増やしません。


### 背景（製品開発のきっかけ、課題等）
寒くなってきたこの時期、コーディングなどの作業を行う際、温かいコーヒーを淹れることがある。
しかし、集中していると飲むことを忘れてしまい、冷たくなってしまうことがたびたび起こってしまう。
私たちは、そんな時に冷める前に教えてくれるサービスがあれば、わざわざ温め直す手間が省けるのではないかと考え、このデバイスを作成した。

また、熱い飲み物が飲めない『猫舌』の人やあまりにも熱すぎる飲み物の場合、飲み物を適温で確認する方法が、実際に飲んでみるなどの方法に限られてしまう。この時、飲み物が適温であるタイミングでお知らせしてくれるデバイスがあれば、無理をして火傷をすることがなくなるのではないかと考えている。

なお、『Temp × Tech』の"Temp"には、温度という意味の≪Temperature≫と、一時的な置き場という意味で≪Temporary≫という2種の単語の意味が込められている。

### 製品説明（具体的な製品の説明）
#### 操作方法
ユーザは、コースタ型のデバイス『Temp Coaster』に、置くだけで自動的にオンにすることができる。
今回は3つのモードを搭載している。
* 温かいものを冷める前に教えてくれるモード
* 熱いものを適温になった時に教えてくれるモード
* 冷たいものがぬるくなってきた時に教えてくれるモード

なお、これらのモードの切り替えは、本体に搭載しているボタンを押すことによって切り替えることが可能である。

また、通知やユーザ適温設定に関しては、LINEのトークを利用し、お知らせ・設定を行うことができる。

#### データ処理に関して
作成した『Temp Coaster』は、Wi-Fiを利用し、ネットワークを介して温度情報をAWS APIに送信し、API側でデータ処理を行う。その後ユーザが指定した温度になると、AWS APIよりGoogle Apps Script(GAS)のスクリプトを実行する。GAS内のスクリプトでは、LINE Messaging APIを利用し、ユーザに対し適温になったことをお知らせするメッセージを送信する。

また、ユーザ側からの適温設定(温度設定)に関しては、LINE Messaging APIを使用し、ユーザがテキストメッセージでLINE送信を行うことにより、AWS APIへデータを送信している。

### 特長

#### 1. シンプルなデザイン
バッテリーを搭載しているためコードレスな上に、机に馴染むデザインのデバイス。
操作は「置く」・「ボタンを押す」だけのシンプル操作のみ。
ユーザが置くと、コースタに搭載されているライトが緑色に光り、検知したことをお知らせ。モードの切り替えはボタンを押すことによって、ライトの配色が変わり、視覚的でわかりやすい操作感を実現。

#### 2.誰もが使っているLINEで通知
LINEを利用して、飲み物がぬるくなってきていることをお知らせ。別途専用のアプリケーションをインストールすることなく使用でき、スマートフォン以外のデバイスで通知を受け取ることも可能。気軽に導入することが出来ます。

#### 3. ユーザごとの適温設定
人によって、それぞれ感じる適温の設定に対応。
LINEのトークに自分の適温の温度を送信するだけで設定完了。あとはデバイスに置いて、モードを切り替えるだけ。

### 解決出来ること
この製品を利用することで、今まで見ることができなかった温度の変化を簡単に可視化することが可能となると考える。触れて確認することしかできなかったものを、デバイス1つで可能になるため、ユーザが火傷してしまうなどの危険を減少させることが可能であると考える。

### 今後の展望
現状は、カップなどに入った飲み物を置くことを想定して作成している。しかしながら、飲み物だけでなく、キッチン作業において冷蔵庫に入れる前などの、食品を冷ますという点においても活用ができると考えている。デバイス自身のセンサ位置などを更に工夫することによって、置けるものを多様化することが可能となる。

また、現在は適温設定をユーザからの操作が必要となっているが、API側にデータベースを構築しているため、ユーザのコップの持ち・置きのタイミングを計測し保存することによって、各個人ごとの適温を的確にお知らせすることが可能となると考えている。

## 開発内容・開発技術
* コースタ型のデバイス
* AWS側のAPI
* Google Apps Script

### 活用した技術
* Wi-Fi
* REST API
* センシングデバイス開発

#### API・データ
* LINE Messaging API
* AWS Lambda


#### フレームワーク・ライブラリ・モジュール
*
*

#### デバイス
* ものを置く「コースタ型のデバイス」
* スマートフォン

### 研究内容・事前開発プロダクト（任意）
ご自身やチームの研究内容や、事前に持ち込みをしたプロダクトがある場合は、こちらに実績なども含め記載をして下さい。

*
*


### 独自開発技術（Hack Dayで開発したもの）
#### 2日間に開発した独自の機能・技術
* 独自で開発したものの内容をこちらに記載してください
* 特に力を入れた部分をファイルリンク、またはcommit_idを記載してください（任意）
