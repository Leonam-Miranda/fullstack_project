export function Header({ darkMode, setDarkMode }) {
return (
<header
style={{
width: "100%",
padding: "16px 24px",
background: darkMode ? "#1e293b" : "#2563eb",
color: "white",
display: "flex",
justifyContent: "space-between",
alignItems: "center",
borderRadius: "10px",
marginBottom: "20px",
boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
}}
>
<h1 style={{ margin: 0, fontSize: "22px" }}>Wilson's Contacts</h1>


<button
onClick={() => setDarkMode(!darkMode)}
style={{
padding: "8px 16px",
borderRadius: "8px",
border: "none",
backgroundColor: darkMode ? "#334155" : "white",
color: darkMode ? "white" : "#2563eb",
fontWeight: "600",
cursor: "pointer",
display: "flex",
alignItems: "center",
gap: "8px",
fontSize: "15px",
}}
>
{darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
</button>
</header>
);
}