window.onload=function(){
    var errorModal = document.getElementById("errorModal");
    errorModal.addEventListener("click", () => {
        $('#errorModal').removeClass('show').addClass('fade');
    });
}