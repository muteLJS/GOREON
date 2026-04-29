import Modal from "@/components/Modal/Modal";
import RatingInput from "@/components/RatingInput/RatingInput";
import UploadIcon from "@/assets/icons/upload.svg";
import { useToast } from "@/components/Toast/toastContext";
import { useState, useRef, useEffect } from "react";
import api from "@/utils/api";
import { normalizeImageUrl } from "@/utils/image";
import "./ReviewWrite.scss";

function ReviewWrite({ productId, initialReview = null, onClose, onSaved }) {
  const MAX_CONTENT_LENGTH = 300;
  const isEditMode = Boolean(initialReview?._id);
  const { showToast } = useToast();
  const [review, setReview] = useState({
    rating: initialReview?.rating || 0,
    content: initialReview?.content || "",
    images: [],
  });
  const [existingImages, setExistingImages] = useState(initialReview?.images || []);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [previews]);

  const handleSubmit = async () => {
    if (!review.rating) {
      showToast("별점을 선택해 주세요.");
      return;
    }

    if (!review.content.trim()) {
      showToast("리뷰 내용을 입력해 주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("product", productId);
    formData.append("rating", review.rating);
    formData.append("content", review.content.trim());

    review.images.forEach((file) => {
      formData.append("images", file);
    });

    try {
      setIsSubmitting(true);

      const response = isEditMode
        ? await api.patch(`/reviews/${initialReview._id}`, formData)
        : await api.post("/reviews", formData);

      showToast(isEditMode ? "리뷰가 수정되었습니다." : "리뷰가 등록되었습니다.");
      onSaved?.(response.data);
      onClose();
    } catch (error) {
      showToast(
        error.response?.data?.message ||
          (isEditMode ? "리뷰 수정에 실패했습니다." : "리뷰 등록에 실패했습니다."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) {
      return;
    }

    const previewUrls = files.map((file) => URL.createObjectURL(file));

    setReview((prev) => {
      return { ...prev, images: files };
    });

    setExistingImages([]);
    setPreviews(previewUrls);
    e.target.value = "";
  };

  const handleContentChange = (e) => {
    setReview((prev) => {
      return { ...prev, content: e.target.value };
    });
  };

  return (
    <Modal
      title={isEditMode ? "리뷰 수정하기" : "리뷰 작성하기"}
      className="review-write-modal"
      overlayClassName="review-write-modal-overlay"
      onClose={onClose}
    >
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

            {existingImages.map((image, index) => (
              <img
                key={`existing-${image}-${index}`}
                className="review-write__image-preview"
                src={normalizeImageUrl(image) || image}
                alt=""
              />
            ))}

            {previews.map((preview, index) => (
              <img key={index} className="review-write__image-preview" src={preview} alt="" />
            ))}
          </div>
        </section>
        <div className="review-write__actions">
          <button type="button" onClick={onClose} disabled={isSubmitting}>
            {isEditMode ? "수정 취소" : "작성 취소"}
          </button>
          <button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "처리중..." : isEditMode ? "리뷰 수정" : "리뷰 등록"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ReviewWrite;
