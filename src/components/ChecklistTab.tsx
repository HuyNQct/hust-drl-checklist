import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, CheckCircle2, Sparkles } from 'lucide-react';
import { HUST_DRL_DATA } from '../data/hustData'; // Import data chung

// Định nghĩa Props nhận từ App.tsx
interface ChecklistTabProps {
    evaluation: any;
    achievedSet: Set<string>;
    manualCriteria: string[];
    toggleManualCriterion: (critId: string) => void;
    criterionSourceMap: Record<string, any>;
}

export default function ChecklistTab({
                                         evaluation,
                                         achievedSet,
                                         manualCriteria,
                                         toggleManualCriterion,
                                         criterionSourceMap
                                     }: ChecklistTabProps) {
    // State quản lý bộ lọc và giao diện (chỉ dùng nội bộ trong Tab này)
    const [checklistSearch, setChecklistSearch] = useState('');
    const [checklistFilter, setChecklistFilter] = useState('all'); // 'all' | 'achieved' | 'unachieved' | 'effective_open'
    const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

    return (
        <div className="mt-5 space-y-5">
            {/* Thanh công cụ lọc và tìm kiếm tiêu chí */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={checklistSearch}
                        onChange={(e) => setChecklistSearch(e.target.value)}
                        placeholder="Tìm kiếm tiêu chí theo mã (VD: 2.3.1, 5.1) hoặc nội dung..."
                        className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:border-red-700 outline-none"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                    {[
                        { id: 'all', label: 'Tất cả tiêu chí' },
                        { id: 'achieved', label: `Đã đạt (${achievedSet.size})` },
                        { id: 'unachieved', label: 'Chưa đạt' },
                        { id: 'effective_open', label: '🎯 Chưa đạt & Còn trần điểm' }
                    ].map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setChecklistFilter(f.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                                checklistFilter === f.id
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Danh sách 5 phần TC1 -> TC5 */}
            {HUST_DRL_DATA.map((sec) => {
                const secState = evaluation.sectionBreakdown[sec.id];
                const isCollapsed = !!collapsedSections[sec.id];

                return (
                    <div
                        key={sec.id}
                        className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
                    >
                        {/* Header của Phần TC */}
                        <div
                            onClick={() => setCollapsedSections((prev) => ({ ...prev, [sec.id]: !prev[sec.id] }))}
                            className={`p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none border-b ${
                                secState.isCapped
                                    ? 'bg-emerald-50/70 border-emerald-200'
                                    : 'bg-slate-900 text-white border-slate-800'
                            }`}
                        >
                            <div className="flex items-start gap-3">
                <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-black shrink-0 ${
                        secState.isCapped ? 'bg-emerald-600 text-white' : 'bg-red-700 text-white'
                    }`}
                >
                  {sec.code}
                </span>
                                <div>
                                    <h2
                                        className={`text-sm sm:text-base font-extrabold ${
                                            secState.isCapped ? 'text-emerald-950' : 'text-white'
                                        }`}
                                    >
                                        {sec.title}
                                    </h2>
                                    <div
                                        className={`text-xs mt-0.5 ${
                                            secState.isCapped ? 'text-emerald-700' : 'text-slate-300'
                                        }`}
                                    >
                                        Tổng điểm các đề mục: {secState.subCappedSum}đ • Trần tối đa phần {sec.code}:{' '}
                                        <b>{sec.maxPoints} điểm</b>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                                <div className="text-right">
                                    <div
                                        className={`text-lg font-black tabular-nums ${
                                            secState.isCapped ? 'text-emerald-700' : 'text-amber-400'
                                        }`}
                                    >
                                        {secState.capped} / {sec.maxPoints} điểm
                                    </div>
                                    <div
                                        className={`text-[11px] font-semibold ${
                                            secState.isCapped ? 'text-emerald-700' : 'text-slate-300'
                                        }`}
                                    >
                                        {secState.isCapped
                                            ? '✓ Đã đạt tối đa phần này'
                                            : `Còn thiếu ${secState.remaining}đ`}
                                    </div>
                                </div>
                                {isCollapsed ? (
                                    <ChevronDown
                                        className={`w-5 h-5 ${secState.isCapped ? 'text-emerald-800' : 'text-slate-300'}`}
                                    />
                                ) : (
                                    <ChevronUp
                                        className={`w-5 h-5 ${secState.isCapped ? 'text-emerald-800' : 'text-slate-300'}`}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Nội dung các Đề mục (Sub-sections) */}
                        {!isCollapsed && (
                            <div className="divide-y divide-slate-200">
                                {sec.subSections.map((sub) => {
                                    const subState = evaluation.subSectionBreakdown[sub.id];
                                    const effectiveRoom = Math.min(secState.remaining, subState.remaining);

                                    // Lọc tiêu chí theo bộ lọc hiện tại
                                    const filteredCriteria = sub.criteria.filter((crit) => {
                                        const isAchieved = achievedSet.has(crit.id);
                                        if (checklistFilter === 'achieved' && !isAchieved) return false;
                                        if (checklistFilter === 'unachieved' && isAchieved) return false;
                                        if (checklistFilter === 'effective_open' && (isAchieved || effectiveRoom <= 0)) return false;

                                        if (checklistSearch.trim()) {
                                            const q = checklistSearch.toLowerCase();
                                            return crit.id.toLowerCase().includes(q) || crit.title.toLowerCase().includes(q);
                                        }
                                        return true;
                                    });

                                    if (filteredCriteria.length === 0) return null;

                                    return (
                                        <div key={sub.id} className="p-4 sm:px-6 bg-white">
                                            {/* Header Đề mục */}
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
                                                <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-extrabold text-xs">
                            Mục {sub.id}
                          </span>
                                                    <h3 className="text-xs sm:text-sm font-bold text-slate-800">
                                                        {sub.title}
                                                    </h3>
                                                </div>

                                                <div className="flex items-center gap-2 shrink-0">
                                                    {subState.isCapped ? (
                                                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                              ✓ Kịch trần đề mục ({subState.capped}/{sub.maxPoints}đ)
                            </span>
                                                    ) : secState.isCapped ? (
                                                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Đã kịch trần {sec.code} ({subState.capped}/{sub.maxPoints}đ)
                            </span>
                                                    ) : (
                                                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                              Điểm đề mục: {subState.capped}/{sub.maxPoints}đ (Còn nhận tối đa{' '}
                                                            <b className="text-red-700">+{effectiveRoom}đ</b>)
                            </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Các dòng tiêu chí */}
                                            <div className="space-y-2">
                                                {filteredCriteria.map((crit) => {
                                                    const isManual = manualCriteria.includes(crit.id);
                                                    const isAchieved = achievedSet.has(crit.id);
                                                    const source = criterionSourceMap[crit.id];
                                                    const effectiveIfPicked = Math.min(crit.points, effectiveRoom);

                                                    return (
                                                        <div
                                                            key={crit.id}
                                                            onClick={() => toggleManualCriterion(crit.id)}
                                                            className={`p-3 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer ${
                                                                isAchieved
                                                                    ? 'bg-emerald-50/60 border-emerald-300 hover:bg-emerald-50'
                                                                    : effectiveRoom === 0
                                                                        ? 'bg-slate-50/70 border-slate-200 opacity-65 hover:opacity-100'
                                                                        : 'bg-white border-slate-200 hover:border-red-300 hover:bg-red-50/10'
                                                            }`}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className="mt-0.5 shrink-0">
                                                                    {isManual ? (
                                                                        <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center">
                                                                            <CheckCircle2 className="w-4 h-4" />
                                                                        </div>
                                                                    ) : isAchieved ? (
                                                                        <div className="w-5 h-5 rounded-md bg-red-700 text-white flex items-center justify-center">
                                                                            <Sparkles className="w-3.5 h-3.5" />
                                                                        </div>
                                                                    ) : (
                                                                        <div className="w-5 h-5 rounded-md border-2 border-slate-300 bg-white" />
                                                                    )}
                                                                </div>

                                                                <div className="space-y-1">
                                                                    <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-xs font-black px-2 py-0.5 rounded bg-slate-200/80 text-slate-900">
                                      {crit.id}
                                    </span>
                                                                        <span className="text-xs font-extrabold text-red-800 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                                      {crit.points} điểm
                                    </span>
                                                                        <span className="text-[11px] font-semibold text-slate-500">
                                      Minh chứng: <b>{crit.proof}</b>
                                    </span>

                                                                        {crit.isCommonDefault && (
                                                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                        Tiêu chí cơ bản
                                      </span>
                                                                        )}
                                                                    </div>

                                                                    <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                                                                        {crit.title}
                                                                    </p>

                                                                    {crit.hint && (
                                                                        <p className="text-[11px] text-slate-500 italic">💡 {crit.hint}</p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Nhãn nguồn đạt hoặc số điểm thực nhận nếu săn tiêu chí này */}
                                                            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                                                                {isAchieved ? (
                                                                    source?.type === 'activity' ? (
                                                                        <div className="text-right">
                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-red-800 text-white">
                                        <Sparkles className="w-3 h-3 text-amber-300" />
                                        HĐ: {source.activityName}
                                      </span>
                                                                        </div>
                                                                    ) : (
                                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-700 text-white">
                                      ✓ Đã tick đạt trực tiếp
                                    </span>
                                                                    )
                                                                ) : effectiveRoom === 0 ? (
                                                                    <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                                    Đã kịch trần (+0đ)
                                  </span>
                                                                ) : (
                                                                    <span className="text-xs font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">
                                    Săn mục này: +{effectiveIfPicked}đ thực tế
                                  </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}