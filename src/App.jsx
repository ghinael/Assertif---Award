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
const SCORE_COLORS = { 1: "#f87171", 2: "#fb923c", 3: "#fbbf24", 4: "#34d399", 5: "#818cf8" };

// Pastel theme
const T = {
  bg: "#fdf6ff",
  bgCard: "#ffffff",
  bgCardAlt: "#faf5ff",
  border: "#e9d5ff",
  borderLight: "#f3e8ff",
  text: "#4a3b5c",
  textSub: "#9c7bb5",
  textMuted: "#c4a8d9",
  pink: "#f9a8d4",
  lavender: "#c4b5fd",
  mint: "#6ee7b7",
  purple: "#a78bfa",
  purpleDark: "#7c3aed",
  purpleLight: "#ede9fe",
  grad: "linear-gradient(135deg, #f9a8d4, #c4b5fd, #93c5fd)",
  gradBtn: "linear-gradient(135deg, #c084fc, #818cf8)",
  gradBtnHover: "linear-gradient(135deg, #a855f7, #6366f1)",
};

const getCurrentMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const getMonthLabel = (ym) => {
  const [y, m] = ym.split("-");
  const months = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  return `${months[parseInt(m) - 1]} ${y}`;
};

// FAIR assignment: all same-room (max 4) + fill up to 4 total from other rooms
const generateAssignment = (raterName) => {
  const rater = TEAM.find(p => p.name === raterName);
  if (!rater) return [];
  const MAX = 4;
  const sameRoom = TEAM.filter(p => p.name !== raterName && p.room === rater.room);
  // Cap same-room at MAX
  const sameRoomCapped = sameRoom.slice(0, MAX);
  const remaining = MAX - sameRoomCapped.length;
  const otherRoom = TEAM.filter(p => p.room !== rater.room).sort(() => Math.random() - 0.5);
  return [...sameRoomCapped, ...otherRoom.slice(0, Math.max(2, remaining))];
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

  useEffect(() => { if (view === "leaderboard") fetchLeaderboard(); }, [view, selectedMonth]);
  useEffect(() => { if (raterName) setPreviewAssignment(generateAssignment(raterName)); }, [raterName]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const { data: subs } = await supabase.from("submissions").select("*").eq("month", selectedMonth);
      const { data: divs } = await supabase.from("division_scores").select("*").eq("month", selectedMonth);
      const { data: allSubs } = await supabase.from("submissions").select("month");

      // Normalized person avg (weighted mean regardless of how many rated them)
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

      // Normalized division avg
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
    setCurrentRateeIdx(0); setCurrentDivIdx(0); setStep(1);
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
    } catch (e) { alert("Error: " + e.message); }
    setLoading(false);
  };

  const resetForm = () => {
    setStep(0); setRaterName(""); setAssignment([]); setPreviewAssignment([]);
    setCurrentRateeIdx(0); setCurrentDivIdx(0); setAllPersonalScores({}); setDivisionScores({}); setDone(false);
  };

  const currentPersonalScores = currentRatee ? (allPersonalScores[currentRatee.name] || Array(PERSONAL_PARAMS.length).fill(0)) : [];
  const setCurrentPersonalScore = (i, val) => {
    setAllPersonalScores(prev => { const u = [...(prev[currentRatee.name] || Array(PERSONAL_PARAMS.length).fill(0))]; u[i] = val; return { ...prev, [currentRatee.name]: u }; });
  };
  const currentDivScores = currentDiv ? (divisionScores[currentDiv] || Array(DIVISION_PARAMS.length).fill(0)) : [];
  const setCurrentDivScore = (i, val) => {
    setDivisionScores(prev => { const u = [...(prev[currentDiv] || Array(DIVISION_PARAMS.length).fill(0))]; u[i] = val; return { ...prev, [currentDiv]: u }; });
  };

  const canNextPersonal = currentPersonalScores.every(s => s > 0);
  const canNextDiv = currentDivScores.every(s => s > 0);

  const NavBtn = ({ v, label }) => (
    <button onClick={() => { setView(v); if (v === "form") resetForm(); }} style={{
      padding: "8px 16px", borderRadius: 20, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer",
      background: view === v ? T.lavender : "transparent",
      color: view === v ? "#fff" : T.textMuted,
      boxShadow: view === v ? "0 2px 8px rgba(167,139,250,0.4)" : "none",
    }}>{label}</button>
  );

  const ScoreRow = ({ label, index, scores, setScore }) => (
    <div style={{ padding: "14px 0", borderBottom: `1px solid ${T.borderLight}` }}>
      <div style={{ fontSize: 13, color: T.textSub, marginBottom: 10, lineHeight: 1.6 }}>
        <span style={{ color: T.textMuted, marginRight: 6, fontSize: 11 }}>{index + 1}.</span>{label}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {[1,2,3,4,5].map(s => (
          <button key={s} onClick={() => setScore(index, s)} style={{
            flex: 1, padding: "11px 0", borderRadius: 10,
            border: scores[index] === s ? `2px solid ${SCORE_COLORS[s]}` : `1px solid ${T.borderLight}`,
            background: scores[index] === s ? `${SCORE_COLORS[s]}22` : T.bgCardAlt,
            color: scores[index] === s ? SCORE_COLORS[s] : T.textMuted,
            fontSize: 16, fontWeight: 800, cursor: "pointer",
          }}>{s}</button>
        ))}
      </div>
      {scores[index] > 0 && (
        <div style={{ fontSize: 11, color: SCORE_COLORS[scores[index]], marginTop: 6, fontWeight: 600 }}>
          → {SCORE_LABELS[scores[index]]}
        </div>
      )}
    </div>
  );

  const RankCard = ({ item, rank }) => {
    const medalColors = { 1: "#fbbf24", 2: "#9ca3af", 3: "#f97316" };
    const isTop = rank <= 3;
    return (
      <div style={{
        background: rank === 1 ? "linear-gradient(135deg, #fdf4ff, #f5f3ff)" : T.bgCard,
        border: `1px solid ${rank === 1 ? "#e9d5ff" : T.borderLight}`,
        borderRadius: 14, padding: "14px 16px", marginBottom: 8,
        display: "flex", alignItems: "center", gap: 14,
        boxShadow: rank === 1 ? "0 4px 20px rgba(167,139,250,0.15)" : "0 1px 4px rgba(0,0,0,0.04)",
      }}>
        <div style={{ width: 32, textAlign: "center", fontSize: isTop ? 22 : 13, color: medalColors[rank] || T.textMuted, fontWeight: 700 }}>
          {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: T.text }}>{item.name}</div>
          <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>{item.count} penilaian</div>
          <div style={{ height: 4, background: T.borderLight, borderRadius: 99, marginTop: 8, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(item.avg / 5) * 100}%`, background: T.gradBtn, borderRadius: 99, transition: "width 0.6s ease" }} />
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: T.purple, lineHeight: 1 }}>{item.avg.toFixed(1)}</div>
          <div style={{ fontSize: 10, color: T.textMuted }}>/5.0</div>
        </div>
      </div>
    );
  };

  const PrimaryBtn = ({ onClick, disabled, children }) => (
    <button onClick={onClick} disabled={disabled} style={{
      width: "100%", padding: "15px", borderRadius: 14, border: "none",
      background: disabled ? T.borderLight : T.gradBtn,
      color: disabled ? T.textMuted : "#fff",
      fontSize: 15, fontWeight: 700, cursor: disabled ? "default" : "pointer",
      boxShadow: disabled ? "none" : "0 4px 16px rgba(167,139,250,0.4)",
      transition: "all 0.2s",
    }}>{children}</button>
  );

  const GhostBtn = ({ onClick, children }) => (
    <button onClick={onClick} style={{
      padding: "15px 18px", borderRadius: 14, border: `1px solid ${T.border}`,
      background: T.bgCardAlt, color: T.textSub, fontSize: 14, fontWeight: 600, cursor: "pointer",
    }}>{children}</button>
  );

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "'Sora', 'DM Sans', sans-serif", margin: 0 }}>
      {/* Header */}
      <div style={{ background: "rgba(253,246,255,0.9)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${T.borderLight}`, padding: "14px 20px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 800, background: T.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "flex", alignItems: "center", gap: 8 }}>
            ✦ Assertif Award
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <NavBtn v="home" label="Home" />
            <NavBtn v="form" label="Nilai" />
            <NavBtn v="leaderboard" label="Ranking" />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 16px 100px" }}>

        {/* HOME */}
        {view === "home" && (
          <div>
            {/* Hero */}
            <div style={{ textAlign: "center", padding: "44px 0 36px" }}>
              <div style={{ width: 80, height: 80, borderRadius: 24, background: T.grad, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, boxShadow: "0 8px 32px rgba(196,181,253,0.4)" }}>🏆</div>
              <h1 style={{ fontSize: 30, fontWeight: 900, margin: "0 0 10px", letterSpacing: "-1px", background: T.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Assertif Award</h1>
              <p style={{ color: T.textSub, fontSize: 14, margin: "0 0 16px" }}>Penilaian asertivitas bulanan tim</p>
              <span style={{ display: "inline-block", padding: "6px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: T.purpleLight, color: T.purple, border: `1px solid ${T.border}` }}>
                🗓 {getMonthLabel(getCurrentMonth())}
              </span>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[["23", "Anggota", "👥"], ["8", "Divisi", "🏢"], ["30", "Parameter", "⭐"]].map(([n, l, icon]) => (
                <div key={l} style={{ background: T.bgCard, border: `1px solid ${T.borderLight}`, borderRadius: 14, padding: "16px 8px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: T.purple }}>{n}</div>
                  <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>

            {/* How it works */}
            <div style={{ background: T.bgCard, border: `1px solid ${T.borderLight}`, borderRadius: 16, padding: "20px", marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16 }}>Cara Kerja</div>
              {[
                ["👤", "Pilih namamu", "Sistem assign siapa yang kamu nilai — max 4 orang, adil untuk semua ruangan"],
                ["⭐", "Nilai 1–5", "Personal: teman seruangan + 2 dari ruangan lain"],
                ["🏢", "Nilai divisi", "Semua divisi dinilai, kecuali divisimu sendiri"],
                ["📊", "Lihat ranking", "Leaderboard real-time, dinormalisasi biar fair"],
              ].map(([icon, title, desc]) => (
                <div key={title} style={{ display: "flex", gap: 14, marginBottom: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: T.purpleLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{icon}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{title}</div>
                    <div style={{ fontSize: 12, color: T.textSub, marginTop: 2, lineHeight: 1.5 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <PrimaryBtn onClick={() => setView("form")}>Mulai Nilai Sekarang 🌸</PrimaryBtn>
          </div>
        )}

        {/* FORM */}
        {view === "form" && (
          <div>
            {done ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
                <h2 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 10px", color: T.text }}>Selesai!</h2>
                <p style={{ color: T.textSub, marginBottom: 6 }}>Kamu menilai <strong style={{ color: T.purple }}>{assignment.length} orang</strong> dan <strong style={{ color: T.purple }}>{divisionList.length} divisi</strong></p>
                <p style={{ color: T.textMuted, fontSize: 13, marginBottom: 32 }}>Makasih udah berpartisipasi! 🙌</p>
                <div style={{ display: "flex", gap: 10 }}>
                  <GhostBtn onClick={resetForm}>Nilai Lagi</GhostBtn>
                  <PrimaryBtn onClick={() => setView("leaderboard")}>Lihat Ranking →</PrimaryBtn>
                </div>
              </div>

            ) : step === 0 ? (
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 6, color: T.text }}>Halo! Siapa kamu? 👋</h2>
                <p style={{ color: T.textSub, fontSize: 13, marginBottom: 24 }}>Pilih namamu untuk mulai penilaian bulan ini</p>
                {["Depan 1", "Depan 2", "Belakang 1", "Belakang 2"].map(room => (
                  <div key={room} style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>Ruangan {room}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {TEAM.filter(p => p.room === room).map(p => (
                        <button key={p.name} onClick={() => setRaterName(p.name)} style={{
                          padding: "9px 16px", borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: "pointer",
                          border: raterName === p.name ? `2px solid ${T.purple}` : `1px solid ${T.borderLight}`,
                          background: raterName === p.name ? T.purpleLight : T.bgCard,
                          color: raterName === p.name ? T.purpleDark : T.textSub,
                          boxShadow: raterName === p.name ? "0 2px 8px rgba(167,139,250,0.3)" : "none",
                        }}>{p.name}</button>
                      ))}
                    </div>
                  </div>
                ))}
                {raterName && (
                  <div style={{ background: "linear-gradient(135deg, #fdf4ff, #f0f4ff)", border: `1px solid ${T.border}`, borderRadius: 14, padding: "16px", marginBottom: 20 }}>
                    <div style={{ fontSize: 12, color: T.purple, fontWeight: 700, marginBottom: 10 }}>✨ Assignment bulan ini untuk {raterName}:</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {previewAssignment.map(p => (
                        <span key={p.name} style={{ fontSize: 12, padding: "4px 12px", background: "#fff", border: `1px solid ${T.borderLight}`, borderRadius: 20, color: T.textSub }}>
                          {p.name} <span style={{ color: T.textMuted, fontSize: 10 }}>({p.room === raterInfo?.room ? "seruangan" : "ruangan lain"})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <PrimaryBtn disabled={!raterName} onClick={startForm}>Lanjut →</PrimaryBtn>
              </div>

            ) : step === 1 ? (
              <div>
                <div style={{ background: "linear-gradient(135deg, #fdf4ff, #f0f4ff)", border: `1px solid ${T.border}`, borderRadius: 14, padding: "16px", marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>Penilaian Personal {currentRateeIdx + 1} / {assignment.length}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: T.text }}>{currentRatee?.name}</div>
                  <div style={{ fontSize: 12, color: T.textSub, marginTop: 2 }}>{currentRatee?.division} · {currentRatee?.room}</div>
                  <div style={{ height: 6, background: T.borderLight, borderRadius: 99, marginTop: 12, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(currentPersonalScores.filter(s => s > 0).length / PERSONAL_PARAMS.length) * 100}%`, background: T.gradBtn, borderRadius: 99, transition: "width 0.2s" }} />
                  </div>
                  <div style={{ fontSize: 11, color: T.textMuted, marginTop: 6 }}>{currentPersonalScores.filter(s => s > 0).length}/{PERSONAL_PARAMS.length} parameter</div>
                </div>
                {PERSONAL_PARAMS.map((p, i) => <ScoreRow key={i} label={p} index={i} scores={currentPersonalScores} setScore={setCurrentPersonalScore} />)}
                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                  <GhostBtn onClick={() => currentRateeIdx > 0 ? setCurrentRateeIdx(currentRateeIdx - 1) : setStep(0)}>← Back</GhostBtn>
                  <PrimaryBtn disabled={!canNextPersonal} onClick={() => currentRateeIdx < assignment.length - 1 ? setCurrentRateeIdx(currentRateeIdx + 1) : setStep(2)}>
                    {currentRateeIdx < assignment.length - 1 ? "Orang berikutnya →" : "Lanjut ke Divisi →"}
                  </PrimaryBtn>
                </div>
              </div>

            ) : step === 2 ? (
              <div>
                <div style={{ background: "linear-gradient(135deg, #f0fdf4, #f0f4ff)", border: `1px solid #bbf7d0`, borderRadius: 14, padding: "16px", marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>Penilaian Divisi {currentDivIdx + 1} / {divisionList.length}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: T.text }}>Divisi {currentDiv}</div>
                  <div style={{ fontSize: 12, color: T.textSub, marginTop: 2 }}>Nilai perilaku tim secara keseluruhan</div>
                  <div style={{ height: 6, background: T.borderLight, borderRadius: 99, marginTop: 12, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(currentDivScores.filter(s => s > 0).length / DIVISION_PARAMS.length) * 100}%`, background: "linear-gradient(90deg, #34d399, #818cf8)", borderRadius: 99, transition: "width 0.2s" }} />
                  </div>
                  <div style={{ fontSize: 11, color: T.textMuted, marginTop: 6 }}>{currentDivScores.filter(s => s > 0).length}/{DIVISION_PARAMS.length} parameter</div>
                </div>
                {DIVISION_PARAMS.map((p, i) => <ScoreRow key={i} label={p} index={i} scores={currentDivScores} setScore={setCurrentDivScore} />)}
                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                  <GhostBtn onClick={() => currentDivIdx > 0 ? setCurrentDivIdx(currentDivIdx - 1) : setStep(1)}>← Back</GhostBtn>
                  <PrimaryBtn disabled={!canNextDiv || loading} onClick={() => currentDivIdx < divisionList.length - 1 ? setCurrentDivIdx(currentDivIdx + 1) : submitAll()}>
                    {loading ? "Menyimpan... 🌸" : currentDivIdx < divisionList.length - 1 ? "Divisi berikutnya →" : "Kirim Semua ✓"}
                  </PrimaryBtn>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* LEADERBOARD */}
        {view === "leaderboard" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, margin: 0, color: T.text }}>🏆 Ranking</h2>
              <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} style={{ padding: "8px 12px", borderRadius: 10, border: `1px solid ${T.border}`, background: T.bgCard, color: T.textSub, fontSize: 12, fontWeight: 600 }}>
                {allMonths.map(m => <option key={m} value={m}>{getMonthLabel(m)}</option>)}
              </select>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: T.textMuted }}>Memuat... 🌸</div>
            ) : (
              <>
                <div style={{ fontSize: 11, fontWeight: 800, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>👤 Most Assertive Person</div>
                {leaderboard.persons.length === 0
                  ? <div style={{ background: T.bgCard, border: `1px solid ${T.borderLight}`, borderRadius: 14, padding: 32, textAlign: "center", color: T.textMuted, marginBottom: 28, fontSize: 13 }}>Belum ada data bulan ini</div>
                  : leaderboard.persons.map((p, i) => <RankCard key={p.name} item={p} rank={i + 1} />)
                }

                <div style={{ fontSize: 11, fontWeight: 800, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1.5, margin: "28px 0 12px" }}>🏢 Most Assertive Division</div>
                {leaderboard.divisions.length === 0
                  ? <div style={{ background: T.bgCard, border: `1px solid ${T.borderLight}`, borderRadius: 14, padding: 32, textAlign: "center", color: T.textMuted, fontSize: 13 }}>Belum ada data bulan ini</div>
                  : leaderboard.divisions.map((d, i) => <RankCard key={d.name} item={d} rank={i + 1} />)
                }

                <div style={{ marginTop: 20, padding: 14, borderRadius: 12, background: T.purpleLight, border: `1px solid ${T.border}`, fontSize: 12, color: T.textSub, textAlign: "center" }}>
                  ✨ Skor dinormalisasi — fair untuk semua ruangan
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
