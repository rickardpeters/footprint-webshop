var host = 'http://127.0.0.1:5000'
var signedIn = false
var globalCust = "female"





function signedIN(){
    if (sessionStorage.getItem('auth') != null) {
        signedIn = sessionStorage.getItem('auth').length > 0;
        $("#btns_home_account").toggleClass('d-none', !signedIN);
        $("#btns_home_login").toggleClass('d-none',signedIN);
    }else{
        $("#btns_home_account").toggleClass('d-none', signedIN);
        $("#btns_home_login").toggleClass('d-none',!signedIN); 
    }
    
}

/*Hantera olika vyer som visas i container. Filip & Christoph */
$(document).ready(function () {


    $("#container").html($("#view_home").html());
    signedIN();

    $("#home").click(function (e) {
        e.preventDefault(); 
        $("#container").html($("#view_home").html());
        signedIN();  
        
    });

    $("#women").click(function (e) {
        e.preventDefault();
        $("#container").html($("#view_shop").html());
        hideAllWomens()
        globalCust = "female";
        filterSneakers(); 
        window.scrollTo(0, 0);       
    });

    $("#women_link").click(function (e) {
        e.preventDefault();
        $("#container").html($("#view_shop").html());
        hideAllWomens()
        globalCust = "female";
        filterSneakers();  
        window.scrollTo(0, 0);      
    });

    $("#men").click(function(e) {
        e.preventDefault();
        $("#container").html($("#view_shop").html());
        hideAllMen()
        globalCust = "male";
        filterSneakers();
        window.scrollTo(0, 0);
    });

    $("#men_link").click(function(e) {
        e.preventDefault();
        $("#container").html($("#view_shop").html());
        hideAllMen()
        globalCust = "male";
        filterSneakers();
        window.scrollTo(0, 0);
    });


    $("#kids").click(function(e) {
        e.preventDefault();
        $("#container").html($("#view_shop").html());
        hideAllKids()
        globalCust = "child"
        filterSneakers();
        window.scrollTo(0, 0);
    });

    $("#kids_link").click(function(e) {
        e.preventDefault();
        $("#container").html($("#view_shop").html());
        hideAllKids()
        globalCust = "child"
        filterSneakers();
        window.scrollTo(0, 0);
    });

    $("#the_team").click(function (e) {
        e.preventDefault();
        $("#container").html($("#view_team").html());
        window.scrollTo(0, 0);
    });

    $("#our_story").click(function (e) {
        e.preventDefault();
        $("#container").html($("#view_story").html());
        window.scrollTo(0, 0);
    });

    $("#contact_us").click(function (e) {
        e.preventDefault();
        $("#container").html($("#view_contactUs").html());
        window.scrollTo(0, 0);
    });

    $("#receipt").click(function (e) {
        e.preventDefault();
        $("#container").html($("#view_receipt").html());
        window.scrollTo(0, 0);
    });

    $("#shipping").click(function (e) {
        e.preventDefault();
        $("#container").html($("#view_shipping").html());
        window.scrollTo(0, 0);
    });

    $("#sustainability").click(function (e) {
        e.preventDefault();
        $("#container").html($("#view_sustainability").html());
        window.scrollTo(0, 0);
    });
    
});
 
function hideAllMen() {
    var link1 = document.getElementById('categoryWomensPic');
    link1.style.display = 'none'; //or
    link1.style.visibility = 'hidden';

    var link2 = document.getElementById('categoryKidsPic');
    link2.style.display = 'none'; //or
    link2.style.visibility = 'hidden';
}

function hideAllWomens() {
    var link1 = document.getElementById('categoryMensPic');
    link1.style.display = 'none'; //or
    link1.style.visibility = 'hidden';

    var link2 = document.getElementById('categoryKidsPic');
    link2.style.display = 'none'; //or
    link2.style.visibility = 'hidden';
}

function hideAllKids() {
    var link1 = document.getElementById('categoryWomensPic');
    link1.style.display = 'none'; //or
    link1.style.visibility = 'hidden';

    var link2 = document.getElementById('categoryMensPic');
    link2.style.display = 'none'; //or
    link2.style.visibility = 'hidden';
}

function showShippingView() {
    $("#container").html($("#view_shipping").html());
}

function showSustainabilityView() {
    $("#container").html($("#view_sustainability").html());
}

// test 

