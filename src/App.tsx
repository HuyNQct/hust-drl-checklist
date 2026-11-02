import { useState, useMemo, useEffect } from 'react';
import type { FormEvent } from 'react';
import {
  CheckCircle2,
  Plus,
  Trash2,
  Sparkles,
  AlertTriangle,
  Award,
  Layers,
  ListChecks,
  Compass,
  Search,
  Lock,
  Unlock,
  RotateCcw,
  Zap,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  CalendarClock,
  CheckSquare,
  Square
} from 'lucide-react';

// ============================================================================
// 1. DỮ LIỆU KHUNG ĐÁNH GIÁ KẾT QUẢ RÈN LUYỆN SINH VIÊN ĐHBK HÀ NỘI
// (Kèm theo Quyết định số 10911/QĐ-ĐHBK ngày 08/09/2026)
// ============================================================================
const HUST_DRL_DATA = [
  {
    id: 'TC1',
    code: 'TC1',
    shortName: 'Pháp luật & Nội quy',
    title: 'Chấp hành pháp luật và nội quy, quy chế của Đại học',
    maxPoints: 25,
    color: 'red',
    subSections: [
      {
        id: '1.1',
        title: 'Chấp hành các quy định của pháp luật đối với công dân',
        maxPoints: 15,
        criteria: [
          {
            id: '1.1.1',
            title: 'Hiểu biết và chấp hành pháp luật của Nhà nước, quy định của Đại học và nơi cư trú.',
            points: 6,
            proof: 'MC',
            isCommonDefault: true,
            hint: 'Thường đạt qua bài kiểm tra pháp luật / cam kết đầu kỳ'
          },
          {
            id: '1.1.2',
            title: 'Tham gia sinh hoạt công dân do Đại học, Trường/Khoa tổ chức.',
            points: 6,
            proof: 'MC',
            isCommonDefault: true,
            hint: 'Tuần sinh hoạt công dân đầu khóa/đầu năm'
          },
          {
            id: '1.1.3',
            title: 'Khai báo thông tin liên lạc và nơi cư trú theo yêu cầu của Đại học.',
            points: 4,
            proof: 'MC',
            isCommonDefault: true,
            hint: 'Cập nhật hồ sơ sinh viên trên hệ thống eHUST/CTSV'
          }
        ]
      },
      {
        id: '1.2',
        title: 'Chấp hành nội quy, quy chế và các quy định của Đại học',
        maxPoints: 15,
        criteria: [
          {
            id: '1.2.1',
            title: 'Tham gia Họp lớp thường kỳ do Trường/Khoa tổ chức.',
            points: 6,
            proof: 'MC',
            isCommonDefault: true,
            hint: 'Họp lớp cùng GVCN/Cố vấn học tập'
          },
          {
            id: '1.2.2',
            title: 'Nắm vững quy định và quy chế của Đại học.',
            points: 6,
            proof: 'MC',
            isCommonDefault: true,
            hint: 'Bài test quy chế đào tạo & CTSV'
          },
          {
            id: '1.2.3',
            title: 'Hoàn thành mục tiêu cam kết học tập và rèn luyện (Kết quả GPA và điểm rèn luyện cuối kỳ đạt từ mức đăng ký đầu kỳ trở lên).',
            points: 6,
            proof: 'MC',
            isCommonDefault: false,
            hint: 'Đạt mục tiêu GPA & ĐRL đã đăng ký đầu kỳ'
          }
        ]
      }
    ]
  },
  {
    id: 'TC2',
    code: 'TC2',
    shortName: 'Học tập & NCKH',
    title: 'Trách nhiệm, tinh thần và thái độ trong học tập',
    maxPoints: 20,
    color: 'blue',
    subSections: [
      {
        id: '2.1',
        title: 'Trách nhiệm và thái độ tham gia các hoạt động học tập',
        maxPoints: 15,
        criteria: [
          {
            id: '2.1.1',
            title: 'Có kế hoạch học tập và rèn luyện phù hợp được thầy cô ghi nhận.',
            points: 3,
            proof: 'MC',
            isCommonDefault: true,
            hint: 'Lập kế hoạch học tập trên hệ thống được GV xác nhận'
          },
          {
            id: '2.1.2',
            title: 'Tham gia hoạt động, sự kiện liên quan đến NCKH, học thuật, chuyên môn.',
            points: 3,
            proof: 'MC',
            isCommonDefault: false,
            hint: 'Hội thảo, seminar chuyên ngành, tech talk...'
          },
          {
            id: '2.1.3',
            title: 'Tham gia các buổi tư vấn xây dựng kế hoạch, động lực học tập phù hợp.',
            points: 3,
            proof: 'MC',
            isCommonDefault: false,
            hint: 'Talkshow phương pháp học đại học, tư vấn tâm lý/học tập'
          },
          {
            id: '2.1.4',
            title: 'Tham gia hoạt động hướng nghiệp, tìm kiếm thông tin việc làm.',
            points: 3,
            proof: 'MC',
            isCommonDefault: false,
            hint: 'Ngày hội việc làm, Company Tour, hội thảo tuyển dụng'
          },
          {
            id: '2.1.5',
            title: 'Tham gia khóa đào tạo kỹ năng nghề nghiệp, kỹ năng bổ trợ chuyên môn.',
            points: 6,
            proof: 'MC',
            isCommonDefault: false,
            hint: 'Tiêu chí 6đ rất giá trị trong mục 2.1!'
          },
          {
            id: '2.1.6',
            title: 'Chủ động xây dựng, hoàn thiện và cập nhật Portfolio cá nhân theo từng học kỳ.',
            points: 3,
            proof: 'MC',
            isCommonDefault: false,
            hint: 'Cập nhật CV/Portfolio trên cổng thông tin'
          }
        ]
      },
      {
        id: '2.2',
        title: 'Trách nhiệm và tinh thần tham gia các kỳ thi, cuộc thi',
        maxPoints: 12,
        criteria: [
          {
            id: '2.2.1',
            title: 'Tham gia công bố khoa học tại Hội nghị hoặc tạp chí khoa học chuyên ngành.',
            points: 6,
            proof: 'MC',
            isCommonDefault: false
          },
          {
            id: '2.2.2',
            title: 'Tham gia các cuộc thi Olympic cấp Đại học, cấp quốc gia, quốc tế.',
            points: 6,
            proof: 'MC',
            isCommonDefault: false
          },
          {
            id: '2.2.3',
            title: 'Thành viên CLB học thuật, Lab nghiên cứu, nhóm nghiên cứu, nhóm khởi nghiệp.',
            points: 6,
            proof: 'MC',
            isCommonDefault: false
          }
        ]
      },
      {
        id: '2.3',
        title: 'Tinh thần vượt khó, phấn đấu vươn lên trong học tập',
        maxPoints: 8,
        criteria: [
          {
            id: '2.3.1',
            title: 'Có nỗ lực trong học tập (GPA kỳ đánh giá cao hơn kỳ trước, giảm mức cảnh báo học tập, hoặc duy trì điểm GPA trên 3.2).',
            points: 6,
            proof: '*',
            isCommonDefault: false,
            hint: 'Hệ thống tự động xét theo điểm GPA (*)'
          },
          {
            id: '2.3.2',
            title: 'Tham gia các hoạt động tăng cường kỹ năng sử dụng ngoại ngữ được Đại học ghi nhận.',
            points: 6,
            proof: 'MC',
            isCommonDefault: false
          },
          {
            id: '2.3.3',
            title: 'Có chứng chỉ ngoại ngữ quốc tế hoặc tương đương đạt mức TOEIC 600 điểm trở lên (còn hạn).',
            points: 6,
            proof: 'MC',
            isCommonDefault: false
          },
          {
            id: '2.3.4',
            title: 'Được doanh nghiệp tuyển dụng là thực tập sinh và có thời gian thực tập hơn 30 ngày.',
            points: 6,
            proof: 'MC',
            isCommonDefault: false
          }
        ]
      }
    ]
  },
  {
    id: 'TC3',
    code: 'TC3',
    shortName: 'Chính trị, Văn체 & Tình nguyện',
    title: 'Trách nhiệm tham gia hoạt động chính trị - xã hội, văn hoá, văn nghệ, thể thao, phòng chống tội phạm, tệ nạn xã hội',
    maxPoints: 20,
    color: 'emerald',
    subSections: [
      {
        id: '3.1',
        title: 'Trách nhiệm và hiệu quả tham gia các hoạt động rèn luyện về chính trị, xã hội, văn hóa, văn nghệ, thể thao',
        maxPoints: 15,
        criteria: [
          {
            id: '3.1.1',
            title: 'Tham gia sự kiện chính trị - xã hội (các Đại hội, Hội nghị, cuộc họp của tổ chức Đảng, Đoàn - Hội từ cấp Chi bộ, Chi đoàn, Chi hội trở lên... và các chương trình mang tính chính trị - xã hội khác).',
            points: 3,
            proof: 'MC',
            isCommonDefault: false
          },
          {
            id: '3.1.2',
            title: 'Tham gia cổ vũ các hoạt động phong trào văn hóa, thể thao.',
            points: 3,
            proof: 'MC',
            isCommonDefault: false
          },
          {
            id: '3.1.3',
            title: 'Tham gia các hoạt động thể dục nâng cao sức khỏe được tổ chức bởi các đơn vị hợp pháp.',
            points: 4,
            proof: 'MC',
            isCommonDefault: false
          },
          {
            id: '3.1.4',
            title: 'Tham gia các cuộc thi văn hóa, văn nghệ do các tổ chức, đơn vị hợp pháp tổ chức (hát, múa, nhảy, nhạc cụ, hội họa...).',
            points: 6,
            proof: 'MC',
            isCommonDefault: false
          },
          {
            id: '3.1.5',
            title: 'Tham gia các giải thể thao do các tổ chức, đơn vị hợp pháp tổ chức (các môn thể thao chính thức như: chạy, bóng đá, cờ vua, bóng chuyền...).',
            points: 6,
            proof: 'MC',
            isCommonDefault: false
          },
          {
            id: '3.1.6',
            title: 'Tham gia các khóa đào tạo kỹ năng mềm do các đơn vị được Đại học công nhận tổ chức.',
            points: 6,
            proof: 'MC',
            isCommonDefault: false
          },
          {
            id: '3.1.7',
            title: 'Thành viên CLB/Tổ/Đội/Nhóm SV hợp pháp, hoạt động về văn nghệ, thể thao, tình nguyện, sở thích.',
            points: 6,
            proof: 'MC',
            isCommonDefault: false
          }
        ]
      },
      {
        id: '3.2',
        title: 'Tham gia các hoạt động công ích, tình nguyện, công tác xã hội',
        maxPoints: 12,
        criteria: [
          {
            id: '3.2.1',
            title: 'Tham gia hoạt động khảo sát thông tin do Đại học thực hiện.',
            points: 3,
            proof: 'MC',
            isCommonDefault: true,
            hint: 'Khảo sát ý kiến SV về học phần / dịch vụ trường'
          },
          {
            id: '3.2.2',
            title: 'Tham gia các hoạt động tình nguyện (hỗ trợ địa phương, bảo đảm an toàn giao thông khu vực cổng trường, hỗ trợ tổ chức các chương trình và sự kiện của Đại học/Trường/Khoa).',
            points: 3,
            proof: 'MC',
            isCommonDefault: false
          },
          {
            id: '3.2.3',
            title: 'Tham gia phong trào "cốc trà đá vì cộng đồng", "tuổi trẻ Bách khoa Nhân ái".',
            points: 3,
            proof: 'MC',
            isCommonDefault: false
          },
          {
            id: '3.2.4',
            title: 'Tham gia hiến máu nhân đạo do Đại học và các tổ chức hợp pháp phát động, tổ chức.',
            points: 6,
            proof: 'MC',
            isCommonDefault: false
          },
          {
            id: '3.2.5',
            title: 'Tham gia các hoạt động phổ biến, tìm hiểu bản sắc văn hóa dân tộc, văn hóa địa phương, văn hóa trường học,...',
            points: 3,
            proof: 'MC',
            isCommonDefault: false
          },
          {
            id: '3.2.6',
            title: 'Tham gia các đội hình hoặc chiến dịch tình nguyện trong và ngoài Đại học (Mùa hè xanh, Tình nguyện mùa đông, Tiếp sức mùa thi, Tư vấn viên đồng đẳng...).',
            points: 6,
            proof: 'MC',
            isCommonDefault: false
          }
        ]
      },
      {
        id: '3.3',
        title: 'Tham gia tuyên truyền, phòng chống tội phạm và tệ nạn xã hội',
        maxPoints: 6,
        criteria: [
          {
            id: '3.3.1',
            title: 'Tham gia bảo vệ cảnh quan, môi trường, nếp sống văn minh nơi công cộng.',
            points: 4,
            proof: 'MC',
            isCommonDefault: false
          },
          {
            id: '3.3.2',
            title: 'Tham gia các hoạt động đảm bảo an ninh, trật tự và an toàn trường học.',
            points: 4,
            proof: 'MC',
            isCommonDefault: false
          },
          {
            id: '3.3.3',
            title: 'Tham gia các diễn đàn sinh viên, các buổi tọa đàm xây dựng quy định, quy chế và pháp luật.',
            points: 4,
            proof: 'MC',
            isCommonDefault: false
          }
        ]
      }
    ]
  },
  {
    id: 'TC4',
    code: 'TC4',
    shortName: 'Ý thức công dân & Cộng đồng',
    title: 'Điểm ý thức công dân trong quan hệ cộng đồng',
    maxPoints: 15,
    color: 'amber',
    subSections: [
      {
        id: '4.1',
        title: 'Tham gia tuyên truyền các chủ trương của Đảng, chính sách, pháp luật của Nhà nước trong cộng đồng',
        maxPoints: 12,
        criteria: [
          {
            id: '4.1.1',
            title: 'Có hành động tích cực trên không gian mạng, phù hợp với chủ trương của Đại học và đường lối, chính sách của Nhà nước.',
            points: 3,
            proof: 'MC',
            isCommonDefault: false
          },
          {
            id: '4.1.2',
            title: 'Tham gia tuyên truyền đường lối của Đảng, pháp luật của Nhà nước, quy định của nơi cư trú hoặc quy chế của Đại học được các cấp có thẩm quyền xác nhận.',
            points: 3,
            proof: 'MC',
            isCommonDefault: false
          },
          {
            id: '4.1.3',
            title: 'Tham gia các hoạt động phổ biến chủ trương của Đảng, chính sách, pháp luật của Nhà nước.',
            points: 4,
            proof: 'MC',
            isCommonDefault: false
          },
          {
            id: '4.1.4',
            title: 'Tham gia các cuộc thi tìm hiểu lịch sử, văn hóa, truyền thống dân tộc.',
            points: 4,
            proof: 'MC',
            isCommonDefault: false
          },
          {
            id: '4.1.5',
            title: 'Góp phần xây dựng tốt hình ảnh sinh viên Bách khoa với các cơ quan, tổ chức hay doanh nghiệp được Đại học ghi nhận.',
            points: 4,
            proof: 'MC',
            isCommonDefault: false
          }
        ]
      },
      {
        id: '4.2',
        title: 'Trách nhiệm tham gia các hoạt động xã hội được ghi nhận, biểu dương khen thưởng',
        maxPoints: 12,
        criteria: [
          {
            id: '4.2.1',
            title: 'Được giấy khen, bằng khen của tổ chức Đoàn, Hội, Đại học hoặc chính quyền địa phương.',
            points: 6,
            proof: 'MC',
            isCommonDefault: false
          },
          {
            id: '4.2.2',
            title: 'Đạt loại Khá trở lên khi tham gia học "Lớp bồi dưỡng nhận thức về Đảng".',
            points: 6,
            proof: 'MC',
            isCommonDefault: false
          },
          {
            id: '4.2.3',
            title: 'Được kết nạp Đảng hoặc được chuyển Đảng chính thức.',
            points: 6,
            proof: 'MC',
            isCommonDefault: false
          },
          {
            id: '4.2.4',
            title: 'Được cơ quan, công ty hoặc tổ chức hợp pháp nơi thực tập đánh giá hoàn thành tốt nhiệm vụ trở lên.',
            points: 6,
            proof: 'MC',
            isCommonDefault: false
          }
        ]
      }
    ]
  },
  {
    id: 'TC5',
    code: 'TC5',
    shortName: 'Cán bộ, Hỗ trợ & Thành tích',
    title: 'Trách nhiệm và kết quả tham gia công tác cán bộ lớp, công tác đoàn thể, các tổ chức khác của Đại học hoặc có thành tích xuất sắc trong học tập và rèn luyện',
    maxPoints: 20,
    color: 'purple',
    subSections: [
      {
        id: '5.1',
        title: 'Tham gia công tác cán bộ tại Lớp, tổ chức Đoàn - Hội, Tổ/Đội/CLB hợp pháp',
        maxPoints: 6,
        criteria: [
          {
            id: '5.1.1',
            title: 'Cán bộ Lớp, Chi bộ, Đoàn - Hội, Tổ/Đội/CLB, trưởng nhóm SV NCKH hoàn thành xuất sắc nhiệm vụ trong kỳ.',
            points: 6,
            proof: 'MC',
            isCommonDefault: false
          },
          {
            id: '5.1.2',
            title: 'Cán bộ Lớp, Chi bộ, Đoàn - Hội, Tổ/Đội/CLB, trưởng nhóm SV NCKH hoàn thành tốt nhiệm vụ trong kỳ.',
            points: 4,
            proof: 'MC',
            isCommonDefault: false
          },
          {
            id: '5.1.3',
            title: 'Cán bộ Lớp, Chi bộ, Đoàn - Hội, Tổ/Đội/CLB, trưởng nhóm SV NCKH hoàn thành nhiệm vụ trong kỳ.',
            points: 3,
            proof: 'MC',
            isCommonDefault: false
          }
        ]
      },
      {
        id: '5.2',
        title: 'Hỗ trợ và tham gia tích cực vào các hoạt động chung của Đại học/Trường/Khoa/Lớp',
        maxPoints: 10,
        criteria: [
          {
            id: '5.2.1',
            title: 'Thành viên tích cực thuộc các Tổ/Đội/CLB, nhóm SV NCKH tham gia hỗ trợ triển khai hoạt động của Lớp, Khoa, Trường hoặc Đại học.',
            points: 6,
            proof: 'MC',
            isCommonDefault: false
          },
          {
            id: '5.2.2',
            title: 'Tham gia hỗ trợ triển khai hoạt động của Lớp, Khoa, Trường hoặc Đại học và hoàn thành tốt nhiệm vụ được giao.',
            points: 4,
            proof: 'MC',
            isCommonDefault: false
          },
          {
            id: '5.2.3',
            title: 'Tham gia hỗ trợ triển khai hoạt động của Lớp, Khoa, Trường hoặc Đại học và hoàn thành nhiệm vụ được giao.',
            points: 3,
            proof: 'MC',
            isCommonDefault: false
          }
        ]
      },
      {
        id: '5.3',
        title: 'Có các thành tích trong NCKH, cuộc thi KHKT, khởi nghiệp và các hoạt động khác dành cho sinh viên được cấp có thẩm quyền khen thưởng',
        maxPoints: 15,
        criteria: [
          {
            id: '5.3.1',
            title: 'Đạt giải trong các cuộc thi chính thức cấp Quốc gia, cấp Quốc tế.',
            points: 15,
            proof: 'MC',
            isCommonDefault: false
          },
          {
            id: '5.3.2',
            title: 'Đạt giải trong các cuộc thi chính thức cấp Thành phố.',
            points: 12,
            proof: 'MC',
            isCommonDefault: false
          },
          {
            id: '5.3.3',
            title: 'Đạt giải trong các cuộc thi chính thức cấp Đại học.',
            points: 10,
            proof: 'MC',
            isCommonDefault: false
          },
          {
            id: '5.3.4',
            title: 'Được khen thưởng bằng khen, huy chương tương đương cấp Bộ trở lên.',
            points: 10,
            proof: 'MC',
            isCommonDefault: false
          },
          {
            id: '5.3.5',
            title: 'Đạt thành tích trong NCKH sinh viên, cuộc thi khoa học kỹ thuật, sáng kiến cải tiến kỹ thuật khởi nghiệp do đơn vị Đại học/Trường/Khoa tổ chức.',
            points: 8,
            proof: 'MC',
            isCommonDefault: false
          },
          {
            id: '5.3.6',
            title: 'Đạt danh hiệu "Sinh viên 5 tốt" từ cấp Đại học trở lên.',
            points: 8,
            proof: 'MC',
            isCommonDefault: false
          },
          {
            id: '5.3.7',
            title: 'Kỳ trước đó có kết quả học tập và rèn luyện đạt mức xuất sắc (GPA >= 3.6, RL >= 90).',
            points: 6,
            proof: '*',
            isCommonDefault: false,
            hint: 'Xét tự động từ kết quả kỳ trước (*)'
          },
          {
            id: '5.3.8',
            title: 'Kỳ trước đó đạt mức học tập loại Giỏi và rèn luyện loại Tốt (GPA >= 3.2, RL >= 80).',
            points: 4,
            proof: '*',
            isCommonDefault: false,
            hint: 'Xét tự động từ kết quả kỳ trước (*)'
          }
        ]
      }
    ]
  }
];

