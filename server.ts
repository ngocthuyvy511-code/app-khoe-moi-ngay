import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize Google Gen AI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    appName: 'Khỏe Mỗi Ngày',
    hasGeminiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// Photo meal recognition endpoint
app.post('/api/gemini/analyze-meal-photo', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;

    if (!imageBase64) {
      res.status(400).json({ error: 'Thiếu dữ liệu hình ảnh (imageBase64).' });
      return;
    }

    if (!ai) {
      // Fallback smart heuristic mock if no API key configured yet
      res.json({
        success: true,
        isSimulated: true,
        dishName: 'Phở bò tái truyền thống',
        portion: '1 tô vừa (~450g)',
        calories: 450,
        protein: 26,
        carbs: 58,
        fat: 12,
        fiber: 3,
        ingredients: ['Bánh phở tươi', 'Thịt bò phi lê', 'Nước dùng hầm xương gia vị', 'Hành lá, ngò gai, giá đỗ', 'Chanh, ớt tươi'],
        notes: 'Món nước nhiều đạm từ thịt bò, năng lượng chủ yếu từ bánh phở và nước hầm. Bạn có thể thêm nhiều rau mùi và giá để tăng chất xơ.',
        disclaimer: 'Lưu ý: Đây chỉ là ước tính dựa trên hình ảnh mẫu. Bạn hãy kiểm tra lại thành phần và lượng ăn thực tế trước khi lưu vào nhật ký.'
      });
      return;
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');

    const promptText = `
Bạn là chuyên gia dinh dưỡng và ẩm thực Việt Nam của ứng dụng "Khỏe Mỗi Ngày".
Hãy phân tích bức ảnh bữa ăn được gửi kèm:
1. Nhận diện tên món ăn Việt Nam hoặc món phổ biến nhất.
2. Ước tính kích cỡ khẩu phần điển hình (ví dụ: "1 tô", "1 đĩa", "1 phần vừa (~300g)").
3. Ước tính năng lượng (Calories: số nguyên kcal).
4. Ước tính Macronutrients: protein (gam), carbs (gam), fat (gam), fiber (gam).
5. Liệt kê các thành phần chính nhìn thấy trong ảnh.
6. Lời khuyên nhẹ nhàng, thân thiện, không phán xét, không dán nhãn "tốt" hay "xấu".
7. Lưu ý an toàn: Nhắc nhở người dùng rằng hình ảnh không thể xác định chính xác gia vị nêm nếm, dầu mỡ ẩn hoặc chất gây dị ứng.

Trả về DUY NHẤT một đối tượng JSON hợp lệ (không kèm markdown code fence ngoài định dạng json) với cấu trúc sau:
{
  "dishName": "string (Tên món tiếng Việt)",
  "portion": "string (ví dụ: 1 tô vừa (~400g))",
  "calories": number (ví dụ: 480),
  "protein": number,
  "carbs": number,
  "fat": number,
  "fiber": number,
  "ingredients": ["thành phần 1", "thành phần 2"],
  "notes": "string (nhận xét ngắn gọn tích cực)",
  "disclaimer": "Ước tính sơ bộ qua ảnh, cần xác nhận thực tế trước khi lưu"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const outputText = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(outputText);
    } catch {
      parsedData = {
        dishName: 'Bữa ăn dinh dưỡng',
        portion: '1 phần',
        calories: 400,
        protein: 20,
        carbs: 50,
        fat: 12,
        fiber: 4,
        ingredients: ['Rau củ', 'Thực phẩm chính'],
        notes: 'Vui lòng kiểm tra lại khẩu phần và nguyên liệu thực tế.',
        disclaimer: 'Dữ liệu ước tính qua ảnh cần bạn xác nhận.',
      };
    }

    res.json({
      success: true,
      isSimulated: false,
      ...parsedData,
    });
  } catch (error: any) {
    console.error('Lỗi khi phân tích ảnh qua Gemini:', error);
    res.status(500).json({
      error: 'Không thể phân tích ảnh lúc này. Vui lòng thử lại hoặc nhập thủ công.',
      details: error?.message,
    });
  }
});

// AI Assistant chat endpoint
app.post('/api/gemini/assistant', async (req: Request, res: Response) => {
  try {
    const { message, history = [], userContext = {} } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Nội dung tin nhắn không được để trống.' });
      return;
    }

    if (!ai) {
      // Gentle helpful rule-based fallback response
      let fallbackReply = `Chào bạn! Tôi là Trợ lý Sống Khỏe của ứng dụng "Khỏe Mỗi Ngày".\n\n`;
      const lower = message.toLowerCase();
      if (lower.includes('nguyên liệu') || lower.includes('nấu gì') || lower.includes('tủ lạnh')) {
        fallbackReply += `Với các nguyên liệu Việt quen thuộc như trứng, đậu phụ, rau muống, cà chua hoặc ức gà, bạn có thể làm món canh cà chua trứng thanh đạm hoặc đậu phụ sốt cà chua ít dầu. Cả hai món đều giàu dinh dưỡng, dễ tiêu hóa và nấu chưa đầy 15 phút!`;
      } else if (lower.includes('thèm') || lower.includes('ăn vặt') || lower.includes('bánh mì')) {
        fallbackReply += `Cảm giác thèm ăn là phản ứng rất bình thường của cơ thể. Bạn có thể uống 1 ly nước ấm trước, hoặc chọn món ăn nhẹ như 1 quả chuối, sữa chua không đường hoặc một nhúm hạt hạnh nhân để nạp năng lượng vừa phải.`;
      } else {
        fallbackReply += `Mỗi bước nhỏ đều đáng trân trọng! Hãy nhớ rằng việc quản lý cân nặng là hành trình dài nuôi dưỡng cơ thể, không phải sự kiêng khem khắc nghiệt. Bạn đang cần hỗ trợ gợi ý món ăn, lập kế hoạch hay lời khuyên vận động hôm nay?`;
      }
      res.json({ reply: fallbackReply, isSimulated: true });
      return;
    }

    const systemInstruction = `
Bạn là Trợ lý đồng hành của ứng dụng "Khỏe Mỗi Ngày" - ứng dụng quản lý cân nặng và lối sống lành mạnh dành cho người Việt.
Nguyên tắc bất di bất dịch của bạn:
1. Luôn dùng tiếng Việt chuẩn mực, thân thiện, tôn trọng, đồng cảm và khích lệ tích cực.
2. KHÔNG BAO GIỜ khuyến khích nhịn ăn cực đoan, giảm cân cấp tốc, thải độc (detox) phản khoa học, hoặc tập luyện để "trừng phạt" bữa ăn.
3. KHÔNG dán nhãn thức ăn là "tốt" hay "xấu", "sạch" hay "bẩn". Mọi món ăn (kể cả phở, cơm tấm, bún chả) đều có vị trí nếu ăn cân bằng và lắng nghe cơ thể.
4. KHÔNG chẩn đoán bệnh tật, KHÔNG kê đơn thuốc hoặc gợi ý thực phẩm chức năng giảm cân. Nếu người dùng hỏi về bệnh lý, nhắc nhở họ tham khảo bác sĩ/chuyên gia y tế.
5. Luôn minh bạch: phân biệt rõ dữ liệu ghi nhận của người dùng với ước tính khoa học.
6. Khi gợi ý món ăn từ nguyên liệu, hãy ưu tiên các nguyên liệu gần gũi với mâm cơm gia đình Việt Nam.

Thông tin hồ sơ tham khảo của người dùng (nếu có):
- Tên: ${userContext.displayName || 'Bạn'}
- Mục tiêu: ${userContext.goal || 'Xây dựng lối sống lành mạnh & duy trì cân nặng'}
- Sở thích/Kiêng cữ: ${userContext.dietaryRestrictions || 'Không có'}
- Dị ứng thực phẩm: ${userContext.allergies || 'Không'}
`;

    const contents = [
      ...history.map((h: { role: string; content: string }) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }],
      })),
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Tôi luôn sẵn sàng đồng hành cùng bạn xây dựng thói quen sống khỏe.';
    res.json({ reply, isSimulated: false });
  } catch (error: any) {
    console.error('Lỗi khi trò chuyện cùng trợ lý Gemini:', error);
    res.status(500).json({
      error: 'Không thể kết nối trợ lý lúc này. Vui lòng thử lại sau giây lát.',
      details: error?.message,
    });
  }
});

// Vite middleware in dev or static files in production
async function setupServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Ứng dụng Khỏe Mỗi Ngày đang chạy tại http://0.0.0.0:${port}`);
  });
}

setupServer().catch((err) => {
  console.error('Khởi động máy chủ thất bại:', err);
  process.exit(1);
});
