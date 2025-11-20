import { useState } from "react";

const ContactForm = ({ existingContact = {}, updateCallback }) => {
  const [firstName, setFirstName] = useState(existingContact.firstName || "");
  const [lastName, setLastName] = useState(existingContact.lastName || "");
  const [email, setEmail] = useState(existingContact.email || "");

  const [errors, setErrors] = useState({});

  const updating = Object.entries(existingContact).length !== 0;

  const validate = () => {
    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required.";
    if (!lastName.trim()) newErrors.lastName = "Last name is required.";

    const emailRegex = /\S+@\S+\.\S+/;
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const data = { firstName, lastName, email };

    const url =
      "http://127.0.0.1:5000/" +
      (updating ? `update_contact/${existingContact.id}` : "create_contact");

    const options = {
      method: updating ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        let message = "Something went wrong. Please try again.";

        try {
          const data = await response.json();
          if (data.message) {
            message = data.message;
          }
        } catch {
        }

        if (response.status === 409) {
          message = "Já existe um contato cadastrado com esse e-mail.";
        }

        setErrors((prev) => ({ ...prev, form: message }));
        return;
      }

      setErrors({});
      updateCallback();
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        form: "Erro ao conectar com o servidor. Tente novamente mais tarde.",
      }));
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="firstName">Primeiro Nome:</label>
        <input
          type="text"
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className={errors.firstName ? "input-error" : ""}
        />
        {errors.firstName && (
          <p className="error-text">{errors.firstName}</p>
        )}
      </div>

      <div>
        <label htmlFor="lastName">Sobrenome:</label>
        <input
          type="text"
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className={errors.lastName ? "input-error" : ""}
        />
        {errors.lastName && (
          <p className="error-text">{errors.lastName}</p>
        )}
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={errors.email ? "input-error" : ""}
        />
      {errors.email && <p className="error-text">{errors.email}</p>}
      </div>

      {errors.form && (
        <p className="error-text" style={{ marginTop: "10px" }}>
          {errors.form}
        </p>
      )}

      <button type="submit">{updating ? "Atualizar" : "Criar Contato"}</button>
    </form>
  );
};

export default ContactForm;
