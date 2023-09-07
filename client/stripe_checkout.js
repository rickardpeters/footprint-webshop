      // This is your test publishable API key.
      const stripe = Stripe("pk_test_51KjKbEJUONbJrLV52LD0CBvUDLCT16Zy3q4Mxve1quZ21Ah7TSLVNyJkH3yU8XQurGRdNU38gfrNe69FmcPV2sLF006ebVZEhR");

      // The items the customer wants to buy
      
      let elements;
      
    //  initialize();
   //   checkStatus();
      
      // document
      //   .querySelector("#payment-form")
      //   .addEventListener("#submit", handleSubmit);
      
      // Fetches a payment intent and captures the client secret
      async function initialize(userId) {
        const items = userId;
        const response = await fetch("/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });
        document
        .querySelector("#payment-form")
        .addEventListener("#submit", handleSubmit);

        const { clientSecret } = await response.json();
      
        const appearance = {
          theme: 'stripe',
        };
        elements = stripe.elements({ appearance, clientSecret });
      
        const paymentElement = elements.create("payment");
        paymentElement.mount("#payment-element");
      }
      
      async function handleSubmit(e) {
       // e.preventDefault();
        setLoading(true);
      
        await stripe.confirmPayment({
          elements,
    //      confirmParams: {
            redirect:'if_required',
            // Make sure to change this to your payment completion page
       //    return_url: "http://localhost:5000/stripe_checkout.html",
    //      },
        })

        .then(function(result) {
          if (result.error) {
            showMessage(result.error.message);
          } else {
            //här ska det egentligen kopplas till backenden
            addSneakersToOrder();
            console.log(24731709875098343657862987356293865472365)
            showReceipt();
          }
          });
      
        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        // if (error.type === "card_error" || error.type === "validation_error") {
        //   showMessage(error.message);
        // } else {
        //   showMessage("An unexpected error occured.");
        // }
        
        setLoading(false);
        checkStatus();
      }
      
      // Fetches the payment intent status after payment submission
      async function checkStatus() {
        const clientSecret = new URLSearchParams(window.location.search).get(
          "payment_intent_client_secret"
        );
      
        if (!clientSecret) {
          return;
        }
      
        const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
      
        switch (paymentIntent.status) {
          case "succeeded":
            showMessage("Payment succeeded!");
            break;
          case "processing":
            showMessage("Your payment is processing.");
            break;
          case "requires_payment_method":
            showMessage("Your payment was not successful, please try again.");
            break;
          default:
            showMessage("Something went wrong.");
            break;
        }
      }
      
      // ------- UI helpers -------
      
      function showMessage(messageText) {
        const messageContainer = document.querySelector("#payment-message");
      
        messageContainer.classList.remove("hidden2");
        messageContainer.textContent = messageText;
      
        setTimeout(function () {
          messageContainer.classList.add("hidden2");
          messageText.textContent = "";
        }, 4000);
      }
      
      // Show a spinner on payment submission
      function setLoading(isLoading) {
        if (isLoading) {
          // Disable the button and show a spinner
          document.querySelector("#submit").disabled = true;
          document.querySelector("#spinner").classList.remove("hidden2");
          document.querySelector("#button-text").classList.add("hidden2");
        } else {
          document.querySelector("#submit").disabled = false;
          document.querySelector("#spinner").classList.add("hidden2");
          document.querySelector("#button-text").classList.remove("hidden2");
        }
      }