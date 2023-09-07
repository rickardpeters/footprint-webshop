from email.policy import default
import http
from pickle import TRUE
from turtle import back
import os

# from importlib.metadata import SelectableGroups
from flask import Flask, session
from flask import jsonify, abort, request
from flask_sqlalchemy import SQLAlchemy
import json
from sqlalchemy import ForeignKey, Integer, false
import stripe
from flask import Flask, render_template, jsonify, request
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager,
    jwt_required,
    create_access_token,
    get_jwt_identity,
)


app = Flask(__name__, static_folder="../client", static_url_path="/")
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "abc123"
db = SQLAlchemy(app)

bcrypt = Bcrypt(app)
jwt = JWTManager(app)


@app.route("/")
def client():
    return app.send_static_file("client.html")


# stripe

# This is your test secret API key.
stripe.api_key = "sk_test_51KjKbEJUONbJrLV50tJvPlnOL7FiYUUHW8kFTrJ4CHPwvwWKCbDowvESEY7Q6kigMQdimVQvHuOU8iuNgmu0q2wD00zDEZRPmq"


def calculate_order_amount(user_id):
    total_price=0
    current_cart = Cart.query.filter_by(owner = user_id).first()
    bought_sneakers = CartedSneaker.query.filter_by(cart_id=current_cart.id)
    for sneaker in bought_sneakers:
        print(total_price)
        total_price=total_price + sneaker.price
    return total_price


@app.route("/create-payment-intent", methods=["POST"])
def create_payment():
    try:
        data = json.loads(request.data)
        # print(data)
        # Create a PaymentIntent with the order amount and currency
        intent = stripe.PaymentIntent.create(
            amount=calculate_order_amount(data["items"]) * 100,
            currency="sek",
            automatic_payment_methods={
                "enabled": True,
            },
        )
        return jsonify({"clientSecret": intent["client_secret"]})
    except Exception as e:
        return jsonify(error=str(e)), 403




# ==========================USER================================#
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    # lastname = db.Column(db.String, nullable=False) 
    email = db.Column(db.String, nullable=False)
    AVG_Rating = db.Column(db.Float, nullable=True)
    Number_Of_Ratings = 0
    password_hash = db.Column(db.String, nullable=False)
    memberSince = db.Column(db.Integer, nullable=False)
    sneakers = db.relationship("Sneaker", backref="user", lazy="select")   
    cart = db.relationship("Cart", backref="user", lazy="select") 
    sneakers_sold = db.Column(db.Integer, default=0)
    sneakers_bought = db.Column(db.Integer, default=0)  



# orders = db.relationship('Order', backref="user", lazy='select')            #BuyingOrders, kan skapa en selling orders speficit vid behov, men det går att fixa om man är lite klurig med queryn


def __repr__(self):
    return "<User {}: {} {}".format(self.id, self.name, self.email) 


# def serialize_cart (self):
#     thisCart = [] 
#     for sneaker in self.cart: 
#         tempSneak = serialize_sneaker_without(sneaker) 
#         thisCart.append(tempSneak)
#     return thisCart


def serialize_user(self):
    
    return dict(
        id=self.id, name=self.name, email=self.email, memberSince=self.memberSince
    )



def update_rating(self, Rating):
    Number_Of_Ratings = +1
    if self.AVG_Rating is None:
        self.AVG_Rating = Rating
    else:
        temp = self.AVG_Rating
        self.AVG_Rating = (Rating + temp) / (Number_Of_Ratings)


def set_password(self, password):
    self.password_hash = bcrypt.generate_password_hash(password).decode("utf8")


# används ej nu, fixa i framtiden.
def full_name(self, surname, lastname):
    self.name = surname + lastname


# ==========================USER================================#

