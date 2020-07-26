// $(document).ready(function () {
//   setTimeout(function () {
//     var alert = document.getElementsByClassName(".alert");
//     alert.remove();
//   }, 2000);
// });

window.onload = () => {
  var alert = document.getElementsByClassName("alert")[0];
  if (alert) {
    setTimeout(() => {
      alert.remove();
    }, 3000);
  }
};
