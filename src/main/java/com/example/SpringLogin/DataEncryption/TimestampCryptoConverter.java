package com.example.SpringLogin.DataEncryption;

import javax.persistence.Converter;
import java.sql.Timestamp;


import static org.apache.logging.log4j.util.Strings.isEmpty;

@Converter
public class TimestampCryptoConverter extends AbstractCryptoConverter<Timestamp> {

    public TimestampCryptoConverter() {
        this(new CipherInitializer());
    }

    public TimestampCryptoConverter(CipherInitializer cipherInitializer) {
        super(cipherInitializer);
    }

    @Override
    boolean isNotNullOrEmpty(Timestamp attribute) {
        return attribute != null;
    }

    @Override
    Timestamp stringToEntityAttribute(String dbData) {
        return isEmpty(dbData) ? null : Timestamp.valueOf(dbData);
    }

    @Override
    String entityAttributeToString(Timestamp attribute) {
        return attribute == null ? null : attribute.toString();
    }

}