# ==========================SNEAKER================================#
class Sneaker(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    model = db.Column(db.String, nullable=False)
    size = db.Column(db.Integer, nullable=False)
    condition = db.Column(db.String, nullable=False)
    brand = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    colour = db.Column(db.String, nullable=False)
    price = db.Column(db.Integer, nullable=False)
    custGroup = db.Column(db.String, nullable = False)
    seller_id = db.Column(
        db.Integer, db.ForeignKey("user.id"), nullable=True
    )  # Ska vara False
    order_id = db.Column(db.Integer, db.ForeignKey("orderz.id"), nullable=True)


def __repr__(self): 
    return "<Sneaker {}: {} {} {} {} {} {} {}".format(
        self.id,
        self.model,
        self.size,
        self.condition,
        self.brand,
        self.description,
        self.colour, 
        self.price,
        self.custGroup,
        self.order_id
    )


def serialize_sneaker(self, owner):
    return dict(
        id=self.id,
        model=self.model,
        size=self.size,
        condition=self.condition,
        brand=self.brand,
        description=self.description,
        colour=self.colour,
        price=self.price,
        order_id = self.order_id,
        seller=owner,
        custGroup=self.custGroup
    )


def serialize_sneaker_without(self):
    return dict(
        id=self.id,
        model=self.model,
        size=self.size,
        condition=self.condition,
        price=self.price,
        custGroup=self.custGroup, 
        seller_id = self.seller_id, 
        order_id=self.order_id,
        brand=self.brand
    )
# ==========================SNEAKER================================#




# ==========================CARTEDSNEAKER================================#

class CartedSneaker (db.Model):
    id = db.Column(db.Integer, primary_key=True)
    corresponding_sneaker = db.Column(db.Integer, nullable = False)
    model = db.Column(db.String, nullable=False)
    size = db.Column(db.Integer, nullable=False)
    condition = db.Column(db.String, nullable=False)
    brand = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False) 
    colour = db.Column(db.String, nullable=False)
    price = db.Column(db.Integer, nullable=False)
    custGroup = db.Column(db.String, nullable = False)
    # order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=True)
    # pictures = db.relationship("Picture", backref="sneaker", lazy="select")
    cart_id = db.Column(db.Integer, db.ForeignKey("cart.id"), nullable=True)  

def __repr__(self): 
    return "<CartedSneaker {}: {} {} {} {} {} {} {} {}".format(
        self.id,
        self.corresponding_sneaker,
        self.model,
        self.size,
        self.condition,
        self.brand,
        self.description,
        self.colour,
        self.price,
        self.custGroup
    )

def serialize_carted_sneaker(self):
    return dict(
    id=self.id,
    corresponding_sneaker = self.corresponding_sneaker,
    model=self.model,
    size=self.size,
    condition=self.condition,
    brand=self.brand,
    description=self.description,
    colour=self.colour,
    price=self.price,
    custGroup=self.custGroup
    )


#==========================CART================================#
class Cart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    owner = db.Column(db.Integer, db.ForeignKey("user.id"), nullable = True) 
    sneakers = db.relationship("CartedSneaker", backref="cart", lazy="select")    


def __repr__(self):  
    return '<Cart {}: {} {} '.format(self.id, self.owner, self.sneakers) 
  
def serialize_cart(self):
    return dict(id=self.id, owner = self.owner, sneakers=self.sneakers)  
 
# ===============================CART======================================#

# ==========================ORDER================================#
class Orderz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # order_date = db.Column(db.String, nullable=False)
    phone_number = db.Column(db.String, nullable=False)
    # freight = db.Column(db.Integer, nullable=False)
    zip_code = db.Column(db.String, nullable=False)
    city = db.Column(db.String, nullable=False)
    shipping_address = db.Column(db.String, nullable=False)
    # cc_number = db.Column(db.String, nullable=False)
    # cc_expiry_date = db.Column(db.String, nullable=False)
    # payment_id = db.Column(db.Integer, nullable=False)
    sneakerIsOrdered = db.relationship("Sneaker", backref="orderz", lazy="select") 
    buyer_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True) 


##Kan va så att man behöver skriva nånting med "super" för att arvet ska fungera, i värsta fall skiter vi i arvet å skriver ut allt bara.


def __repr__(self):
    return "<Orderz {}: {} {} {} {}".format(
        self.id,
        # self.no_items,
        # self.cart_price,
        self.phone_number,
        # self.order_date,
        # self.freight,
        self.city,
        self.zip_code,
        self.shipping_address,
        self.buyer_id
        # self.cc_number,
        # self.cc_expiry_date,
    )


def serialize_order(self):
    return dict(
   #     order_date=self.order_date,
        # cart_price=self.cart_price,
        # freight=self.freight,
        zip_code=self.zip_code,
        shipping_address=self.shipping_address,
        city=self.city,
        phone_number=self.phone_number,
        buyer_id=self.buyer_id
        # cc_number=self.cc_number,
        # cc_expiry_date=self.cc_expiry_date,
    )


