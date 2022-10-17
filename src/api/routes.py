"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Rol, Competition, About_us
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import (
    JWTManager, jwt_required, get_jwt_identity,
    create_access_token, get_jwt)
import json
import cloudinary
import cloudinary.uploader


api = Blueprint('api', __name__)


# ------------  USER ROUTES --------------------------

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data["email"], password=data["password"]).first(
    )
    if user is None:
        return jsonify({"error": "Usuario incorrecto"}), 401
    accesss_token = create_access_token(identity=user.id)
    response_body = {
        "token": accesss_token,
        "user_id": user.id,
        "message": "Usuario registrado correctamente, acceso permitido",
        "rol": str(user.rol)
    }
    return jsonify(response_body), 200


@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if data.get("password1") != data.get("password2"):
        return jsonify({"message": "Las contraseñas no coinciden"}), 403

    if User.query.filter_by(email=data.get("email")).first() == None:
        new_user = User(
            email=data.get("email"),
            password=data.get("password1")
        )
        db.session.add(new_user)
        db.session.commit()
        access_token = create_access_token(identity=new_user.id)
        return jsonify({"logged": True, "token": access_token, "message": "Usuario creado correctamente", "rol": str(new_user.rol), "competitor": new_user.serialize()}), 200
    else:
        return jsonify({"message": "Error, el email ya existe como usuario"}), 400


@api.route('/home/user', methods=['GET'])
@jwt_required()
def private():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user:
        return jsonify({"resultado": "acceso permitido"}), 200
    else:
        return jsonify({"resultado": "usuario no autenticado"}), 400


@api.route("/user", methods=['DELETE'])
@jwt_required()
def delete_user():
    current_user = get_jwt_identity()
    delete_user = User.query.filter_by(email=current_user).first()

    db.session.delete(delete_user)
    db.session.commit()

    response_body = {
        "message": "Usuario eliminado correctamente"
    }
    return jsonify(response_body), 200


# ------------  COMPETITIONS --------------------------


@api.route('/competitions', methods=['GET'])
@jwt_required()
def get_all_competitions():
    all_competitions = Competition.query.order_by(Competition.id.asc()).all()
    competition_serializer = list(
        map(lambda param: param.serialize(), all_competitions))
    response_body = {
        "result": "Obtenidas competiciones correctamente",
        "competitions": competition_serializer
    }
    return jsonify(response_body), 200


@api.route('/competition/<int:id>', methods=['GET'])
@jwt_required()
def get_one_competition(id):
    competition = Competition.query.get(id)
    competition_serializer = competition.serialize()
    response_body = {
        "result": "Competición obtenida",
        "competition": competition_serializer
    }
    return jsonify(response_body), 200


@api.route('/create-competition', methods=['POST'])
@jwt_required()
def create_competition():
    data = request.get_json()
    competition = Competition(
        competition_name=data["competition_name"],
        qualifier_date=data["qualifier_date"],
        location=data["location"],
        category=data["category"],
        requirements=data["requirements"],
        description=data["description"],
        create_at=data["create_at"],
        stage=data["stage"],
        competition_competitor=data["competition_competitor"]
    )
    db.session.add(competition)
    db.session.commit()
    response_body = {
        "result": "Competición añadida correctamente"
    }
    return jsonify(response_body), 200


@api.route('/create-competition/<int:competition_id>', methods=['PUT'])
@jwt_required()
def modify_competition(competition_id):
    data = request.get_json()
    competition = Competition.query.get(competition_id)
    if data is not None and competition:
        competition.competition_name = data["competition_name"],
        competition.qualifier_date = data["qualifier_date"],
        competition.location = data["location"],
        competition.category = data["category"],
        competition.requirements = data["requirements"],
        competition.description = data["description"],
        competition.create_at = data["create_at"],
        competition.stage = data["stage"],
        competition.competition_competitor = data["competition_competitor"]
        db.session.commit()

        response_body = {
            "result": "Competición modificada correctamente"
        }

        return jsonify(response_body), 200

    return jsonify({"result": "competición no modificada"}), 400


@api.route('/my-competitions', methods=['GET'])
@jwt_required()
def my_competition():
    competitor_id = get_jwt_identity()
    competitor = User.query.get(competitor_id)
    my_competitions = Competition.query.filter(
        Competition.competition_competitor.any(User.id == competitor_id)).all()
    print(competitor)
    if len(my_competitions) > 0:
        my_competition_serializer = list(
            map(lambda param: param.serialize(), my_competitions))
        return jsonify({"data": my_competition_serializer}), 200
    return jsonify({"message": "Todavía no se ha inscrito en ninguna competición"}), 204

# ------------  COMPETITORS (Tabla USERS) --------------------------


@api.route('/create-competitor/<int:competitor_id>', methods=['PUT'])
@jwt_required()
def modify_competitor(user_id):
    data = request.get_json()
    competitor = User.query.get(user_id)
    if data is not None and competitor:
        competitor.name = data["name"],
        competitor.last_name = data["last_name"],
        competitor.profile_image_url = data["profile_image_url"],
        competitor.adress = data["adress"],
        competitor.gender = data["gender"],
        competitor.phone = data["phone"],
        competitor.rol = data["rol"],

        response_body = {
            "result": "Competidor modificado correctamente"
        }

        return jsonify(response_body), 200

    return jsonify({"result": "Competidor no modificado"}), 400


# ------------  CLOUDINARY --------------------------

@api.route('/upload', methods=['POST'])
@jwt_required()
def handle_upload():
    user_id = get_jwt_identity()

    if 'profile_image' in request.files:
        result = cloudinary.uploader.upload(request.files['profile_image'])
        user_update = User.query.filter_by(id=user_id).first()
        user_update.profile_image_url = result['secure_url']

        db.session.add(user_update)
        db.session.commit()
        return jsonify(user_update.serialize()), 200
    return jsonify({"message": "error"}), 400


# ------------  ABOUT_US --------------------------

@api.route('/about-us', methods=['POST'])
def contactForm():
    data = request.get_json()
    print(data)
    aboutUs = About_us(
        name=data["name"],
        surname=data["surname"],
        phone=data["phone"],
        contact_request=data["contact_request"],

    )
    db.session.add(aboutUs)
    db.session.commit()
    response_body = {
        "result": "Petición de contacto recibida correctamente"
    }
    return jsonify(response_body), 200
