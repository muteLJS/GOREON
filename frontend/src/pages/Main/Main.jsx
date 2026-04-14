import "./Main.scss";

function Main() {
  return (
    <main className="main-page">
      <section className="main-page__section">
        <div className="section__AI sections">
          <div className="AI_description">
            <button>AI 전자기기 추천 서비스</button>
            <p>
              복잡한 스펙비교,
              <br /> 이제 <span className="input">AI 고르미</span>에게
              <br /> 맡기세요
            </p>
            <p>
              용도 · 예산 · 사용환경을 말하면
              <br /> 수천 개의 제품 중 딱 맞는 전자기기를 골라드려요
              <div className="br">어려운 스펙 설명 없이, 쉽고 빠르게.</div>
            </p>
          </div>
          <img src="assets/logo/ai/characters.svg" alt="AI_logo" />
        </div>
        <div className="AI_chat">
          <form action="#" method="POST">
            <div className=""></div>
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
