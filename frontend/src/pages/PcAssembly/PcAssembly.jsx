/* -------------------------------------------------------------------------- */
/* [페이지] PC 맞춤 견적 (PcAssembly)                                           */
/* 설명: 사용 목적과 예산에 맞는 PC 견적을 안내하는 페이지입니다.             */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import "./PcAssembly.scss";

import ProductCardVertical from "@/components/ProductCard/ProductCardVertical";
import ProductCardHorizontal from "@/components/ProductCard/ProductCardHorizontal";
import Modal from "@/components/Modal/Modal";

import banner1 from "@/assets/banner/banner-1.jpg";
import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import CheckIcon from "@/assets/icons/check.svg";
import { PRODUCTS as productList } from "@/data/products";

/* 필터 더미데이터 */
const categories = ["CPU", "램", "메인보드", "그래픽카드", "저장장치", "케이스", "파워"];

function PcAssembly() {
  return <main>Pc Assembly Page</main>;
}

export default PcAssembly;