function showShoppingView() {
    $("#container").html($("#view_shop").html());
}

// test

function showRegisterView() {
    $("#container").html($("#view_register").html());
}

function showOurStoryView() {
    $("#container").html($("#view_story").html());
}

// function showReceipt() {
//     $("#container").html($("#view_receipt").html());
// }

function showLogInView() {
    $("#container").html($("#view_login").html());
}

function showHome() {
    $("#container").html($("#view_home").html());
    signedIN() 
}

// HUAX stripe visning
function showCart() {
    createCart();
   // $("#container").html($("#view_cart").html());     
}
$("#stripe").click(function (e) {
    e.preventDefault();
    $("#container").html($("/stripe_checkout.html").html());
});
// HUAX stripe visning



function showAccount() {
    userId = JSON.parse(sessionStorage.getItem('auth')).user.id;
    $.ajax({
        url: host + '/users/'+ userId,
        type: 'GET',
        headers: { "Authorization": "Bearer " + JSON.parse(sessionStorage.getItem('auth')).token },
        success: function (user) {
            $("#container").html($("#view_account").html());
            if (signedIn) {
                showSellerAds();
                document.getElementById("account_view_name_text").innerHTML = user.name;
                document.getElementById("member_since_text").innerHTML = "Member since: " + user.memberSince;
            }
        }
    })
}

function showSell() {
    console.log("!")
    if (sessionStorage.getItem('auth') != null) {
        $("#container").html($("#view_sell").html());
        console.log("!!") 
    } else {
        alert("du måste vara inloggad för att sälja ett föremål")
        $("#container").html($("#view_login").html());
        console.log("!!!")  
    }
    
}

// function showShopping() {
//     $("#container").html($("#view_shop").html());
// }

// function showShippingDetails() {
//     $("#container").html($("#view_stripe").html());
// }

function showTheTeam() {
    $("#container").html($("#view_team").html());
}

function showStripe() {
    userId = JSON.parse(sessionStorage.getItem('auth')).user.id;
    initialize(userId)
    $("#container").html($("#view_stripe").html());
}

// function showContactUs() {
//     $("#container").html($("#view_contact").html());
// }

//Funktion för registrering
function signUp() {
    var pwd = checkPassword()
    
    date = new Date()
    $.ajax({
        url: host + '/sign-up',
        type: 'POST',
        contentType: "application/json",
        dataType: 'JSON',
        data: JSON.stringify({
            email: $("#inputSignUpEmail").val(), name: $("#inputSignUpName").val(), password: pwd, memberSince: parseInt(date.getFullYear())
        }),
        success: function (data) {
            // console.log(JSON.parse(sessionStorage.getItem('auth')).user.memberSince)
            showLogInView()
        }
    })
}

function checkPassword() {
    pwd1 = $("#passwordInput1").val()
    pwd2 = $("#inputSignUpPassword").val()

    if (pwd1 == pwd2) {
        return pwd1
    } else {
        showRegisterView()
        alert("Your passwords do not match - try again!");
        showRegisterView() 
    }
}


//Funktion för inloggning
function logIn() {
    $.ajax({
        url: host + '/login',
        type: 'POST',
        contentType: "application/json",
        dataType: 'JSON',
        data: JSON.stringify({
            email: $("#inputLogInEmail").val(), password: $("#inputLogInPassword").val()
        }),
        success: function (loginResponse) {
            sessionStorage.setItem('auth', JSON.stringify(loginResponse))
            showAccount()
            signedIn = true;
        }
    })
}

function logOut() {
    userId = JSON.parse(sessionStorage.getItem('auth')).user.id;
    emptyCart(userId);
    sessionStorage.removeItem('auth')
    signedIn = false;
    showLogInView();
}

//Funktion för att avgöra om man ska visa login vyn eller account vyn
function loginVSAccount() {
    if (signedIn) {
        showAccount()
    } else {
        showLogInView()
    }
}

//Funktion för att redigera profil 
function editProfile(){
    userId = JSON.parse(sessionStorage.getItem('auth')).user.id;
    $.ajax({
        url: host + '/users/'+ userId,
        type: 'PUT',
        headers: {"Authorization": "Bearer " + JSON.parse(sessionStorage.getItem('auth')).token},
        contentType: "application/json",
        dataType: 'JSON',
        data: JSON.stringify({
           name: $("#recipient-name").val()
        }),
        success: function(data){
            $('.modal').remove();
            $('.modal-backdrop').remove();
            $('body').removeClass( "modal-open" );
            $("#container").empty()
            showAccount();
        }
    })
}

