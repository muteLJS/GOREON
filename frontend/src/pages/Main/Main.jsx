import "./Main.scss";

import { useState } from "react";

import CharacterImage from "assets/logo/ai/character.svg";
import MainBackground from "assets/pc/Main/Main_back.svg";
import DirectIcon from "assets/icons/main/direct.svg";
import GameIcon from "assets/icons/main/game.svg";
import BookIcon from "assets/icons/main/book.svg";
import TogetherIcon from "assets/icons/main/together.svg";
import CartIcon from "assets/icons/cart-straight.svg";
import LikeIcon from "assets/icons/like-before.svg";

const promptButtons = [
  "🎬 유튜브용 편집용 노트북",
  "🎮 FPS 게임에 맞는 모니터",
  "📚 대학생 첫 노트북 50만원 이하",
  "👨‍👩‍👦 부모님 쉽게 쓸 태블릿",
  "🖨 가정용 프린터 추천",
];

const reviews = [
  {
    id: 1,
    user: "User**6*",
    product: "갤럭시 탭 S10",
    body: "고르미가 “RAM 6GB면 충분한 이유”를 어르신 눈높이에서 설명해줬어요. 처음엔 아이패드랑 고민했는데 안드로이즈가 더 익숙하실 거라는 포인트가 정확했습니다. 부모님도 잘 쓰고 계세요!",
  },
  {
    id: 2,
    user: "User**6*",
    product: "갤럭시 탭 S10",
    body: "처음엔 스펙만 보고 어려웠는데, 사용 환경 기준으로 딱 필요한 기능만 추려줘서 빠르게 결정했어요. 설명도 어렵지 않고 이해가 쉬웠습니다.",
  },
  {
    id: 3,
    user: "User**6*",
    product: "갤럭시 탭 S10",
    body: "예산 안에서 부모님이 쓰기 쉬운 제품을 추천해줘서 좋았어요. 실제로 받아보니 무게나 화면 크기도 추천 이유랑 잘 맞았습니다.",
  },
];

const categoryTabs = [
  { id: "video", label: "영상 편집", icon: DirectIcon },
  { id: "gaming", label: "게이밍", icon: GameIcon },
  { id: "student", label: "학생용", icon: BookIcon },
  { id: "parents", label: "부모님", icon: TogetherIcon },
];

const purposeProducts = [
  {
    id: 1,
    name: "MacBook Pro 14 M3",
    price: "2,419,000",
    tags: ["고성능", "디자인", "휴대성"],
    colors: ["#2b2b2b", "#d8d8d8"],
  },
  {
    id: 2,
    name: "MacBook Pro 14 M3",
    price: "2,419,000",
    tags: ["작업용", "고해상도", "프리미엄"],
    colors: ["#2b2b2b", "#d8d8d8"],
  },
  {
    id: 3,
    name: "MacBook Pro 14 M3",
    price: "2,419,000",
    tags: ["크리에이터", "저소음", "멀티태스킹"],
    colors: ["#2b2b2b", "#d8d8d8"],
  },
  {
    id: 4,
    name: "MacBook Pro 14 M3",
    price: "2,419,000",
    tags: ["전문가용", "베스트", "고급형"],
    colors: ["#2b2b2b", "#d8d8d8"],
  },
];

const bundleProducts = [
  {
    id: 1,
    title: "영상편집 패키지",
    summary: "큰 화면, 직관적 UI, 영상통화와 유튜브에 딱 맞게",
    price: "2,419,000",
    specs: [
      "CPU 인텔 코어 i5 14400F",
      "RAM 16GB",
      "VGA RTX 5060",
      "SSD 1TB NVMe",
    ],
  },
  {
    id: 2,
    title: "영상편집 패키지",
    summary: "큰 화면, 직관적 UI, 영상통화와 유튜브에 딱 맞게",
    price: "2,419,000",
    specs: [
      "CPU 인텔 코어 i5 14400F",
      "RAM 16GB",
      "VGA RTX 5060",
      "SSD 1TB NVMe",
    ],
  },
  {
    id: 3,
    title: "영상편집 패키지",
    summary: "큰 화면, 직관적 UI, 영상통화와 유튜브에 딱 맞게",
    price: "2,419,000",
    specs: [
      "CPU 인텔 코어 i5 14400F",
      "RAM 16GB",
      "VGA RTX 5060",
      "SSD 1TB NVMe",
    ],
  },
];

