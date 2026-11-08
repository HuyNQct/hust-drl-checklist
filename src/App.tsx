import React, { useState, useEffect, useMemo } from 'react';
import {
  Award, Layers, ListChecks, Compass, CalendarDays,
  Zap, Sparkles, RotateCcw, CheckCircle2, AlertTriangle
} from 'lucide-react';

// 1. IMPORT DATA & THUẬT TOÁN
import {
  SAMPLE_MANUAL_CRITERIA, SAMPLE_ACTIVITIES, ALL_CRITERIA_LIST, HUST_DRL_DATA
} from './data/hustData';
import { solveOptimalAssignment } from './utils/solver';

// 2. IMPORT CÁC COMPONENT CON
import ActivitiesTab from './components/ActivitiesTab';
import ChecklistTab from './components/ChecklistTab';
import AdvisorTab from './components/AdvisorTab';
import ScheduleChecklist from './components/ScheduleChecklist';

export default function App() {
  // ==========================================================================
  // STATE LOCALSTORAGE
  // ==========================================================================
  const [manualCriteria, setManualCriteria] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hust_drl_manual_v1');
      return saved ? JSON.parse(saved) : SAMPLE_MANUAL_CRITERIA;
    } catch {
      return SAMPLE_MANUAL_CRITERIA;
    }
  });

  const [activities, setActivities] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('hust_drl_activities_v1');
      return saved ? JSON.parse(saved) : SAMPLE_ACTIVITIES;
    } catch {
      return SAMPLE_ACTIVITIES;
    }
  });

  const [includePlanned, setIncludePlanned] = useState(true);
  const [activeTab, setActiveTab] = useState<'schedule' | 'activities' | 'checklist' | 'advisor'>('schedule');

  useEffect(() => {
    localStorage.setItem('hust_drl_manual_v1', JSON.stringify(manualCriteria));
  }, [manualCriteria]);

  useEffect(() => {
    localStorage.setItem('hust_drl_activities_v1', JSON.stringify(activities));
  }, [activities]);

  // ==========================================================================
  // GIẢI THUẬT TỐI ƯU HÓA
  // ==========================================================================
  const optimalResult = useMemo(() => {
    return solveOptimalAssignment(manualCriteria, activities, includePlanned);
  }, [manualCriteria, activities, includePlanned]);

  const doneOnlyResult = useMemo(() => {
    return solveOptimalAssignment(manualCriteria, activities, false);
  }, [manualCriteria, activities]);

  const { evaluation, achievedSet, criterionSourceMap, activityAnalysis } = optimalResult;

  // Tính toán gợi ý cho AdvisorTab (tránh undefined crash)
  const advisorRecommendations = useMemo(() => {
    return HUST_DRL_DATA.map((sec) => {
      const secBreak = evaluation.sectionBreakdown[sec.id];
      const missingInSec = secBreak.remaining;

      const candidateCriteria: any[] = [];
      sec.subSections.forEach((sub) => {
        const subBreak = evaluation.subSectionBreakdown[sub.id];
        const roomInSub = Math.min(missingInSec, subBreak.remaining);

        sub.criteria.forEach((crit) => {
          if (!achievedSet.has(crit.id)) {
            const effectiveGain = Math.min(crit.points, roomInSub);
            candidateCriteria.push({
              ...crit,
              subSectionId: sub.id,
              subSectionTitle: sub.title,
              subRemaining: subBreak.remaining,
              subIsCapped: subBreak.isCapped,
              effectiveGain,
              wastedPoints: Math.max(0, crit.points - effectiveGain)
            });
          }
        });
      });

      candidateCriteria.sort((a, b) => {
        if (b.effectiveGain !== a.effectiveGain) return b.effectiveGain - a.effectiveGain;
        return b.points - a.points;
      });

      return {
        section: sec,
        secBreak,
        missingInSec,
        bestToHunt: candidateCriteria.filter((c) => c.effectiveGain > 0),
        cappedTrapCriteria: candidateCriteria.filter((c) => c.effectiveGain === 0)
      };
    });
  }, [evaluation, achievedSet]);

  // ==========================================================================
  // HANDLERS
  // ==========================================================================
  const toggleManualCriterion = (critId: string) => {
    setManualCriteria((prev) =>
        prev.includes(critId) ? prev.filter((id) => id !== critId) : [...prev, critId]
    );
  };

  const loadBasicDefaults = () => {
    const basicIds = ALL_CRITERIA_LIST.filter((c: any) => c.isCommonDefault).map((c: any) => c.id);
    setManualCriteria((prev) => Array.from(new Set([...prev, ...basicIds])));
  };

  const loadSampleDemo = () => {
    setManualCriteria(SAMPLE_MANUAL_CRITERIA);
    setActivities(SAMPLE_ACTIVITIES);
  };

  const clearAllData = () => {
    setManualCriteria([]);
    setActivities([]);
  };

  const getClassification = (score: number) => {
    if (score >= 90) return { label: 'Xuất sắc', color: 'bg-emerald-500 text-white' };
    if (score >= 80) return { label: 'Tốt', color: 'bg-blue-600 text-white' };
    if (score >= 65) return { label: 'Khá', color: 'bg-amber-500 text-white' };
    if (score >= 50) return { label: 'Trung bình', color: 'bg-orange-500 text-white' };
    return { label: 'Yếu / Kém', color: 'bg-red-600 text-white' };
  };

  const classification = getClassification(evaluation.totalScore);
  const activeActsCount = activities.filter(a => a.status === 'done' || (includePlanned && a.status === 'planned')).length;
  const redundantActsCount = Object.values(activityAnalysis).filter((a: any) => a.isRedundant).length;
  const effectiveActsCount = activeActsCount - redundantActsCount;

  return (
      <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
        {/* HEADER */}
        <header className="bg-gradient-to-r from-red-900 via-red-800 to-rose-900 text-white shadow-lg border-b border-red-950/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/25 shrink-0 shadow-inner">
                  <Award className="w-7 h-7 text-amber-300" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1">
                    Trình Tối Ưu ĐRL & Quản Lý Học Tập
                  </h1>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button onClick={loadBasicDefaults} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/15 hover:bg-white/25 text-white border border-white/20 transition cursor-pointer">
                  <Zap className="w-3.5 h-3.5 text-amber-300" /> Tick TC cơ bản
                </button>
                <button onClick={loadSampleDemo} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-red-100 border border-white/15 transition cursor-pointer">
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" /> Nạp mẫu
                </button>
                <button onClick={clearAllData} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-red-950/50 hover:bg-red-950/80 text-red-200 border border-red-400/20 transition cursor-pointer">
                  <RotateCcw className="w-3.5 h-3.5" /> Xóa Data
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* STICKY SCORE BAR */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
              <div className="lg:col-span-4 flex items-center justify-between sm:justify-start gap-4 bg-slate-900 text-white rounded-2xl p-3.5 shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Tổng điểm tối ưu</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${classification.color}`}>{classification.label}</span>
                  </div>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-3xl sm:text-4xl font-black text-amber-400 tabular-nums">{evaluation.totalScore}</span>
                    <span className="text-sm text-slate-400 font-medium">/ 100 điểm</span>
                  </div>
                  {includePlanned && evaluation.totalScore !== doneOnlyResult.evaluation.totalScore && (
                      <div className="text-[11px] text-emerald-300 mt-0.5">
                        Đã chốt: <b>{doneOnlyResult.evaluation.totalScore}đ</b> (+{evaluation.totalScore - doneOnlyResult.evaluation.totalScore}đ dự kiến)
                      </div>
                  )}
                </div>
                <div className="text-right border-l border-slate-700/80 pl-3.5 text-xs space-y-1">
                  <div className="flex items-center justify-end gap-1.5 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> <span>{effectiveActsCount} HĐ hiệu quả</span>
                  </div>
                  <div className={`flex items-center justify-end gap-1.5 font-medium ${redundantActsCount > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                    <AlertTriangle className="w-3.5 h-3.5" /> <span>{redundantActsCount} HĐ thừa</span>
                  </div>
                </div>
              </div>

              {/* 5 Thẻ mini TC1 -> TC5 */}
              <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-5 gap-2">
                {HUST_DRL_DATA.map((sec) => {
                  const secState = evaluation.sectionBreakdown[sec.id];
                  const pct = Math.min(100, Math.round((secState.capped / sec.maxPoints) * 100));
                  return (
                      <div
                          key={sec.id}
                          onClick={() => setActiveTab('checklist')}
                          className={`rounded-xl p-2 border transition cursor-pointer ${
                              secState.isCapped ? 'bg-emerald-50/70 border-emerald-300' : 'bg-slate-50 border-slate-200 hover:border-red-300'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-slate-800">{sec.code}</span>
                          <span className={`text-xs font-bold tabular-nums ${secState.isCapped ? 'text-emerald-700' : 'text-slate-700'}`}>
                        {secState.capped}/{sec.maxPoints}đ
                      </span>
                        </div>
                        <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden mt-1.5">
                          <div className={`h-full ${secState.isCapped ? 'bg-emerald-500' : 'bg-red-700'}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* NAVBAR VÀ MAIN TABS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div className="flex flex-wrap gap-2">
              <button
                  onClick={() => setActiveTab('schedule')}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
                      activeTab === 'schedule' ? 'bg-blue-700 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
              >
                <CalendarDays className="w-4 h-4" /> <span>Checklist Lịch Học</span>
              </button>

              <div className="w-[1px] bg-slate-200 mx-1"></div>

              <button
                  onClick={() => setActiveTab('activities')}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
                      activeTab === 'activities' ? 'bg-red-800 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
              >
                <Layers className="w-4 h-4" /> <span>1. Nhập Hoạt Động</span>
              </button>

              <button
                  onClick={() => setActiveTab('checklist')}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
                      activeTab === 'checklist' ? 'bg-red-800 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
              >
                <ListChecks className="w-4 h-4" /> <span>2. Checklist ĐRL</span>
              </button>

              <button
                  onClick={() => setActiveTab('advisor')}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
                      activeTab === 'advisor' ? 'bg-red-800 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
              >
                <Compass className="w-4 h-4" /> <span>3. Cố Vấn Khuyên</span>
              </button>
            </div>

            <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white px-3.5 py-2 rounded-xl border border-slate-200 cursor-pointer select-none">
              <input
                  type="checkbox"
                  checked={includePlanned}
                  onChange={(e) => setIncludePlanned(e.target.checked)}
                  className="rounded text-red-700 focus:ring-red-600 w-4 h-4"
              />
              <span>Tính cả hoạt động "Dự kiến"</span>
            </label>
          </div>

          {/* RENDER NỘI DUNG TỪNG TAB */}
          {activeTab === 'schedule' && <ScheduleChecklist />}

          {activeTab === 'activities' && (
              <ActivitiesTab
                  activities={activities}
                  setActivities={setActivities}
                  achievedSet={achievedSet}
                  evaluation={evaluation}
                  activityAnalysis={activityAnalysis}
                  includePlanned={includePlanned}
                  effectiveActsCount={effectiveActsCount}
                  redundantActsCount={redundantActsCount}
              />
          )}

          {activeTab === 'checklist' && (
              <ChecklistTab
                  evaluation={evaluation}
                  achievedSet={achievedSet}
                  manualCriteria={manualCriteria}
                  toggleManualCriterion={toggleManualCriterion}
                  criterionSourceMap={criterionSourceMap}
              />
          )}

          {activeTab === 'advisor' && (
              <AdvisorTab
                  evaluation={evaluation}
                  advisorRecommendations={advisorRecommendations}
                  toggleManualCriterion={toggleManualCriterion}
              />
          )}
        </div>
      </div>
  );
}