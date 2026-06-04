# SPEC — AI Intent Clarification cho Food Discovery

_Track: Food Delivery · Web: Shopee Food / GrabFood · Day 06_

---

## 1. Bằng chứng

### Trải nghiệm trực tiếp (self-use)

| Quan sát | App | Điều học được |
|---|---|---|
| Tìm "món ăn nhẹ buổi tối" → kết quả sắp xếp theo popularity, không theo intent "nhẹ"; không rõ logic ranking | Shopee Food, GrabFood | AI chỉ match keyword, không hiểu "nhẹ" là ít calo, ít no, hay ăn nhanh |
| Ô search bắt buộc dùng tên món hoặc tên quán cụ thể — không thể tìm theo mood hay cảm giác | Shopee Food | Không có intent layer; user muốn khám phá bị chặn ngay bước đầu |
| Lần đầu mở app, feed hiển thị combo discount, flash sale, quán bán chạy — không hỏi khẩu vị, không personalized | GrabFood, Shopee Food | Cold-start hoàn toàn dựa vào popularity + sponsor |
| Sau khi chọn Mỳ Quảng, mục "Bạn có thể gọi thêm" chỉ trả về nước uống, bỏ qua tráng miệng và đồ ăn mặn bổ sung | GrabFood | AI cross-sell quá hẹp, optimize theo category đơn giản thay vì meal context |

### Nguồn bên ngoài nhóm

| Trích dẫn / quan sát | Nguồn | Pain |
|---|---|---|
| "App cứ gợi ý mấy quán cũ hoặc quán sponsor, tìm món cụ thể thì ra kết quả lung tung" | Review 2–3 sao, App Store Shopee Food | Recommendation bị bias sponsor, không cá nhân hoá |
| "the app will only display the delays as they occur… they cancel the order with no input from our side" | App Store, GrabFood, 3 sao — M!k3Li | AI tự quyết (cancel đơn) không cần user confirm = mất trust |
| "đặt giao hàng nhanh mà cứ ghép đơn chờ lâu quá trời" | Google Play, Grab, 1 sao — Quang Khải Nguyễn, 23/05/2026 | AI ghép đơn optimize theo lợi nhuận platform, không theo ETA thực tế |
| Baemin hỏi khẩu vị trong onboarding trước khi hiển thị feed lần đầu | Competitor, self-use Baemin | Explicit preference collection giải cold-start đơn giản, không cần model phức tạp |
| Foody/Now có tag lọc theo mood: "ăn nhanh", "ăn lành", "no lâu", "ăn vặt" | Competitor, self-use | Intent-based browse song song keyword search — user không cần biết tên món |

---

## 2. Lát cắt để build

```
Khi user đang gõ query tìm món có dưới 3 từ hoặc dùng tính từ chung
("nhẹ", "no", "nhanh", "ăn gì đó mới", "hôm nay mệt"),
AI nhận diện intent mơ hồ và hỏi lại 1 câu clarification ngắn —
hoặc hiển thị 3–4 mood-tag để user chọn nhanh khi query quá ngắn —
trả về danh sách 5 quán / món phù hợp intent thật của user.
```

Đây là phần nhóm thật sự dựng nên và mang đi demo. Không bao gồm: onboarding preference, cross-sell, transparency layer cho AI delivery decision.

---

## 3. AI Product Canvas

### Value — Giá trị

**Dành cho ai:** User mới hoặc ít lịch sử, đang tìm món vào bữa tối trong tuần, không có món cụ thể trong đầu, đói và mệt sau giờ làm.

**Họ đau ở đâu:** Không có entry point nào phù hợp ngoài keyword search và list popularity. Khi không biết muốn ăn gì, lướt list vô tận không giải quyết được vấn đề — còn tạo thêm decision fatigue — dẫn đến đặt lại quán quen (không khám phá).

**AI giải được điều gì mà cách làm hiện tại chưa giải tốt:** Hiểu được rằng "ăn nhẹ" có thể nghĩa là ít calo, ít no, hoặc ăn nhanh — và hỏi lại đúng một câu thay vì ném ra list dài theo popularity. Rule đơn giản không làm được điều này vì "nhẹ", "no", "nhanh" không khớp tên món nào trong DB.

### Trust — Niềm tin

**Khi AI trả lời sai (hỏi clarification không đúng lúc):** User nhận ra ngay vì họ biết mình muốn gì — nếu đã gõ "bún bò Huế" mà còn bị hỏi "nhẹ theo nghĩa nào?", friction lộ rõ.

