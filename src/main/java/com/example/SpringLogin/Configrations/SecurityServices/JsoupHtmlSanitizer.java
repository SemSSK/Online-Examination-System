package com.example.SpringLogin.Configrations.SecurityServices;

import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;


public class JsoupHtmlSanitizer {
    public static String getSanitizedJSON(String unsafeHtml){
        String safeHtml = Jsoup.clean(unsafeHtml, Whitelist.basicWithImages());
        System.out.println(unsafeHtml + "->" + safeHtml);
        return safeHtml;
    }
}