# ==========================ORDER================================#

# ==========================CUSTOMER_GROUP================================#
# class CustomerGroup(db.Model):
#     group = db.Column(db.String, primary_key=True)
#     sneaker_id = db.Column(db.Integer, db.ForeignKey("sneaker.id"), nullable=True)


# def __repr__(self):
#     return "<Order {}:".format(self.group)


# def serialize(self):
#     return dict(id=self.group)


# ==========================CUSTOMER_GROUP================================#

# # ==========================Picture================================#
# class Picture(db.Model):
#     pic_id = db.Column(db.String, primary_key=True)
#     # sneaker_id = db.Column(db.Integer, db.ForeignKey("sneaker.id"), nullable=True)


# def __repr__(self):
#     return "<Order {}:".format(self.pic_id)


# def serialize(self):
#     return dict(id=self.pic_id) 


# ==========================Picture================================#


@app.route("/sign-up", methods=["POST"])
def signup():
    if request.method == "POST":
        # lägg till hantering: unik mail
        data = request.get_json()
        user = User(
            name=data["name"], email=data["email"], memberSince=data["memberSince"]
        )
        set_password(user, data["password"])
        db.session.add(user)
        db.session.commit()
        return serialize_user(user)


@app.route("/login", methods=["POST"])
def login():
    if request.method == "POST":
        data = request.get_json()
        user = User.query.filter_by(email=data["email"]).first()
        if user == None:
            print("HEEEJ")
            abort(401)
        else:

            if bcrypt.check_password_hash(user.password_hash, data["password"]):
    
                if Cart.query.filter_by(owner=user.id).first() is None: 
                    sessionCart = Cart ( 
                    owner = user.id
                    ) 
                    db.session.add(sessionCart)
                    db.session.commit()

                    

                access_token = create_access_token(identity=user.id)
                output_list = {"token": access_token, "user": serialize_user(user)}
                return jsonify(output_list)  
           

            else:
                print("JAHAPP")
                abort(401)


@app.route("/users/<int:user_id>", methods=["GET", "PUT", "DELETE"])
# @jwt_required()
def user_id(user_id):
    if request.method == "PUT":
        user = User.query.filter_by(id=user_id).first()
        user.name = request.json.get("name", user.name)
        db.session.commit()
        return jsonify(serialize_user(user))
    elif request.method == "GET":
        user = User.query.filter_by(id=user_id).first()
        if user == None:
            abort(404)
        return jsonify(serialize_user(user))
    elif request.method == "DELETE":
        if User.query.filter_by(id=user_id).first() != None:
            db.session.delete(User.query.filter_by(id=user_id).first())
            db.session.commit()
            return {}
        return abort(404)


@app.route("/sneakers", methods=["GET", "POST"])
# @jwt_required()
def sneakers():
    sneakers = []
    
    if request.method == "GET":
        sneaker_list = Sneaker.query.all()
        for i in sneaker_list:
            if i.seller_id is None:
                user = None
            else:
                user = serialize_user(User.query.get(i.seller_id))
            sneakers.append(serialize_sneaker(i,user))
        return jsonify(sneakers)
    elif request.method == 'POST':
        if request.get_json(force = True).get('seller_id', False):
            sneakers = Sneaker(model = request.get_json()['model'], size = request.get_json()['size'], condition = request.get_json()['condition'], brand = request.get_json()['brand']
            ,description = request.get_json()['description'] , colour = request.get_json()['colour'], price = request.get_json()['price'], 
             seller_id = request.get_json()['seller_id'], custGroup = request.get_json()['custGroup'])
            
        else: 
            sneakers = Sneaker(model = request.get_json()['model'], size = request.get_json()['size'], condition = request.get_json()['condition'], brand = request.get_json()['brand']
            ,description = request.get_json()['description'] , colour = request.get_json()['colour'], price = request.get_json()['price'], 
             seller_id = None, custGroup = request.get_json()['custGroup'])
            print("HEJ")
        db.session.add(sneakers)
        db.session.commit()
        return jsonify(serialize_sneaker_without(sneakers))


