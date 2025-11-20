from flask import request, jsonify
from sqlalchemy.exc import IntegrityError
from config import app, db
from models import Contact


@app.route("/contacts", methods=["GET"])
def get_contacts():
    contacts = Contact.query.all()
    json_contacts = list(map(lambda x: x.to_json(), contacts))
    return jsonify({"contacts": json_contacts}), 200



@app.route("/create_contact", methods=["POST"])
def create_contact():
    first_name = request.json.get("firstName")
    last_name = request.json.get("lastName")
    email = request.json.get("email")

    if not first_name or not last_name or not email:
        return jsonify({"message": "Você deve preencher todos os campos."}), 400

    new_contact = Contact(first_name=first_name, last_name=last_name, email=email)

    try:
        db.session.add(new_contact)
        db.session.commit()
        return jsonify({"message": "Contato criado com sucesso!"}), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Já existe um contato cadastrado com esse e-mail."}), 409

    except Exception:
        db.session.rollback()
        return jsonify({"message": "Erro ao criar contato."}), 500


@app.route("/update_contact/<int:user_id>", methods=["PATCH"])
def update_contact(user_id):
    contact = Contact.query.get(user_id)

    if not contact:
        return jsonify({"message": "Contato não encontrado."}), 404

    data = request.json
    contact.first_name = data.get("firstName", contact.first_name)
    contact.last_name = data.get("lastName", contact.last_name)
    contact.email = data.get("email", contact.email)

    try:
        db.session.commit()
        return jsonify({"message": "Contato atualizado com sucesso!"}), 200

    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Já existe um contato com esse e-mail."}), 409

    except Exception:
        db.session.rollback()
        return jsonify({"message": "Erro ao atualizar contato."}), 500



@app.route("/delete_contact/<int:user_id>", methods=["DELETE"])
def delete_contact(user_id):
    contact = Contact.query.get(user_id)

    if not contact:
        return jsonify({"message": "Contato não encontrado."}), 404

    try:
        db.session.delete(contact)
        db.session.commit()
        return jsonify({"message": "Contato deletado com sucesso!"}), 200

    except Exception:
        db.session.rollback()
        return jsonify({"message": "Erro ao deletar contato."}), 500


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)
