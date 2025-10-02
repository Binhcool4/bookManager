package controller;

import java.io.*;
import javax.servlet.*;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.*;
//@WebServlet("/upload")
@MultipartConfig
public class UploadServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
        
        Part filePart = request.getPart("file");
        InputStream fileContent = filePart.getInputStream();
        
        BufferedReader reader = new BufferedReader(new InputStreamReader(fileContent, "UTF-8"));
        StringBuilder fileText = new StringBuilder();
        String line;
        
        while ((line = reader.readLine()) != null) {
            fileText.append(line).append("<br>");
        }
        
        request.setAttribute("content", fileText.toString());
        request.getRequestDispatcher("result.jsp").forward(request, response);
    }
}

