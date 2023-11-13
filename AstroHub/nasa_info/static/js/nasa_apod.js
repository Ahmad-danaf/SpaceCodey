
// $.ajax({
//     url: '/gtapik1246/',
//     method: 'GET',
//     success: function (data) {
//         apiKey = data.api_key;

//         // Now that apiKey is initialized, you can use it in the next AJAX request
//         $.ajax({
//             url: `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`,
//             beforeSend: function () {
//                 $("#loading-spinner").show();
//             },
//             success: function (data) {
//                 $("#img").html("<img src=" + data.url + " style='width: 100%; border-radius: 5px;'/>");
//                 $("#photo-link").attr("href", data.url);
//                 $("#copyright").text("By " + data.copyright);
//                 $("#title").text(data.title);
//                 $("#explanation").text(data.explanation);
//             },
//             error: function () {
//                 $("#output").html("<p>Error loading NASA data. Please try again later or check your internet connection.</p>");
//             },
//             complete: function () {
//                 $("#loading-spinner").hide();
//             }
//         });
//     }
// });
