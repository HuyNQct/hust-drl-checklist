// ============================================================================
// 1. DỮ LIỆU KHUNG ĐÁNH GIÁ KẾT QUẢ RÈN LUYỆN SINH VIÊN ĐHBK HÀ NỘI
// (Kèm theo Quyết định số 10911/QĐ-ĐHBK ngày 08/09/2026)
// ============================================================================
export const HUST_DRL_DATA = [
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
        shortName: 'Chính trị, Văn thể & Tình nguyện',
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

// ============================================================================
// MAPS TRA CỨU NHANH
// ============================================================================
export const CRITERIA_MAP: Record<string, any> = {};
export const SUBSECTION_MAP: Record<string, any> = {};
export const SECTION_MAP: Record<string, any> = {};
export const ALL_CRITERIA_LIST: any[] = [];

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
// DỮ LIỆU MẪU
// ============================================================================
export const SAMPLE_MANUAL_CRITERIA = [
    '1.1.1',
    '1.1.2',
    '1.1.3',
    '1.2.1',
    '1.2.2',
    '2.1.1',
    '2.3.1',
    '3.2.1'
];

export const SAMPLE_ACTIVITIES = [
    {
        id: 'act-1',
        name: 'Hội thảo Trí tuệ nhân tạo & Chuyển đổi số SoICT',
        criteria: ['2.1.2', '2.1.4', '3.1.1'],
        status: 'done',
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