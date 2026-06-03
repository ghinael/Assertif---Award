import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://cgrvzbcfysmoixmvtrod.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNncnZ6YmNmeXNtb2l4bXZ0cm9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NDUwOTksImV4cCI6MjA5NjAyMTA5OX0.U9YLZGNSMjEyaIduAs0e7V-ZD7QM7KEBb4G7erIP0Ks";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const TEAM = [
  { name: "Pak Aldi", division: "CEO", room: "Depan 1" },
  { name: "Yeni", division: "Finance", room: "Depan 1" },
  { name: "Ghina", division: "PM", room: "Depan 1" },
  { name: "Farhan", division: "Design", room: "Depan 1" },
  { name: "Rizal", division: "Design", room: "Depan 1" },
  { name: "Fery", division: "Design", room: "Depan 1" },
  { name: "Tantra", division: "Brevet", room: "Depan 1" },
  { name: "Naila", division: "Brevet", room: "Depan 1" },
  { name: "Julian", division: "Design", room: "Depan 1" },
  { name: "Ella", division: "MMBA", room: "Depan 2" },
  { name: "Zia", division: "MMBA", room: "Depan 2" },
  { name: "Dinda", division: "DBE", room: "Depan 2" },
  { name: "Nasa", division: "SIC", room: "Depan 2" },
  { name: "Raja", division: "DBE", room: "Depan 2" },
  { name: "Wesy", division: "DBS", room: "Depan 2" },
  { name: "Zaradiva", division: "Design", room: "Belakang 1" },
  { name: "Hana", division: "Al-Azhar", room: "Belakang 1" },
  { name: "Maulana", division: "Al-Azhar", room: "Belakang 1" },
  { name: "Nafa", division: "SIC", room: "Belakang 2" },
  { name: "Zara", division: "SIC", room: "Belakang 2" },
  { name: "Tasya", division: "SIC", room: "Belakang 2" },
  { name: "Na'ilah", division: "DBE", room: "Belakang 2" },
  { name: "Meisya", division: "RA", room: "Belakang 2" },
];

const DIVISIONS = ["DBE", "MMBA", "SIC", "DBS", "Brevet", "Al-Azhar", "RA", "Design"];

const PERSONAL_PARAMS = [
  "Tidak menyindir / tidak pasif agresif",
  "Berani menyatakan tidak/tidak bisa/butuh waktu dengan alasan rasional",
  "Menjaga nada suara profesional, netral, dan respectful",
  "Jujur tentang kebutuhan waktu, bantuan, informasi",
  "Menjaga jam kerja dan jeda",
  "Tidak defensif ketika menerima kritik",
  "Tidak mengomentari personal (fokus pada proses, bukan orang)",
  "Fokus pada perbaikan & solusi, menyampaikan data apa adanya",
  "Mengingatkan kepada kebaikan",
  "Aktif improve skill",
  "Tidak melakukan pelanggaran asertivitas",
  "Zero conflict",
  "100% clear direction (paham amanah, tidak iya-iya aja)",
];

const DIVISION_PARAMS = [
  "Improve sistem yang workable (ada perbaikan sistem kerja dari tim)",
  "Team zero stress – suasana kerja tenang dan bebas tekanan negatif",
  "Memberikan update kerja secara rutin dan jelas",
  "Saat diskusi, tidak mengganggu divisi lain",
  "Mencapai target yang ditetapkan (mingguan, bulanan, tahunan)",
  "Zero pelanggaran SOP dan kualitas",
  "Menerima saran & perubahan sistem dari divisi lain (adaptive)",
  "Pembagian sistem kerja/tugas yang sesuai",
  "Improve kompetensi",
  "Divisi lain tidak takut bertanya atau koordinasi",
  "Laporan apa adanya, tidak ditutupi",
  "Tidak ada gosip antardivisi",
  "Divisi aktif memberi pengingat positif",
  "Inisiatif tinggi dalam kolaborasi antar divisi",
  "Tidak menolak tugas lintas divisi tanpa alasan jelas",
  "Zero pasif-agresif dan zero agresif (intra & antar divisi)",
  "Zero Conflict – menyelesaikan potensi konflik dengan cepat",
];

