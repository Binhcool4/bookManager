<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<html>
<head><title>Ghi file thành công</title></head>
<body>
    <h3>Ghi file thành công!</h3>
    <p>Bạn có thể tải file tại đây: <a href="<%= request.getAttribute("filepath") %>">Tải về Ghifile.txt</a></p>
    <a href="index1.jsp">Trở lại</a>
</body>
</html>