//funktioner för att visa storlekar på sälj sidan
function menSizeSelect(){
    var selectElement = document.getElementById('sellSize');
    for (var size = 38; size <= 51 ; size++) {
        if(selectElement.value != null){
            selectElement.remove(size-38)
        }
        selectElement.add(new Option(size), size-38);
    }
    }
    
    function womenSizeSelect(){
        var selectElement = document.getElementById('sellSize');
        for (var size = 32; size <= 45 ; size++) {
            if(selectElement.value != null){
                selectElement.remove(size-32)
            }
            selectElement.add(new Option(size), size-32);
        }
    }
    
    function childSizeSelect(){
        var selectElement = document.getElementById('sellSize');
        for (var size = 20; size <= 33 ; size++) {
            if(selectElement.value != null){
                selectElement.remove(size-20)
            } 
            selectElement.add(new Option(size), size-20);
        }
    }

    function addingSneaker(){

        var fd = new FormData();
        var files = $('#sellImage1')[0].files[0];
        fd.append('file',files)
       
        userId = JSON.parse(sessionStorage.getItem('auth')).user.id;
        $.ajax({
            url: host + '/sneakers',
            type: 'POST',
            headers: {"Authorization": "Bearer " + JSON.parse(sessionStorage.getItem('auth')).token},
            contentType: "application/json",
            dataType: 'JSON',
            data: JSON.stringify({
               model: $("#sellModel").val(), size :$("#sellSize").val(), condition:$("#sellCondition").val(), brand:$("#sellBrand").val(), description:$("#sellDesc").val(), colour:$("#sellColour").val(), price:$("#sellPrice").val(),seller_id: userId, custGroup:$("input[type='radio'][name='genderRadio']:checked").val()
            }),
            success: function(data){
                console.log("sko tillagd")
                $.ajax({
                    url: host + '/image/'+ data.id,
                    type: 'POST', 
                    processData: false, // important
                    contentType: false , // important
                    dataType : 'json',
                    data: fd,
                    success: function(data){
                        console.log("hej")
                        showAccount();
                    }
                })
            }
        })
    }



    function showSneakers(sneakers){
        $("#produktLista").empty();
                    sneakers.forEach((sneaker) => { 
                        if (sneaker.order_id == null) { 
                        bild_id=sneaker.id.toString()
                        var sneakerShown =  ' <div class="col mb-5"> <div class="card pb-0 color3" style="height: 430px;"> <!-- Product image--><img class="card-img-top" style="height: 180px;" src="bilder_sneaker/sneaker'+bild_id+'.jpeg" alt="..." /> <!-- Product details--><div class="card-body color3"> <div class="text-center"><!-- Product name--> <h5 class="fw-bolder textfont color6">'+ sneaker.brand +' '+ sneaker.model+'</h5> <!-- Product price--><p class="textfont color6">'+'Price: ' +sneaker.price+'<br>Color: ' +sneaker.colour+'<br>Size: ' +sneaker.size+'</p></div><!-- Product actions--><div class="text-center textfont"><button type="button" style="margin-bottom:20px;" class="btn btn-outline-dark mt-auto color2 color1" onclick="addToCart('+sneaker.id+')" href="#">Add to cart</button>';
                        $("#produktLista").append(sneakerShown);
                        }
                    })             
    }


    
    function filterSneakers(){
        console.log(globalCust)
        $.ajax({
            url: host + '/sneakers', 
            type: 'GET',
            success: function(sneakers) {
                listCust = [];
                listBrand = [];
                listCondition = [];
                listSize = [];
                listPrice = [];
                listColor = [];
                sneakers.forEach((sneaker)=>{
                            if(sneaker.custGroup == globalCust ) {
                                listCust.push(sneaker)
                                go = false;
                            }
                });

                if ($("#brandFilter").val() != "All"){
                    listCust.forEach((sneaker)=>{
                                if(sneaker.brand == $("#brandFilter").val()) {
                                    listBrand.push(sneaker)
                                }
                    });
                }else{
                    listBrand = listCust
                }

                if ($("#conditionFilter").val() != "All"){
                    listBrand.forEach((sneaker)=>{
                                if(sneaker.condition == $("#conditionFilter").val() ) {
                                    listCondition.push(sneaker)
                                }
                    });
                }else{
                    listCondition = listBrand
                }

                if ($("#sizeFilter").val() != "All"){
                    listCondition.forEach((sneaker)=>{
                        console.log("Sneaker: " + sneaker.size + " Filter: " + $("#sizeFilter").val())
                                if(sneaker.size == $("#sizeFilter").val() ) {
                                    listSize.push(sneaker)
                                }
                    });
                }else{
                    listSize = listCondition
                }

                
                    listSize.forEach((sneaker)=>{
                        console.log(typeof $("#filterPriceMin").val())
                        if ( $("#filterPriceMin").val() === ''){
                            min = 0;
                        }else{
                            min = parseInt($("#filterPriceMin").val())
                        }
                        if ($("#filterPriceMax").val() === ''){
                            max = Infinity;
                        }else{
                            max = parseInt($("#filterPriceMax").val())
                        }

                        console.log("Min: " + min + " Type:" + typeof min)
                        if(min <= sneaker.price && sneaker.price <= max ) {
                                    listPrice.push(sneaker)
                        }
                    });

                    if ($("#colorFilter").val() != "All"){
                        listPrice.forEach((sneaker)=>{
                                    if(sneaker.colour == $("#colorFilter").val() ) {
                                        listColor.push(sneaker)
                                    }
                        });
                    }else{
                        listColor= listPrice
                    }

                window.scrollTo(0, 0);  //ändra denna till (0,150) om vi vill scrolla ner efter filter

                sortSneakers(listColor);
                showSneakers(listColor);    
 

            } 
        })
    }

    function sortSneakers (sneakerList) {
        
         if($("#sortingFilter").val() == "HighestToLowest") {
            sneakerList.sort((a,b) => {
                return b.price - a.price;
            });
         }

        if($("#sortingFilter").val() == "LowestToHighest") {
            sneakerList.sort((a,b) => {
                return a.price - b.price;
            });
        }

    }

    function showSellerAds(){
        $.ajax({
            url: host + '/sneakers',
            type: 'GET',
            success: function(sneakers) {
                sneakers.forEach((sneaker)=>{
                    bild_id=sneaker.id.toString()
                    if(sneaker.seller != null && sneaker.order_id == null){
                        if(sneaker.seller.id == JSON.parse(sessionStorage.getItem('auth')).user.id) {
                        var sneakerShown = '<div class="sellerAds color2"><div class="sellerAdsDiv"><img class="sellerAdsImage" src="bilder_sneaker/sneaker'+bild_id+'.jpeg" alt="..." /></div><div id="sellerAdsDivRight"><p class="sellerAdsText color1 textfont">Brand: ' + sneaker.brand + '<br>Model: ' +sneaker.model + '<br>Size: ' + sneaker.size + '<br>Price: ' + sneaker.price + '</p><button type="button" class="btn btn-outline-dark mt-auto color3 color6" onclick="removeAdd('+sneaker.id+')" href="#">Remove ad</button></div></div>'
                        $("#annonsLista").append(sneakerShown);
                        }
                    }
                });
            }
        })
    }


    function addToCart(sneaker_id){
        
        userId = JSON.parse(sessionStorage.getItem('auth')).user.id;
        $.ajax({
            url: host + '/sneakers/' + sneaker_id,
            type: 'GET',
            headers: {"Authorization": "Bearer " + JSON.parse(sessionStorage.getItem('auth')).token},
            success: function(data){
                console.log("wtf")
                if (data.seller.id==userId) {
                    console.log("wtf")
                    alert("You may not purchase your own sneaker")
                } else {
                $.ajax({
                    url: host + '/users/'+userId+'/cart/sneakers/'+sneaker_id,
                    type: 'POST',
                    headers: {"Authorization": "Bearer " + JSON.parse(sessionStorage.getItem('auth')).token},
                    contentType: "application/json",
                    dataType: 'JSON',
                    data: JSON.stringify({
                       model: data.model, size : data.size, condition: data.condition, brand: data.brand, description: data.description, colour: data.colour, price: data.price, custGroup: data.custGroup
                    }),
                    success: function(data){ 
                        
                    }
                })
             
            } }
        })
    }

    function createCart() {
       var total_price = 0
       // den ifsats fungerar ej ännu
//        if (JSON.parse(sessionStorage.getItem('auth')).user.id != null) {
    try { 
        userId = JSON.parse(sessionStorage.getItem('auth')).user.id;
        $.ajax({
            url: host + '/users/' + userId + '/cart',
            type: 'GET',
            headers: {"Authorization": "Bearer " + JSON.parse(sessionStorage.getItem('auth')).token},
            success: function(current_cart_products){
// Värt att nämna att vi bör ha cart_sneaks.image som en levande grej men enkelt att fixa
                for (cart_sneaks in current_cart_products) {
                    bild_id=current_cart_products[cart_sneaks].corresponding_sneaker.toString() 
                    console.log(current_cart_products[cart_sneaks].corresponding_sneaker)
                    $("#dynamicCart").append( 
                        "<div class='d-flex flex-row justify-content-between align-items-center p-2 bg-white mt-2 px-3 rounded'>" +
                          "<div class='mr-1'><img class='rounded' src='bilder_sneaker/sneaker"+bild_id+".jpeg' width='70'>" +
                          "</div>" +
                         "<div class='d-flex flex-column align-items-center product-details'><span" +
                         "class=textfont>" +current_cart_products[cart_sneaks].brand + "</span>" +
                           "<div class='d-flex flex-row product-desc'>" +
                              "<div class='size mr-1'><span class='textfont'>Color:</span><span"+
                                "class='textfont'>&nbsp;" + current_cart_products[cart_sneaks].colour + "</span></div>"+
                              "<div class='color'><span class='textfont'>Size:</span><span"+
                                "class='textfont'>&nbsp;" + current_cart_products[cart_sneaks].size + "</span></div>"+
                            "</div>" +
                            "</div>" +
                          "<div>" + 
                          "<h5 class='textfont'>" + current_cart_products[cart_sneaks].price + " SEK</h5>" +
                          "</div>" +
                          "<div class='d-flex align-items-center'><i class='fa fa-trash mb-1 text-danger'></i>" +
                          "</div>" +
                          "<button type='button' class='btn btn-outline-dark mt-auto color3 color6' onclick='removeFromCart("+current_cart_products[cart_sneaks].id+" )' href='#'>Remove from cart</button> " +
                          "</div>"  
        );
        (total_price = total_price + current_cart_products[cart_sneaks].price)
     }
     $("#total_price").append( 
        "<h5 class='textfont color6'>Your total cost: " + total_price + " SEK</h5>" );
    }}
     );
     $("#container").html($("#view_cart").html()); 
    } catch (e) {
alert("Please login to shop")

    }
}
   