const updateProducts = [
  {
    id: 1,
    title: "영상편집 패키지",
    summary: "큰 화면, 직관적 UI",
    detail: "영상통화 · 유튜브에 딱 맞게",
  },
  {
    id: 2,
    title: "영상편집 패키지",
    summary: "큰 화면, 직관적 UI",
    detail: "영상통화 · 유튜브에 딱 맞게",
  },
  {
    id: 3,
    title: "영상편집 패키지",
    summary: "큰 화면, 직관적 UI",
    detail: "영상통화 · 유튜브에 딱 맞게",
  },
];

function ProductMockup({ variant = "laptop" }) {
  if (variant === "desktop") {
    return (
      <div className="main-product-mockup main-product-mockup--desktop" aria-hidden="true">
        <div className="main-product-mockup__monitor">
          <span>FHD</span>
          <strong>144 Hz</strong>
        </div>
        <div className="main-product-mockup__tower" />
        <div className="main-product-mockup__stand" />
      </div>
    );
  }

  return (
    <div className="main-product-mockup main-product-mockup--laptop" aria-hidden="true">
      <div className="main-product-mockup__screen" />
      <div className="main-product-mockup__base" />
    </div>
  );
}

function Main() {
  const [activePurposeTab, setActivePurposeTab] = useState("video");
  const [activePurposeCard, setActivePurposeCard] = useState(0);
  const [expandedBundleId, setExpandedBundleId] = useState(1);
  const [activeUpdateId, setActiveUpdateId] = useState(0);
  const [isUpdateHovered, setIsUpdateHovered] = useState(false);

  return (
    <div className="main-page">
      <section className="main-hero" style={{ backgroundImage: `url(${MainBackground})` }}>
        <div className="main-hero__content">
          <div className="main-hero__copy">
            <span className="main-hero__eyebrow">AI 전자기기 추천 서비스</span>
            <h2>
              복잡한 스펙 비교,
              <br />
              이제 <span>AI 고르미</span>에게
              <br />
              맡기세요
            </h2>
            <p>
              용도 · 예산 · 사용 환경을 말하면
              <br />
              수천 개의 제품 중 딱 맞는 전자기기를 골라드려요.
              <br />
              어려운 스펙 설명 없이, 쉽고 빠르게.
            </p>
          </div>

          <div className="main-hero__visual">
            <img src={CharacterImage} alt="AI 고르미 캐릭터" />
          </div>
        </div>

        <div className="main-hero__search">
          <label className="main-hero__search-label" htmlFor="main-ai-search">
            무엇이든 물어보세요!
          </label>
          <div className="main-hero__search-field">
            <input
              id="main-ai-search"
              type="text"
              placeholder="어떤 제품이 필요한지 입력해보세요."
            />
            <button type="button" className="main-hero__submit" aria-label="질문 전송">
              ↗
            </button>
          </div>
          <div className="main-hero__button-list">
            {promptButtons.map((prompt) => (
              <button key={prompt} type="button" className="main-hero__prompt-button">
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="main-section main-section--reviews">
        <div className="main-section__heading">
          <h3>AI 추천 제품 실제 구매 리뷰</h3>
          <p>고르미의 추천을 받고 구매한 고객들의 생생한 리뷰입니다.</p>
        </div>

        <div className="main-review-grid">
          {reviews.map((review) => (
            <article key={review.id} className="main-review-card">
              <div className="main-review-card__top">
                <div className="main-review-card__user">
                  <span className="main-review-card__avatar">👤</span>
                  <strong>{review.user}</strong>
                </div>
                <span className="main-review-card__stars">★★★★★</span>
              </div>
              <h4>{review.product}</h4>
              <p>{review.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="main-section main-section--mint">
        <div className="main-section__bar">
          <div className="main-section__heading">
            <h3>목적별 추천 카테고리</h3>
            <p>어떤 용도로 사용하시나요? 목적에 맞는 제품을 바로 찾아드려요</p>
          </div>
          <button type="button" className="main-more-link">
            더보기
            <span>&gt;</span>
          </button>
        </div>

        <div className="main-tab-list" role="tablist" aria-label="추천 카테고리">
          {categoryTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`main-tab ${activePurposeTab === tab.id ? "is-active" : ""}`}
              aria-selected={activePurposeTab === tab.id}
              onClick={() => setActivePurposeTab(tab.id)}
            >
              <img src={tab.icon} alt="" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="main-product-row">
          {purposeProducts.map((product, index) => (
            <article
              key={product.id}
              className={`main-product-card ${activePurposeCard === index ? "is-active" : ""}`}
              onMouseEnter={() => setActivePurposeCard(index)}
            >
              <div className="main-product-card__media">
                <ProductMockup />
                <div className="main-product-card__actions">
                  <button type="button" aria-label="장바구니 담기">
                    <img src={CartIcon} alt="" />
                  </button>
                  <button type="button" aria-label="찜하기">
                    <img src={LikeIcon} alt="" />
                  </button>
                </div>
              </div>

              <div className="main-product-card__content">
                <h4>{product.name}</h4>
                <div className="main-product-card__tags">
                  {product.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <strong className="main-product-card__price">₩{product.price}</strong>
                <div className="main-product-card__colors">
                  {product.colors.map((color) => (
                    <span key={color} style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="main-section">
        <div className="main-section__bar">
          <div className="main-section__heading">
            <h3>추천 조합</h3>
            <p>실제 사용 시나리오 결과를 바탕으로 고르미가 골라드려요</p>
          </div>
          <button type="button" className="main-more-link">
            더보기
            <span>&gt;</span>
          </button>
        </div>

        <div className="main-bundle-grid">
          {bundleProducts.map((bundle) => {
            const isExpanded = expandedBundleId === bundle.id;

            return (
              <article key={bundle.id} className={`main-bundle-card ${isExpanded ? "is-open" : ""}`}>
                <div className="main-bundle-card__hero">
                  <ProductMockup variant="desktop" />
                </div>
                <div className="main-bundle-card__body">
                  <h4>{bundle.title}</h4>
                  <p>{bundle.summary}</p>
                  <div className="main-bundle-card__meta">
                    <strong>₩ {bundle.price}</strong>
                    <div className="main-bundle-card__actions">
                      <button type="button" aria-label="장바구니 담기">
                        <img src={CartIcon} alt="" />
                      </button>
                      <button type="button" aria-label="찜하기">
                        <img src={LikeIcon} alt="" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className={`main-bundle-card__dropdown ${isExpanded ? "is-open" : ""}`}>
                  <div className="main-bundle-card__spec-list">
                    {bundle.specs.map((spec) => (
                      <div key={spec} className="main-bundle-card__spec-item">
                        <div className="main-bundle-card__spec-thumb" />
                        <p>{spec}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className={`main-bundle-card__toggle ${isExpanded ? "is-open" : ""}`}
                  onClick={() => setExpandedBundleId(isExpanded ? 0 : bundle.id)}
                  aria-expanded={isExpanded}
                >
                  ⌃
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="main-section main-section--mint">
        <div className="main-section__heading">
          <h3>최신 업데이트 상품</h3>
          <p>새로 입고된 신제품과 업데이트된 상품이에요.</p>
        </div>

        <div className="main-update-layout">
          <article
            className={`main-update-feature ${
              isUpdateHovered || activeUpdateId !== 0 ? "is-overlay" : ""
            }`}
            onMouseEnter={() => setIsUpdateHovered(true)}
            onMouseLeave={() => setIsUpdateHovered(false)}
          >
            <div className="main-update-feature__base">
              <div className="main-update-feature__thumb">
                <ProductMockup variant="desktop" />
              </div>
              <div className="main-update-feature__actions">
                <button type="button" aria-label="장바구니 담기">
                  <img src={CartIcon} alt="" />
                </button>
                <button type="button" aria-label="찜하기">
                  <img src={LikeIcon} alt="" />
                </button>
              </div>
            </div>

            <div className="main-update-feature__overlay">
              <div className="main-update-feature__specs">
                <div>
                  <span>CPU</span>
                  <strong>인텔 코어 i5 14400F</strong>
                </div>
                <div>
                  <span>RAM</span>
                  <strong>16 GB</strong>
                </div>
                <div>
                  <span>VGA</span>
                  <strong>RTX 5060</strong>
                </div>
                <div>
                  <span>OS</span>
                  <strong>Window 11 (home)</strong>
                </div>
                <div>
                  <span>모니터</span>
                  <strong>FHD / 144 Hz</strong>
                </div>
                <div>
                  <span>가격</span>
                  <strong>₩ 2,419,000</strong>
                </div>
              </div>
            </div>
          </article>

          <div className="main-update-list">
            {updateProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                className={`main-update-item ${activeUpdateId === product.id ? "is-active" : ""}`}
                onClick={() => setActiveUpdateId(product.id)}
                onMouseEnter={() => setActiveUpdateId(product.id)}
              >
                <div className="main-update-item__thumb">
                  <ProductMockup variant="desktop" />
                </div>
                <div className="main-update-item__content">
                  <h4>{product.title}</h4>
                  <p>{product.summary}</p>
                  <span>{product.detail}</span>
                </div>
                <span className="main-update-item__arrow">&gt;</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Main;
