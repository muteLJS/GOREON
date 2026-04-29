import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useToast } from "@/components/Toast/toastContext";
import {
  addReportedReviewId,
  createReportedReviewId,
  hasReportedReviewId,
  removeReportedReviewId,
} from "@/utils/reportedReviews";

function ReviewCard({
  reviewId,
  userImage,
  userName,
  productName,
  description,
  rating = 5,
  onReported,
}) {
  const { showToast } = useToast();
  const userInfo = useSelector((state) => state.user.userInfo);
  const reportId = useMemo(
    () => createReportedReviewId(reviewId, userName, productName, description),
    [description, productName, reviewId, userName],
  );
  const [isReported, setIsReported] = useState(() => hasReportedReviewId(userInfo, reportId));

  useEffect(() => {
    setIsReported(hasReportedReviewId(userInfo, reportId));
  }, [reportId, userInfo]);

  const handleReportClick = () => {
    const nextReportedIds = addReportedReviewId(userInfo, reportId);

    setIsReported(true);
    showToast("신고가 접수되었습니다.");
    onReported?.(reportId, nextReportedIds);
  };

  const handleReportCancelClick = () => {
    const nextReportedIds = removeReportedReviewId(userInfo, reportId);

    setIsReported(false);
    showToast("신고가 취소되었습니다.");
    onReported?.(reportId, nextReportedIds);
  };

  return (
    <div className="review_main">
      <div className="AI_box">
        <div className="review_card_header">
          <div className="user_info">
            <img src={userImage} alt="review_user_img" />
            <p className="user_name">{userName}</p>
          </div>
          <div className="review_report_actions">
            {isReported ? (
              <>
                <button type="button" className="review_report is-reported" disabled>
                  신고 완료
                </button>
                <button type="button" className="review_report" onClick={handleReportCancelClick}>
                  신고 취소
                </button>
              </>
            ) : (
              <button type="button" className="review_report" onClick={handleReportClick}>
                신고하기
              </button>
            )}
          </div>
        </div>
        <div className="stars" aria-label={`별점 ${rating}점`}>
          {[...Array(rating)].map((_, index) => (
            <svg key={index} viewBox="0 0 9 9" aria-hidden="true">
              <path d="M4.88.72c-.04-.07-.09-.12-.16-.16A.43.43 0 0 0 4.5.5a.43.43 0 0 0-.38.22 12.06 12.06 0 0 0-.91 2.12.49.49 0 0 1-.46.33c-.64.02-1.27.08-1.9.19a.43.43 0 0 0-.23.69 14.5 14.5 0 0 0 1.52 1.28c.16.12.23.33.17.52-.24.71-.4 1.44-.5 2.19-.05.33.31.57.62.41.62-.32 1.21-.68 1.77-1.1a.51.51 0 0 1 .6 0c.56.42 1.15.78 1.77 1.1.31.16.67-.08.63-.41a12.88 12.88 0 0 0-.5-2.19.5.5 0 0 1 .16-.52 14.45 14.45 0 0 0 1.52-1.28.43.43 0 0 0-.23-.69 12.67 12.67 0 0 0-1.9-.19.49.49 0 0 1-.45-.33A12.06 12.06 0 0 0 4.88.72Z" />
            </svg>
          ))}
        </div>
      </div>
      <p className="item_name">{productName}</p>
      <p className="description">{description}</p>
    </div>
  );
}

export default ReviewCard;
