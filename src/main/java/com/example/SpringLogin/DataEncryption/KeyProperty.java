package com.example.SpringLogin.DataEncryption;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class KeyProperty {

    public static String DATABASE_ENCRYPTION_KEY;

    @Value("${SAB_EXAM_BETA.database.encryption.key}")
    public void setDatabase(String databaseEncryptionKey) {
        DATABASE_ENCRYPTION_KEY = databaseEncryptionKey;
    }

}
