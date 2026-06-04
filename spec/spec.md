# SPEC — AI Food Discovery (Day 06)

**Track:** Food & Local Delivery  
**Product/app tham chiếu:** Shopee Food · GrabFood  
**Prototype:** Web app (từ Figma) + chatbot AI recommendation  

---

## 1. Bằng chứng

### Vấn đề cốt lõi

Khi user không có món cụ thể trong đầu, cả Shopee Food lẫn GrabFood đều không có entry point phù hợp — chỉ hiện list dài theo popularity/sponsor hoặc bắt gõ keyword. Kết quả: user scroll mãi rồi đặt lại quán quen, không khám phá được món mới.

### Self-use observations (nhóm tự thử)

| Observation | App | Path liên quan | Học được |
|---|---|---|---|
| Recommendation phù hợp địa điểm trong bán kính 3–5km — location-aware hoạt động tốt | GrabFood | Happy | Grab giải được geo-filter nhưng chưa giải được intent filter |
| Sau khi chọn Mỳ Quảng, mục "Bạn có thể gọi thêm" chỉ trả về nước uống, bỏ qua tráng miệng / đồ ăn mặn bổ sung | GrabFood | Failure | AI cross-sell quá hẹp, không hiểu meal context; optimize theo category đơn giản thay vì theo bữa ăn hoàn chỉnh |
| Lần đầu mở app: feed hiện combo discount, flash sale, quán bán chạy — không hỏi khẩu vị, không personalized | Shopee Food | Low-confidence | Cold-start hoàn toàn dựa vào popularity + sponsor, không có explicit preference collection |
| Tìm kiếm bắt buộc phải dùng từ khoá liên quan đến tên món / tên quán cụ thể — không thể tìm theo mood ("muốn ăn gì đó mới") | Shopee Food | Failure | Search là keyword-only, không có intent layer |
| Kết quả search sắp xếp theo "relevance" nhưng không rõ logic — rating, khoảng cách, tốc độ chuẩn bị không được thể hiện rõ khi rank | Shopee Food | Failure | User không biết nên cân nhắc tiêu chí nào để chọn; AI ranking thiếu transparency |
| Sau khi đặt: hiện món hay đặt lên đầu + quán đã xem gần đây — có personalization nhưng chỉ dựa trên lịch sử, không theo context hiện tại | Shopee Food | Happy (limited) | Có memory nhưng không có context-awareness; gợi ý cũ không kích thích khám phá món mới |

### Review thật từ người dùng bên ngoài nhóm

| Quote | Nguồn | User là ai? | Pain / failure mode |
|---|---|---|---|
| "Đặt giao hàng nhanh mà cứ ghép đơn chờ lâu quá trời, đề nghị grab đừng có ghép đơn nữa cách 2km mà chờ lâu quá trời mới nhận dc hàng" | Google Play · GrabFood · 1 sao · Quang Khải Nguyễn · 23/05/2026 | User đặt thường xuyên, ưu tiên tốc độ | AI ghép đơn optimize theo lợi nhuận platform, không theo ETA thực tế của user |
| "grab tăng phí nền tảng với khách hàng nhưng lại cắt giảm thưởng cho tài xế và ghép đơn vô tội vạ nhằm lấy lun phần tiền ship của đơn ghép thứ 2 dành cho tài xế" | Google Play · GrabFood · 1 sao · Đại Nguyễn · 28/05/2026 | User nhận ra cơ chế ghép đơn | AI decision (ghép đơn) không minh bạch, bị cảm nhận là thiên về platform hơn user |
| "the app will only display the delays as they occur, meaning that the initial estimate of food arriving by 5:30pm can be pushed to 6:30pm and beyond… they cancel the order with no input from our side" | App Store · GrabFood · 3 sao · M!k3Li | Gia đình đặt thường xuyên, cần đáng tin cậy | AI delivery estimate không có confidence interval; cancel đơn tự động không cần user confirm = mất trust hoàn toàn |
| App tập trung gợi ý đồ ăn nhanh, thiếu đa dạng. Khi không biết muốn ăn gì thì gợi ý rất đơn điệu, không hứng thú — phải lướt list như đi chợ | Self-use tổng hợp · Shopee Food | User muốn khám phá món mới, không có món cụ thể trong đầu | Discovery UX bị broken: không có mood-based hoặc intent-based entry point ngoài keyword search |

### Competitor / analog

