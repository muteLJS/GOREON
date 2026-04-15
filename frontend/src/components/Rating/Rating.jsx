import RatingEmpty from "@/assets/icons/rating-empty.svg";
import RatingFull from "@/assets/icons/rating-full.svg";
import styles from "./Rating.module.scss";

import { registerModuleStyles } from "styles/registerModuleStyles";

registerModuleStyles(styles);

function Rating({ rating = 5 }) {
  const roundedRating = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));

  return (
    <div className="rating">
      {[...Array(5)].map((_, index) => (
        <img key={index} src={index < roundedRating ? RatingFull : RatingEmpty} alt="rating" />
      ))}
    </div>
  );
}

export default Rating;