const SCORE_LABELS = { 1: "Belum terlihat", 2: "Mulai terlihat", 3: "Terlihat tapi labil", 4: "Terlihat dan stabil", 5: "Teladan" };
const SCORE_COLORS = { 1: "#ff453a", 2: "#ff9f0a", 3: "#ffd60a", 4: "#30d158", 5: "#32ade6" };

const getCurrentMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const getMonthLabel = (ym) => {
  const [y, m] = ym.split("-");
  const months = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  return `${months[parseInt(m) - 1]} ${y}`;
};

const generateAssignment = (raterName) => {
  const rater = TEAM.find(p => p.name === raterName);
  if (!rater) return [];
  const sameRoom = TEAM.filter(p => p.name !== raterName && p.room === rater.room);
  const otherRoom = TEAM.filter(p => p.room !== rater.room);
  const shuffled = [...otherRoom].sort(() => Math.random() - 0.5);
  return [...sameRoom, ...shuffled.slice(0, 2)];
};

export default function App() {
  const [view, setView] = useState("home");
  const [step, setStep] = useState(0);
  const [raterName, setRaterName] = useState("");
  const [assignment, setAssignment] = useState([]);
  const [previewAssignment, setPreviewAssignment] = useState([]);
  const [currentRateeIdx, setCurrentRateeIdx] = useState(0);
  const [currentDivIdx, setCurrentDivIdx] = useState(0);
  const [allPersonalScores, setAllPersonalScores] = useState({});
  const [divisionScores, setDivisionScores] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [leaderboard, setLeaderboard] = useState({ persons: [], divisions: [] });
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [allMonths, setAllMonths] = useState([getCurrentMonth()]);

  const raterInfo = TEAM.find(p => p.name === raterName);
  const divisionList = raterInfo ? DIVISIONS.filter(d => d !== raterInfo.division) : DIVISIONS;
  const currentRatee = assignment[currentRateeIdx];
  const currentDiv = divisionList[currentDivIdx];

  useEffect(() => {
    if (view === "leaderboard") fetchLeaderboard();
  }, [view, selectedMonth]);

  useEffect(() => {
    if (raterName) setPreviewAssignment(generateAssignment(raterName));
  }, [raterName]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const { data: subs } = await supabase.from("submissions").select("*").eq("month", selectedMonth);
      const { data: divs } = await supabase.from("division_scores").select("*").eq("month", selectedMonth);
      const { data: allSubs } = await supabase.from("submissions").select("month");

      const personMap = {};
      (subs || []).forEach(s => {
        if (!personMap[s.ratee]) personMap[s.ratee] = { total: 0, count: 0 };
        const vals = Object.values(s.personal_scores);
        personMap[s.ratee].total += vals.reduce((a, b) => a + b, 0) / vals.length;
        personMap[s.ratee].count++;
      });
      const persons = Object.entries(personMap)
        .map(([name, d]) => ({ name, avg: d.count ? d.total / d.count : 0, count: d.count }))
        .sort((a, b) => b.avg - a.avg);

      const divMap = {};
      (divs || []).forEach(d => {
        Object.entries(d.division_scores).forEach(([div, scores]) => {
          if (!divMap[div]) divMap[div] = { total: 0, count: 0 };
          const arr = Object.values(scores);
          divMap[div].total += arr.reduce((a, b) => a + b, 0) / arr.length;
          divMap[div].count++;
        });
      });
      const divisions = Object.entries(divMap)
        .map(([name, d]) => ({ name, avg: d.count ? d.total / d.count : 0, count: d.count }))
        .sort((a, b) => b.avg - a.avg);

      setLeaderboard({ persons, divisions });
      const months = [...new Set((allSubs || []).map(s => s.month))].sort().reverse();
      if (months.length) setAllMonths(months);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const startForm = () => {
    const assign = generateAssignment(raterName);
    setAssignment(assign);
    const initP = {};
    assign.forEach(p => { initP[p.name] = Array(PERSONAL_PARAMS.length).fill(0); });
    setAllPersonalScores(initP);
    const initD = {};
    divisionList.forEach(d => { initD[d] = Array(DIVISION_PARAMS.length).fill(0); });
    setDivisionScores(initD);
    setCurrentRateeIdx(0);
    setCurrentDivIdx(0);
    setStep(1);
  };

  const submitAll = async () => {
    setLoading(true);
    try {
      const month = getCurrentMonth();
      for (const ratee of assignment) {
        const scoreObj = {};
        (allPersonalScores[ratee.name] || []).forEach((s, i) => { scoreObj[i] = s; });
        await supabase.from("submissions").insert({ month, rater: raterName, ratee: ratee.name, room: ratee.room, personal_scores: scoreObj });
      }
      const divObj = {};
      Object.entries(divisionScores).forEach(([div, scores]) => {
        const scoreObj = {};
        scores.forEach((s, i) => { scoreObj[i] = s; });
        divObj[div] = scoreObj;
      });
      await supabase.from("division_scores").insert({ month, rater: raterName, rater_division: raterInfo?.division || "", division_scores: divObj });
      setDone(true);
    } catch (e) { console.error(e); alert("Error menyimpan: " + e.message); }
    setLoading(false);
  };

  const resetForm = () => {
    setStep(0); setRaterName(""); setAssignment([]); setPreviewAssignment([]);
    setCurrentRateeIdx(0); setCurrentDivIdx(0);
    setAllPersonalScores({}); setDivisionScores({}); setDone(false);
  };

  const currentPersonalScores = currentRatee ? (allPersonalScores[currentRatee.name] || Array(PERSONAL_PARAMS.length).fill(0)) : [];
  const setCurrentPersonalScore = (i, val) => {
    setAllPersonalScores(prev => {
      const updated = [...(prev[currentRatee.name] || Array(PERSONAL_PARAMS.length).fill(0))];
      updated[i] = val;
      return { ...prev, [currentRatee.name]: updated };
    });
  };

  const currentDivScores = currentDiv ? (divisionScores[currentDiv] || Array(DIVISION_PARAMS.length).fill(0)) : [];
  const setCurrentDivScore = (i, val) => {
    setDivisionScores(prev => {
      const updated = [...(prev[currentDiv] || Array(DIVISION_PARAMS.length).fill(0))];
      updated[i] = val;
      return { ...prev, [currentDiv]: updated };
    });
  };

  const canNextPersonal = currentPersonalScores.every(s => s > 0);
  const canNextDiv = currentDivScores.every(s => s > 0);

  const C = {
    app: { minHeight: "100vh", background: "#070d14", color: "#e8edf5", fontFamily: "'Sora', sans-serif", margin: 0 },
    header: { background: "rgba(7,13,20,0.96)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "14px 20px", position: "sticky", top: 0, zIndex: 100 },
    headerInner: { maxWidth: 640, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" },
    wrap: { maxWidth: 640, margin: "0 auto", padding: "24px 16px 100px" },
    card: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px" },
    primary: { width: "100%", padding: "15px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #2563eb, #7c3aed)", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" },
    ghost: { padding: "15px 18px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#64748b", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  };

  const NavBtn = ({ v, label }) => (
    <button onClick={() => { setView(v); if (v === "form") resetForm(); }} style={{ padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, border: "none", background: view === v ? "rgba(255,255,255,0.12)" : "transparent", color: view === v ? "#fff" : "#4a5568", cursor: "pointer" }}>
      {label}
    </button>
  );

  const ScoreRow = ({ label, index, scores, setScore }) => (
    <div style={{ padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 10, lineHeight: 1.6 }}>
        <span style={{ color: "#2d3748", marginRight: 6, fontSize: 11 }}>{index + 1}.</span>{label}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {[1,2,3,4,5].map(s => (
          <button key={s} onClick={() => setScore(index, s)} style={{
            flex: 1, padding: "11px 0", borderRadius: 8,
            border: scores[index] === s ? `2px solid ${SCORE_COLORS[s]}` : "1px solid rgba(255,255,255,0.08)",
            background: scores[index] === s ? `${SCORE_COLORS[s]}20` : "rgba(255,255,255,0.02)",
            color: scores[index] === s ? SCORE_COLORS[s] : "#2d3748",
            fontSize: 16, fontWeight: 800, cursor: "pointer",
          }}>{s}</button>
        ))}
      </div>
      {scores[index] > 0 && <div style={{ fontSize: 11, color: SCORE_COLORS[scores[index]], marginTop: 6 }}>→ {SCORE_LABELS[scores[index]]}</div>}
    </div>
  );

  const RankCard = ({ item, rank, color }) => (
    <div style={{ ...C.card, display: "flex", alignItems: "center", gap: 14, marginBottom: 8, padding: "14px 16px", border: rank === 1 ? `1px solid ${color}44` : "1px solid rgba(255,255,255,0.06)", background: rank === 1 ? `${color}08` : "rgba(255,255,255,0.02)" }}>
      <div style={{ width: 32, textAlign: "center", fontSize: rank <= 3 ? 22 : 13, color: "#4a5568", fontWeight: 700 }}>
        {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>{item.name}</div>
        <div style={{ fontSize: 11, color: "#334155", marginTop: 2 }}>{item.count} penilaian</div>
        <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 99, marginTop: 8, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(item.avg / 5) * 100}%`, background: SCORE_COLORS[Math.round(item.avg)] || "#30d158", borderRadius: 99 }} />
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 26, fontWeight: 900, color: SCORE_COLORS[Math.round(item.avg)] || "#30d158", lineHeight: 1 }}>{item.avg.toFixed(1)}</div>
        <div style={{ fontSize: 10, color: "#334155" }}>/5.0</div>
      </div>
    </div>
  );

  return (
    <div style={C.app}>
      <div style={C.header}>
        <div style={C.headerInner}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
            <span>✦</span> Assertif Award
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <NavBtn v="home" label="Home" />
            <NavBtn v="form" label="Nilai" />
            <NavBtn v="leaderboard" label="Ranking" />
          </div>
        </div>
      </div>

      <div style={C.wrap}>

        {/* HOME */}
        {view === "home" && (
          <div>
            <div style={{ textAlign: "center", padding: "44px 0 36px" }}>
              <div style={{ fontSize: 60, marginBottom: 18 }}>🏆</div>
              <h1 style={{ fontSize: 32, fontWeight: 900, margin: "0 0 10px", letterSpacing: "-1.5px" }}>Assertif Award</h1>
              <p style={{ color: "#4a5568", fontSize: 14, margin: "0 0 14px" }}>Penilaian asertivitas bulanan tim</p>
              <span style={{ display: "inline-block", padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: "rgba(37,99,235,0.15)", color: "#60a5fa", border: "1px solid rgba(37,99,235,0.3)" }}>{getMonthLabel(getCurrentMonth())}</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[["23", "Anggota"], ["8", "Divisi"], ["30", "Parameter"]].map(([n, l]) => (
                <div key={l} style={{ ...C.card, textAlign: "center", padding: "16px 8px" }}>
                  <div style={{ fontSize: 24, fontWeight: 900 }}>{n}</div>
                  <div style={{ fontSize: 11, color: "#334155", marginTop: 3 }}>{l}</div>
                </div>
              ))}
            </div>

            <div style={{ ...C.card, marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#334155", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16 }}>Cara Kerja</div>
              {[
                ["👤", "Pilih namamu", "Sistem otomatis assign siapa yang kamu nilai bulan ini"],
                ["⭐", "Nilai 1–5", "Personal: teman seruangan. Plus 2 orang dari ruangan lain"],
                ["🏢", "Nilai divisi", "Semua divisi dinilai, kecuali divisimu sendiri"],
                ["📊", "Lihat ranking", "Leaderboard real-time — person & division terbaik tiap bulan"],
              ].map(([i, t, d]) => (
                <div key={t} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{i}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{t}</div>
                    <div style={{ fontSize: 12, color: "#334155", marginTop: 2 }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setView("form")} style={C.primary}>Mulai Nilai →</button>
          </div>
        )}

        {/* FORM */}
        {view === "form" && (
          <div>
            {done ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
                <h2 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 10px" }}>Selesai!</h2>
                <p style={{ color: "#4a5568", marginBottom: 6 }}>Kamu menilai <strong style={{ color: "#fff" }}>{assignment.length} orang</strong> dan <strong style={{ color: "#fff" }}>{divisionList.length} divisi</strong></p>
                <p style={{ color: "#334155", fontSize: 13, marginBottom: 32 }}>Terima kasih sudah berpartisipasi 🙌</p>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={resetForm} style={{ ...C.ghost, flex: 1 }}>Nilai Lagi</button>
                  <button onClick={() => setView("leaderboard")} style={{ ...C.primary, flex: 1 }}>Lihat Ranking →</button>
                </div>
              </div>

            ) : step === 0 ? (
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 6 }}>Halo! Siapa kamu?</h2>
                <p style={{ color: "#4a5568", fontSize: 13, marginBottom: 24 }}>Pilih namamu untuk mulai</p>
                {["Depan 1", "Depan 2", "Belakang 1", "Belakang 2"].map(room => (
                  <div key={room} style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, color: "#334155", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>Ruangan {room}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {TEAM.filter(p => p.room === room).map(p => (
                        <button key={p.name} onClick={() => setRaterName(p.name)} style={{
                          padding: "9px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                          border: raterName === p.name ? "2px solid #2563eb" : "1px solid rgba(255,255,255,0.08)",
                          background: raterName === p.name ? "rgba(37,99,235,0.15)" : "rgba(255,255,255,0.03)",
                          color: raterName === p.name ? "#60a5fa" : "#64748b", cursor: "pointer",
                        }}>{p.name}</button>
                      ))}
                    </div>
                  </div>
                ))}
                {raterName && (
                  <div style={{ ...C.card, marginBottom: 20, background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.2)" }}>
                    <div style={{ fontSize: 12, color: "#60a5fa", fontWeight: 700, marginBottom: 10 }}>Assignment bulan ini untuk {raterName}:</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {previewAssignment.map(p => (
                        <span key={p.name} style={{ fontSize: 12, padding: "4px 10px", background: "rgba(255,255,255,0.05)", borderRadius: 20, color: "#94a3b8" }}>
                          {p.name} <span style={{ color: "#334155", fontSize: 11 }}>({p.room === raterInfo?.room ? "seruangan" : "ruangan lain"})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <button disabled={!raterName} onClick={startForm} style={{ ...C.primary, opacity: raterName ? 1 : 0.3 }}>Lanjut →</button>
              </div>

            ) : step === 1 ? (
              <div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: "#334155", textTransform: "uppercase", letterSpacing: 1.5 }}>Personal {currentRateeIdx + 1} / {assignment.length}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, marginTop: 4 }}>{currentRatee?.name}</div>
                  <div style={{ fontSize: 12, color: "#4a5568", marginTop: 2 }}>{currentRatee?.division} · {currentRatee?.room}</div>
                  <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 99, marginTop: 12, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(currentPersonalScores.filter(s => s > 0).length / PERSONAL_PARAMS.length) * 100}%`, background: "linear-gradient(90deg, #2563eb, #7c3aed)", borderRadius: 99, transition: "width 0.2s" }} />
                  </div>
                  <div style={{ fontSize: 11, color: "#334155", marginTop: 6 }}>{currentPersonalScores.filter(s => s > 0).length}/{PERSONAL_PARAMS.length} parameter dinilai</div>
                </div>
                {PERSONAL_PARAMS.map((p, i) => <ScoreRow key={i} label={p} index={i} scores={currentPersonalScores} setScore={setCurrentPersonalScore} />)}
                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                  <button onClick={() => currentRateeIdx > 0 ? setCurrentRateeIdx(currentRateeIdx - 1) : setStep(0)} style={C.ghost}>← Back</button>
                  <button disabled={!canNextPersonal} onClick={() => currentRateeIdx < assignment.length - 1 ? setCurrentRateeIdx(currentRateeIdx + 1) : setStep(2)} style={{ ...C.primary, opacity: canNextPersonal ? 1 : 0.3 }}>
                    {currentRateeIdx < assignment.length - 1 ? "Orang berikutnya →" : "Lanjut ke Divisi →"}
                  </button>
                </div>
              </div>

            ) : step === 2 ? (
              <div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: "#334155", textTransform: "uppercase", letterSpacing: 1.5 }}>Divisi {currentDivIdx + 1} / {divisionList.length}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, marginTop: 4 }}>Divisi {currentDiv}</div>
                  <div style={{ fontSize: 12, color: "#4a5568", marginTop: 2 }}>Nilai tim secara keseluruhan</div>
                  <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 99, marginTop: 12, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(currentDivScores.filter(s => s > 0).length / DIVISION_PARAMS.length) * 100}%`, background: "linear-gradient(90deg, #059669, #0891b2)", borderRadius: 99, transition: "width 0.2s" }} />
                  </div>
                  <div style={{ fontSize: 11, color: "#334155", marginTop: 6 }}>{currentDivScores.filter(s => s > 0).length}/{DIVISION_PARAMS.length} parameter dinilai</div>
                </div>
                {DIVISION_PARAMS.map((p, i) => <ScoreRow key={i} label={p} index={i} scores={currentDivScores} setScore={setCurrentDivScore} />)}
                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                  <button onClick={() => currentDivIdx > 0 ? setCurrentDivIdx(currentDivIdx - 1) : setStep(1)} style={C.ghost}>← Back</button>
                  <button disabled={!canNextDiv || loading} onClick={() => currentDivIdx < divisionList.length - 1 ? setCurrentDivIdx(currentDivIdx + 1) : submitAll()} style={{ ...C.primary, opacity: canNextDiv ? 1 : 0.3 }}>
                    {loading ? "Menyimpan..." : currentDivIdx < divisionList.length - 1 ? "Divisi berikutnya →" : "Kirim Semua ✓"}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* LEADERBOARD */}
        {view === "leaderboard" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>Ranking</h2>
              <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "#0f172a", color: "#94a3b8", fontSize: 12 }}>
                {allMonths.map(m => <option key={m} value={m}>{getMonthLabel(m)}</option>)}
              </select>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#334155" }}>Memuat...</div>
            ) : (
              <>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#334155", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  👤 Most Assertive Person
                </div>
                {leaderboard.persons.length === 0
                  ? <div style={{ ...C.card, textAlign: "center", padding: 32, color: "#334155", marginBottom: 28 }}>Belum ada data bulan ini</div>
                  : leaderboard.persons.map((p, i) => <RankCard key={p.name} item={p} rank={i + 1} color="#fbbf24" />)
                }

                <div style={{ fontSize: 11, fontWeight: 800, color: "#334155", textTransform: "uppercase", letterSpacing: 1.5, margin: "28px 0 14px", display: "flex", alignItems: "center", gap: 8 }}>
                  🏢 Most Assertive Division
                </div>
                {leaderboard.divisions.length === 0
                  ? <div style={{ ...C.card, textAlign: "center", padding: 32, color: "#334155" }}>Belum ada data bulan ini</div>
                  : leaderboard.divisions.map((d, i) => <RankCard key={d.name} item={d} rank={i + 1} color="#818cf8" />)
                }
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
