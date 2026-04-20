import ReviewWrite from "@/components/ReviewWrite/ReviewWrite";
import { useState } from "react";

function OrderHistory() {
  const [isReviewWriteOpen, setIsReviewWriteOpen] = useState(false);

  return (
    <div>
      <p>주문내역 페이지입니다</p>
      <button onClick={() => setIsReviewWriteOpen(true)}>리뷰작성</button>

      {isReviewWriteOpen && (
        <ReviewWrite productId={1} onClose={() => setIsReviewWriteOpen(false)} />
      )}
    </div>
  );
}

export default OrderHistory;
