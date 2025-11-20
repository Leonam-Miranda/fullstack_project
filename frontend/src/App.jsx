import { useState, useEffect } from "react";
import ContactList from "./ContactList";
import "./App.css";
import ContactForm from "./ContactForm";

function App() {
  const [contacts, setContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState({});

  const [search, setSearch] = useState("");

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const response = await fetch("http://127.0.0.1:5000/contacts");
    const data = await response.json();
    setContacts(data.contacts);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentContact({});
  };

  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true);
  };

  const openEditModal = (contact) => {
    if (isModalOpen) return;
    setCurrentContact(contact);
    setIsModalOpen(true);
  };

  const onUpdate = () => {
    closeModal();
    fetchContacts();
  };

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  const filteredContacts = contacts.filter((c) =>
    `${c.firstName} ${c.lastName} ${c.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      <h1 style={{ marginBottom: "14px" }}>Wilson's Agenda</h1>

      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
  <button onClick={() => setIsModalOpen(true)}>Criar Contato</button>

  <button
    onClick={() => setDarkMode(!darkMode)}
    style={{
      padding: "8px 16px",
      borderRadius: "8px",
      border: "none",
      backgroundColor: darkMode ? "#475569" : "#e2e8f0",
      color: darkMode ? "#fff" : "#1e293b",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "16px",
    }}
  >
    {darkMode ? "🌞 Light" : "🌙 Dark"}
  </button>

  <input
    type="text"
    placeholder="Search contacts..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{
      padding: "10px",
      width: "250px",
      borderRadius: "8px",
      border: "1px solid #d0d7de",
    }}
  />
  </div>
    <ContactList
      contacts={filteredContacts}
      updateContact={openEditModal}
      updateCallback={onUpdate}
    />

    {isModalOpen && (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={closeModal}>
            &times;
          </span>
          <ContactForm
            existingContact={currentContact}
            updateCallback={onUpdate}
          />
        </div>
      </div>
    )}
  </>
  );
}

export default App;