| App | Cách họ xử lý | Pattern học được | Khả thi trong 1 ngày? |
|---|---|---|---|
| **Baemin** | Onboarding hỏi khẩu vị ("Bạn thích món gì?") trước khi hiện feed lần đầu | Explicit preference collection giải cold-start; đơn giản, không cần model phức tạp | Có — 2–3 câu hỏi onboarding, lưu preference tag |
| **DoorDash** (Mỹ) | "Tonight's pick" thay đổi theo giờ trong ngày + lịch sử; "Reorder" one-tap cho món hay đặt | Context-aware (time of day) + friction-reduction cho returning user | Có — time slot + order history đã có sẵn trong data |
| **Foody / Now** | Tag lọc theo mood: "Ăn nhanh", "Ăn lành", "No lâu", "Ăn vặt" | Intent-based browse song song với keyword search; user không cần biết tên món cụ thể | Có — tag đơn giản, không cần model, implement nhanh |
| **Netflix** (analog) | "Play Something" khi user không biết xem gì — AI tự chọn 1 nội dung dựa trên lịch sử | Reduce decision paralysis bằng 1 action dứt khoát thay vì list vô tận | Có — "Gợi ý ngay 1 món" button là version food delivery |

### Insight tổng hợp

User không chỉ cần "gợi ý món ăn". Thực ra họ cần một điểm khởi đầu phù hợp với trạng thái hiện tại của mình — vì khi đói và không biết muốn ăn gì, lướt list vô tận không giải quyết được vấn đề, mà còn tạo thêm decision fatigue dẫn đến đặt lại quán quen (không khám phá).

---

## 2. Lát cắt để build

```
Cho user đang mở app không có món cụ thể trong đầu (hoặc gõ query mơ hồ như "ăn nhẹ", "no nhanh", "hôm nay mệt"),
chatbot AI sẽ hỏi 1–2 câu clarification ngắn về mood / intent,
tạo ra danh sách gợi ý phù hợp hơn với context thật của user,
và xử lý trường hợp user bỏ qua câu hỏi bằng cách fallback về mood-tag để user tự điều chỉnh nhanh.
```

**Hai entry point cần build:**
1. **Search intent clarification** — khi user gõ query mơ hồ (< 3 từ hoặc dùng tính từ chung)
2. **Mood-tag discovery** — khi user mở app không gõ gì / không biết muốn ăn gì

---

## 3. AI Product Canvas

| Ô | Nội dung |
|---|---|
| **Value — Giá trị** | Dành cho user đang đói, mệt, không có món cụ thể trong đầu. Đau ở chỗ: app hiện tại bắt gõ keyword hoặc lướt list dài theo popularity — không có entry point cho người "chưa biết muốn ăn gì". AI giải được điều mà cách làm hiện tại chưa giải: thu hẹp không gian lựa chọn bằng 1–2 câu hỏi context trước khi render kết quả. |
| **Trust — Niềm tin** | Khi AI gợi ý sai mood (ví dụ user muốn "ăn nhẹ" nhưng AI trả về cơm tấm sườn bì chả nặng), user nhận ra ngay vì kết quả hiện rõ kèm tag intent. Sửa bằng cách: nhấn "Đổi tiêu chí" → quay về màn clarification, giữ lại câu trả lời trước để chỉ cần sửa 1 điểm. Không cần reload hay gõ lại từ đầu. |
| **Feasibility — Tính khả thi** | Chi phí mỗi lượt gọi AI (clarification + gợi ý) ước tính < $0.01/lượt với GPT-4o-mini hoặc Claude Haiku. Độ trễ chấp nhận được < 2 giây. Dữ liệu cần: danh sách món + quán (mock data trong prototype). Rủi ro lớn nhất: AI hỏi clarification khi không cần thiết (user đã rõ ý) → tăng friction. Ngưỡng dừng: nếu clarification bị skip > 60% lượt thì bỏ, chỉ dùng mood-tag thuần. |
| **Tín hiệu học** | Khi user nhấn "Đổi tiêu chí" hoặc chọn tag khác sau khi xem kết quả → lưu lại cặp (intent ban đầu, intent sau khi sửa). Dữ liệu này dùng để cải thiện prompt clarification và cập nhật tập kiểm thử. Khi user đặt thành công sau flow clarification → positive signal cho cặp (query type, clarification answer). |

---

## 4. Tăng năng lực hay tự động hóa

**Quyết định: Augmentation** — AI gợi ý và hỏi clarification, user quyết định cuối.

**Lý do:** Sai món đặt = mất tiền thật + trải nghiệm tệ. Review GrabFood về AI tự cancel đơn không cần input của user xác nhận: khi AI tự quyết trong food context mà không có human confirm, trust sụp đổ hoàn toàn.

**Human role:** Decider — user chọn món cuối từ danh sách AI đề xuất, user xác nhận intent qua clarification question.

**Con người giữ quyền ở:** bước chọn món cuối cùng + bước confirm clarification. AI không tự đặt, không tự chọn thay.

---

## 5. Bốn đường đi của trải nghiệm