function addSneakersToOrder() {
    userId = JSON.parse(sessionStorage.getItem('auth')).user.id;
        $.ajax({
            url: host + '/users/' + userId + '/orderz',
            type: 'POST',
            contentType: "application/json",
            async: false,
            dataType: 'JSON',
            data: JSON.stringify({
                city: $("#city").val(), 
                zip_code: $("#zip_code").val(), 
                shipping_address: $("#shipping_address").val(), 
                phone_number: $("#phone_number").val(), 
                buyer_id: userId
            }),
            success: function (data) {
                emptyCart(userId);
            }
        })
    }
    function emptyCart(userId) {
        userId = JSON.parse(sessionStorage.getItem('auth')).user.id;
        $.ajax({
            url: host + '/users/' + userId + '/emptycart',
            type: 'DELETE',
            headers: {"Authorization": "Bearer " + JSON.parse(sessionStorage.getItem('auth')).token},
            success: function(data){
         console.log("delete success")
    }
})

}
    
function showReceipt() {
     userId = JSON.parse(sessionStorage.getItem('auth')).user.id;
     $.ajax({
         url: host + '/users/' + userId + '/receipt',
         type: 'GET',
         headers: {"Authorization": "Bearer " + JSON.parse(sessionStorage.getItem('auth')).token},
         success: function(order_products){
             for (sneaks in order_products) { 
                bild_id=order_products[sneaks].id.toString() 

                 $("#dynamicName").append( 
                    "<p class='textfont' style='margin-top:40px;'>"+order_products[sneaks].brand+" </p>"
                );
 
                $("#dynamicArticleNumber").append( 
                    "<p class='textfont' style='margin-top:40px;'> "+order_products[sneaks].id+"</p>"
                );
                $("#dynamicPrice").append( 
                    "<p class='textfont' style='margin-top:40px;'> "+order_products[sneaks].price+"</p>"

                 );
  $("#dynamicPic").append( 
    "<div class='mr-1'><img class='rounded' src='bilder_sneaker/sneaker"+bild_id+".jpeg' width='70' style='margin-top:15px;'>"

);
 }
 document.getElementById("order_number_text").innerHTML = "Order Number: " + order_products[0].order_id
 document.getElementById("total_price_text").innerHTML = "Total Price: " + 1000
}

     })
     $("#container").html($("#view_receipt").html());
    }

    function removeAdd(sneaker_id) {
        userId = JSON.parse(sessionStorage.getItem('auth')).user.id;
        $.ajax({
            url: host + '/users/' + userId + '/sneakers/'+sneaker_id,
            type: 'DELETE',
            headers: {"Authorization": "Bearer " + JSON.parse(sessionStorage.getItem('auth')).token},
            success: function(data){
                showAccount();
         console.log("delete success")
    }
})

}