type Section = (typeof HUST_DRL_DATA)[number];
type SubSection = Section['subSections'][number];
type Criterion = SubSection['criteria'][number];
type EnrichedCriterion = Criterion & {
  subSectionId: string;
  subSectionTitle: string;
  subSectionMax: number;
  sectionId: string;
  sectionCode: string;
  sectionMax: number;
};
type ActivityStatus = 'done' | 'planned';
type Activity = {
  id: string;
  name: string;
  criteria: string[];
  status: ActivityStatus;
  forcedCriterion: string | null;
};
type ScoreBreakdown = {
  raw: number;
  capped: number;
  max: number;
  isCapped: boolean;
  overflow: number;
  remaining: number;
};
type CriterionSource =
  | { type: 'manual'; label: string }
  | {
      type: 'activity';
      activityId: string;
      activityName: string;
      activityStatus: ActivityStatus;
      effectiveGain: number;
    };
type ActivityAnalysis = {
  assignedCriterion: string | null;
  effectiveGain: number;
  isRedundant: boolean;
  reasonType?: 'empty' | 'surplus';
  reason: string;
};
type RecommendedCriterion = Criterion & {
  subSectionId: string;
  subSectionTitle: string;
  subRemaining: number;
  subIsCapped: boolean;
  effectiveGain: number;
  wastedPoints: number;
};