| Đường đi | Người dùng thấy gì? | Prototype xử lý thế nào? |
|---|---|---|
| **Đường thuận** | User gõ "ăn nhẹ" → chatbot hỏi "Nhẹ theo nghĩa ít calo hay ít no?" → user chọn → ra 5 quán / món đúng intent, tag hiện rõ | Clarification flow 1 câu → render kết quả kèm intent tag |
| **Khi AI không chắc** | Query quá ngắn hoặc quá chung ("ăn", "đồ ăn") → AI không hỏi câu mở mà hiện 3–4 mood-tag để user chọn nhanh | Fallback sang tag picker thay vì open-ended question — ít friction hơn |
| **Khi AI sai** | AI đoán sai intent → user thấy kết quả không liên quan → có nút "Tìm lại / Đổi tiêu chí" rõ ràng | Không bắt user gõ lại từ đầu; nút đổi tiêu chí quay về clarification, giữ câu trả lời cũ |
| **Khi người dùng sửa** | User nhấn "Đổi tiêu chí" → quay về màn clarification với câu trả lời trước đã được giữ lại → user chỉ cần sửa 1 điểm | Lưu cặp (intent gốc, intent sửa) để cải thiện prompt sau |

---

## 6. Những kiểu lỗi đáng lo nhất

### Lỗi 1 — AI hỏi clarification khi không cần thiết

**Khi nào xảy ra:** User gõ tên món cụ thể ("bún bò Huế", "cơm tấm sườn bì chả") nhưng AI nhận diện nhầm là intent mơ hồ và hỏi clarification.  
**Hậu quả:** User bực bội vì họ rõ ràng đã biết mình muốn gì — friction tăng, bounce rate tăng.  
**Prototype xử lý:** Nếu query match tên món trong food DB → skip clarification hoàn toàn. Chỉ kích hoạt clarification khi query là tính từ đơn lẻ hoặc cụm chung không khớp tên món nào.

### Lỗi 2 — Gợi ý lặp lại quán cũ / quán sponsor, bỏ qua intent

**Khi nào xảy ra:** AI nhận được intent đúng nhưng vẫn trả về kết quả theo popularity + sponsor thay vì filter theo intent.  
**Hậu quả:** User mất tin tưởng vào chatbot recommendation — cảm giác AI chỉ là wrapper của list cũ.  
**Prototype xử lý:** Mock data được tag sẵn theo intent category; AI dùng intent từ clarification để filter trước khi rank.

### Lỗi 3 — Chatbot không hiểu tiếng Việt có dấu / mix Anh-Việt

**Khi nào xảy ra:** User gõ "an nhe", "an gi do moi", "healthy food", hoặc mix kiểu "tìm đồ ăn light".  
**Hậu quả:** AI trả về kết quả không liên quan hoặc lỗi parsing.  
**Prototype xử lý:** Prompt system instruction bao gồm xử lý tiếng Việt không dấu và mix Anh-Việt; fallback về mood-tag nếu không parse được intent.

---

## 7. Kế hoạch kiểm thử và bằng chứng demo

### Đầu vào demo

| Case | Input | Kết quả mong đợi |
|---|---|---|
| **Happy case** | "ăn nhẹ buổi tối" | Chatbot hỏi "Nhẹ theo nghĩa ít calo hay ít no?", user chọn → ra list phù hợp có tag |
| **Happy case 2** | User mở app, không gõ gì, nhấn "Gợi ý cho tôi" | Chatbot hỏi 1–2 câu mood → ra list |
| **Edge case** | "bún bò Huế" (tên món cụ thể) | Skip clarification, ra kết quả tìm kiếm trực tiếp |
| **Edge case** | "ăn" (quá ngắn) | Hiện mood-tag picker thay vì hỏi open-ended |
| **Failure recovery** | AI gợi ý sai → user nhấn "Đổi tiêu chí" | Quay về clarification, giữ câu trả lời trước |

### Bằng chứng cần giữ trong repo

- [x] Screenshot self-use trên Shopee Food + GrabFood (search flow, cold-start feed)
- [x] Screenshot review App Store / Google Play đã trích dẫn
- [ ] Prompt log: system prompt + ví dụ input/output của clarification flow
- [ ] Test log: danh sách edge case đã thử (tên món cụ thể, query tiếng Anh, mix Anh-Việt, query quá ngắn)
- [ ] Đánh đổi đã cân nhắc: tại sao chọn clarification 1 câu thay vì onboarding dài như Baemin

---

## 8. Phân công

| Thành viên | Phụ trách | Bằng chứng trong repo |
|---|---|---|
| [P1 — điền tên + mã HV] | Prototype UI — web app từ Figma, màn hình search + clarification flow + kết quả | File code (React/Next.js hoặc tương đương) có thể chạy được |
| [P2 — điền tên + mã HV] | Chatbot AI — tích hợp API, viết + kiểm thử system prompt clarification + recommendation | Prompt log, ví dụ response AI, test case đã chạy |
| [P3 — điền tên + mã HV] | Test failure path — tìm case AI hỏi sai lúc (tên món cụ thể, query tiếng Anh, mix Anh-Việt, query quá ngắn) | Screenshot test log + danh sách edge case |
| [P4 — điền tên + mã HV] | Evidence pack + SPEC hoàn thiện + demo script + repo README | SPEC này, README mô tả cách chạy, slide demo 3–5 phút |
