import "./PcAssemblyQuote.scss";
import PcAssemblyQuoteList from "@/components/PcAssemblyQuoteList/PcAssemblyQuoteList";
import CheckIcon from "@/assets/icons/check.svg";
import { useState } from "react";

const productList = [
  {
    id: 1,
    productId: 10111,
    category: "CPU",
    name: "인텔 코어 i5-14400F",
    option: "벌크",
    price: 200000,
    quantity: 1,
    image:
      "https://img.danuri.io/catalog-image/286/424/108/577a3036f3bf4923a5358055d5c11dcb.jpg?shrink=500:*&_v=20260416113343",
    compatibility: "ok",
  },
  {
    id: 2,
    productId: 20221,
    category: "메인보드",
    name: "MSI PRO B760M-A WIFI",
    price: 189000,
    quantity: 1,
    image:
      "https://img.danuri.io/catalog-image/286/424/108/577a3036f3bf4923a5358055d5c11dcb.jpg?shrink=500:*&_v=20260416113343",
    compatibility: "ok",
  },
  {
    id: 3,
    productId: 30331,
    category: "그래픽카드",
    name: "ZOTAC GAMING 지포스 RTX 4060 SOLO",
    option: "블랙",
    price: 449000,
    quantity: 1,
    image:
      "https://img.danuri.io/catalog-image/286/424/108/577a3036f3bf4923a5358055d5c11dcb.jpg?shrink=500:*&_v=20260416113343",
    compatibility: "warning",
  },
  {
    id: 4,
    productId: 40441,
    category: "램",
    name: "삼성전자 DDR5-5600 16GB",
    price: 59000,
    quantity: 2,
    image:
      "https://img.danuri.io/catalog-image/286/424/108/577a3036f3bf4923a5358055d5c11dcb.jpg?shrink=500:*&_v=20260416113343",
    compatibility: "ok",
  },
  {
    id: 5,
    productId: 50551,
    category: "저장장치",
    name: "삼성전자 990 EVO Plus 1TB",
    price: 129000,
    quantity: 1,
    image:
      "https://img.danuri.io/catalog-image/286/424/108/577a3036f3bf4923a5358055d5c11dcb.jpg?shrink=500:*&_v=20260416113343",
    compatibility: "ok",
  },
  {
    id: 6,
    productId: 60661,
    category: "케이스",
    name: "darkFlash DS900 ARGB 강화유리",
    option: "블랙",
    price: 69000,
    quantity: 1,
    image:
      "https://img.danuri.io/catalog-image/286/424/108/577a3036f3bf4923a5358055d5c11dcb.jpg?shrink=500:*&_v=20260416113343",
    compatibility: "ok",
  },
  {
    id: 7,
    productId: 70771,
    category: "파워",
    name: "마이크로닉스 Classic II 750W GOLD",
    price: 119000,
    quantity: 1,
    image:
      "https://img.danuri.io/catalog-image/286/424/108/577a3036f3bf4923a5358055d5c11dcb.jpg?shrink=500:*&_v=20260416113343",
    compatibility: "error",
  },
];

function PcAssemblyQuote() {
  const [items, setItems] = useState(productList);
  const [selectedIds, setSelectedIds] = useState(productList.map((item) => item.id));
  const isAllSelected = items.length > 0 && selectedIds.length === items.length;

  const handleSelectAll = () => {
    setSelectedIds(isAllSelected ? [] : items.map((item) => item.id));
  };

  const handleSelectItem = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id],
    );
  };

  const handleDeleteSelected = () => {
    setItems((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
    setSelectedIds([]);
  };

  return (
    <main className="pc-assembly-quote">
      <h2 className="pc-assembly-quote__title">견적 리스트</h2>

      <div className="pc-assembly-quote__layout">
        <section className="pc-assembly-quote__list">
          <div className="pc-assembly-quote__control">
            <label className="pc-assembly-quote__select-all">
              <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} />
              <span className="pc-assembly-quote__checkbox-mark" />
              <span>전체선택</span>
            </label>
            <button
              className="pc-assembly-quote__delete-button"
              type="button"
              onClick={handleDeleteSelected}
            >
              삭제
            </button>
          </div>

          {items.length > 0 ? (
            <PcAssemblyQuoteList
              productList={items}
              selectedIds={selectedIds}
              onSelectItem={handleSelectItem}
            />
          ) : (
            <p className="pc-assembly-quote__empty">아직 담긴 상품이 없습니다.</p>
          )}
        </section>

        <section className="pc-assembly-quote__compatibility">
          <div className="pc-assembly-quote__compatibility-count">
            <img src={CheckIcon} alt="체크" />
            부품 6개 선택
          </div>
          <div className="pc-assembly-quote__compatibility-status">호환성 모두 이상 없음</div>
        </section>

        <strong className="pc-assembly-quote__total">TOTAL : 400,000원</strong>

        <div className="pc-assembly-quote__right">
          <section className="pc-assembly-quote__performance">
            <h3 className="pc-assembly-quote__section-title">성능 분석</h3>
            <div className="pc-assembly-quote__panel">
              <div className="pc-assembly-quote__panel-item">
                <span className="indicator indicator--warning"></span>GPU 대비 파워 용량 부족
              </div>
              <div className="pc-assembly-quote__panel-item">
                <span className="indicator indicator--ok"></span>RAM 용량 충분
              </div>
            </div>
          </section>

          <section className="pc-assembly-quote__recommend">
            <h3 className="pc-assembly-quote__section-title">업그레이드 추천</h3>
            <div className="pc-assembly-quote__panel">업그레이드 추천입니다.</div>
          </section>

          <section className="pc-assembly-quote__action">
            <button
              className="pc-assembly-quote__action-button pc-assembly-quote__action-button--secondary"
              type="button"
            >
              초기화
            </button>
            <button className="pc-assembly-quote__action-button" type="button">
              장바구니 담기
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}

export default PcAssemblyQuote;