**Cách người dùng sửa lại:**
- Nút "Tìm lại / Đổi tiêu chí" rõ ràng dưới kết quả — không bắt gõ lại từ đầu.
- Bỏ qua câu clarification → fallback về kết quả mặc định kèm mood-tag filter để user tự điều chỉnh.
- Không có automation: AI không tự đặt đơn — user luôn là người quyết cuối.

### Feasibility — Tính khả thi

| Hạng mục | Đánh giá |
|---|---|
| Chi phí mỗi lượt gọi | 1 lần gọi LLM để classify intent (< 100 token input); có thể cache kết quả cho các query phổ biến |
| Độ trễ | Classify intent: < 500ms; chấp nhận được trước khi render kết quả |
| Dữ liệu cần có | Danh sách tên món trong food DB để guard "query là tên món → skip clarification"; mood-tag vocabulary (có thể hardcode 10–15 tag) |
| Rủi ro lớn nhất | False positive: AI hỏi clarification khi user đã rõ ý → friction. Guard bằng food-name matching |
| Ngưỡng dừng | Nếu false positive rate > 20% trên test set edge case → tắt clarification, fallback về mood-tag thuần |

### Tín hiệu học

Khi user chọn mood-tag hoặc trả lời câu clarification:
- Lưu cặp (query gốc → intent được chọn) để cải thiện classifier.
- Khi user nhấn "Đổi tiêu chí" → lưu lại flow đó làm negative example (AI đoán sai lần đầu).
- Khi user bỏ qua clarification → lưu "query này không cần hỏi" để giảm friction lần sau.

---

## 4. Tăng năng lực hay tự động hóa

**Quyết định: Augmentation.**

AI gợi ý hướng hiểu (clarification / mood-tag), user xác nhận và chọn món cuối. AI không tự đặt đơn, không tự render kết quả mà không qua bước user confirm intent.

**Con người giữ quyền quyết định ở:** bước chọn món — user là decider, AI là advisor.

**Vì sao chọn mức này:** Sai món đặt = mất tiền thật + trải nghiệm tệ + không hoàn tác được ngay. Hậu quả đủ nặng để không để AI tự quyết. Hơn nữa, evidence về GrabFood cancel đơn tự động (không xin phép user) cho thấy rõ: user mất trust rất nhanh khi AI tự quyết trong food context.

---

## 5. Bốn đường đi của trải nghiệm

| Đường đi | Tình huống | Prototype thể hiện gì |
|---|---|---|
| **Đường thuận** | User gõ "ăn nhẹ" — query mơ hồ nhưng đủ thông tin để hỏi | AI hiển thị 1 câu hỏi: "Nhẹ theo nghĩa ít calo hay ít no?" → user chọn một trong hai → ra 5 quán / món đúng intent, một thao tác để chấp nhận |
| **Khi AI không chắc** | Query quá ngắn hoặc quá chung ("ăn", "đồ ăn", chỉ 1 ký tự) — không đủ để hỏi câu mở | AI không hỏi câu mở; hiển thị 3–4 mood-tag để user chọn nhanh (ít friction hơn): "Ăn nhanh · Ăn nhẹ · No lâu · Thử món mới" |
| **Khi AI sai** | AI đoán sai intent → user thấy kết quả không liên quan | Nút "Tìm lại / Đổi tiêu chí" rõ ràng ngay dưới kết quả — không bắt user gõ lại từ đầu |
| **Khi người dùng sửa** | User nhấn "Đổi tiêu chí" | Quay về màn hình clarification với câu trả lời trước đã được giữ lại — user chỉ cần sửa 1 điểm, không fill lại từ đầu; cặp (query, intent sai → intent đúng) được lưu làm tín hiệu học |

---

## 6. Những kiểu lỗi đáng lo nhất

### Lỗi 1 — False positive clarification: hỏi khi user đã rõ ý

**Xuất hiện khi:** User gõ tên món cụ thể ("bún bò Huế", "cơm tấm sườn bì chả", "phở bò tái"), hoặc query tiếng Anh / mix Anh-Việt ("fried rice", "bun bo") mà AI không nhận ra là tên món.

**Ai chịu thiệt và nặng đến đâu:** User bực bội ngay lập tức — họ rõ ràng biết mình muốn gì mà còn bị hỏi thêm. Friction nhỏ nhưng lặp lại nhiều lần → bounce rate tăng, mất tin tưởng vào tính năng.

