# Word Quest Mobile App

ชุดนี้ปรับจากเวอร์ชัน desktop ให้เหมาะกับมือถือ/PWA โดยเฉพาะ

## ไฟล์ใน repo

- `index.html` หน้าเกมหลัก
- `manifest.json` ตั้งค่า PWA
- `sw.js` service worker สำหรับ cache ไฟล์ static
- `assets/` โฟลเดอร์สำหรับภาพและเสียง

## วิธีใช้งาน

1. สร้าง repo ใหม่ เช่น `WordQuest_PR_mobile`
2. อัปโหลดไฟล์ทั้งหมดในชุดนี้
3. Copy assets จาก repo เดิมมาไว้ใน `assets/`
4. เปิด GitHub Pages หรือ Cloudflare Pages
5. ทดสอบบนมือถือ

## จุดที่ปรับให้เหมาะกับมือถือ

- ใช้ `100dvh` และ safe area สำหรับมือถือ
- หน้า Level ปรับเป็น 2 แถว × 5 ปุ่มแบบพอดีจอ
- หน้า Game ปรับการ์ดคำตอบเป็น 2×2 ให้นิ้วกดง่าย
- HUD บนเกมย่อให้พอดีจอ
- ปุ่มตั้งค่าเสียงเหมาะกับจอมือถือ
- เพิ่ม `manifest.json` และ `sw.js` สำหรับทำเป็น PWA

## ข้อควรระวัง

- Apps Script URL ยังใช้ตัวเดิมใน `index.html`
- ถ้าเปลี่ยน Apps Script ให้แก้ค่าที่ `GAS_API_URL`
- เสียงจาก Google Drive ยังโหลดผ่าน Apps Script เหมือนเดิม
