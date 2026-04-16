import "./Main.scss";
import Cart from "../../components/cart/cart";
import Like from "../../components/like/like";
import AI_Logo from "assets/logo/ai/character.svg";

function Main() {
  return (
    <main className="main-page">
      <section className="main-page__section">
        <div className="section__AI sections">
          <div className="AI_description">
            <button>
              <div className="circle"></div>AI 전자기기 추천 서비스
            </button>
            <p className="Main_text">
              복잡한 스펙비교,
              <br /> 이제 <span className="input">AI 고르미</span>에게
              <br /> 맡기세요
            </p>
            <p className="sub_text">
              용도 · 예산 · 사용환경을 말하면
              <br /> 수천 개의 제품 중 딱 맞는 전자기기를 골라드려요
              <div className="br">어려운 스펙 설명 없이, 쉽고 빠르게.</div>
            </p>
            {/* <div className="test-icons">
              <Cart />
              <Like />
            </div> */}
          </div>
          <img src={AI_Logo} alt="AI_logo" className="AI_logo" />
        </div>
        <div className="AI_chat_container">
          <form action="#" method="POST">
            <div className="AI_Chat_row_1">
              <input type="text" name="ai_chat" id="ai_chat" />
              <button></button>
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
      </section>
      <section className="main-page__section">
        <div className="section__AI_Review sections" />
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