**Prototype xử lý bằng:** Nếu query match tên món trong food DB (kể cả dạng phiên âm tiếng Anh phổ biến) → skip clarification hoàn toàn, render kết quả trực tiếp. Chỉ kích hoạt clarification khi query là tính từ đơn lẻ hoặc cụm chung không khớp tên món nào.

---

### Lỗi 2 — Clarification hỏi sai câu: AI hiểu nhầm chiều của intent

**Xuất hiện khi:** User gõ "no nhanh" — AI hỏi "Bạn muốn ăn ít hay ăn nhiều?" thay vì "Bạn muốn ăn nhanh hay no lâu?". Câu clarification không align với những gì user thật sự phân vân.

**Ai chịu thiệt và nặng đến đâu:** User phải đọc lại câu hỏi, không trả lời được ngay → confusion → bỏ qua clarification → fallback về kết quả mặc định, tính năng trở nên vô nghĩa.

**Prototype xử lý bằng:** Giới hạn clarification chỉ hỏi theo 2–3 chiều đã được hardcode (calo / độ no / tốc độ / khẩu vị); không để LLM tự sinh câu hỏi tự do. Kiểm thử câu hỏi với ít nhất 5 người ngoài nhóm trước khi demo.

---

### Lỗi 3 — Mood-tag không cover được intent của user

**Xuất hiện khi:** User muốn ăn "lẩu một mình" hoặc "đồ ăn chay" — không có tag nào khớp trong bộ 3–4 tag mặc định.

**Ai chịu thiệt và nặng đến đâu:** User không tìm được điểm vào phù hợp → quay về keyword search → vòng tròn lại như cũ, tính năng không tạo ra giá trị.

**Prototype xử lý bằng:** Thêm lựa chọn "Khác / Tự gõ" trong bộ mood-tag, cho phép user quay về search thuần nếu không có tag phù hợp. Ghi lại những lần user chọn "Khác" để mở rộng tag set về sau.

---

## 7. Kế hoạch kiểm thử và bằng chứng demo

### Hai đầu vào chuẩn bị sẵn cho demo

**Đầu vào bình thường (đường thuận):**
- Query: `"ăn nhẹ"`
- Kỳ vọng: AI hiện câu hỏi "Nhẹ theo nghĩa ít calo hay ít no?" → user chọn "ít calo" → ra 5 món salad / cháo / cuốn

**Đầu vào khó (failure + recovery):**
- Query: `"bún bò Huế"` → kỳ vọng: skip clarification hoàn toàn, render ngay
- Query: `"ăn"` → kỳ vọng: hiện mood-tag, không hỏi câu mở
- Query: `"ăn nhẹ"` → chọn intent → kết quả sai → nhấn "Đổi tiêu chí" → recovery flow

### Bằng chứng giữ lại trong repo

- [ ] Screenshot self-use: kết quả search "ăn nhẹ buổi tối" trên Shopee Food và GrabFood
- [ ] Screenshot review App Store Shopee Food (2–3 sao) về gợi ý quán sponsor
- [ ] Screenshot review Google Play GrabFood (1 sao) về ghép đơn
- [ ] Nhật ký prompt: prompt phân loại intent + các version đã thử
- [ ] Test log: danh sách edge case đã chạy (tên món cụ thể, query tiếng Anh, mix Anh-Việt, query 1 ký tự)
- [ ] Ghi chú đánh đổi: tại sao không dùng automation, tại sao giới hạn clarification về chiều hardcode thay vì để LLM tự sinh câu hỏi

---

## 8. Phân công

| Thành viên | Việc phụ trách | Bằng chứng cần có trong repo |
|---|---|---|
| **Nguyễn Văn Quang** | Prototype UI — màn hình search → clarification flow → màn kết quả → recovery path | File code hoặc Figma prototype có thể click qua cả 4 đường đi |
| **P2** | Viết và kiểm thử prompt phân loại intent — bao gồm guard tên món, edge case tiếng Anh/mix | Nhật ký prompt + test log với ít nhất 15 query test case, ghi rõ pass/fail |
| **P3** | Evidence pack + SPEC hoàn thiện — bổ sung quote thật, ảnh chụp màn hình, ghi chú đánh đổi | File markdown không còn placeholder; ảnh screenshot trong `/evidence/` |
| **P4** | Demo script + repo README + slide demo | README mô tả cách chạy; kịch bản demo 3–5 phút có cả đường thuận và failure recovery |

---

_Mỗi thành viên cần giải thích được phần mình phụ trách khi bị hỏi trong buổi demo._