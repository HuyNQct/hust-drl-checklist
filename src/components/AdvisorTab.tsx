import { ShieldCheck } from 'lucide-react';

// Định nghĩa Props nhận từ component cha (App.tsx)
interface AdvisorTabProps {
    evaluation: any;
    advisorRecommendations: any[];
    toggleManualCriterion: (critId: string) => void;
}

export default function AdvisorTab({
                                       evaluation,
                                       advisorRecommendations,
                                       toggleManualCriterion,
                                   }: AdvisorTabProps) {
    return (
        <div className="mt-5 space-y-6">
            {/* 1. CARD TỔNG QUAN CHIẾN LƯỢC */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 sm:p-6 shadow-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Chiến lược tối ưu hóa ĐRL Bách Khoa
            </span>
                        <h2 className="text-lg sm:text-xl font-extrabold">
                            {evaluation.totalScore >= 100
                                ? '🎉 Chúc mừng! Bạn đã đạt tuyệt đối 100/100 điểm rèn luyện!'
                                : `Bạn còn có thể kiếm thêm tối đa +${100 - evaluation.totalScore} điểm nữa`}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                            Dưới đây là phân tích lỗ hổng điểm ở từng phần TC1 → TC5. Chỉ đăng ký các hoạt động nằm trong những đề mục <b>còn dư địa điểm</b> để không tốn thời gian đi sự kiện thừa.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 shrink-0">
                        {evaluation.totalScore < 90 && (
                            <div className="bg-white/10 border border-white/15 rounded-xl px-3.5 py-2 text-xs">
                                <div className="text-slate-300">Mốc Xuất sắc (90đ)</div>
                                <div className="text-base font-black text-amber-300">
                                    Cần +{90 - evaluation.totalScore}đ
                                </div>
                            </div>
                        )}
                        {evaluation.totalScore < 80 && (
                            <div className="bg-white/10 border border-white/15 rounded-xl px-3.5 py-2 text-xs">
                                <div className="text-slate-300">Mốc Tốt (80đ)</div>
                                <div className="text-base font-black text-emerald-300">
                                    Cần +{80 - evaluation.totalScore}đ
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. CHI TIẾT GỢI Ý TỪNG PHẦN TC1 -> TC5 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {advisorRecommendations.map(({ section, secBreak, missingInSec, bestToHunt }) => (
                    <div
                        key={section.id}
                        className={`rounded-2xl border p-5 bg-white shadow-xs flex flex-col justify-between ${
                            secBreak.isCapped ? 'border-emerald-300' : 'border-slate-200'
                        }`}
                    >
                        <div>
                            {/* Header của từng Phần (TC1, TC2...) */}
                            <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                                <div>
                                    <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-red-800 text-white">
                      {section.code}
                    </span>
                                        <h3 className="text-sm font-extrabold text-slate-900">
                                            {section.shortName}
                                        </h3>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">{section.title}</p>
                                </div>

                                <div className="text-right shrink-0">
                                    <div className="text-base font-black text-slate-900">
                                        {secBreak.capped}/{section.maxPoints}đ
                                    </div>
                                    {secBreak.isCapped ? (
                                        <span className="text-[11px] font-bold text-emerald-700">
                      ✓ Đã kịch trần
                    </span>
                                    ) : (
                                        <span className="text-[11px] font-bold text-amber-700">
                      Còn thiếu {missingInSec}đ
                    </span>
                                    )}
                                </div>
                            </div>

                            {/* Phân tích trạng thái kịch trần hoặc gợi ý săn điểm */}
                            {secBreak.isCapped ? (
                                <div className="py-6 text-center text-xs text-emerald-800 bg-emerald-50/60 rounded-xl mt-4 border border-emerald-200 p-4">
                                    <ShieldCheck className="w-7 h-7 text-emerald-600 mx-auto mb-1.5" />
                                    <p className="font-bold text-sm">
                                        Phần {section.code} đã đạt tối đa {section.maxPoints}/{section.maxPoints} điểm!
                                    </p>
                                    <p className="text-emerald-700 mt-0.5">
                                        Bạn không cần đăng ký thêm bất kỳ hoạt động nào thuộc {section.code} nữa.
                                    </p>
                                </div>
                            ) : (
                                <div className="mt-3 space-y-2.5">
                                    <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                                        <span>Tiêu chí nên săn tiếp theo (Hiệu suất cao nhất):</span>
                                        <span className="text-[11px] text-slate-500">Nhấn để tick thử</span>
                                    </div>

                                    {/* Render top 5 tiêu chí đáng giá nhất để săn */}
                                    {bestToHunt.slice(0, 5).map((crit: any) => (
                                        <div
                                            key={crit.id}
                                            onClick={() => toggleManualCriterion(crit.id)}
                                            className="p-3 rounded-xl border border-slate-200 hover:border-red-400 hover:bg-red-50/20 transition cursor-pointer flex items-start justify-between gap-3"
                                        >
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                            {crit.id}
                          </span>
                                                    <span className="text-[11px] text-slate-500 font-medium">
                            Mục {crit.subSectionId} (Còn trống {crit.subRemaining}đ)
                          </span>
                                                </div>
                                                <p className="text-xs text-slate-700 line-clamp-2 mt-1">
                                                    {crit.title}
                                                </p>
                                            </div>

                                            <div className="text-right shrink-0">
                        <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-600 text-white">
                          +{crit.effectiveGain}đ
                        </span>
                                                {crit.wastedPoints > 0 && (
                                                    <div className="text-[10px] text-amber-700 mt-0.5">
                                                        (Gốc {crit.points}đ, chạm trần)
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Trạng thái các đề mục con dưới cùng */}
                        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                            {section.subSections.map((sub: any) => {
                                const subState = evaluation.subSectionBreakdown[sub.id];
                                return (
                                    <span
                                        key={sub.id}
                                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                                            subState.isCapped
                                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                                : 'bg-slate-50 text-slate-700 border-slate-200'
                                        }`}
                                    >
                    Mục {sub.id}: {subState.capped}/{sub.maxPoints}đ{' '}
                                        {subState.isCapped ? '(Đầy)' : ''}
                  </span>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}