import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { logout } from "../../store/slices/userSlice";

export default function MyPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user.userInfo);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div>
      <h1>마이페이지</h1>
      <p>{userInfo?.name || "사용자"}님</p>
      <p>{userInfo?.email || ""}</p>
      <p>{userInfo?.phone || ""}</p>
      <Link to="/order-history">주문 내역</Link>
      <br />
      <Link to="/wishlist">찜 목록</Link>
      <br />
      <button type="button" onClick={handleLogout}>
        로그아웃
      </button>
    </div>
  );
}
