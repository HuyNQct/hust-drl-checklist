import React, { useState } from 'react';
import {
    Plus, CheckCircle2, CalendarClock, Search,
    CheckSquare, Square, Sparkles, AlertTriangle,
    Trash2, Lock, Unlock
} from 'lucide-react';

// Import data map từ file data (bạn cần đảm bảo đường dẫn đúng)
import { ALL_CRITERIA_LIST, CRITERIA_MAP } from '../data/hustData';

// Định nghĩa các Props mà App.tsx sẽ truyền vào
interface ActivitiesTabProps {
    activities: any[];
    setActivities: React.Dispatch<React.SetStateAction<any[]>>;
    activityAnalysis: any;
    achievedSet: Set<string>;
    evaluation: any;
    includePlanned: boolean;
    effectiveActsCount: number;
    redundantActsCount: number;
}

export default function ActivitiesTab({
                                          activities,
                                          setActivities,
                                          activityAnalysis,
                                          achievedSet,
                                          evaluation,
                                          includePlanned,
                                          effectiveActsCount,
                                          redundantActsCount
                                      }: ActivitiesTabProps) {

    // State cục bộ chỉ dùng cho Form thêm hoạt động
    const [newActName, setNewActName] = useState('');
    const [newActCriteria, setNewActCriteria] = useState<string[]>([]);
    const [newActStatus, setNewActStatus] = useState<'done' | 'planned'>('done');
    const [criteriaSearch, setCriteriaSearch] = useState('');
    const [selectedSectionFilter, setSelectedSectionFilter] = useState('ALL');

    // Các hàm xử lý tác vụ
    const handleAddActivity = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newActName.trim() || newActCriteria.length === 0) return;

        const newAct = {
            id: 'act-' + Date.now(),
            name: newActName.trim(),
            criteria: [...newActCriteria].sort(),
            status: newActStatus,
            forcedCriterion: null
        };

        setActivities((prev) => [newAct, ...prev]);
        setNewActName('');
        setNewActCriteria([]);
    };

    const toggleNewActCriterion = (critId: string) => {
        setNewActCriteria((prev) =>
            prev.includes(critId) ? prev.filter((c) => c !== critId) : [...prev, critId]
        );
    };

    const removeActivity = (actId: string) => {
        setActivities((prev) => prev.filter((a) => a.id !== actId));
    };

    const toggleActivityStatus = (actId: string) => {
        setActivities((prev) =>
            prev.map((a) =>
                a.id === actId ? { ...a, status: a.status === 'done' ? 'planned' : 'done' } : a
            )
        );
    };

    const setForcedCriterion = (actId: string, critIdOrNull: string | null) => {
        setActivities((prev) =>
            prev.map((a) => (a.id === actId ? { ...a, forcedCriterion: critIdOrNull } : a))
        );
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
            {/* ==========================================
          CỘT TRÁI: FORM THÊM HOẠT ĐỘNG MỚI
      ========================================== */}
            <div className="lg:col-span-5 space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-red-700" />
                            Thêm Hoạt Động & Bộ Tiêu Chí
                        </h2>
                        <span className="text-xs text-slate-500">Chọn 1 hoặc nhiều</span>
                    </div>

                    <form onSubmit={handleAddActivity} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Tên hoạt động / Sự kiện rèn luyện
                            </label>
                            <input
                                type="text"
                                value={newActName}
                                onChange={(e) => setNewActName(e.target.value)}
                                placeholder="VD: Hội thảo AI, Hiến máu, Giải chạy Bách Khoa..."
                                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-red-700 focus:ring-2 focus:ring-red-700/15 outline-none"
                            />
                        </div>

                        {/* Trạng thái hoạt động */}
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setNewActStatus('done')}
                                className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                                    newActStatus === 'done'
                                        ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                                        : 'bg-slate-50 border-slate-200 text-slate-600'
                                }`}
                            >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Đã tham gia / Đã đăng ký
                            </button>
                            <button
                                type="button"
                                onClick={() => setNewActStatus('planned')}
                                className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                                    newActStatus === 'planned'
                                        ? 'bg-amber-50 border-amber-400 text-amber-800'
                                        : 'bg-slate-50 border-slate-200 text-slate-600'
                                }`}
                            >
                                <CalendarClock className="w-3.5 h-3.5" />
                                Dự kiến
                            </button>
                        </div>

                        {/* Chọn bộ tiêu chí */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-xs font-bold text-slate-700">
                                    Bộ tiêu chí của hoạt động ({newActCriteria.length} đã chọn)
                                </label>
                                {newActCriteria.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setNewActCriteria([])}
                                        className="text-[11px] text-red-700 hover:underline font-medium cursor-pointer"
                                    >
                                        Bỏ chọn hết
                                    </button>
                                )}
                            </div>

                            {newActCriteria.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5 p-2.5 bg-red-50/60 border border-red-200 rounded-xl mb-2.5">
                                    {newActCriteria.map((cid) => {
                                        const crit = CRITERIA_MAP[cid];
                                        return (
                                            <span
                                                key={cid}
                                                onClick={() => toggleNewActCriterion(cid)}
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-red-800 text-white cursor-pointer hover:bg-red-900 transition"
                                            >
                        <span>{cid}</span>
                        <span className="text-amber-300">({crit?.points}đ)</span>
                        <span className="ml-0.5 text-red-200">×</span>
                      </span>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-xs text-slate-400 italic bg-slate-50 border border-dashed border-slate-200 rounded-xl p-2.5 mb-2.5">
                                    Nhấp vào các mã tiêu chí bên dưới (VD: 2.1.2, 3.1.1...) mà hoạt động này cấp.
                                </div>
                            )}

                            {/* Lọc và Tìm kiếm tiêu chí */}
                            <div className="flex gap-1.5 mb-2">
                                <div className="relative flex-1">
                                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={criteriaSearch}
                                        onChange={(e) => setCriteriaSearch(e.target.value)}
                                        placeholder="Tìm mã hoặc từ khóa..."
                                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-red-700 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-1 mb-2">
                                {['ALL', 'TC1', 'TC2', 'TC3', 'TC4', 'TC5'].map((code) => (
                                    <button
                                        type="button"
                                        key={code}
                                        onClick={() => setSelectedSectionFilter(code)}
                                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                                            selectedSectionFilter === code
                                                ? 'bg-slate-800 text-white'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        {code === 'ALL' ? 'Tất cả' : code}
                                    </button>
                                ))}
                            </div>

                            <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-slate-50/50">
                                {ALL_CRITERIA_LIST.filter((c) => {
                                    if (selectedSectionFilter !== 'ALL' && c.sectionCode !== selectedSectionFilter) return false;
                                    if (!criteriaSearch.trim()) return true;
                                    const q = criteriaSearch.toLowerCase();
                                    return c.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q);
                                }).map((crit) => {
                                    const isSelected = newActCriteria.includes(crit.id);
                                    const isAlreadyAchieved = achievedSet.has(crit.id);
                                    const secState = evaluation.sectionBreakdown[crit.sectionId];
                                    const subState = evaluation.subSectionBreakdown[crit.subSectionId];
                                    const isCappedOut = secState.isCapped || subState.isCapped;

                                    return (
                                        <div
                                            key={crit.id}
                                            onClick={() => toggleNewActCriterion(crit.id)}
                                            className={`p-2.5 text-xs flex items-start gap-2.5 cursor-pointer transition ${
                                                isSelected ? 'bg-red-50/90 hover:bg-red-100/70' : 'hover:bg-white'
                                            }`}
                                        >
                                            <div className="mt-0.5">
                                                {isSelected ? <CheckSquare className="w-4 h-4 text-red-700" /> : <Square className="w-4 h-4 text-slate-400" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center flex-wrap gap-1.5">
                                                    <span className="font-extrabold text-slate-900">{crit.id}</span>
                                                    <span className="px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700 font-bold text-[10px]">
                            +{crit.points}đ
                          </span>
                                                    {isAlreadyAchieved ? (
                                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">Đã có</span>
                                                    ) : isCappedOut ? (
                                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">Kịch trần</span>
                                                    ) : (
                                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">Cần săn</span>
                                                    )}
                                                </div>
                                                <p className="text-slate-600 line-clamp-2 mt-0.5 leading-snug">{crit.title}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!newActName.trim() || newActCriteria.length === 0}
                            className="w-full py-2.5 px-4 rounded-xl bg-red-800 hover:bg-red-900 disabled:bg-slate-300 text-white font-bold text-sm shadow-sm transition cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Thêm vào danh sách tối ưu
                        </button>
                    </form>
                </div>

                <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-1.5">
                    <div className="font-extrabold flex items-center gap-1.5 text-amber-950">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        Cơ chế phân bổ thông minh
                    </div>
                    <p>• Mỗi hoạt động chỉ được tính điểm cho <b>tối đa 1 tiêu chí</b>.</p>
                    <p>• Thuật toán tự động tìm phương án ghép cặp sao cho <b>Tổng ĐRL cuối cùng</b> là cao nhất sau khi áp trần.</p>
                    <p>• Nếu 1 hoạt động không giúp tăng điểm (do trùng hoặc đã kịch trần), hệ thống báo <b>"Dư thừa"</b>.</p>
                </div>
            </div>

            {/* ==========================================
          CỘT PHẢI: DANH SÁCH HOẠT ĐỘNG
      ========================================== */}
            <div className="lg:col-span-7 space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                        <div>
                            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-red-700" />
                                Danh Sách Hoạt Động & Phân Bổ ({activities.length})
                            </h2>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                {effectiveActsCount} Hiệu quả
              </span>
                            <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                {redundantActsCount} Dư thừa
              </span>
                        </div>
                    </div>

                    {activities.length === 0 ? (
                        <div className="text-center py-12 px-4">
                            <p className="text-sm font-bold text-slate-700">Chưa có hoạt động ngoại khóa nào</p>
                        </div>
                    ) : (
                        <div className="space-y-3 mt-4">
                            {activities.map((act) => {
                                const analysis = activityAnalysis[act.id];
                                const isIgnoredPlanned = act.status === 'planned' && !includePlanned;
                                const assignedCrit = analysis?.assignedCriterion ? CRITERIA_MAP[analysis.assignedCriterion] : null;

                                return (
                                    <div
                                        key={act.id}
                                        className={`rounded-2xl border p-4 transition ${
                                            isIgnoredPlanned
                                                ? 'bg-slate-50 border-slate-200 opacity-60'
                                                : analysis?.isRedundant
                                                    ? 'bg-amber-50/40 border-amber-300'
                                                    : 'bg-white border-emerald-300 shadow-xs'
                                        }`}
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                            <div className="space-y-1 flex-1">
                                                <div className="flex items-center flex-wrap gap-2">
                          <span
                              onClick={() => toggleActivityStatus(act.id)}
                              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full cursor-pointer transition ${
                                  act.status === 'done' ? 'bg-slate-800 text-white' : 'bg-amber-100 text-amber-900 border border-amber-300'
                              }`}
                          >
                            {act.status === 'done' ? '✓ Đã tham gia' : '⏳ Dự kiến đăng ký'}
                          </span>
                                                    <h3 className="text-sm font-extrabold text-slate-900">{act.name}</h3>
                                                </div>

                                                {!isIgnoredPlanned && (
                                                    <div className="pt-1">
                                                        {assignedCrit ? (
                                                            <div className="inline-flex items-center gap-1.5 text-xs bg-emerald-100/90 text-emerald-900 px-3 py-1 rounded-xl font-bold border border-emerald-300">
                                                                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                                                                <span>Đang gánh <b>{assignedCrit.id}</b> (+{assignedCrit.points}đ gốc → Tăng <b>+{analysis.effectiveGain}đ</b>)</span>
                                                            </div>
                                                        ) : (
                                                            <div className="inline-flex items-start gap-1.5 text-xs bg-amber-100/90 text-amber-950 px-3 py-1.5 rounded-xl font-semibold border border-amber-300">
                                                                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                                                                <span>Dư thừa: {analysis?.reason}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => removeActivity(act.id)}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2">
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                <span className="text-[11px] font-semibold text-slate-500 mr-1">Bộ tiêu chí:</span>
                                                {act.criteria.map((cid: string) => {
                                                    const c = CRITERIA_MAP[cid];
                                                    if (!c) return null;
                                                    const isAssignedHere = analysis?.assignedCriterion === cid;
                                                    const isLockedHere = act.forcedCriterion === cid;

                                                    return (
                                                        <button
                                                            key={cid}
                                                            type="button"
                                                            onClick={() => setForcedCriterion(act.id, isLockedHere ? null : cid)}
                                                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                                                                isAssignedHere ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs' : 'bg-slate-100 text-slate-700 border-slate-200'
                                                            }`}
                                                        >
                                                            {isLockedHere && <Lock className="w-3 h-3 text-amber-300" />}
                                                            <span>{cid}</span>
                                                            <span className={isAssignedHere ? 'text-emerald-200' : 'text-slate-500'}>({c.points}đ)</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            {act.forcedCriterion && (
                                                <button
                                                    type="button"
                                                    onClick={() => setForcedCriterion(act.id, null)}
                                                    className="text-[11px] text-amber-800 hover:underline flex items-center gap-1 font-semibold"
                                                >
                                                    <Unlock className="w-3 h-3" /> Bỏ khóa
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}