package controller;

import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;

public class SaveTextServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
        
        String content = request.getParameter("text");
        String filePath = getServletContext().getRealPath("/") + "Ghifile.txt";
        
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath))) {
            writer.write(content);
        }

        request.setAttribute("filepath", "Ghifile.txt");
        request.getRequestDispatcher("result1.jsp").forward(request, response);
    }
}