// Xây dựng bảng tra cứu nhanh (Maps) cho các tiêu chí
const CRITERIA_MAP: Record<string, EnrichedCriterion> = {};
const SUBSECTION_MAP: Record<string, SubSection & { sectionId: string; sectionMax: number }> = {};
const SECTION_MAP: Record<string, Section> = {};
const ALL_CRITERIA_LIST: EnrichedCriterion[] = [];

HUST_DRL_DATA.forEach((sec) => {
  SECTION_MAP[sec.id] = sec;
  sec.subSections.forEach((sub) => {
    SUBSECTION_MAP[sub.id] = { ...sub, sectionId: sec.id, sectionMax: sec.maxPoints };
    sub.criteria.forEach((crit) => {
      const enriched = {
        ...crit,
        subSectionId: sub.id,
        subSectionTitle: sub.title,
        subSectionMax: sub.maxPoints,
        sectionId: sec.id,
        sectionCode: sec.code,
        sectionMax: sec.maxPoints
      };
      CRITERIA_MAP[crit.id] = enriched;
      ALL_CRITERIA_LIST.push(enriched);
    });
  });
});

// ============================================================================
// 2. DỮ LIỆU MẪU ĐỂ SINH VIÊN THỬ NGHIỆM NGAY
// ============================================================================
const SAMPLE_MANUAL_CRITERIA = [
  '1.1.1',
  '1.1.2',
  '1.1.3',
  '1.2.1',
  '1.2.2',
  '2.1.1',
  '2.3.1',
  '3.2.1'
];

