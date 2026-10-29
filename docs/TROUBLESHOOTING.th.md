# การแก้ปัญหา

เริ่มจาก **Agent Health** (สถานะของแต่ละส่วน: ฐานข้อมูล, Wazuh MCP, โมเดล, scheduler, การดึงข้อมูล) และ **Runs & Traces** (ทุก span พร้อมข้อผิดพลาดของมัน) ดู log ของคอนเทนเนอร์ด้วย `docker compose logs -f autopilot`

## แพลตฟอร์ม

| อาการ | วิธีแก้ |
|---|---|
| เปิด 8480 แล้วเจอแอปอื่น | มีโปรเซสอื่นจองพอร์ตอยู่ ตั้งค่า `AUTOPILOT_PORT` ใน `.env` |
| `docker compose up` ล้มเหลวที่ `!reset` | Compose เก่ากว่า v2.24 ให้อัปเกรด Docker Compose |
| Postgres แจ้ง "superuser password is not specified" | ตั้งค่า `POSTGRES_PASSWORD` ใน `.env` (overlay สำหรับเดโมตั้งให้อยู่แล้ว) |
| ถูกเตะออกจากระบบทุกครั้งที่รีสตาร์ท | ตั้งค่า `AUTOPILOT_SECRET_KEY` หรือเก็บ volume `autopilot-data` ไว้ (คีย์ที่ระบบสร้างเองถูกเก็บในนั้น) |
| ไม่เห็นหน้า setup wizard | มีการตั้ง `AUTOPILOT_ADMIN_PASSWORD` ไว้ จึงมีบัญชีผู้ดูแลอยู่แล้ว ให้ลงชื่อเข้าใช้ด้วย `AUTOPILOT_ADMIN_EMAIL` |
| Run ขึ้นว่า "Interrupted by platform restart" | เป็นพฤติกรรมที่คาดไว้ run ที่กำลังทำงานตอนรีสตาร์ทจะถูกทำเป็น failed เมื่อระบบบูตขึ้นมา สั่ง replay ได้จากหน้า Runs |

## Wazuh MCP

| อาการ | วิธีแก้ |
|---|---|
| Wazuh MCP ขึ้นสถานะ "down" | ตรวจว่า base URL ไม่มี `/mcp` ต่อท้าย และเข้าถึงได้จากในคอนเทนเนอร์ (`docker compose exec autopilot python -c "import urllib.request;print(urllib.request.urlopen('<url>/health').read())"`) |
| ผลทดสอบขึ้นว่า "read-only key" | ตั้ง `MCP_API_KEY_SCOPES="wazuh:read wazuh:write"` บน MCP server แล้วออกคีย์ใหม่ |
| สั่ง action แล้วได้ error เรื่อง scope หรือสิทธิ์ | สาเหตุเดียวกับข้อข้างบน |
| action ทำงานแล้วแต่ยืนยันผลไม่ได้ | Wazuh รับคำสั่งแล้ว แต่เครื่องมือตรวจสอบยืนยันผลไม่ได้ ดูบันทึกการยืนยันของ action นั้นและข้อสรุปของ Responder อาจเป็นเพราะ agent หลุดการเชื่อมต่อ หรือไม่มีสคริปต์ active response อยู่บนเครื่องนั้น |
| ไม่มี alert ใหม่เข้ามา | ที่ **Settings → Ingestion** โหมดต้องมี poll อยู่ด้วย (หรือไปตั้ง webhook) และค่า `min_level` อาจสูงเกินไป หน้า Health จะบอกเวลา poll ครั้งล่าสุดและข้อผิดพลาดที่เจอ |

## Agent และโมเดล

| อาการ | วิธีแก้ |
|---|---|
| ทดสอบโมเดลไม่ผ่าน | ตรวจ provider, model ID และ credentials สำหรับ Bedrock ต้องเปิดสิทธิ์เข้าถึงโมเดลใน region นั้นและตรวจ IAM |
| agent ตอบโดยไม่เรียกเครื่องมือ | โมเดลทำ tool calling ได้ไม่ดี ให้เปลี่ยนไปใช้โมเดลที่เก่งกว่า หรือถ้าเป็น vLLM ให้เปิด `--enable-auto-tool-choice` พร้อม parser ที่ถูกต้อง |
| agent บน Ollama ลืมคำสั่งหรือพิมพ์ JSON ดิบออกมา | context window เล็กเกินไป ตั้ง "Context window" ไว้ที่ ≥ 32768 |
| ข้อเสนอถูกปฏิเสธ | trace ของ run จะบอกเหตุผลเชิงนโยบาย: อยู่ในโหมด observe, เป้าหมายเป็น protected target, หรือ action ประเภทนั้นถูกปิดไว้ |
| มี incident เปิดขึ้นแต่ไม่มี run | ใช้โควตา run ต่อชั่วโมงหมดแล้ว (`max_runs_per_hour`) |
| swarm หยุดกลางทาง | ชน limit ของจำนวน handoff, จำนวนรอบ หรือ timeout (**Settings → Swarm limits**) |
| เจอ `ImportError` จาก `strands` ในบิลด์ที่ทำเอง | ติดตั้งผิดแพ็กเกจ: ต้องเป็น `strands-agents` ไม่ใช่ `strands` |
