package com.t2404e.aihealthcoach.util;

import jakarta.servlet.http.HttpServletRequest;

public class RequestUtil {

    private RequestUtil() {}

    public static Long getUserId(HttpServletRequest request) {
        Object val = request.getAttribute("userId");
        if (val == null) return null;
        if (val instanceof Long l) return l;
        if (val instanceof Number n) return n.longValue();
        return null;
    }
}
