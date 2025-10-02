<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<html>
<head><title>Upload file text</title></head>
<body>
    <h3>Chọn file .txt để đọc:</h3>
    <form action="upload" method="post" enctype="multipart/form-data">
        <input type="file" name="file" />
        <input type="submit" value="Đọc nội dung" />
    </form>
</body>
</html>


