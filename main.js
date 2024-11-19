window.backendUrl = " https://online-lectures-cs.thi.de/chat/82db3425-e88c-4eed-80c9-d3220b6e83b7";
window.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiVG9tIiwiaWF0IjoxNzMxOTc1NzAxfQ.RTWIYnjkSIvbDGDfeB5L68q1iQAL3unQr8P_-uTG3DE";



var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        let data = JSON.parse(xmlhttp.responseText);
        console.log(data);
    }
};
xmlhttp.open("GET", "https://online-lectures-cs.thi.de/chat/82db3425-e88c-4eed-80c9-d3220b6e83b7/user", true);
// Add token, e. g., from Tom
xmlhttp.setRequestHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiVG9tIiwiaWF0IjoxNzMxOTc1NzAxfQ.RTWIYnjkSIvbDGDfeB5L68q1iQAL3unQr8P_-uTG3DE');
xmlhttp.send();