@app.route("/sneakers/<int:sneaker_id>", methods=["GET", "PUT", "DELETE"])
# @jwt_required()
def sneaker_int(sneaker_id):

    if request.method == "GET":
        sneaker = Sneaker.query.filter_by(id=sneaker_id).first_or_404()
        if sneaker.seller_id is None:
            user = None
        else:
            user = serialize_user(User.query.get(sneaker.seller_id))

        return jsonify(serialize_sneaker(sneaker, user))

    elif request.method == "PUT":
        sneaker = Sneaker.query.filter_by(id=sneaker_id).first_or_404()
        if request.get_json(force=True).get("seller_id", False):
            user = User.query.filter_by(
                id=request.get_json()["seller_id"]
            ).first_or_404()

        if request.get_json(force=True).get("model", False):
            setattr(sneaker, "model", request.get_json()["model"])
        if request.get_json(force=True).get("size", False):
            setattr(sneaker, "size", request.get_json()["size"])
        if request.get_json(force=True).get("condition", False):
            setattr(sneaker, "condition", request.get_json()["condition"])
        if request.get_json(force=True).get("brand", False):
            setattr(sneaker, "brand", request.get_json()["brand"])
        if request.get_json(force=True).get("description", False):
            setattr(sneaker, "description", request.get_json()["description"])
        if request.get_json(force=True).get("colour", False):
            setattr(sneaker, "colour", request.get_json()["colour"])
        if request.get_json(force=True).get("price", False):
            setattr(sneaker, "price", request.get_json()["price"])
        if request.get_json(force=True).get("seller_id", False):
            setattr(sneaker, "seller_id", request.get_json()["seller_id"])
        db.session.commit()

        return jsonify(serialize_sneaker_without(Sneaker.query.get(sneaker_id)))

    elif request.method == "DELETE":
        sneaker = Sneaker.query.filter_by(id=sneaker_id).first_or_404()
        Sneaker.query.filter_by(id=sneaker_id).delete()
        db.session.commit()

        return ("", http.HTTPStatus.OK)


@app.route("/users/<int:user_id>/cart/<int:cart_id>", methods=["GET"])
# @jwt_required()
def users():
    users = []
    if request.method == "GET":
        user_list = User.query.all()
        for i in user_list:
            i.cart
            users.append(serialize_user(i))
        return jsonify(users)

#============Lägga till Sneakers i Cart, genom att skapa en cartedsneaker som är en kopia av den riktiga.

@app.route("/users/<int:user_id>/cart/sneakers/<int:sneaker_id>", methods=["POST", "DELETE"]) 
def cart(user_id, sneaker_id): 

    sneaker = Sneaker.query.filter_by(id=sneaker_id).first_or_404()
    thiscart = Cart.query.filter_by(owner=user_id).first_or_404() 


    if request.method == "POST":

        if CartedSneaker.query.filter_by(cart_id = thiscart.id, corresponding_sneaker = sneaker_id).first() is not None:        
            return "Skon är i din cart redan"
        else: 
            CartSneaker = CartedSneaker( 
                corresponding_sneaker = sneaker.id, 
                model = sneaker.model,
                size = sneaker.size,
                condition = sneaker.condition, 
                brand = sneaker.brand,
                description = sneaker.description,
                colour = sneaker.colour,
                price = sneaker.price,
                custGroup = sneaker.custGroup, 
                cart_id = thiscart.id,
            ) 
            db.session.add(CartSneaker) 
            db.session.commit() 
            return "Nicely added sneaker" 
                


    elif request.method == "DELETE":
        CartedSneaker.query.filter_by(cart_id = thiscart.id, corresponding_sneaker = sneaker_id).delete() 
        db.session.commit()
        return "Deleted sneaker" 
    
       
@app.route("/users/<int:user_id>/cart", methods=["GET"])
def user_cart(user_id):
    current_cart_products = []
    if request.method == "GET":
        myCart = Cart.query.filter_by(owner = user_id).first()
        myCart_sneakers = CartedSneaker.query.filter_by(cart_id = myCart.id)
        for x in myCart_sneakers:
           current_cart_products.append(serialize_carted_sneaker(x))
        return jsonify(current_cart_products)

    
UPLOAD_FOLDER = '../client/bilder_sneaker/'

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/image/<int:sneaker_id>', methods=[ 'POST'])
def upload_file(sneaker_id):
    if request.method == 'POST':
        if 'file' not in request.files:
            print('nope')
            return 'there is no file in form!'
        image1 = request.files['file']      
        id_s = str(sneaker_id) 
        path = os.path.join(app.config['UPLOAD_FOLDER'], 'sneaker'+id_s+'.jpeg')
        image1.save(path)
        print(id)
        return jsonify("added sneaker")
 

