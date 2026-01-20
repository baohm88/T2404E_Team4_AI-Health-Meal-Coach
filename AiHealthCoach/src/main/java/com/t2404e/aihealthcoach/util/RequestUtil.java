package com.t2404e.aihealthcoach.util;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

public class RequestUtil {

    private RequestUtil() {}

    public static Long getUserId(HttpServletRequest request) {

        // 1️⃣ Ưu tiên JWT (đã login)
        Object val = request.getAttribute("userId");
        if (val instanceof Number n) {
            return n.longValue();
        }

        // 2️⃣ Fallback: session (sau register, chưa login)
        HttpSession session = request.getSession(false);
        if (session != null) {
            Object tempUserId = session.getAttribute("TEMP_USER_ID");
            if (tempUserId instanceof Number n) {
                return n.longValue();
            }
        }

        return null;
    }
}
