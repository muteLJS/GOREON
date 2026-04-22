const normalizeText = (value) => String(value ?? "").toLowerCase();

const getPart = (items, category) => items.find((item) => item.category === category);
const getName = (item) => normalizeText(item?.name);
const getRawText = (item) => normalizeText([item?.name, ...(item?.raw?.tag ?? [])].join(" "));

const detectCpuPlatform = (item) => {
  const text = getRawText(item);

  if (/amd|라이젠|ryzen/.test(text)) return "amd";
  if (/인텔|intel|\bcore\b|\bi[3579][-\s]?\d/i.test(text)) return "intel";

  return "unknown";
};

const detectMainboardPlatform = (item) => {
  const text = getRawText(item).toUpperCase();

  if (/\b(A520|A620|B450|B550|B650|X570|X670|X870)\b/.test(text)) return "amd";
  if (/\b(H610|B660|B760|Z690|Z790|Z890)\b/.test(text)) return "intel";

  return "unknown";
};

const detectDdrType = (item) => {
  const text = getRawText(item).toUpperCase();

  if (text.includes("DDR5")) return "DDR5";
  if (text.includes("DDR4")) return "DDR4";

  return "unknown";
};

const detectWattage = (item) => {
  const match = getName(item).match(/(\d{3,4})\s*w/i);
  return match ? Number(match[1]) : null;
};

const getRecommendedGpuWattage = (item) => {
  const text = getRawText(item).toUpperCase();

  if (/RTX\s*4090|RTX\s*4080|RX\s*7900/.test(text)) return 750;
  if (/RTX\s*4070|RX\s*7800|RX\s*7700/.test(text)) return 650;
  if (/RTX\s*4060|RX\s*7600/.test(text)) return 550;
  if (/RTX|RADEON|RX\s*\d{4}|GTX/.test(text)) return 500;

  return null;
};

const makeCheck = (id, level, text) => ({ id, level, text });

const getOverallLevel = (checks) => {
  if (checks.some((check) => check.level === "error")) return "error";
  if (checks.some((check) => check.level === "warning")) return "warning";
  return "ok";
};

const getSummaryMessage = (level, checks) => {
  if (checks.length === 0) return "부품을 선택하면 호환성을 확인합니다";
  if (level === "error") return "호환성 문제가 있습니다";
  if (level === "warning") return "확인이 필요한 부품이 있습니다";
  return "호환성 모두 이상 없음";
};

export const analyzePcCompatibility = (items = []) => {
  const checks = [];
  const cpu = getPart(items, "CPU");
  const mainboard = getPart(items, "메인보드");
  const memory = getPart(items, "램");
  const storage = getPart(items, "저장장치");
  const casePart = getPart(items, "케이스");
  const power = getPart(items, "파워");
  const gpu = getPart(items, "그래픽카드");

  const requiredParts = [
    ["CPU", cpu],
    ["메인보드", mainboard],
    ["램", memory],
    ["저장장치", storage],
    ["케이스", casePart],
    ["파워", power],
  ];

  requiredParts.forEach(([label, part]) => {
    if (!part) {
      checks.push(makeCheck(`missing-${label}`, "warning", `${label}가 선택되지 않았습니다.`));
    }
  });

  if (cpu && mainboard) {
    const cpuPlatform = detectCpuPlatform(cpu);
    const boardPlatform = detectMainboardPlatform(mainboard);

    if (cpuPlatform !== "unknown" && boardPlatform !== "unknown") {
      checks.push(
        cpuPlatform === boardPlatform
          ? makeCheck("cpu-mainboard-platform", "ok", "CPU와 메인보드 플랫폼이 호환됩니다.")
          : makeCheck("cpu-mainboard-platform", "error", "CPU와 메인보드 플랫폼이 맞지 않습니다."),
      );
    } else {
      checks.push(
        makeCheck(
          "cpu-mainboard-platform",
          "warning",
          "CPU와 메인보드 플랫폼 정보를 확인해야 합니다.",
        ),
      );
    }
  }

  if (memory && mainboard) {
    const memoryDdr = detectDdrType(memory);
    const boardDdr = detectDdrType(mainboard);

    if (memoryDdr !== "unknown" && boardDdr !== "unknown") {
      checks.push(
        memoryDdr === boardDdr
          ? makeCheck(
              "memory-mainboard-ddr",
              "ok",
              `${memoryDdr} 메모리 규격이 메인보드와 맞습니다.`,
            )
          : makeCheck(
              "memory-mainboard-ddr",
              "error",
              "메모리 DDR 규격과 메인보드 규격이 맞지 않습니다.",
            ),
      );
    } else {
      checks.push(
        makeCheck("memory-mainboard-ddr", "warning", "메모리/메인보드 DDR 규격 확인이 필요합니다."),
      );
    }
  }

  if (gpu && power) {
    const recommendedWattage = getRecommendedGpuWattage(gpu);
    const powerWattage = detectWattage(power);

    if (recommendedWattage && powerWattage) {
      checks.push(
        powerWattage >= recommendedWattage
          ? makeCheck(
              "gpu-power-wattage",
              "ok",
              `그래픽카드 권장 파워(${recommendedWattage}W) 이상입니다.`,
            )
          : makeCheck(
              "gpu-power-wattage",
              "warning",
              `그래픽카드 권장 파워(${recommendedWattage}W)보다 낮을 수 있습니다.`,
            ),
      );
    } else {
      checks.push(
        makeCheck("gpu-power-wattage", "warning", "그래픽카드와 파워 용량 확인이 필요합니다."),
      );
    }
  }

  if (!gpu) {
    checks.push(makeCheck("gpu-optional", "ok", "그래픽카드는 용도에 따라 선택할 수 있습니다."));
  }

  const level = getOverallLevel(checks);

  return {
    level,
    message: getSummaryMessage(level, checks),
    checks,
  };
};
