function showData() {
    // DOM mengambil data
   let inputName = document.getElementById("name").value
   let inputEmail = document.getElementById("email").value
   let inputPhone = document.getElementById("phone").value
   let inputSubject = document.getElementById("subject").value
   let inputMessage = document.getElementById("message").value

    // DOM mengirim data
    //document.getElementById("name").value = ""

   //validasi
   if(inputName == ""){
        alert('Nama harus diisi !')
   }

   if (inputEmail == "") {
        alert('Email harus diisi !')
   }

   if (inputPhone == "") {
    alert('Nomor Telepon harus diisi !')
   }

   if (inputSubject == "") {
        alert('Subject harus diisi !')
   }

   if (inputMessage == "") {
    alert('Message harus diisi !')
   }

   // DOM create element
   let emailReceiver = 'yosua872@gmail.com'
   let a = document.createElement("a")
   a.href = `mailto:${emailReceiver}?subject=${inputSubject}&body=${inputMessage}`

   a.click()

   // Reset DDM 
   document.getElementById("name").value = ""
   document.getElementById("email").value = ""
   document.getElementById("phone").value = ""
   document.getElementById("subject").value = ""
   document.getElementById("message").value = ""


   let dataObject = {
       inputName,
       inputEmail,
       inputPhone,
       inputSubject,
       inputMessage
   }

   console.table(dataObject) 


}

