// Import dữ liệu từ file hustData.ts (File này chứa HUST_DRL_DATA và CRITERIA_MAP)
import { HUST_DRL_DATA, CRITERIA_MAP } from '../data/hustData';

// ============================================================================
// 1. THUẬT TOÁN TÍNH ĐIỂM CÓ TRẦN ĐỀ MỤC & TRẦN PHẦN (TC1..TC5)
// ============================================================================
export function evaluateCriteriaSet(achievedSet: Set<string>) {
    let totalScore = 0;
    let totalSubCapped = 0;
    let totalRaw = 0;
    const sectionBreakdown: Record<string, any> = {};
    const subSectionBreakdown: Record<string, any> = {};

    for (const sec of HUST_DRL_DATA) {
        let secSumFromSubs = 0;
        let secRaw = 0;

        for (const sub of sec.subSections) {
            let subRaw = 0;
            for (const crit of sub.criteria) {
                if (achievedSet.has(crit.id)) {
                    subRaw += crit.points;
                }
            }
            const subCapped = Math.min(sub.maxPoints, subRaw);
            subSectionBreakdown[sub.id] = {
                raw: subRaw,
                capped: subCapped,
                max: sub.maxPoints,
                isCapped: subCapped >= sub.maxPoints,
                overflow: Math.max(0, subRaw - sub.maxPoints),
                remaining: Math.max(0, sub.maxPoints - subCapped)
            };
            secSumFromSubs += subCapped;
            secRaw += subRaw;
        }

        const secCapped = Math.min(sec.maxPoints, secSumFromSubs);
        sectionBreakdown[sec.id] = {
            raw: secRaw,
            subCappedSum: secSumFromSubs,
            capped: secCapped,
            max: sec.maxPoints,
            isCapped: secCapped >= sec.maxPoints,
            overflow: Math.max(0, secSumFromSubs - sec.maxPoints),
            remaining: Math.max(0, sec.maxPoints - secCapped)
        };

        totalScore += secCapped;
        totalSubCapped += secSumFromSubs;
        totalRaw += secRaw;
    }

    return {
        totalScore,
        totalSubCapped,
        totalRaw,
        sectionBreakdown,
        subSectionBreakdown
    };
}

