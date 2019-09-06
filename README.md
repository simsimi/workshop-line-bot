# workshop-line-bot

[SimSimi Workshop](https://workshop.simsimi.com)의 [SmallTalk API](https://workshop.simsimi.com/document)와 [LINE Messaging API](https://developers.line.biz/en/services/messaging-api/)를 이용하여 LINE 챗봇을 만드는 방법에 대해 설명합니다.

&nbsp;

## 필요한 계정 목록

챗봇을 만들기 위해 다음의 계정이 필요합니다. 모두 가입을 완료한 다음 진행해주세요.

- [SimSimi Workshop](https://workshop.simsimi.com) - 챗봇에 필요한 대화엔진을 사용하는데 필요합니다.
- [LINE Developers](https://developers.line.biz/) - 실제 챗봇을 생성하는데 필요합니다.
- [Heroku](https://www.heroku.com/) - 챗봇 대화엔진이 올라갈 서버를 생성하는데 필요합니다.

&nbsp;

## LINE Developers 설정하기

### Channel 생성하기

* [LINE Developers](https://developers.line.biz/)에 로그인합니다.

* 새 Provider를 만들어야 합니다. **Create New Provider**를 눌러 적당한 이름을 입력하고 **Confirm**과 **Create**를 차례로 눌러 Provider를 생성합니다.
![](/img/new_provider_1.png)
![](/img/new_provider_2.png)
![](/img/new_provider_3.png)

* Provider 생성을 완료했다면 이번에는 새 Channel을 만들어야 합니다. Provider를 생성한 직후라면 아래와 같이 3가지의 Channel을 생성할 수 있는 버튼이 있습니다. 이번에 필요한 Channel은 **Messaging API**입니다. **Messaging API**의 **Create Channel**을 눌러 생성 절차를 진행합니다.
![](/img/new_channel_1.png)

* **App icon**은 챗봇의 프로필 사진이 됩니다. **App name**은 챗봇의 닉네임이 됩니다. 나머지 항목들은 필수 항목만 적당한 값을 입력하고, **Confirm**을 눌러 다음 단계로 넘어갑니다.
![](/img/new_channel_2.png)

* **LINE Official Account Terms of Use**와 **LINE Official API Terms of Use**에 체크하고, **Create**를 눌러 Channel 생성을 완료합니다.

### Channel 설정하기

* 생성된 Channel을 클릭하여 Channel 정보 화면으로 진입합니다. **Channel settings**탭에서 챗봇에 필요한 항목들을 확인합니다.
![](/img/channel_settings_1.png)

#### Basic information

* **Channel secret** - 챗봇 코드에서 사용될 값입니다.
![](/img/channel_secret_1.png)

#### Messaging settings

* **Channel access token (long-lived)** - 챗봇 코드에서 사용될 값입니다. **Issue**를 눌러 값을 발급받습니다.
![](/img/channel_access_token_1.png)
![](/img/channel_access_token_2.png)
![](/img/channel_access_token_3.png)

* **Use webhooks** - **Edit**을 누르고 **Enabled**로 바꾼 뒤, **Update** 해줍니다.
![](/img/use_webhook_1.png)

* **Webhook URL** - 챗봇 코드를 서버에 올린 뒤에 값을 넣어줍니다. heroku 배포 후 다시 설명합니다. [설명 바로가기](https://github.com/simsimi/workshop-line-bot/blob/master/README.md#Webhook-연결하기)
![](/img/webhook_url_1.png)

#### Using LINE@ features

* **Auto-reply messages** - **Set message**를 눌러 뜨는 창에서 **상세 설정 > 자동 답변**의 값을 **끔**으로 설정해줍니다.
![](/img/auto_reply_messages_1.png)
![](/img/auto_reply_messages_2.png)

* **Greeting messages** - **Set message**를 눌러 뜨는 창에서 **기본 설정 > 인사 메시지**의 값을 **켬**으로 설정한 뒤, **인사 메시지 설정**을 눌러 뜨는 화면에서 챗봇과 처음 대화를 시작했을 때 챗봇이 할 인사말을 설정해줍니다.
![](/img/greeting_messages_1.png)
![](/img/greeting_messages_2.png)
![](/img/greeting_messages_3.png)

#### Bot Informations

* **QR code of your bot** - 이 QR code로 만들어진 챗봇을 LINE 친구로 추가할 수 있습니다. 친구로 추가된 챗봇을 테스트해 볼 수 있습니다. 또는 다른 사람들에게 QR code를 공유하여 내가 만든 챗봇을 사용하도록 할 수 있습니다.
![](/img/qr_code_of_your_bot_1.png)

&nbsp;

## SimSimi Workshop 프로젝트 API Key 가져오기

* [SimSimi Workshop](https://workshop.simsimi.com)에 로그인하고, [대시보드 페이지](https://workshop.simsimi.com/dashboard)로 이동합니다.
![](/img/go_to_dashboard_1.png)

* 데모 프로젝트가 기본으로 생성되어 있는 것을 확인할 수 있습니다. **API 키**가 챗봇 코드에서 사용될 값이므로 복사해둡니다.
![](/img/demo_project_api_key_1.png)

&nbsp;

## 대화엔진 설정하기

* [workshop-line-bot GitHub 페이지](https://github.com/simsimi/workshop-line-bot)에서 **Clone or download > Download ZIP**을 눌러 챗봇 코드를 다운받습니다.
![](/img/git_code_download_1.png)

* 다운받은 챗봇 코드의 압축을 풀고, `config` 폴더 안의 텍스트 파일에 필요한 값들을 설정해줍니다. 필수 항목은 반드시 설정해주어야 합니다.
    * **API Key** - 필수
        * `/config/api_key.txt`에 SimSimi Workshop 프로젝트의 **API 키**를 붙여넣습니다.
    * **Channel Access Token** - 필수
        * `/config/channel_access_token.txt`에 LINE Channel의 **Channel access token (long-lived)** 값을 붙여넣습니다.
    * **Channel Secret** - 필수
        * `/config/channel_secret.txt`에 LINE Channel의 **Channel secret** 값을 붙여넣습니다.
    * **챗봇 이름** - 필수
        * `/config/bot_name.txt`에 챗봇이 불릴 수 있는 모든 이름을 입력해주세요. (ex. 홍길동, 길동 등) 
        * `홍길동,길동`와 같은 방식으로 입력합니다. 
    * **대화세트 생성 국가**
        * 사용할 대화세트의 생성 국가를 지정합니다. 이 값을 지정하면 원하는 지역에서 생성된 대화세트를 필터할 수 있습니다.
        * `/config/country.txt`에 [ISO-3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) 국가코드를 최대 10개 열거합니다. (ex. `kr,us`)
    * **답변문장 나쁜말 확률**
        * 답변문장의 나쁜말 확률을 제한합니다.
        * `/config/atext_bad_prod_min.txt`와 `/config/atext_bad_prod_max.txt`에 각각 나쁜말 확률의 최솟값과 최댓값을 입력합니다.
        * `0.0`부터 `1.0` 사이의 소수점 첫째 자리 숫자 11개 중 하나로 입력하며, 값이 클수록 나쁜말일 확률이 높습니다.
    * **답변문장 길이**
        * 답변문장의 길이를 제한합니다.
        * `/config/atext_length_min.txt`와 `/config/atext_length_max.txt`에 각각 길이의 최솟값과 최댓값을 입력합니다.
        * 입력 가능한 길이의 범위는 `1~256`입니다.
    * **대화세트 생성 날짜**
        * 대화세트의 생성일 범위를 제한합니다.
        * `/config/regist_date_min.txt`와 `/config/regist_date_max.txt`에 각각 생성일의 최솟값과 최댓값을 입력합니다.
        * 입력 형식은 `yyyy-MM-dd HH:mm:ss`을 사용합니다.

&nbsp;

## Heroku에 배포하기

* [Heroku](https://www.heroku.com/)에 로그인합니다.

* 새 App을 만들어야 합니다. **Create new app**을 눌러 생성 절차를 진행합니다.
![](/img/heroku_1.png)

* **App name**에 중복되지 않는 적당한 이름을 입력합니다. **Choose a region**은 **United States**로 두면 됩니다. **Create app**을 눌러 생성을 완료합니다.
![](/img/heroku_2.png)

* 설정을 끝낸 챗봇 코드를 생성된 App에 배포해야 합니다.
    * [Git](https://git-scm.com/downloads)을 본인의 운영체제에 맞게 설치합니다.
    * [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)를 본인의 운영체제에 맞게 설치합니다.
    * 설치가 완료되면 본인의 운영체제에 맞게 아래 과정을 따릅니다.

### macOS

* **Spotlight**에 **terminal.app**을 검색하여 터미널 앱을 켭니다.
![](/img/spolight_terminal_1.png)
* 터미널 앱에 다음을 입력하여 heroku에 로그인합니다.
  ```bash
  $ heroku login
  ```
* 터미널에서 챗봇 코드의 폴더 위치로 이동합니다. 터미널에 `cd` 를 입력하고 한 칸 띄운 뒤, 챗봇 코드의 폴더를 드래그 해넣으면 편합니다.
![](/img/cd_project_1.png)
* 다음을 입력하여 git을 초기화합니다. `project-name`에는 본인이 만든 heroku 프로젝트의 이름을 넣습니다.
  ```bash
  $ git init
  $ heroku git:remote -a project-name
  ```
* 다음을 입력하여 heroku에 코드를 배포합니다.
  ```bash
  $ git add .
  $ git commit -am "make it better"
  $ git push heroku master
  ```

### Windows

* 실행(윈도우키 + R)에서 **cmd**를 검색하여 명령 프롬프트 창을 켭니다.
![](/img/run_cmd_1.png)
* 명령 프롬프트에 다음을 입력하여 heroku에 로그인합니다.
  ```bash
  $ heroku login
  ```
* 터미널에서 챗봇 코드의 폴더 위치로 이동합니다. 터미널에 `cd` 를 입력하고 한 칸 띄운 뒤, 챗봇 코드의 폴더를 드래그 해넣으면 편합니다.
![](/img/cd_project_2.png)
* 다음을 입력하여 git을 초기화합니다. `project-name`에는 본인이 만든 heroku 프로젝트의 이름을 넣습니다.
  ```bash
  $ git init
  $ heroku git:remote -a project-name
  ```
* 다음을 입력하여 heroku에 코드를 배포합니다.
  ```bash
  $ git add .
  $ git commit -am "make it better"
  $ git push heroku master
  ```

&nbsp;

## Webhook 연결하기

* LINE Developers의 Channel 설정 설명에서 보았던 **Channel settings > Messaging settings > Webhook URL**에 Webhook URL 값인 `https://app-name.herokuapp.com/callback`을 입력합니다. `app-name`에는 본인이 heroku에서 만든 앱의 이름을 넣어주세요. 
![](/img/connect_webhook_1.png)
* URL 확인이 완료되면 **Verify** 버튼을 눌러 **Success**가 잘 뜨는지 확인합니다.
![](/img/connect_webhook_2.png)

&nbsp;

## 대화 테스트하기

* 배포와 Webhook 연결이 완료되면 챗봇이 잘 작동하는지 확인합니다. 챗봇을 친구 추가하여 대화를 시도해봅니다.
* 챗봇 세부 설정(추가 파라미터)은 얼마든지 값을 바꿔서 다시 배포할 수 있습니다. 다시 배포하는 법은 아래와 같습니다.

### macOS

* 터미널 앱에서 챗봇 코드의 폴더 위치로 이동한 뒤, 다음을 입력하여 heroku에 코드를 배포합니다.
  ```bash
  $ git add .
  $ git commit -am "make it better"
  $ git push heroku master
  ```

### Windows

* 명령 프롬프트에서 챗봇 코드의 폴더 위치로 이동한 뒤, 다음을 입력하여 heroku에 코드를 배포합니다.
  ```bash
  $ git add .
  $ git commit -am "make it better"
  $ git push heroku master
  ```