const SAMPLE_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    name: 'Hội thảo Trí tuệ nhân tạo & Chuyển đổi số SoICT',
    criteria: ['2.1.2', '2.1.4', '3.1.1'],
    status: 'done', // 'done' | 'planned'
    forcedCriterion: null
  },
  {
    id: 'act-2',
    name: 'Ngày hội Việc làm Bách Khoa - HUST Career Fair',
    criteria: ['2.1.4', '2.1.5', '4.1.5'],
    status: 'done',
    forcedCriterion: null
  },
  {
    id: 'act-3',
    name: 'Seminar Kỹ năng viết CV & Phỏng vấn Doanh nghiệp',
    criteria: ['2.1.4', '3.1.6'],
    status: 'done',
    forcedCriterion: null
  },
  {
    id: 'act-4',
    name: 'Ngày Chủ nhật Đỏ - Hiến máu nhân đạo Bách Khoa',
    criteria: ['3.2.4', '3.2.3'],
    status: 'done',
    forcedCriterion: null
  },
  {
    id: 'act-5',
    name: 'Giải chạy Bách Khoa Run vì Cộng đồng',
    criteria: ['3.1.3', '3.1.5', '3.2.3'],
    status: 'done',
    forcedCriterion: null
  },
  {
    id: 'act-6',
    name: 'Cuộc thi trực tuyến Tìm hiểu Pháp luật & Lịch sử Đảng',
    criteria: ['4.1.3', '4.1.4', '3.1.1'],
    status: 'done',
    forcedCriterion: null
  },
  {
    id: 'act-7',
    name: 'Tọa đàm An ninh mạng & Văn minh không gian mạng',
    criteria: ['3.3.3', '4.1.1', '2.1.2'],
    status: 'done',
    forcedCriterion: null
  },
  {
    id: 'act-8',
    name: 'Cổ vũ Chung kết Bóng đá Sinh viên HUST',
    criteria: ['3.1.2'],
    status: 'done',
    forcedCriterion: null
  },
  {
    id: 'act-9',
    name: 'Tình nguyện hỗ trợ Ban tổ chức Lễ Tốt nghiệp',
    criteria: ['3.2.2', '5.2.2', '4.1.5'],
    status: 'planned',
    forcedCriterion: null
  }
];

