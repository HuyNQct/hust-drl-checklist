import React, { useState, useEffect, useMemo } from 'react';
import {
    Plus,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Check,
    Calendar,
    Grid,
    Download,
    Upload,
    Clock,
    Sparkles
} from 'lucide-react';

interface Subject {
    id: string;
    name: string;
}

export default function ScheduleChecklist() {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0 - 11
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [viewMode, setViewMode] = useState<'matrix' | 'calendar'>('matrix');

    // Danh sách môn học
    const [subjects, setSubjects] = useState<Subject[]>(() => {
        try {
            const saved = localStorage.getItem('hust_study_subjects_v2');
            return saved ? JSON.parse(saved) : [
                { id: 'sub-1', name: 'Đại số tuyến tính' },
                { id: 'sub-2', name: 'Giải tích 3' },
                { id: 'sub-3', name: 'Cấu trúc dữ liệu & Giải thuật' },
                { id: 'sub-4', name: 'Kiến trúc máy tính' }
            ];
        } catch {
            return [];
        }
    });

    // Dữ liệu tick: { "2026-11": { "sub-1": [1, 5, 8], "sub-2": [2, 8] } }
    const [records, setRecords] = useState<Record<string, Record<string, number[]>>>(() => {
        try {
            const saved = localStorage.getItem('hust_study_records_v2');
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    });

    const [newSubjectName, setNewSubjectName] = useState('');
    const monthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;

    // Lưu LocalStorage
    useEffect(() => {
        localStorage.setItem('hust_study_subjects_v2', JSON.stringify(subjects));
    }, [subjects]);

    useEffect(() => {
        localStorage.setItem('hust_study_records_v2', JSON.stringify(records));
    }, [records]);

    // Tính số ngày và thứ trong tháng
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysList = useMemo(() => {
        return Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dateObj = new Date(currentYear, currentMonth, day);
            const dayOfWeek = dateObj.getDay(); // 0: CN, 1: T2, ..., 6: T7
            const dayLabels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
            return {
                day,
                label: dayLabels[dayOfWeek],
                isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
                isToday:
                    day === today.getDate() &&
                    currentMonth === today.getMonth() &&
                    currentYear === today.getFullYear()
            };
        });
    }, [currentYear, currentMonth, daysInMonth, today]);

    // Điều hướng tháng
    const changeMonth = (delta: number) => {
        let nextMonth = currentMonth + delta;
        let nextYear = currentYear;
        if (nextMonth < 0) {
            nextMonth = 11;
            nextYear -= 1;
        } else if (nextMonth > 11) {
            nextMonth = 0;
            nextYear += 1;
        }
        setCurrentMonth(nextMonth);
        setCurrentYear(nextYear);
    };

    const jumpToToday = () => {
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
    };

    // Thêm / Xóa môn học
    const handleAddSubject = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = newSubjectName.trim();
        if (!trimmed) return;
        if (subjects.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
            alert('Môn học này đã có trong danh sách!');
            return;
        }
        setSubjects((prev) => [...prev, { id: `sub-${Date.now()}`, name: trimmed }]);
        setNewSubjectName('');
    };

    const handleRemoveSubject = (id: string, name: string) => {
        if (window.confirm(`Xóa môn "${name}" khỏi checklist?`)) {
            setSubjects((prev) => prev.filter((s) => s.id !== id));
            // Dọn rác trong records
            setRecords((prev) => {
                const updated = { ...prev };
                Object.keys(updated).forEach((m) => {
                    if (updated[m]?.[id]) {
                        const copy = { ...updated[m] };
                        delete copy[id];
                        updated[m] = copy;
                    }
                });
                return updated;
            });
        }
    };

    // Toggle tick ngày - SỬA LỖI MUTATION HOÀN TOÀN
    const toggleCheck = (subjectId: string, day: number) => {
        setRecords((prev) => {
            const monthData = prev[monthKey] ? { ...prev[monthKey] } : {};
            const subjectDays = monthData[subjectId] ? [...monthData[subjectId]] : [];

            const existsIndex = subjectDays.indexOf(day);
            let updatedDays: number[];
            if (existsIndex > -1) {
                updatedDays = subjectDays.filter((d) => d !== day);
            } else {
                updatedDays = [...subjectDays, day];
            }

            monthData[subjectId] = updatedDays;
            return {
                ...prev,
                [monthKey]: monthData
            };
        });
    };

    const isChecked = (subjectId: string, day: number) => {
        return records[monthKey]?.[subjectId]?.includes(day) || false;
    };

    const getSubjectMonthCount = (subjectId: string) => {
        return records[monthKey]?.[subjectId]?.length || 0;
    };

    // Backup / Import JSON
    const exportData = () => {
        const dataStr = JSON.stringify({ subjects, records }, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `study_checklist_backup_${monthKey}.json`;
        a.click();
    };

    const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target?.result as string);
                if (parsed.subjects && parsed.records) {
                    setSubjects(parsed.subjects);
                    setRecords(parsed.records);
                    alert('Khôi phục dữ liệu thành công!');
                }
            } catch {
                alert('File không hợp lệ!');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="mt-5 space-y-5">
            {/* =====================================================================
          1. WIDGET TẬP TRUNG HÔM NAY (TODAY FOCUS CHECKLIST)
      ===================================================================== */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-sm border border-blue-950">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Hôm nay
              </span>
                            <span className="text-xs text-slate-300">
                {today.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
              </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-extrabold flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-amber-300" />
                            Checklist nhanh: Hôm nay bạn đã ôn môn gì?
                        </h3>
                    </div>

                    <div className="text-xs text-slate-300 font-medium">
                        Đã tick:{' '}
                        <b className="text-amber-300 text-sm">
                            {subjects.filter((s) => isChecked(s.id, today.getDate()) && currentMonth === today.getMonth() && currentYear === today.getFullYear()).length}
                        </b>
                        /{subjects.length} môn
                    </div>
                </div>

                {/* Nút bấm tick nhanh từng môn hôm nay */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
                    {subjects.map((sub) => {
                        const checkedToday = isChecked(sub.id, today.getDate()) && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                        return (
                            <button
                                key={sub.id}
                                type="button"
                                onClick={() => {
                                    if (currentMonth !== today.getMonth() || currentYear !== today.getFullYear()) {
                                        jumpToToday();
                                    }
                                    toggleCheck(sub.id, today.getDate());
                                }}
                                className={`p-3 rounded-xl border text-left font-bold text-xs flex items-center justify-between gap-2 transition cursor-pointer ${
                                    checkedToday
                                        ? 'bg-blue-600 border-blue-400 text-white shadow-sm'
                                        : 'bg-white/10 border-white/15 text-slate-200 hover:bg-white/20'
                                }`}
                            >
                                <span className="truncate">{sub.name}</span>
                                <div
                                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                                        checkedToday ? 'bg-white text-blue-700 border-white' : 'border-white/30 text-transparent'
                                    }`}
                                >
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* =====================================================================
          2. THANH CÔNG CỤ: THÊM MÔN, ĐIỀU HƯỚNG & VIEW MODE
      ===================================================================== */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Form thêm môn */}
                    <form onSubmit={handleAddSubject} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={newSubjectName}
                            onChange={(e) => setNewSubjectName(e.target.value)}
                            placeholder="Nhập tên môn học kỳ này..."
                            className="px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 outline-none w-56 sm:w-72"
                        />
                        <button
                            type="submit"
                            disabled={!newSubjectName.trim()}
                            className="px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Thêm môn</span>
                        </button>
                    </form>

                    {/* Điều hướng tháng & Chế độ xem */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                            <button
                                type="button"
                                onClick={() => setViewMode('matrix')}
                                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                                    viewMode === 'matrix' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <Grid className="w-3.5 h-3.5" /> Ma Trận
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('calendar')}
                                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                                    viewMode === 'calendar' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <Calendar className="w-3.5 h-3.5" /> Lịch Tháng
                            </button>
                        </div>

                        {/* Chuyển tháng */}
                        <div className="flex items-center gap-1 bg-slate-900 text-white rounded-xl p-1 shadow-xs">
                            <button
                                onClick={() => changeMonth(-1)}
                                className="p-1.5 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                                title="Tháng trước"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-xs font-bold px-2 tabular-nums">
                Tháng {currentMonth + 1}/{currentYear}
              </span>
                            <button
                                onClick={() => changeMonth(1)}
                                className="p-1.5 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                                title="Tháng sau"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        <button
                            onClick={jumpToToday}
                            className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition cursor-pointer"
                        >
                            Hôm nay
                        </button>

                        {/* Xuất / Nhập backup */}
                        <button
                            onClick={exportData}
                            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                            title="Xuất file JSON sao lưu"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                        <label
                            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                            title="Nhập file JSON đã lưu"
                        >
                            <Upload className="w-4 h-4" />
                            <input type="file" accept=".json" onChange={importData} className="hidden" />
                        </label>
                    </div>
                </div>
            </div>

            {/* =====================================================================
          3. CHẾ ĐỘ 1: BẢNG MA TRẬN GRID (CẢI TIẾN THỨ TRONG TUẦN & TỔNG)
      ===================================================================== */}
            {viewMode === 'matrix' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left border-collapse min-w-max">
                            <thead>
                            <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700">
                                <th className="px-4 py-3 font-extrabold sticky left-0 z-20 bg-slate-100 border-r border-slate-200 min-w-[170px]">
                                    Môn học ({subjects.length})
                                </th>
                                <th className="px-3 py-3 font-extrabold text-center border-r border-slate-200 bg-blue-50/70 text-blue-900 w-20">
                                    Tổng buổi
                                </th>
                                {daysList.map(({ day, label, isWeekend, isToday }) => (
                                    <th
                                        key={day}
                                        className={`p-1 text-center min-w-[34px] border-r border-slate-200/60 ${
                                            isToday ? 'bg-amber-100 text-amber-900 font-black' : isWeekend ? 'bg-slate-200/50 text-slate-500' : ''
                                        }`}
                                    >
                                        <div className="text-[10px] uppercase font-bold text-slate-400">{label}</div>
                                        <div className="text-xs">{day}</div>
                                    </th>
                                ))}
                                <th className="px-3 py-3 text-center w-12 sticky right-0 bg-slate-100 border-l border-slate-200">
                                    Xóa
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                            {subjects.map((sub) => {
                                const count = getSubjectMonthCount(sub.id);
                                return (
                                    <tr key={sub.id} className="hover:bg-blue-50/30 transition-colors">
                                        {/* Tên môn */}
                                        <td className="px-4 py-2.5 font-bold text-slate-800 sticky left-0 z-10 bg-white border-r border-slate-200 shadow-xs">
                                            <div className="truncate max-w-[160px] sm:max-w-[200px]" title={sub.name}>
                                                {sub.name}
                                            </div>
                                        </td>

                                        {/* Tổng buổi đã ôn */}
                                        <td className="px-2 py-2.5 text-center border-r border-slate-100 bg-blue-50/20 font-black text-blue-700">
                        <span className={`px-2 py-0.5 rounded-full ${count > 0 ? 'bg-blue-100 text-blue-800' : 'text-slate-400'}`}>
                          {count}
                        </span>
                                        </td>

                                        {/* 30/31 Ngày */}
                                        {daysList.map(({ day, isToday, isWeekend }) => {
                                            const checked = isChecked(sub.id, day);
                                            return (
                                                <td
                                                    key={day}
                                                    onClick={() => toggleCheck(sub.id, day)}
                                                    className={`p-1 text-center cursor-pointer border-r border-slate-100 transition-colors ${
                                                        isToday ? 'bg-amber-50/70' : isWeekend ? 'bg-slate-50/40' : ''
                                                    } hover:bg-blue-100/50`}
                                                >
                                                    <div
                                                        className={`mx-auto w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
                                                            checked
                                                                ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                                                                : isToday
                                                                    ? 'bg-white border-amber-400 text-transparent'
                                                                    : 'bg-white border-slate-300 text-transparent'
                                                        }`}
                                                    >
                                                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                                    </div>
                                                </td>
                                            );
                                        })}

                                        {/* Nút xóa */}
                                        <td className="px-2 py-2 text-center sticky right-0 bg-white border-l border-slate-200 shadow-xs">
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSubject(sub.id, sub.name)}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                                                title="Xóa môn"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* =====================================================================
          4. CHẾ ĐỘ 2: CUỐN LỊCH BÀN TRUYỀN THỐNG (7 CỘT THÁNG)
      ===================================================================== */}
            {viewMode === 'calendar' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5">
                    {/* Header 7 cột thứ trong tuần */}
                    <div className="grid grid-cols-7 gap-2 text-center font-extrabold text-xs text-slate-500 mb-2">
                        {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'].map((d) => (
                            <div key={d} className="py-1 bg-slate-100 rounded-lg">
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Ô ngày dạng bàn cờ */}
                    <div className="grid grid-cols-7 gap-2">
                        {/* Khoảng trống đầu tháng */}
                        {Array.from({
                            length: (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7
                        }).map((_, i) => (
                            <div key={`empty-${i}`} className="min-h-[90px] rounded-xl bg-slate-50/50 border border-dashed border-slate-200/60 opacity-40" />
                        ))}

                        {/* Các ngày trong tháng */}
                        {daysList.map(({ day, isToday }) => {
                            const studiedSubjects = subjects.filter((s) => isChecked(s.id, day));
                            return (
                                <div
                                    key={day}
                                    className={`min-h-[105px] p-2 rounded-xl border flex flex-col justify-between transition ${
                                        isToday ? 'bg-amber-50/50 border-amber-400 shadow-xs ring-1 ring-amber-400/30' : 'bg-white border-slate-200 hover:border-blue-300'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                    <span
                        className={`text-xs font-black w-6 h-6 rounded-full flex items-center justify-center ${
                            isToday ? 'bg-amber-500 text-white' : 'text-slate-800'
                        }`}
                    >
                      {day}
                    </span>
                                        {studiedSubjects.length > 0 && (
                                            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                        {studiedSubjects.length} môn
                      </span>
                                        )}
                                    </div>

                                    {/* Checklist các môn trong ngày */}
                                    <div className="space-y-1 mt-1.5 flex-1 overflow-y-auto max-h-24">
                                        {subjects.map((sub) => {
                                            const checked = isChecked(sub.id, day);
                                            return (
                                                <div
                                                    key={sub.id}
                                                    onClick={() => toggleCheck(sub.id, day)}
                                                    className={`text-[10px] px-1.5 py-1 rounded-md font-semibold cursor-pointer flex items-center justify-between gap-1 transition ${
                                                        checked
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                    }`}
                                                >
                                                    <span className="truncate">{sub.name}</span>
                                                    {checked && <Check className="w-3 h-3 shrink-0" />}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}