// ============================================================================
// 2. THUẬT TOÁN TỐI ƯU HÓA TOÀN CỤC (EXACT BRANCH & BOUND SOLVER)
// Phân bổ mỗi Hoạt động vào tối đa 1 Tiêu chí sao cho Tổng điểm rèn luyện là LỚN NHẤT.
// ============================================================================
export function solveOptimalAssignment(manualCriteriaList: string[], activitiesList: any[], includePlanned: boolean = true) {
    const baseSet = new Set(manualCriteriaList);
    const activeActivities = activitiesList.filter(
        (a) => a.status === 'done' || (includePlanned && a.status === 'planned')
    );

    const n = activeActivities.length;

    const choicesPerActivity = activeActivities.map((act) => {
        const validCrit = act.criteria.filter((c: string) => CRITERIA_MAP[c]);
        if (act.forcedCriterion && CRITERIA_MAP[act.forcedCriterion]) {
            return [act.forcedCriterion];
        }
        return [...validCrit].sort((a, b) => CRITERIA_MAP[b].points - CRITERIA_MAP[a].points);
    });

    const suffixMaxRawPoints = new Array(n + 1).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        const bestPt =
            choicesPerActivity[i].length > 0
                ? Math.max(...choicesPerActivity[i].map((cid: string) => CRITERIA_MAP[cid].points))
                : 0;
        suffixMaxRawPoints[i] = suffixMaxRawPoints[i + 1] + bestPt;
    }

    let bestTotalScore = -1;
    let bestSubCappedScore = -1;
    let bestUsedCount = Infinity;
    let bestAssignment = new Array(n).fill(null);

    const currentSet = new Set(baseSet);
    const currentAssignment = new Array(n).fill(null);
    const visitedStates = new Map();

    function dfs(idx: number, usedCount: number) {
        if (idx === n) {
            const evalRes = evaluateCriteriaSet(currentSet);
            const isBetter =
                evalRes.totalScore > bestTotalScore ||
                (evalRes.totalScore === bestTotalScore && evalRes.totalSubCapped > bestSubCappedScore) ||
                (evalRes.totalScore === bestTotalScore && evalRes.totalSubCapped === bestSubCappedScore && usedCount < bestUsedCount);

            if (isBetter) {
                bestTotalScore = evalRes.totalScore;
                bestSubCappedScore = evalRes.totalSubCapped;
                bestUsedCount = usedCount;
                bestAssignment = [...currentAssignment];
            }
            return;
        }

        const currentEval = evaluateCriteriaSet(currentSet);
        const optimisticTotal = Math.min(100, currentEval.totalScore + suffixMaxRawPoints[idx]);
        if (optimisticTotal < bestTotalScore) {
            return;
        }

        const stateKey = `${idx}:${Array.from(currentSet).sort().join(',')}`;
        const prevUsed = visitedStates.get(stateKey);
        if (prevUsed !== undefined && prevUsed <= usedCount) {
            return;
        }
        visitedStates.set(stateKey, usedCount);

        const options = choicesPerActivity[idx];

        for (const cid of options) {
            if (!currentSet.has(cid)) {
                currentSet.add(cid);
                currentAssignment[idx] = cid;
                dfs(idx + 1, usedCount + 1);
                currentAssignment[idx] = null;
                currentSet.delete(cid);
            }
        }

        dfs(idx + 1, usedCount);
    }

    dfs(0, 0);

    const finalCriteriaSet = new Set(baseSet);
    const criterionSourceMap: Record<string, any> = {};

    baseSet.forEach((cid) => {
        criterionSourceMap[cid] = {
            type: 'manual',
            label: 'Tick đạt trực tiếp / Mặc định'
        };
    });

    const cleanedAssignment = [...bestAssignment];
    const fullSet = new Set(baseSet);
    cleanedAssignment.forEach((cid) => {
        if (cid) fullSet.add(cid);
    });

    for (let i = 0; i < n; i++) {
        const cid = cleanedAssignment[i];
        if (!cid) continue;
        const setWithout = new Set(fullSet);
        setWithout.delete(cid);
        const evalWith = evaluateCriteriaSet(fullSet);
        const evalWithout = evaluateCriteriaSet(setWithout);
        const deltaTotal = evalWith.totalScore - evalWithout.totalScore;
        if (deltaTotal === 0) {
            cleanedAssignment[i] = null;
            fullSet.delete(cid);
        }
    }

    const activityAnalysis: Record<string, any> = {};
    activeActivities.forEach((act, idx) => {
        const assignedCid = cleanedAssignment[idx];
        if (assignedCid) {
            finalCriteriaSet.add(assignedCid);
            const setWithout = new Set(fullSet);
            setWithout.delete(assignedCid);
            const deltaTotal = evaluateCriteriaSet(fullSet).totalScore - evaluateCriteriaSet(setWithout).totalScore;

            criterionSourceMap[assignedCid] = {
                type: 'activity',
                activityId: act.id,
                activityName: act.name,
                activityStatus: act.status,
                effectiveGain: deltaTotal
            };

            activityAnalysis[act.id] = {
                assignedCriterion: assignedCid,
                effectiveGain: deltaTotal,
                isRedundant: false,
                reason: `Đang gánh tiêu chí ${assignedCid} (+${deltaTotal}đ thực tế vào tổng ĐRL)`
            };
        }
    });

    const finalEvaluation = evaluateCriteriaSet(finalCriteriaSet);

    activeActivities.forEach((act) => {
        if (activityAnalysis[act.id]) return;

        const validCrit = act.criteria.filter((c: string) => CRITERIA_MAP[c]);
        if (validCrit.length === 0) {
            activityAnalysis[act.id] = {
                assignedCriterion: null,
                effectiveGain: 0,
                isRedundant: true,
                reasonType: 'empty',
                reason: 'Chưa gắn mã tiêu chí nào cho hoạt động này.'
            };
            return;
        }

        const reasons = validCrit.map((cid: string) => {
            const crit = CRITERIA_MAP[cid];
            if (baseSet.has(cid)) {
                return `${cid} đã được tick đạt trực tiếp`;
            }
            if (criterionSourceMap[cid]?.type === 'activity') {
                return `${cid} đã do "${criterionSourceMap[cid].activityName}" gánh`;
            }
            const secState = finalEvaluation.sectionBreakdown[crit.sectionId];
            const subState = finalEvaluation.subSectionBreakdown[crit.subSectionId];
            if (secState.isCapped) {
                return `${cid} thuộc ${crit.sectionCode} đã kịch trần (${secState.max}/${secState.max}đ)`;
            }
            if (subState.isCapped) {
                return `${cid} thuộc mục ${crit.subSectionId} đã kịch trần (${subState.max}/${subState.max}đ)`;
            }
            return `${cid} đã được tối ưu bằng tổ hợp điểm cao hơn`;
        });

        activityAnalysis[act.id] = {
            assignedCriterion: null,
            effectiveGain: 0,
            isRedundant: true,
            reasonType: 'surplus',
            reason: reasons.join(' • ')
        };
    });

    return {
        evaluation: finalEvaluation,
        achievedSet: finalCriteriaSet,
        criterionSourceMap,
        activityAnalysis
    };
}