// ============================================================================
// 3. THUẬT TOÁN TÍNH ĐIỂM CÓ TRẦN ĐỀ MỤC & TRẦN PHẦN (TC1..TC5)
// ============================================================================
function evaluateCriteriaSet(achievedSet: ReadonlySet<string>) {
  let totalScore = 0;
  let totalSubCapped = 0;
  let totalRaw = 0;
  const sectionBreakdown: Record<string, ScoreBreakdown & { subCappedSum: number }> = {};
  const subSectionBreakdown: Record<string, ScoreBreakdown> = {};

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
// 4. THUẬT TOÁN TỐI ƯU HÓA TOÀN CỤC (EXACT BRANCH & BOUND SOLVER)
// Phân bổ mỗi Hoạt động vào tối đa 1 Tiêu chí sao cho:
// 1. Tổng điểm rèn luyện (sau khi áp trần Đề mục & trần Phần) là LỚN NHẤT.
// 2. Tổng điểm đề mục (Sub-section capped sum) lớn nhất.
// 3. Sử dụng ít hoạt động dư thừa nhất (chỉ gán hoạt động khi thực sự mở khóa tiêu chí có ích).
// ============================================================================
function solveOptimalAssignment(manualCriteriaList: string[], activitiesList: Activity[], includePlanned = true) {
  const baseSet = new Set(manualCriteriaList);
  const activeActivities = activitiesList.filter(
    (a) => a.status === 'done' || (includePlanned && a.status === 'planned')
  );

  const n = activeActivities.length;

  // Chuẩn bị danh sách lựa chọn cho từng hoạt động
  // Nếu người dùng khóa (force) hoạt động vào 1 tiêu chí, chỉ xét tiêu chí đó hoặc null
  const choicesPerActivity = activeActivities.map((act) => {
    const validCrit = act.criteria.filter((c) => CRITERIA_MAP[c]);
    if (act.forcedCriterion && CRITERIA_MAP[act.forcedCriterion]) {
      return [act.forcedCriterion];
    }
    // Sắp xếp tiêu chí theo điểm giảm dần để nhánh tốt được duyệt trước
    return [...validCrit].sort((a, b) => CRITERIA_MAP[b].points - CRITERIA_MAP[a].points);
  });

  // Tính cận trên (Upper bound) điểm có thể thêm từ các hoạt động từ vị trí idx trở đi
  const suffixMaxRawPoints = new Array(n + 1).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    const bestPt =
      choicesPerActivity[i].length > 0
        ? Math.max(...choicesPerActivity[i].map((cid) => CRITERIA_MAP[cid].points))
        : 0;
    suffixMaxRawPoints[i] = suffixMaxRawPoints[i + 1] + bestPt;
  }

  let bestTotalScore = -1;
  let bestSubCappedScore = -1;
  let bestUsedCount = Infinity;
  let bestAssignment = new Array<string | null>(n).fill(null);

  const currentSet = new Set(baseSet);
  const currentAssignment = new Array<string | null>(n).fill(null);
  const visitedStates = new Map<string, number>();

  function dfs(idx: number, usedCount: number) {
    if (idx === n) {
      const evalRes = evaluateCriteriaSet(currentSet);
      const isBetter =
        evalRes.totalScore > bestTotalScore ||
        (evalRes.totalScore === bestTotalScore &&
          evalRes.totalSubCapped > bestSubCappedScore) ||
        (evalRes.totalScore === bestTotalScore &&
          evalRes.totalSubCapped === bestSubCappedScore &&
          usedCount < bestUsedCount);

      if (isBetter) {
        bestTotalScore = evalRes.totalScore;
        bestSubCappedScore = evalRes.totalSubCapped;
        bestUsedCount = usedCount;
        bestAssignment = [...currentAssignment];
      }
      return;
    }

    // Nhánh cận (Pruning): Điểm hiện tại + tổng điểm tối đa các hoạt động còn lại
    const currentEval = evaluateCriteriaSet(currentSet);
    const optimisticTotal = Math.min(100, currentEval.totalScore + suffixMaxRawPoints[idx]);
    if (optimisticTotal < bestTotalScore) {
      return;
    }

    // Memoization theo tập tiêu chí hiện tại + chỉ số idx
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

    // Luôn xét nhánh không dùng hoạt động này (để phát hiện hoạt động dư thừa hoặc khi mọi tiêu chí đã có)
    dfs(idx + 1, usedCount);
  }

  dfs(0, 0);

  // Sau khi tìm được cách gán tối ưu đạt bestTotalScore:
  // Kiểm tra từng hoạt động được gán xem tiêu chí của nó thực sự đóng góp bao nhiêu điểm vào TotalScore
  const finalCriteriaSet = new Set(baseSet);
  const criterionSourceMap: Record<string, CriterionSource> = {}; // critId -> { type: 'manual' | 'activity', activityId, activityName, status }

  baseSet.forEach((cid) => {
    criterionSourceMap[cid] = {
      type: 'manual',
      label: 'Tick đạt trực tiếp / Mặc định'
    };
  });

  // Trước tiên lọc bỏ những phép gán không làm tăng điểm tổng (TotalScore) để không báo "Đang gánh điểm" giả tạo khi phần/đề mục đã kịch trần
  const cleanedAssignment = [...bestAssignment];
  const fullSet = new Set(baseSet);
  cleanedAssignment.forEach((cid) => {
    if (cid) fullSet.add(cid);
  });

  for (let i = 0; i < n; i++) {
    const cid = cleanedAssignment[i];
    if (!cid) continue;
    // Thử bỏ tiêu chí này xem TotalScore có giảm không
    const setWithout = new Set(fullSet);
    setWithout.delete(cid);
    const evalWith = evaluateCriteriaSet(fullSet);
    const evalWithout = evaluateCriteriaSet(setWithout);
    const deltaTotal = evalWith.totalScore - evalWithout.totalScore;
    if (deltaTotal === 0) {
      // Tiêu chí này nằm trong đề mục/phần đã kịch trần điểm, không làm tăng tổng điểm!
      cleanedAssignment[i] = null;
      fullSet.delete(cid);
    }
  }

  // Ghi nhận nguồn mở khóa cho các tiêu chí thực sự đóng góp vào tổng điểm
  const activityAnalysis: Record<string, ActivityAnalysis> = {};
  activeActivities.forEach((act, idx) => {
    const assignedCid = cleanedAssignment[idx];
    if (assignedCid) {
      finalCriteriaSet.add(assignedCid);
      const setWithout = new Set(fullSet);
      setWithout.delete(assignedCid);
      const deltaTotal =
        evaluateCriteriaSet(fullSet).totalScore - evaluateCriteriaSet(setWithout).totalScore;

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

  // Phân tích chi tiết lý do vì sao các hoạt động còn lại bị dư thừa (Redundant)
  activeActivities.forEach((act) => {
    if (activityAnalysis[act.id]) return;

    const validCrit = act.criteria.filter((c) => CRITERIA_MAP[c]);
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

    // Kiểm tra lý do từng tiêu chí của hoạt động không tăng thêm điểm
    const reasons = validCrit.map((cid) => {
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

// ============================================================================
// 5. COMPONENT CHÍNH: APP
// ============================================================================
export default function App() {
  // State lưu trữ trong LocalStorage
  const [manualCriteria, setManualCriteria] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hust_drl_manual_v1');
      return saved ? JSON.parse(saved) : SAMPLE_MANUAL_CRITERIA;
    } catch {
      return SAMPLE_MANUAL_CRITERIA;
    }
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    try {
      const saved = localStorage.getItem('hust_drl_activities_v1');
      return saved ? JSON.parse(saved) : SAMPLE_ACTIVITIES;
    } catch {
      return SAMPLE_ACTIVITIES;
    }
  });

  const [includePlanned, setIncludePlanned] = useState(true);
  const [activeTab, setActiveTab] = useState('activities'); // 'activities' | 'checklist' | 'advisor'

  // State cho Form thêm hoạt động mới
  const [newActName, setNewActName] = useState('');
  const [newActCriteria, setNewActCriteria] = useState<string[]>([]);
  const [newActStatus, setNewActStatus] = useState<ActivityStatus>('done');
  const [criteriaSearch, setCriteriaSearch] = useState('');
  const [selectedSectionFilter, setSelectedSectionFilter] = useState('ALL');

  // State cho bộ lọc trong tab Checklist
  const [checklistSearch, setChecklistSearch] = useState('');
  const [checklistFilter, setChecklistFilter] = useState('all'); // 'all' | 'achieved' | 'unachieved' | 'effective_open'
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      localStorage.setItem('hust_drl_manual_v1', JSON.stringify(manualCriteria));
    } catch (e) {
      console.error(e);
    }
  }, [manualCriteria]);

  useEffect(() => {
    try {
      localStorage.setItem('hust_drl_activities_v1', JSON.stringify(activities));
    } catch (e) {
      console.error(e);
    }
  }, [activities]);

  // Chạy bộ giải tối ưu hóa mỗi khi dữ liệu thay đổi
  const optimalResult = useMemo(() => {
    return solveOptimalAssignment(manualCriteria, activities, includePlanned);
  }, [manualCriteria, activities, includePlanned]);

  // Tính điểm nếu KHÔNG tính các hoạt động "Dự kiến" để so sánh
  const doneOnlyResult = useMemo(() => {
    return solveOptimalAssignment(manualCriteria, activities, false);
  }, [manualCriteria, activities]);

  const { evaluation, achievedSet, criterionSourceMap, activityAnalysis } = optimalResult;

  // Xếp loại rèn luyện theo thang điểm 100
  const getClassification = (score: number) => {
    if (score >= 90)
      return { label: 'Xuất sắc', color: 'bg-emerald-500 text-white', text: 'text-emerald-600' };
    if (score >= 80)
      return { label: 'Tốt', color: 'bg-blue-600 text-white', text: 'text-blue-600' };
    if (score >= 65)
      return { label: 'Khá', color: 'bg-amber-500 text-white', text: 'text-amber-600' };
    if (score >= 50)
      return { label: 'Trung bình', color: 'bg-orange-500 text-white', text: 'text-orange-600' };
    return { label: 'Yếu / Kém', color: 'bg-red-600 text-white', text: 'text-red-600' };
  };

  const classification = getClassification(evaluation.totalScore);

  // Các hàm thao tác dữ liệu
  const toggleManualCriterion = (critId: string) => {
    setManualCriteria((prev) =>
      prev.includes(critId) ? prev.filter((id) => id !== critId) : [...prev, critId]
    );
  };

  const handleAddActivity = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newActName.trim() || newActCriteria.length === 0) return;

    const newAct: Activity = {
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

  const loadBasicDefaults = () => {
    const basicIds = ALL_CRITERIA_LIST.filter((c) => c.isCommonDefault).map((c) => c.id);
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

  // Tính toán danh sách gợi ý săn điểm tối ưu cho Tab Advisor & Quick Badges
  const advisorRecommendations = useMemo(() => {
    return HUST_DRL_DATA.map((sec) => {
      const secBreak = evaluation.sectionBreakdown[sec.id];
      const missingInSec = secBreak.remaining;

      // Tìm các tiêu chí chưa đạt trong phần này và số điểm thực tế tăng thêm nếu đạt được nó
      const candidateCriteria: RecommendedCriterion[] = [];
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

      // Sắp xếp theo số điểm thực tế cộng vào tổng (effectiveGain) giảm dần
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

  // Thống kê số hoạt động hiệu quả vs dư thừa
  const activeActsCount = activities.filter(
    (a) => a.status === 'done' || (includePlanned && a.status === 'planned')
  ).length;
  const redundantActsCount = Object.values(activityAnalysis).filter((a) => a.isRedundant).length;
  const effectiveActsCount = activeActsCount - redundantActsCount;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* =====================================================================
          HEADER & TOP STICKY DASHBOARD
      ===================================================================== */}
      <header className="bg-gradient-to-r from-red-900 via-red-800 to-rose-900 text-white shadow-lg border-b border-red-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/25 shrink-0 shadow-inner">
                <Award className="w-7 h-7 text-amber-300" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/30">
                    ĐHBK Hà Nội • QĐ 10911/QĐ-ĐHBK
                  </span>
                  <span className="text-xs text-red-100/80">
                    Tối ưu hóa phân bổ hoạt động & kiểm soát trần điểm
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1">
                  Trình Tối Ưu Điểm Rèn Luyện Bách Khoa (HUST ĐRL Optimizer)
                </h1>
              </div>
            </div>

            {/* Quick Action Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={loadBasicDefaults}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/15 hover:bg-white/25 text-white border border-white/20 transition cursor-pointer"
                title="Đánh dấu nhanh các tiêu chí cơ bản hầu hết SV đều có (Họp lớp, SHCD, Khảo sát, Khai báo...)"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                Tick tiêu chí cơ bản (Mặc định)
              </button>
              <button
                onClick={loadSampleDemo}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-red-100 border border-white/15 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                Nạp dữ liệu mẫu
              </button>
              <button
                onClick={clearAllData}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-red-950/50 hover:bg-red-950/80 text-red-200 border border-red-400/20 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Làm mới (0đ)
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* SCORE SUMMARY BAR */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
            {/* Tổng điểm tối ưu */}
            <div className="lg:col-span-4 flex items-center justify-between sm:justify-start gap-4 bg-slate-900 text-white rounded-2xl p-3.5 shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Tổng điểm tối ưu
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${classification.color}`}
                  >
                    {classification.label}
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-black text-amber-400 tabular-nums">
                    {evaluation.totalScore}
                  </span>
                  <span className="text-sm text-slate-400 font-medium">/ 100 điểm</span>
                </div>
                {includePlanned && evaluation.totalScore !== doneOnlyResult.evaluation.totalScore && (
                  <div className="text-[11px] text-emerald-300 mt-0.5">
                    Đã chốt: <b>{doneOnlyResult.evaluation.totalScore}đ</b> (+
                    {evaluation.totalScore - doneOnlyResult.evaluation.totalScore}đ từ HĐ dự kiến)
                  </div>
                )}
              </div>

              <div className="text-right border-l border-slate-700/80 pl-3.5 text-xs space-y-1">
                <div className="flex items-center justify-end gap-1.5 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{effectiveActsCount} HĐ gánh điểm</span>
                </div>
                <div
                  className={`flex items-center justify-end gap-1.5 font-medium ${
                    redundantActsCount > 0 ? 'text-amber-400' : 'text-slate-400'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{redundantActsCount} HĐ dư thừa</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Còn thiếu <b>{100 - evaluation.totalScore}đ</b> để đạt 100
                </div>
              </div>
            </div>

            {/* 5 Thẻ tiến độ TC1 -> TC5 */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-5 gap-2">
              {HUST_DRL_DATA.map((sec) => {
                const secState = evaluation.sectionBreakdown[sec.id];
                const pct = Math.min(100, Math.round((secState.capped / sec.maxPoints) * 100));
                return (
                  <div
                    key={sec.id}
                    onClick={() => {
                      setActiveTab('checklist');
                      setCollapsedSections((prev) => ({ ...prev, [sec.id]: false }));
                    }}
                    className={`rounded-xl p-2.5 border transition cursor-pointer ${
                      secState.isCapped
                        ? 'bg-emerald-50/70 border-emerald-300 hover:bg-emerald-50'
                        : 'bg-slate-50 border-slate-200 hover:border-red-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-800">{sec.code}</span>
                      <span
                        className={`text-xs font-bold tabular-nums ${
                          secState.isCapped ? 'text-emerald-700' : 'text-slate-700'
                        }`}
                      >
                        {secState.capped}/{sec.maxPoints}đ
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5" title={sec.title}>
                      {sec.shortName}
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1.5">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          secState.isCapped ? 'bg-emerald-500' : 'bg-red-700'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[10px]">
                      {secState.isCapped ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                          ✓ Kịch trần
                        </span>
                      ) : (
                        <span className="text-amber-700 font-medium">
                          Thiếu {secState.remaining}đ
                        </span>
                      )}
                      {secState.overflow > 0 && (
                        <span
                          className="text-slate-400"
                          title="Điểm đề mục vượt trần phần (không được cộng thêm)"
                        >
                          Dư {secState.overflow}đ
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          MAIN NAVIGATION TABS
      ===================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('activities')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
                activeTab === 'activities'
                  ? 'bg-red-800 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>1. Quản lý Hoạt động & Phân bổ</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === 'activities'
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {activities.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('checklist')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
                activeTab === 'checklist'
                  ? 'bg-red-800 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <ListChecks className="w-4 h-4" />
              <span>2. Checklist Khung Tiêu Chí (TC1 - TC5)</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === 'checklist'
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {achievedSet.size}/{ALL_CRITERIA_LIST.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('advisor')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
                activeTab === 'advisor'
                  ? 'bg-red-800 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>3. Gợi ý Săn Điểm & Chống Thừa</span>
              {100 - evaluation.totalScore > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500 text-white">
                  +{100 - evaluation.totalScore}đ
                </span>
              )}
            </button>
          </div>

          {/* Toggle tính cả hoạt động dự kiến */}
          <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white px-3.5 py-2 rounded-xl border border-slate-200 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includePlanned}
              onChange={(e) => setIncludePlanned(e.target.checked)}
              className="rounded text-red-700 focus:ring-red-600 w-4 h-4"
            />
            <span>Tính cả hoạt động "Dự kiến đăng ký"</span>
          </label>
        </div>

        {/* ===================================================================
            TAB 1: QUẢN LÝ HOẠT ĐỘNG & TỰ ĐỘNG PHÂN BỔ TIÊU CHÍ TỐI ƯU
        =================================================================== */}
        {activeTab === 'activities' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
            {/* CỘT TRÁI: FORM THÊM HOẠT ĐỘNG MỚI */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-red-700" />
                    Thêm Hoạt Động & Bộ Tiêu Chí
                  </h2>
                  <span className="text-xs text-slate-500">Chọn 1 hoặc nhiều tiêu chí</span>
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
                      Dự kiến (Ướm thử xem có thừa)
                    </button>
                  </div>

                  {/* Bộ tiêu chí đã chọn cho HĐ đang nhập */}
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
                              title={crit?.title}
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
                        Nhấp vào các mã tiêu chí bên dưới (VD: 2.1.2, 3.1.1, 3.2.4...) mà hoạt động này cấp.
                      </div>
                    )}

                    {/* Thanh tìm kiếm & lọc nhanh mã tiêu chí */}
                    <div className="flex gap-1.5 mb-2">
                      <div className="relative flex-1">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={criteriaSearch}
                          onChange={(e) => setCriteriaSearch(e.target.value)}
                          placeholder="Tìm mã (VD: 2.1.2, 3.2) hoặc từ khóa (hiến máu, CLB...)"
                          className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-red-700 outline-none"
                        />
                      </div>
                    </div>

                    {/* Filter theo TC1..TC5 */}
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

                    {/* Danh sách tiêu chí để chọn */}
                    <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-slate-50/50">
                      {ALL_CRITERIA_LIST.filter((c) => {
                        if (
                          selectedSectionFilter !== 'ALL' &&
                          c.sectionCode !== selectedSectionFilter
                        )
                          return false;
                        if (!criteriaSearch.trim()) return true;
                        const q = criteriaSearch.toLowerCase();
                        return (
                          c.id.toLowerCase().includes(q) ||
                          c.title.toLowerCase().includes(q)
                        );
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
                              isSelected
                                ? 'bg-red-50/90 hover:bg-red-100/70'
                                : 'hover:bg-white'
                            }`}
                          >
                            <div className="mt-0.5">
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-red-700" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center flex-wrap gap-1.5">
                                <span className="font-extrabold text-slate-900">{crit.id}</span>
                                <span className="px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700 font-bold text-[10px]">
                                  +{crit.points}đ
                                </span>
                                {isAlreadyAchieved ? (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                                    Đã có
                                  </span>
                                ) : isCappedOut ? (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                                    Kịch trần mục/phần
                                  </span>
                                ) : (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                                    Đang cần săn
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-600 line-clamp-2 mt-0.5 leading-snug">
                                {crit.title}
                              </p>
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

              {/* Hộp giải thích nhanh cơ chế tối ưu */}
              <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-1.5">
                <div className="font-extrabold flex items-center gap-1.5 text-amber-950">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Cơ chế phân bổ thông minh hoạt động như thế nào?
                </div>
                <p className="leading-relaxed">
                  • Mỗi hoạt động chỉ được tính điểm cho <b>tối đa 1 tiêu chí</b> trong bộ tiêu chí của nó.
                </p>
                <p className="leading-relaxed">
                  • Thuật toán tự động giải bài toán ghép cặp toàn cục để tìm phương án gán hoạt động vào tiêu chí sao cho <b>Tổng điểm cuối cùng (sau khi áp trần Đề mục & trần Phần TC1..TC5)</b> là cao nhất.
                </p>
                <p className="leading-relaxed">
                  • Nếu 1 hoạt động không giúp tăng thêm bất kỳ điểm nào (do trùng tiêu chí hoặc đề mục đã kịch trần), hệ thống sẽ cảnh báo <b>"Hoạt động dư thừa"</b> để bạn tránh đăng ký thừa!
                </p>
              </div>
            </div>

            {/* CỘT PHẢI: DANH SÁCH HOẠT ĐỘNG & KẾT QUẢ PHÂN BỔ */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-red-700" />
                      Danh Sách Hoạt Động & Kết Quả Gán Tối Ưu ({activities.length})
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Tự động xoay vòng tiêu chí khi bạn thêm hoạt động mới hoặc tick tiêu chí trực tiếp.
                    </p>
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
                    <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-700">
                      Chưa có hoạt động ngoại khóa nào trong danh sách
                    </p>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                      Hãy thêm hoạt động ở khung bên trái hoặc nhấn nút <b>"Nạp dữ liệu mẫu"</b> trên thanh công cụ để xem thuật toán phân bổ tiêu chí.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 mt-4">
                    {activities.map((act) => {
                      const analysis = activityAnalysis[act.id];
                      const isIgnoredPlanned = act.status === 'planned' && !includePlanned;
                      const assignedCrit = analysis?.assignedCriterion
                        ? CRITERIA_MAP[analysis.assignedCriterion]
                        : null;

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
                                    act.status === 'done'
                                      ? 'bg-slate-800 text-white'
                                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                                  }`}
                                  title="Nhấn để đổi giữa Đã tham gia và Dự kiến đăng ký"
                                >
                                  {act.status === 'done' ? '✓ Đã tham gia' : '⏳ Dự kiến đăng ký'}
                                </span>

                                <h3 className="text-sm font-extrabold text-slate-900">
                                  {act.name}
                                </h3>
                              </div>

                              {/* Hiển thị kết quả phân bổ của thuật toán */}
                              {!isIgnoredPlanned && (
                                <div className="pt-1">
                                  {assignedCrit ? (
                                    <div className="inline-flex items-center flex-wrap gap-1.5 text-xs bg-emerald-100/90 text-emerald-900 px-3 py-1 rounded-xl font-bold border border-emerald-300">
                                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                                      <span>
                                        Đang gánh tiêu chí <b>{assignedCrit.id}</b> (+
                                        {assignedCrit.points}đ gốc → Tăng{' '}
                                        <b>+{analysis.effectiveGain}đ</b> vào tổng ĐRL)
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="inline-flex items-start gap-1.5 text-xs bg-amber-100/90 text-amber-950 px-3 py-1.5 rounded-xl font-semibold border border-amber-300">
                                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                                      <div>
                                        <span className="font-extrabold">
                                          Dư thừa / Không làm tăng tổng điểm:{' '}
                                        </span>
                                        <span className="font-normal">{analysis?.reason}</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Nút xóa hoạt động */}
                            <div className="flex items-center gap-1 self-end sm:self-start">
                              <button
                                onClick={() => removeActivity(act.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                                title="Xóa hoạt động này"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Danh sách các tiêu chí trong bộ tiêu chí của hoạt động */}
                          <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[11px] font-semibold text-slate-500 mr-1">
                                Bộ tiêu chí của HĐ:
                              </span>
                              {act.criteria.map((cid) => {
                                const c = CRITERIA_MAP[cid];
                                if (!c) return null;
                                const isAssignedHere = analysis?.assignedCriterion === cid;
                                const isLockedHere = act.forcedCriterion === cid;

                                return (
                                  <button
                                    key={cid}
                                    type="button"
                                    onClick={() =>
                                      setForcedCriterion(act.id, isLockedHere ? null : cid)
                                    }
                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                                      isAssignedHere
                                        ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                                    }`}
                                    title={`${c.id}: ${c.title} (+${c.points}đ). Nhấn để khóa/mở khóa cố định vào tiêu chí này.`}
                                  >
                                    {isLockedHere && <Lock className="w-3 h-3 text-amber-300" />}
                                    <span>{cid}</span>
                                    <span
                                      className={
                                        isAssignedHere ? 'text-emerald-200' : 'text-slate-500'
                                      }
                                    >
                                      ({c.points}đ)
                                    </span>
                                  </button>
                                );
                              })}
                            </div>

                            {act.forcedCriterion && (
                              <button
                                type="button"
                                onClick={() => setForcedCriterion(act.id, null)}
                                className="text-[11px] text-amber-800 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                              >
                                <Unlock className="w-3 h-3" />
                                Bỏ khóa cố định ({act.forcedCriterion})
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
        )}

        {/* ===================================================================
            TAB 2: BẢNG CHECKLIST TOÀN BỘ KHUNG TIÊU CHÍ (TC1 - TC5)
        =================================================================== */}
        {activeTab === 'checklist' && (
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
                    onClick={() =>
                      setCollapsedSections((prev) => ({ ...prev, [sec.id]: !prev[sec.id] }))
                    }
                    className={`p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none border-b ${
                      secState.isCapped
                        ? 'bg-emerald-50/70 border-emerald-200'
                        : 'bg-slate-900 text-white border-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-black shrink-0 ${
                          secState.isCapped
                            ? 'bg-emerald-600 text-white'
                            : 'bg-red-700 text-white'
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
                          className={`w-5 h-5 ${
                            secState.isCapped ? 'text-emerald-800' : 'text-slate-300'
                          }`}
                        />
                      ) : (
                        <ChevronUp
                          className={`w-5 h-5 ${
                            secState.isCapped ? 'text-emerald-800' : 'text-slate-300'
                          }`}
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
                          if (
                            checklistFilter === 'effective_open' &&
                            (isAchieved || effectiveRoom <= 0)
                          )
                            return false;

                          if (checklistSearch.trim()) {
                            const q = checklistSearch.toLowerCase();
                            return (
                              crit.id.toLowerCase().includes(q) ||
                              crit.title.toLowerCase().includes(q)
                            );
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
                                          <p className="text-[11px] text-slate-500 italic">
                                            💡 {crit.hint}
                                          </p>
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
        )}

        {/* ===================================================================
            TAB 3: GỢI Ý SĂN ĐIỂM TỐI ƯU & CẢNH BÁO BẪY ĐIỂM TRẦN
        =================================================================== */}
        {activeTab === 'advisor' && (
          <div className="mt-5 space-y-6">
            {/* Tổng quan chiến lược */}
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

            {/* Chi tiết gợi ý từng phần TC1..TC5 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {advisorRecommendations.map(({ section, secBreak, missingInSec, bestToHunt }) => (
                <div
                  key={section.id}
                  className={`rounded-2xl border p-5 bg-white shadow-xs flex flex-col justify-between ${
                    secBreak.isCapped ? 'border-emerald-300' : 'border-slate-200'
                  }`}
                >
                  <div>
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

                    {secBreak.isCapped ? (
                      <div className="py-6 text-center text-xs text-emerald-800 bg-emerald-50/60 rounded-xl mt-4 border border-emerald-200 p-4">
                        <ShieldCheck className="w-7 h-7 text-emerald-600 mx-auto mb-1.5" />
                        <p className="font-bold text-sm">
                          Phần {section.code} đã đạt tối đa {section.maxPoints}/{section.maxPoints}{' '}
                          điểm!
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

                        {bestToHunt.slice(0, 5).map((crit) => (
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

                  {/* Trạng thái các đề mục con trong phần này */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {section.subSections.map((sub) => {
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
        )}
      </div>
    </div>
  );
}