function showOrderHistory(){
    var sold_sneakers = 0;
    userId = JSON.parse(sessionStorage.getItem('auth')).user.id;
    $.ajax({
        url: host + '/users/' + userId + '/orderz',
        type: 'GET',
        headers: {"Authorization": "Bearer " + JSON.parse(sessionStorage.getItem('auth')).token},
        success: function(ordered_sneakers){
            ordered_sneakers.forEach((sneaker)=>{
                bild_id=sneaker.id.toString()
                    var sneakerShown = "<div class='sellerAds color2'><div class='sellerAdsDiv'><img class='sellerAdsImage' src='bilder_sneaker/sneaker"+bild_id+".jpeg' alt='...' /></div><div id='sellerAdsDivRight'><p class='sellerAdsText color1 textfont'>Brand: " + sneaker.brand + "<br>Model: " +sneaker.model + "<br>Size: " + sneaker.size + "<br>Price: " + sneaker.price + " <br>Sold. Order id: " + sneaker.order_id + "</p></div></div>"
                    $("#annonsLista").append(sneakerShown);
                    })
                    document.getElementById("shoes_purchased_text").innerHTML = "Shoes purchased: " + ordered_sneakers.length;
                }
                
            })

    $.ajax({
        url: host + '/users/' + userId + '/sneakers',
        type: 'GET',
        success: function(sneakers) {
            sneakers.forEach((sneaker)=>{
                bild_id=sneaker.id.toString()
                    if(sneaker.seller_id == JSON.parse(sessionStorage.getItem('auth')).user.id && sneaker.order_id != null) {                
                    var sneakerShown = "<div class='sellerAds color2'><div class='sellerAdsDiv'><img class='sellerAdsImage' src='bilder_sneaker/sneaker"+bild_id+".jpeg' alt='...' /></div><div id='sellerAdsDivRight'><p class='sellerAdsText color1 textfont'>Brand: " + sneaker.brand + "<br>Model: " +sneaker.model + "<br>Size: " + sneaker.size + "<br>Price: " + sneaker.price + " <br>Sold. Order id: " + sneaker.order_id + "</p></div></div>"
                    $("#annonsLista").append(sneakerShown); 
                    sold_sneakers = sold_sneakers +1;
                    }
            });
            document.getElementById("shoes_sold_text").innerHTML = "Shoes sold: " + sold_sneakers;
        }
    })

    $.ajax({
        url: host + '/users/'+ userId,
        type: 'GET',
        headers: { "Authorization": "Bearer " + JSON.parse(sessionStorage.getItem('auth')).token },
        success: function (user) {
                document.getElementById("account_view_name_text").innerHTML = user.name;
                document.getElementById("member_since_text").innerHTML = "Member since: " + user.memberSince;
             //   document.getElementById("shoes_purchased_text").innerHTML = "Shoes purchased: ordered_sneakers.size";
        }
    })
    $("#container").html($("#view_account").html());
}

function removeFromCart(carted_sneaker_id) {
    userId = JSON.parse(sessionStorage.getItem('auth')).user.id;
    $.ajax({
        url: host + '/removefromcart/cartedsneakers/'+carted_sneaker_id +'',
        type: 'DELETE',
        headers: {"Authorization": "Bearer " + JSON.parse(sessionStorage.getItem('auth')).token},
        success: function(data){
            showCart();
     console.log("delete success")
}
})

}
 
