<div align="center">

<h1>🛡️ Wazuh Autopilot</h1>

<h3>แพลตฟอร์ม Agentic SOC สำหรับ Wazuh ขับเคลื่อนด้วย Strands Agents<br>ฝูง 13 AI Agents ทำงานร่วมกันเพื่อ Triage, สืบสวน และตอบสนองต่อภัยคุกคามผ่าน Wazuh MCP Server โดยมีมนุษย์คอยควบคุมเสมอ</h3>

<p>
  <a href="https://github.com/gensecaihq/Wazuh-Autopilot/releases"><img src="https://img.shields.io/github/v/release/gensecaihq/Wazuh-Autopilot?color=2ea44f&label=release&style=flat-square" alt="Release"/></a>
  <a href="https://github.com/gensecaihq/Wazuh-Autopilot/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License: MIT"/></a>
  <a href="https://github.com/gensecaihq/Wazuh-Autopilot/actions"><img src="https://img.shields.io/github/actions/workflow/status/gensecaihq/Wazuh-Autopilot/ci.yml?label=CI&style=flat-square" alt="CI"/></a>
  <img src="https://img.shields.io/badge/tests-41%20passing-2ea44f?style=flat-square" alt="Tests"/>
  <a href="https://github.com/gensecaihq/Wazuh-Autopilot/stargazers"><img src="https://img.shields.io/github/stars/gensecaihq/Wazuh-Autopilot?style=social" alt="Stars"/></a>
</p>

<p>
  <img src="https://img.shields.io/badge/Wazuh-0080FF?style=for-the-badge&logo=wazuh&logoColor=white" alt="Wazuh"/>
  <img src="https://img.shields.io/badge/Strands%20Agents-FF8127?style=for-the-badge&logoColor=white" alt="Strands Agents"/>
  <img src="https://img.shields.io/badge/MCP-6B4FBB?style=for-the-badge&logoColor=white" alt="MCP"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
</p>

<p>
  <a href="#quick-start-เริ่มต้นใช้งานด่วน"><b>เริ่มต้นใช้งานด่วน</b></a> &nbsp;·&nbsp;
  <a href="#ระบบการทำงานเป็นแบบไหน-how-it-works"><b>ระบบการทำงาน</b></a> &nbsp;·&nbsp;
  <a href="docs/ARCHITECTURE.md"><b>สถาปัตยกรรม (Architecture)</b></a> &nbsp;·&nbsp;
  <a href="docs/DEPLOYMENT.md"><b>การ Deploy</b></a> &nbsp;·&nbsp;
  <a href="docs/AGENTS_AND_SKILLS.md"><b>Agents & Skills</b></a> &nbsp;·&nbsp;
  <a href="docs/API.md"><b>API Docs</b></a> &nbsp;·&nbsp;
  <a href="CHANGELOG.md"><b>ประวัติการแก้ไข</b></a>
</p>

</div>

---

