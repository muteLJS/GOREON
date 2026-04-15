import styles from "./Main.module.scss";
import { registerModuleStyles } from "styles/registerModuleStyles";
import AI_Logo from "assets/logo/ai/character.svg";
import Review_user from "assets/Icons/review_user.svg";

registerModuleStyles(styles);

function Main() {
  const handleInput = (e) => {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  return (
    <main className="main-page">
      <h1 className="hidden">메인 페이지</h1>
      <section className="main-page__section">
        <div className="section__AI sections">
          <div className="AI_container">
            <div className="AI_description">
              <button>
                <div className="circle"></div>AI 전자기기 추천 서비스
              </button>
              <h2 className="AI_Main_text">
                복잡한 스펙 비교,
                <br /> 이제 <span className="input">AI 고르미</span>에게
                <br /> 맡기세요
              </h2>
              <p className="AI_sub_text">
                용도 · 예산 · 사용환경을 말하면
                <br /> 수천 개의 제품 중 딱 맞는 전자기기를 골라드려요
                <br />
                어려운 스펙 설명 없이, 쉽고 빠르게.
              </p>
              <div className="AI_Chat_row_2">
                <button>🎬 유튜브용 편집용 노트북</button>
                <button>🎮 FPS 게임에 맞는 모니터</button>
                <button>📚 대학생 첫 노트북 50만원 이하</button>
                <button>👨‍👩‍👦 부모님 쉽게 쓸 테블릿</button>
                <button>🖨 가정용 프린터 추천</button>
              </div>
            </div>
            <img src={AI_Logo} alt="AI_logo" className="AI_logo" />
          </div>
          <div className="AI_chat_container">
            <form action="#" method="POST">
              <div className="AI_Chat_row_1">
                <textarea
                  name="ai_chat"
                  id="ai_chat"
                  rows={1}
                  placeholder="무엇이든 물어보세요!"
                  onInput={handleInput}
                />
                <button>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="green">
                    <circle cx="12" cy="12" r="12" fill="#0AA6A6" />
                    <path
                      d="M8 13L12 9L16 13"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <div className="AI_Chat_row_2">
                <button>🎬 유튜브용 편집용 노트북</button>
                <button>🎮 FPS 게임에 맞는 모니터</button>
                <button>📚 대학생 첫 노트북 50만원 이하</button>
                <button>👨‍👩‍👦 부모님 쉽게 쓸 테블릿</button>
                <button>🖨 가정용 프린터 추천</button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <section className="main-page__section">
        <div className="section__AI_Review sections">
          <div className="text_box">
            <h2>AI 추천 제품 실제 구매 리뷰</h2>
            <h4>고르미의 추천을 받고 구매한 고객들의 생생한 리뷰입니다.</h4>
          </div>
          <div className="review_main">
            <div className="">
              <div className="user_info">
                <img src={Review_user} alt="review_user_img" />
                <p className="user_name">User**6*</p>
              </div>
            </div>
            <p className="item_name">갤럭시 탭 S10</p>
            <p className="description">
              고르미가 “RAM 6GB면 충분한 이유”를 어르신 눈높이에서 설명해줬어요. 처음엔 아이패드랑
              고민했는데 안드로이즈가 더 익숙하실 거라는 포인트가 정확했습니다. 부모님도 잘 쓰고
              계세요!
            </p>
          </div>
        </div>
      </section>
      <section className="main-page__section">
        <div className="section__Set_Category sections" />
      </section>
      <section className="main-page__section">
        <div className="section__Collarborates sections" />
      </section>
      <section className="main-page__section">
        <div className="section__New_Update sections" />
      </section>
    </main>
  );
}

export default Main;
