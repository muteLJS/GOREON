import Modal from "@/components/Modal/Modal";
import RatingInput from "@/components/RatingInput/RatingInput";
import UploadIcon from "@/assets/icons/upload.svg";
import { useToast } from "@/components/Toast/toastContext";
import { useState, useRef, useEffect } from "react";
import api from "@/utils/api";
import "./ReviewWrite.scss";

function ReviewWrite({ productId, onClose }) {
  const MAX_CONTENT_LENGTH = 300;
  const { showToast } = useToast();
  const [review, setReview] = useState({
    rating: 0,
    content: "",
    images: [],
  });
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });
    };
  });

  const handleSubmit = async () => {
    if (!review.rating) return;
    if (!review.content.trim()) return;

    const formData = new FormData();
    formData.append("product", productId);
    formData.append("rating", review.rating);
    formData.append("content", review.content.trim());

    review.images.forEach((file) => {
      formData.append("images", file);
    });

    try {
      await api.post("/reviews", formData);
      showToast("리뷰가 등록되었습니다.");
      onClose();
    } catch {
      showToast("리뷰 등록에 실패했습니다.");
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previewUrls = files.map((file) => URL.createObjectURL(file));

    setReview((prev) => {
      return { ...prev, images: files };
    });

    setPreviews(previewUrls);
  };

  const handleContentChange = (e) => {
    setReview((prev) => {
      return { ...prev, content: e.target.value };
    });
  };

  return (
    <Modal title="리뷰 작성하기" className="review-write-modal">
      <div className="review-write">
        <section className="review-write__rating">
          <p className="review-write__title">
            별점 등록 <span>({review.rating}/5)</span>
          </p>
          <RatingInput
            value={review.rating}
            onChange={(rating) => setReview((prev) => ({ ...prev, rating: rating }))}
          ></RatingInput>
        </section>
        <section className="review-write__content">
          <p className="review-write__title">리뷰 작성</p>
          <div className="review-write__content-area">
            <textarea
              name="reviewContent"
              id="reviewContent"
              value={review.content}
              maxLength={MAX_CONTENT_LENGTH}
              onChange={handleContentChange}
              placeholder="사이즈, 품질, 사용감 등을 포함해 솔직하게 작성해 주세요."
              rows={5}
            ></textarea>
            <span className="review-write__content-length">
              {review.content.length}/{MAX_CONTENT_LENGTH}
            </span>
          </div>
        </section>
        <section className="review-write__images">
          <p className="review-write__title">사진 첨부</p>
          <div className="review-write__image-list">
            <button type="button" onClick={() => fileInputRef.current.click()}>
              <img src={UploadIcon} alt="" />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleImageChange}
            />

            {previews.map((preview, index) => (
              <img key={index} className="review-write__image-preview" src={preview} alt="" />
            ))}
          </div>
        </section>
        <div className="review-write__actions">
          <button type="button" onClick={onClose}>
            작성 취소
          </button>
          <button type="button" onClick={handleSubmit}>
            리뷰 등록
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ReviewWrite;
