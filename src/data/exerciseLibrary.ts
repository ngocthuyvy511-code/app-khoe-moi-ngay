import { ExerciseItem } from '../types';

export const EXERCISE_LIBRARY: ExerciseItem[] = [
  {
    id: 'ex_walking',
    title: 'Đi bộ thư thái ngoài trời / công viên',
    category: 'cardio',
    categoryLabel: 'Cardio nhịp tim',
    level: 'beginner',
    levelLabel: 'Người mới bắt đầu',
    durationMinutes: 30,
    equipment: 'Giày thể thao êm chân',
    instructions: [
      'Khởi động khớp cổ chân, đầu gối và xoay hông nhẹ nhàng trong 3 phút.',
      'Duy trì tư thế thẳng lưng, mắt nhìn về phía trước khoảng 5-6 mét, hai tay đánh tự nhiên theo nhịp bước.',
      'Tiếp đất bằng gót chân rồi cuộn mượt mà đến mũi chân.',
      'Hít thở sâu bằng mũi, thở ra đều đặn bằng miệng theo nhịp 3 bước hít - 3 bước thở.'
    ],
    alternativeExercise: 'Nếu trời mưa hoặc không gian hẹp, có thể đi bộ nhẹ nhàng tại chỗ hoặc đi quanh phòng khách.',
    safetyCaution: 'LƯU Ý AN TOÀN: Dừng lại ngay lập tức nếu bạn cảm thấy chóng mặt, đau nhói ngực hoặc khớp gối kêu đau bất thường. Luôn lắng nghe giới hạn cơ thể.',
    targetMuscles: ['Bắp chân', 'Cơ đùi trước', 'Cơ mông', 'Tim mạch']
  },
  {
    id: 'ex_bodyweight_squat',
    title: 'Squat tự thân (Đứng lên ngồi xuống)',
    category: 'strength',
    categoryLabel: 'Sức mạnh cơ bắp',
    level: 'beginner',
    levelLabel: 'Người mới bắt đầu',
    durationMinutes: 15,
    equipment: 'Không cần dụng cụ (hoặc ghế tựa để hỗ trợ)',
    instructions: [
      'Hai chân đứng rộng bằng vai, mũi chân mở nhẹ sang hai bên khoảng 15-20 độ.',
      'Siết nhẹ cơ bụng, từ từ đẩy hông ra sau và hạ đùi xuống như đang ngồi vào ghế.',
      'Giữ đầu gối thẳng hàng theo hướng mũi chân, lưng thẳng, ngực mở rộng.',
      'Nhấn lực đều vào toàn bàn chân và gót chân để đứng thẳng trở lại. Thực hiện 3 hiệp, mỗi hiệp 10-12 lần.'
    ],
    alternativeExercise: 'Box Squat (ngồi chạm nhẹ vào mặt ghế rồi đứng dậy) nếu khớp gối yếu hoặc chưa quen thăng bằng.',
    safetyCaution: 'Không để đầu gối chụm vào nhau khi đứng lên. Không võng lưng dưới.',
    targetMuscles: ['Cơ đùi trước', 'Cơ mông', 'Gân kheo']
  },
  {
    id: 'ex_morning_yoga',
    title: 'Chuỗi giãn cơ & Yoga buổi sáng nhẹ nhàng',
    category: 'mobility',
    categoryLabel: 'Linh hoạt & Giãn cơ',
    level: 'beginner',
    levelLabel: 'Người mới bắt đầu',
    durationMinutes: 20,
    equipment: 'Thảm yoga hoặc sàn mềm',
    instructions: [
      'Tư thế em bé (Child Pose): Quỳ gối, duỗi dài hai tay về phía trước, trán chạm thảm, hít thở sâu 5 nhịp.',
      'Tư thế Mèo - Bò (Cat-Cow): Chống 4 điểm, hít vào võng lưng ngẩng mặt nhẹ, thở ra cuộn tròn cột sống.',
      'Tư thế Chó úp mặt (Downward Dog): Đẩy hông lên cao, duỗi dài cột sống, gập nhẹ gối nếu gân kheo căng.',
      'Đứng vươn tay hít thở sâu và cảm nhận sự tươi mới của ngày mới.'
    ],
    alternativeExercise: 'Các động tác xoay cổ vai gáy và nghiêng lườn trên ghế làm việc.',
    safetyCaution: 'Chuyển động từ từ theo hơi thở. Không giật cục hay ép căng quá ngưỡng chịu đựng.',
    targetMuscles: ['Cột sống', 'Cơ vai ngực', 'Gân kheo', 'Hông']
  },
  {
    id: 'ex_plank_knees',
    title: 'Plank gối (Tăng cường cơ lõi an toàn)',
    category: 'strength',
    categoryLabel: 'Sức mạnh cơ bắp',
    level: 'beginner',
    levelLabel: 'Người mới bắt đầu',
    durationMinutes: 10,
    equipment: 'Thảm tập',
    instructions: [
      'Chống cẳng tay xuống sàn, khuỷu tay vuông góc ngay dưới vai.',
      'Hai đầu gối chạm sàn, giữ thân người từ đầu, vai đến hông tạo thành một đường thẳng tự nhiên.',
      'Siết cơ bụng, hít thở đều, giữ trong 20-30 giây.',
      'Nghỉ 30 giây rồi lặp lại 3 lượt.'
    ],
    alternativeExercise: 'Plank chống tay lên mặt bàn cao hoặc tường thẳng đứng.',
    safetyCaution: 'Không để võng lưng hoặc nhô mông quá cao. Thả lỏng cổ, nhìn xuống thảm.',
    targetMuscles: ['Cơ bụng thẳng', 'Cơ bụng ngang', 'Cơ lưng dưới', 'Cơ vai']
  },
  {
    id: 'ex_cycling_gentle',
    title: 'Đạp xe thư giãn buổi chiều',
    category: 'cardio',
    categoryLabel: 'Cardio nhịp tim',
    level: 'intermediate',
    levelLabel: 'Trung bình',
    durationMinutes: 35,
    equipment: 'Xe đạp đường phố hoặc xe đạp tại chỗ',
    instructions: [
      'Điều chỉnh yên xe ngang tầm xương hông khi đứng cạnh xe.',
      'Đạp với tốc độ vừa phải trong 5 phút đầu để làm nóng cơ thể.',
      'Duy trì vòng tua nhịp nhàng, có thể nói chuyện ngắt quãng mà không hụt hơi.',
      'Giảm tốc độ trong 3 phút cuối và thả lỏng bắp chân.'
    ],
    alternativeExercise: 'Đạp xe tại chỗ trong nhà với kháng lực nhẹ.',
    safetyCaution: 'Đội mũ bảo hiểm khi đạp ngoài trời. Mang theo bình nước để bù nước từng ngụm nhỏ.',
    targetMuscles: ['Cơ tứ đầu', 'Bắp chân', 'Tim mạch']
  }
];