@app.route("/users/<int:user_id>/orderz", methods=["GET", "POST"]) 
def order_make(user_id):
    current_cart = Cart.query.filter_by(owner = user_id).first()
    cart_sneak = CartedSneaker.query.filter_by(cart_id=current_cart.id)
    if request.method == 'POST':
        shoe_order = request.get_json()
        new_order = Orderz(
        city=shoe_order["city"],
        zip_code=shoe_order["zip_code"], 
        shipping_address= shoe_order["shipping_address"], 
        phone_number = shoe_order["phone_number"],
        buyer_id= user_id
        )
        db.session.add(new_order)
        db.session.commit() 
        this_order=Orderz.query.filter_by(buyer_id=user_id)
        for sneaky in cart_sneak:
            snook = Sneaker.query.filter_by(id=sneaky.corresponding_sneaker).first()
            snook.order_id = this_order[-1].id
        db.session.commit()
        return jsonify("Good purchase my leige")

    elif request.method == "GET":
            sneakers = []
            myOrders = Orderz.query.filter_by(buyer_id = user_id)
            for orders in myOrders:  
                sneaker_list = Sneaker.query.filter_by(order_id=orders.id)
                for sneak in sneaker_list:
                    if sneak.seller_id is None:
                        user = None
                    else:
                        user = serialize_user(User.query.get(sneak.seller_id))
                    sneakers.append(serialize_sneaker(sneak,user))
            return jsonify(sneakers)



@app.route("/users/<int:user_id>/emptycart", methods=["DELETE"]) 
def empty_cart(user_id):
    current_cart = Cart.query.filter_by(owner = user_id).first()
    bought_sneakers = CartedSneaker.query.filter_by(cart_id=current_cart.id)
    if request.method == 'DELETE':
        for sneak in bought_sneakers:
         CartedSneaker.query.filter_by(corresponding_sneaker=sneak.corresponding_sneaker).delete()
    # Cart.query.filter_by(owner=user_id).delete()
    db.session.commit()
    return "Empty cart empty heart" 

@app.route("/users/<int:user_id>/sneakers", methods=["GET"])
def my_sneakers(user_id): 
    user_adds = Sneaker.query.filter_by(seller_id=user_id)
    if request.method == 'GET': 
        mySneaks = []
        for sneakers in user_adds:
            serSneak = serialize_sneaker_without(sneakers)
            mySneaks.append(serSneak)
        return jsonify(mySneaks) 
    
@app.route("/users/<int:user_id>/sneakers/<int:sneaker_id>", methods=["DELETE"])
def delete_add(user_id, sneaker_id): 
    user_adds = Sneaker.query.filter_by(seller_id=user_id)
    filtered = []
    if request.method == 'DELETE': 
        for i in user_adds:
            if i.id == sneaker_id:
                sneak = serialize_sneaker_without(i)
                filtered.append(sneak)
                db.session.delete(i)
                db.session.commit()

        if filtered:
            return jsonify(filtered)
            
        else:
            return "Du säljer inte den bro" 

@app.route("/removefromcart/cartedsneakers/<int:carted_sneaker_id>", methods=["DELETE"]) 
def delete_cart_sneaker(carted_sneaker_id):
    if request.method == 'DELETE':
         CartedSneaker.query.filter_by(id=carted_sneaker_id).delete()
    # Cart.query.filter_by(owner=user_id).delete()
    db.session.commit()
    return "Deleted from cart" 


         
@app.route("/users/<int:user_id>/receipt", methods=["GET"]) 
def receipt(user_id):
    if request.method == "GET":
            sneakers = []
            myOrders = Orderz.query.filter_by(buyer_id = user_id)
            latest_order=myOrders[-1].id
            sneaker_list = Sneaker.query.filter_by(order_id=latest_order)
            for sneak in sneaker_list:
                if sneak.seller_id is None:
                    user = None
                else:
                    user = serialize_user(User.query.get(sneak.seller_id))
                sneakers.append(serialize_sneaker(sneak,user))
            return jsonify(sneakers)

      

if __name__ == "__main__": 
    app.run(debug=True)  