**Wazuh Autopilot** คือแพลตฟอร์ม Self-hosted ที่เปลี่ยนการทำงานของศูนย์เฝ้าระวังความมั่นคงปลอดภัยไซเบอร์ (SOC) ให้เป็นระบบอัตโนมัติด้วยฝูง AI Agents จาก [Strands Agents](https://strandsagents.com) ทำงานเชื่อมต่อกับ Wazuh SIEM ผ่าน [Wazuh MCP Server](https://github.com/gensecaihq/Wazuh-MCP-Server) (เครื่องมือกว่า 55 รายการ) 

ระบบจะดึง Alert เข้ามาจัดกลุ่มเป็นเคสภัยคุกคาม (Incidents) โดยอัตโนมัติ จากนั้น AI Agents จะช่วยคัดกรอง (Triage), สหสัมพันธ์เหตุการณ์ (Correlate), เจาะลึกทางนิติวิทยาศาสตร์ดิจิทัล (Deep DFIR), เพิ่มบริบท Threat Intelligence และวางแผนการตอบสนอง ทุกขั้นตอนการสั่งระงับหรือแก้ไข (Containment/Remediation) จะต้องผ่าน **นโยบายการควบคุม (Autonomy Policy)** ที่กำหนดได้เอง ตั้งแต่ระดับ "สังเกตการณ์อย่างเดียว" ไปจนถึง "อัตโนมัติเฉพาะเหตุการณ์ความเสี่ยงต่ำ" โดยทั้งหมดรันบน Container และมาพร้อมกับ Web Console ควบคุมครบวงจร

**⚡ ทำงานเสร็จในไม่กี่นาที** &nbsp;·&nbsp; **🤖 13 Agents / 37 Skills** &nbsp;·&nbsp; **🧭 อิงมาตรฐาน NIST · MITRE · CIS · ISO · PCI** &nbsp;·&nbsp; **✅ ควบคุมสิทธิ์การสั่งการ (Policy-Gated)** &nbsp;·&nbsp; **🔭 บันทึก Traces และ Observability ครบทุกขั้นตอน** &nbsp;·&nbsp; **🔒 ใช้งานแบบตัดการเชื่อมต่อภายนอก (Air-gap Ready)**

---

## ระบบการทำงานเป็นแบบไหน? (How It Works)

สถาปัตยกรรมการทำงานของ Wazuh Autopilot แบ่งออกเป็น 5 ขั้นตอนหลักตาม Flow ดังนี้:

```
┌──────────────┐     Alerts (Polling / Webhook)     ┌────────────────────────────────────────────────────────┐
│ Wazuh Server │ ─────────────────────────────────► │                   Wazuh Autopilot                      │
└──────────────┘                                    │  1. Ingestion & Normalization                          │
       ▲                                            │  2. Deterministic Grouping (รวมเป็น Incident Case)     │
       │                                            └───────────────────────────┬────────────────────────────┘
       │                                                                        │ Trigger Workflow
       │                                                                        ▼
┌──────┴──────────────┐      Read-only & Verify Tools       ┌────────────────────────────────────────────────────────┐
│  Wazuh MCP Server   │ ◄────────────────────────────────── │         ฝูง AI Agents (Strands Swarm / Graph)          │
│ (v4.3.0 · 55 Tools) │                                     │  • Overwatch (SOC Commander): ควบคุมทิศทางและส่งต่องาน │
└──────┬──────────────┘                                     │  • Sentinel (Tier 1 Triage): คัดกรอง Alert และกรองขยะ  │
       │                                                    │  • Weaver (Tier 2 Correlation): สหสัมพันธ์เหตุการณ์    │
       │                                                    │  • Sleuth (Tier 3 DFIR): เจาะลึกนิติวิทยาศาสตร์        │
       │                                                    │  • Oracle (CTI Analyst): ตรวจสอบฐานข้อมูลข่าวกรอง      │
       │                                                    │  • Strategist (IR Lead): วางแผนมาตรการตอบสนอง          │
       │                                                    └───────────────────────────┬────────────────────────────┘
       │                                                                                │ propose_action (เสนอคำสั่งจัดการ)
       │                                                                                ▼
       │               คำสั่งที่ผ่านการอนุมัติ               ┌────────────────────────────────────────────────────────┐
       │ ◄───────────────────────────────────────────────── │               Autonomy Policy & Approvals              │
       │                                                    │  • ตรวจสอบ Policy (Observe / Supervised / Auto)        │
       │                                                    │  • Protected Targets (ห้ามรันกับเป้าหมายสำคัญ)         │
       │                                                    │  • Human Approvals Queue (รอการยืนยันจากมนุษย์)        │
       │                                                    └────────────────────────────────────────────────────────┘
       ▼
┌─────────────────────┐
│ Platform Executor   │ ──► สั่งดำเนินการ (Active Response / Isolation / Kill Process)
│ (การปฏิบัติการจริง) │ ──► ตรวจสอบซ้ำด้วย wazuh_check_* ทันที
│                     │ ──► บันทึก Audit Log และรองรับการ Rollback คืนสถานะ
└─────────────────────┘
```

### 1. การรับข้อมูล Alert เข้าสู่ระบบ (Alert Ingestion & Case Grouping)
- รับข้อมูลได้ 2 ทาง: **Webhook** (รับ Event แบบ Real-time จาก Wazuh) หรือ **MCP Polling** (ดึง Alert จาก Wazuh Manager อัตโนมัติทุกๆ 30 วินาที)
- ทำ Normalization จัดโครงสร้างข้อมูลให้อยู่ในฟอร์แมตมาตรฐาน
- นำ Alert ที่เกี่ยวข้องกัน (เช่น Rule ID เดียวกัน, Host เดียวกัน, หรือเกิดจาก Source IP เดียวกันในหน้าต่างเวลาที่กำหนด) มา **รวมกลุ่มเป็นเคสภัยคุกคามเดียวกัน (Deterministic Grouping)** ช่วยลดปัญหา Alert Fatigue ได้อย่างมีนัยสำคัญ

### 2. ฝูง 13 AI Agents ประสานงานร่วมกัน (Strands Swarm & Handoffs)
- **SOC Commander (Overwatch)** จะเป็นด่านแรกในการประเมินสถานการณ์ แล้วส่งต่องาน (Handoff) ไปยังเอเจนต์ผู้เชี่ยวชาญเฉพาะด้าน
- เอเจนต์ทำงานร่วมกันแบบ Dynamic Handoff หรือตามโครงสร้าง Graph Workflow ที่วางไว้
- เอเจนต์สามารถดึงทักษะความเชี่ยวชาญ **37 Agent Skills** (เช่น ตรวจสอบ Brute Force, FIM, Sysmon, Ransomware, Ransomware Investigation) มาปรับใช้ตามสถานการณ์

### 3. มาตรการความปลอดภัยขั้นสูงสุด (Safe-by-Construction)
- **AI ไม่มีสิทธิ์สั่งแก้ไขระบบโดยตรง:** เอเจนต์จะไม่ได้รับสิทธิ์ในการสั่งเปลี่ยนสถานะของ Wazuh ทุกเครื่องมือแก้ไขจะถูกบล็อกผ่าน MCP Filter และ Approval Gate
- เมื่อเอเจนต์ต้องการให้ระงับเหตุการณ์ (เช่น ตัดเน็ตเวิร์กเครื่องที่มีมัลแวร์ หรือบล็อก IP) เอเจนต์ทำได้เพียงเรียกฟังก์ชัน `propose_action` เพื่อเสนอคำสั่งพร้อมระบุระดับความมั่นใจ (Confidence Score), เหตุผลสนับสนุน และขั้นตอนการ Rollback

### 4. นโยบายการควบคุมระดับการตัดสินใจ (Autonomy Policy & Approvals)
- การตัดสินใจขึ้นอยู่กับนโยบายที่ SOC Manager กำหนดไว้:
  - **Observe-only:** แสดงข้อเสนอแนะเท่านั้น ไม่มีการกดดำเนินการ
  - **Recommend:** มนุษย์ต้องเป็นผู้อนุมัติและเป็นผู้สั่งรันเอง
  - **Supervised:** มนุษย์กดอนุมัติ แล้วระบบ Platform Executor จะสั่งรันให้
  - **Autonomous:** ระบบรันให้อัตโนมัติทันที เฉพาะ Action ความเสี่ยงต่ำที่มีคะแนนความมั่นใจเกินเกณฑ์ และไม่เกินเพดานงบประมาณต่อชั่วโมง
- **Critical Risk:** เหตุการณ์ความเสี่ยงระดับวิกฤตจะต้องผ่านการอนุมัติจากมนุษย์เสมอ (บังคับ Two-Person Rule ได้)
- **Protected Targets:** ปกป้องเซิร์ฟเวอร์หลัก, IP สำคัญ, และบัญชีผู้ดูแลระบบจากการถูกสั่งระงับโดยอัตโนมัติ 100%

### 5. การรันคำสั่งและการตรวจสอบยืนยัน (Execution & Verification)
- คำสั่งที่ได้รับอนุมัติจะถูกประมวลผลโดย **Platform Executor** ส่งไปยัง Wazuh ผ่าน Wazuh MCP Server
- เมื่อรันเสร็จสิ้น ระบบจะเรียกเครื่องมือ `wazuh_check_*` เพื่อตรวจสอบยืนยันสถานะจริงทันทีว่าการสั่งการสำเร็จหรือไม่
- บันทึกทุกคำสั่งลง **Immutable Audit Log** และเตรียมปุ่ม **Rollback** เพื่อคืนค่าสถานะเดิมได้อย่างปลอดภัย

---

## ทีม 13 AI Agents ใน Swarm

| Agent (Codename) | ตำแหน่ง | หน้าที่หลัก |
|---|---|---|
| **SOC Commander** (`Overwatch`) | หัวหน้าเวร SOC (LEAD) | ประเมินสถานการณ์ภาพรวม, ส่งต่องานให้ Specialist และตัดสินใจปิดรอบเคส |
| **Tier 1 Triage Analyst** (`Sentinel`) | นักวิเคราะห์ Tier 1 | คัดกรองและตัดสัญญาณรบกวน (Noise), ตรวจสอบความถูกต้องของ Alert, ประเมินความรุนแรง |
| **Tier 2 Correlation Analyst** (`Weaver`) | นักวิเคราะห์ Tier 2 | สหสัมพันธ์ Alert ข้ามโฮสต์และเวลา, ทำ Mapping เข้ากับเทคนิค MITRE ATT&CK และสร้างไทม์ไลน์ |
| **Tier 3 DFIR Investigator** (`Sleuth`) | ผู้เชี่ยวชาญสืบสวนเชิงลึก | นิติวิทยาศาสตร์ดิจิทัลระดับ Host, ตรวจจับ Persistence, สิทธิ์ผู้ใช้ และ Lateral Movement |
| **Cyber Threat Intelligence** (`Oracle`) | นักวิเคราะห์ CTI | เสริมข้อมูล IoCs, จัดเกรดความน่าเชื่อถือ และเทียบเคียงกับ Threat Actor ที่รู้จัก |
| **Threat Hunter** (`Tracker`) | นักล่าภัยคุกคาม | ทำการตรวจค้นหาภัยคุกคามเชิงรุก (PEAK Framework) ทั่วทั้งระบบโครงข่าย |
| **Vulnerability Manager** (`Patchwork`) | ผู้จัดการช่องโหว่ | เชื่อมโยงข้อมูลช่องโหว่ Wazuh Vulnerability Detector เข้ากับ CISA KEV, EPSS และประเมินความเสี่ยง |
| **Incident Response Lead** (`Strategist`) | หัวหน้าทีมรับมือเหตุฉุกเฉิน | วางแผนยุทธวิธีตอบสนองเหตุการณ์ (Containment, Eradication, Recovery) ตามมาตรฐาน SANS |
| **Security Operations Engineer** (`Enforcer`) | วิศวกรปฏิบัติการความปลอดภัย | ร่างข้อเสนอ Active Response ปรับแต่งการบล็อกและประเมินผลกระทบต่อระบบงาน |
| **Detection Engineer** (`Forge`) | วิศวกรสร้างกฎตรวจจับ | ออกแบบ พัฒนา และปรับปรุงกฎ Wazuh Rules / Decoders และแปลง Sigma Rules |
| **Compliance & GRC Analyst** (`Auditor`) | นักวิเคราะห์การปฏิบัติตามกฎเกณฑ์ | เทียบเคียงเหตุการณ์เข้ากับข้อกำหนด PCI-DSS, ISO/IEC 27001, CIS Benchmarks |
| **Wazuh Platform Engineer** (`Keeper`) | วิศวกรดูแลแพลตฟอร์ม Wazuh | ตรวจสอบสถานะคลัสเตอร์ Wazuh, ปัญหาการเชื่อมต่อของ Agent และประสานงานทางเทคนิค |
| **SOC Manager** (`Chronicle`) | ผู้จัดการศูนย์ SOC | สรุปรายงานสำหรับผู้บริหาร, วิเคราะห์ประสิทธิภาพ MTTR/MTTD และควบคุม SLA ของทีม |

---

## 37 ทักษะเฉพาะทาง (Agent Skills)

ระบบมาพร้อมกับ **37 Skills** (มาตรฐาน `SKILL.md`) ครอบคลุม:
- **ทักษะเฉพาะสำหรับ Wazuh (9 Skills):** การสืบค้น Wazuh MCP, การเขียน Rules & Decoders, การสืบสวน FIM (File Integrity Monitoring), การตรวจเช็ค SCA, การตรวจจับ Malware, การวิเคราะห์ Windows Sysmon, การตรวจจับ Cloud & Containers, การใช้งาน Active Response และการตรวจสุขภาพแพลตฟอร์ม
- **Playbooks การรับมือเหตุการณ์ (7 Playbooks):** Brute Force, Lateral Movement, Privilege Escalation, Ransomware, Suspicious PowerShell, Data Exfiltration และ Vulnerability Spike
- **มาตรฐานสากลที่รองรับ:** NIST CSF 2.0, NIST SP 800-61r3, NIST SP 800-53r5, MITRE ATT&CK / D3FEND, CIS Controls v8.1, ISO/IEC 27001:2022, PCI DSS v4.0.1, SANS PICERL, CISA KEV และ OWASP LLM Top 10

---

## Quick Start (เริ่มต้นใช้งานด่วน)

### 1. โหมดทดลองใช้งาน (Demo Mode)
รันระบบเพื่อทดสอบฟังก์ชันทั้งหมดได้ทันทีโดยไม่ต้องต่อกับ Wazuh จริง และไม่ต้องใช้ API Key ของ LLM (ระบบจะจำลอง Wazuh Fleet และเคสจำลองให้ในตัว):

```bash
git clone https://github.com/gensecaihq/Wazuh-Autopilot.git
cd Wazuh-Autopilot
docker compose -f docker-compose.yml -f docker-compose.demo.yml up -d --build
```
เปิดเว็บเบราว์เซอร์ไปที่: **`http://localhost:8480`**  
- **อีเมล:** `admin@autopilot.local`
- **รหัสผ่าน:** `Autopilot!2026`

---

### 2. โหมดใช้งานจริง (Production Setup)

1. คัดลอกไฟล์การตั้งค่าสภาพแวดล้อม:
   ```bash
   cp .env.example .env
   ```
2. แก้ไขไฟล์ `.env` ระบุข้อมูลการเชื่อมต่อไปยัง **Wazuh MCP Server** และ **Model Provider**:
   ```env
   WAZUH_MCP_URL=http://<wazuh-mcp-host>:3000
   WAZUH_MCP_API_KEY=<wazuh-mcp-api-key>
   
   MODEL_PROVIDER=openai   # หรือ bedrock, anthropic, ollama, vllm, litellm
   MODEL_ID=gpt-4o         # หรือ claude-3-7-sonnet, qwen2.5, ฯลฯ
   MODEL_API_KEY=<your-api-key>
   ```
3. สั่งรันระบบ:
   ```bash
   docker compose up -d
   ```
4. เข้าใช้งานผ่านเบราว์เซอร์ที่พอร์ต `8480` เพื่อเข้าสู่ **Setup Wizard** ในการสร้างบัญชีผู้ดูแลระบบคนแรก

---

## โมเดล AI ที่รองรับ (Model Providers)

- **Cloud Providers:** Amazon Bedrock (พร้อม Guardrails), Anthropic Claude, OpenAI / OpenAI-Compatible endpoints
- **Local & Self-Hosted:** Ollama, vLLM, NVIDIA NIM (Nemotron), LiteLLM Proxy
- สามารถกำหนดโมเดลหลักสำหรับทั้งระบบ (Swarm-wide Default) และตั้งค่า Overrides แยกเป็นราย Agent ได้อย่างอิสระ

---

## โครงสร้างโปรเจกต์ (Repository Layout)

```
Wazuh-Autopilot/
├── backend/            # FastAPI + Strands Swarm Platform, Policy Engine, Executor (Python 3.12)
│   ├── app/
│   │   ├── api/        # REST APIs (Auth, Alerts, Cases, Swarm, Admin, Ops)
│   │   ├── swarm/      # การสร้าง Agent, เครื่องมือ Platform, Telemetry, LLM Providers
│   │   └── skills/     # คลัง 37 ทักษะความเชี่ยวชาญ (SKILL.md)
│   └── tests/          # ชุดทดสอบอัตโนมัติ (pytest)
├── ui/                 # Web Console สร้างด้วย React + TypeScript + Vite + Tailwind CSS
├── mock-wazuh/         # เซิร์ฟเวอร์จำลอง Wazuh MCP สำหรับการทดสอบและ Demo
├── litellm/            # การตั้งค่า LiteLLM Proxy
└── docs/               # เอกสารสถาปัตยกรรมและการติดตั้งอย่างละเอียด
```

---

## เอกสารอ้างอิงเพิ่มเติม (Documentation)

- [QUICKSTART.md](docs/QUICKSTART.md) — คู่มือเริ่มต้นใช้งานอย่างรวดเร็ว
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) — สถาปัตยกรรมระบบ เส้นทางการไหลของข้อมูล และขอบเขตความปลอดภัย
- [DEPLOYMENT.md](docs/DEPLOYMENT.md) — การ Deploy ในสภาพแวดล้อมจริง การรับ Ingestion และการบำรุงรักษา
- [AGENTS_AND_SKILLS.md](docs/AGENTS_AND_SKILLS.md) — เจาะลึกบทบาทของ 13 Agents และ 37 Skills
- [AUTONOMY_AND_APPROVALS.md](docs/AUTONOMY_AND_APPROVALS.md) — การตั้งค่านโยบาย Autonomy และกระบวนการอนุมัติคำสั่ง
- [MODEL_PROVIDERS.md](docs/MODEL_PROVIDERS.md) — การเชื่อมต่อ LLM หลากหลายค่าย และการรันแบบ Air-gapped
- [MCP_INTEGRATION.md](docs/MCP_INTEGRATION.md) — การติดตั้งและเชื่อมต่อกับ Wazuh MCP Server
- [API.md](docs/API.md) — เอกสาร REST API และ OpenAPI Specification

---

## ใบอนุญาต (License)

โปรเจกต์นี้เผยแพร่ภายใต้สัญญาอนุญาต **MIT License** ดูรายละเอียดเพิ่มเติมได้ที่ไฟล์ [LICENSE](LICENSE)
