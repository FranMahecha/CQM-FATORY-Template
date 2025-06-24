document.addEventListener("DOMContentLoaded", function() {
  function handleForm(formId, messageId) {
    var form = document.getElementById(formId);
    if(form){
      form.addEventListener("submit", function(e) {
        e.preventDefault();
        var data = new FormData(form);
        fetch(form.action, {
          method: "POST",
          body: data,
          headers: {
            'Accept': 'application/json'
          }
        }).then(function(response) {
          if (response.ok) {
            document.getElementById(messageId).innerHTML = "¡Mensaje enviado correctamente!";
            form.reset();
          } else {
            document.getElementById(messageId).innerHTML = "Error al enviar el mensaje.";
          }
        }).catch(function(error) {
          document.getElementById(messageId).innerHTML = "Error al enviar el mensaje.";
        });
      });
    }
  }
  handleForm("contact-form", "message");
  handleForm("footer-form", "footer-message");
});