# เริ่มต้นใช้งาน

## เดโม (5 นาที ไม่ต้องมี Wazuh หรือ LLM)

```bash
git clone https://github.com/gensecaihq/Wazuh-Autopilot.git && cd Wazuh-Autopilot
docker compose -f docker-compose.yml -f docker-compose.demo.yml up -d --build
```

เปิด <http://localhost:8480> แล้วลงชื่อเข้าใช้ด้วย `admin@autopilot.local` / `Autopilot!2026` ผู้ใช้เดโมคนอื่น (รหัสผ่านเดียวกัน): `maya.chen@autopilot.local` (SOC Manager), `sam.okafor@autopilot.local` (Responder), `lena.ivanova@autopilot.local` (Analyst), `raj.patel@autopilot.local` (Auditor)

สิ่งที่กำลังทำงานอยู่:

- **autopilot**: ตัวแพลตฟอร์ม (API, UI, swarm) ที่พอร์ต 8480
- **postgres**: ฐานข้อมูลของแพลตฟอร์ม
- **mock-wazuh**: Wazuh MCP Server จำลอง มี agent 14 ตัว, สตรีม alert แบบสด และการบุกรุกที่วางไว้สองจุด (miner บน `k8s-node-2` และ beacon บน `fin-ws-17`)

เดโมใช้โมเดล `demo` ที่เขียนสคริปต์ไว้ แต่ละ agent เดินตามขั้นตอนที่กำหนดไว้ แต่เรียกเครื่องมือจริง ดังนั้น case, finding, ข้อเสนอ action, การสั่งทำงาน และการยืนยันผล เกิดขึ้นจริงทั้งหมด สิ่งที่น่าลอง:

1. **Command Center**: การตรวจจับและกิจกรรมของ swarm แบบสด
2. **Incidents**: เปิดเคสใหม่แล้วอ่าน timeline, finding และการแมป ATT&CK ที่ agent สร้างขึ้น
3. **Approvals**: อนุมัติข้อเสนอ `block_ip` แพลตฟอร์มจะสั่งทำงานบนฟลีตจำลองแล้วยืนยันผลด้วย `wazuh_check_blocked_ip`
4. **Runs & Traces**: waterfall ของทุก agent, ทุกการเรียกโมเดล, ทุกการเรียกเครื่องมือ และทุกการส่งต่องาน
5. **Playground**: คุยกับ agent ตัวเดียวในโหมด dry-run และดูการเรียกเครื่องมือไหลมาแบบสด
6. **Settings → Models**: สลับไปใช้ provider จริง (Bedrock, Anthropic, OpenAI-compatible, NVIDIA NIM, vLLM, LiteLLM, Ollama) เพื่อดูการให้เหตุผลจริงบนฟลีตเดียวกัน

หยุดการทำงานด้วย `docker compose -f docker-compose.yml -f docker-compose.demo.yml down` (เติม `-v` ถ้าต้องการล้างข้อมูลทิ้ง)

## การติดตั้งใช้งานจริงครั้งแรก

สิ่งที่ต้องมีก่อน: Docker ที่มี Compose v2.24+, [Wazuh MCP Server](https://github.com/gensecaihq/Wazuh-MCP-Server) v4.3.0 ที่เข้าถึงได้จากเครื่องโฮสต์ และ provider ของโมเดล

```bash
cp .env.example .env
# set POSTGRES_PASSWORD, AUTOPILOT_SECRET_KEY, WAZUH_MCP_URL, WAZUH_MCP_API_KEY, MODEL_PROVIDER/MODEL_ID
docker compose up -d --build
```

ปล่อย `AUTOPILOT_ADMIN_PASSWORD` ว่างไว้ แล้วการเข้าเว็บครั้งแรกจะเปิด setup wizard ให้: องค์กร → ผู้ดูแลระบบ → Wazuh MCP (ทดสอบการเชื่อมต่อได้) → โมเดล (ทดสอบได้) → ระดับการตัดสินใจเอง → ตรวจทาน

เริ่มด้วยระดับการตัดสินใจเองที่ **recommend** (คนเป็นผู้อนุมัติและสั่งทำงานทุกอย่าง) เฝ้าดูข้อเสนอสักสองสามวัน แล้วค่อยผ่อนเฉพาะ action บางประเภทใน **Autonomy Policy** ถ้าจะใช้ active response คีย์ MCP ต้องมี scope `wazuh:write` ดูเพิ่มที่ [MCP_INTEGRATION.md](MCP_INTEGRATION.md)

ขั้นต่อไป: [DEPLOYMENT.md](DEPLOYMENT.md) สำหรับการรับข้อมูลเข้า, TLS, การสำรองข้อมูล และการดูแลระบบ
